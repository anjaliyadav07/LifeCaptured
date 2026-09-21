const pool = require('../config/db')

const {
  interpretMemorySearch
} = require('../services/memorySearchService')

const searchMemories = async (req, res) => {
  try {
    const query = req.query.q?.trim()

    if (!query) {
      return res.status(400).json({
        message: 'Search query is required'
      })
    }

    if (query.length > 200) {
      return res.status(400).json({
        message: 'Search query is too long'
      })
    }

    const interpretation = await interpretMemorySearch(query)

    const {
      keywords = [],
      moods = [],
      themes = [],
      locations = []
    } = interpretation

    /*
      Add useful words from the original query as a fallback.

      This makes search more reliable if the AI interpretation
      misses an important word.
    */
    const originalWords = query
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .split(/\s+/)
      .filter((word) => word.length >= 3)

    const stopWords = new Set([
      'the',
      'and',
      'for',
      'with',
      'near',
      'from',
      'that',
      'this',
      'what',
      'where',
      'when',
      'which',
      'were',
      'are',
      'was',
      'into',
      'about',
      'your',
      'mine',
      'my',
      'moments',
      'memories',
      'memory'
    ])

    const fallbackKeywords = originalWords.filter(
      (word) => !stopWords.has(word)
    )

    const searchKeywords = [
      ...new Set([
        ...keywords,
        ...fallbackKeywords
      ])
    ].slice(0, 20)

    const searchMoods = [
      ...new Set(moods)
    ].slice(0, 10)

    const searchThemes = [
      ...new Set(themes)
    ].slice(0, 15)

    const searchLocations = [
      ...new Set(locations)
    ].slice(0, 10)

    const result = await pool.query(
      `
      WITH scored_memories AS (
        SELECT
          m.id,
          m.title,
          m.description,
          m.memory_date,
          m.location,
          m.created_at,
          m.updated_at,

          COALESCE(
            json_agg(
              DISTINCT jsonb_build_object(
                'id', mi.id,
                'imageUrl', mi.image_url
              )
            ) FILTER (WHERE mi.id IS NOT NULL),
            '[]'::json
          ) AS images,

          ai.caption AS ai_caption,
          ai.summary AS ai_summary,
          ai.mood AS ai_mood,
          ai.themes AS ai_themes,

          (
            /*
              Exact phrase match in title
            */
            CASE
              WHEN LOWER(m.title) LIKE '%' || LOWER($2) || '%'
              THEN 20
              ELSE 0
            END

            +

            /*
              Exact phrase match in description
            */
            CASE
              WHEN LOWER(COALESCE(m.description, ''))
                LIKE '%' || LOWER($2) || '%'
              THEN 15
              ELSE 0
            END

            +

            /*
              Keyword match in title
            */
            CASE
              WHEN EXISTS (
                SELECT 1
                FROM unnest($3::text[]) AS keyword
                WHERE LOWER(m.title)
                  LIKE '%' || LOWER(keyword) || '%'
              )
              THEN 12
              ELSE 0
            END

            +

            /*
              Keyword match in description
            */
            CASE
              WHEN EXISTS (
                SELECT 1
                FROM unnest($3::text[]) AS keyword
                WHERE LOWER(COALESCE(m.description, ''))
                  LIKE '%' || LOWER(keyword) || '%'
              )
              THEN 9
              ELSE 0
            END

            +

            /*
              Keyword match in AI caption
            */
            CASE
              WHEN EXISTS (
                SELECT 1
                FROM unnest($3::text[]) AS keyword
                WHERE LOWER(COALESCE(ai.caption, ''))
                  LIKE '%' || LOWER(keyword) || '%'
              )
              THEN 8
              ELSE 0
            END

            +

            /*
              Keyword match in AI summary
            */
            CASE
              WHEN EXISTS (
                SELECT 1
                FROM unnest($3::text[]) AS keyword
                WHERE LOWER(COALESCE(ai.summary, ''))
                  LIKE '%' || LOWER(keyword) || '%'
              )
              THEN 8
              ELSE 0
            END

            +

            /*
              Location match
            */
            CASE
              WHEN EXISTS (
                SELECT 1
                FROM unnest($4::text[]) AS location_name
                WHERE LOWER(COALESCE(m.location, ''))
                  LIKE '%' || LOWER(location_name) || '%'
              )
              THEN 15
              ELSE 0
            END

            +

            /*
              Mood match
            */
            CASE
              WHEN EXISTS (
                SELECT 1
                FROM unnest($5::text[]) AS search_mood
                WHERE LOWER(COALESCE(ai.mood, ''))
                  LIKE '%' || LOWER(search_mood) || '%'
                  OR LOWER(search_mood)
                  LIKE '%' || LOWER(COALESCE(ai.mood, '')) || '%'
              )
              THEN 12
              ELSE 0
            END

            +

            /*
              Theme match
            */
            CASE
              WHEN EXISTS (
                SELECT 1
                FROM unnest($6::text[]) AS search_theme
                CROSS JOIN LATERAL unnest(
                  COALESCE(ai.themes, '{}')
                ) AS stored_theme
                WHERE LOWER(stored_theme)
                  LIKE '%' || LOWER(search_theme) || '%'
                  OR LOWER(search_theme)
                  LIKE '%' || LOWER(stored_theme) || '%'
              )
              THEN 12
              ELSE 0
            END

            +

            /*
              Keyword match anywhere across the AI-generated
              memory understanding.
            */
            CASE
              WHEN EXISTS (
                SELECT 1
                FROM unnest($3::text[]) AS keyword
                WHERE
                  LOWER(COALESCE(ai.caption, ''))
                    LIKE '%' || LOWER(keyword) || '%'
                  OR
                  LOWER(COALESCE(ai.summary, ''))
                    LIKE '%' || LOWER(keyword) || '%'
                  OR
                  EXISTS (
                    SELECT 1
                    FROM unnest(
                      COALESCE(ai.themes, '{}')
                    ) AS stored_theme
                    WHERE LOWER(stored_theme)
                      LIKE '%' || LOWER(keyword) || '%'
                  )
              )
              THEN 7
              ELSE 0
            END

          ) AS relevance_score

        FROM memories m

        LEFT JOIN memory_images mi
          ON mi.memory_id = m.id

        LEFT JOIN memory_ai_insights ai
          ON ai.memory_id = m.id

        WHERE m.user_id = $1

        GROUP BY
          m.id,
          ai.id,
          ai.caption,
          ai.summary,
          ai.mood,
          ai.themes
      )

      SELECT
        id,
        title,
        description,
        memory_date,
        location,
        created_at,
        updated_at,
        images,
        relevance_score
      FROM scored_memories

      WHERE relevance_score > 0

      ORDER BY
        relevance_score DESC,
        memory_date DESC,
        created_at DESC

      LIMIT 30
      `,
      [
        req.user.userId,
        query,
        searchKeywords,
        searchLocations,
        searchMoods,
        searchThemes
      ]
    )

    return res.status(200).json({
      query,
      interpretation: {
        ...interpretation,
        keywords: searchKeywords,
        moods: searchMoods,
        themes: searchThemes,
        locations: searchLocations
      },
      memories: result.rows
    })
  } catch (error) {
    console.error('Search memories error:', error)

    return res.status(500).json({
      message:
        'Something went wrong while searching your memories'
    })
  }
}

module.exports = {
  searchMemories
}