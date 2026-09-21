const pool = require('../config/db')
const { analyzeMemory } = require('../services/aiService')

const generateMemoryInsight = async (req, res) => {
  try {
    const { id } = req.params

    const memoryResult = await pool.query(
      `
      SELECT
        m.id,
        m.title,
        m.description,
        m.memory_date,
        m.location,
        mi.image_url
      FROM memories m
      LEFT JOIN memory_images mi
        ON mi.memory_id = m.id
      WHERE m.id = $1
        AND m.user_id = $2
      ORDER BY mi.created_at
      LIMIT 1
      `,
      [id, req.user.userId]
    )

    if (memoryResult.rows.length === 0) {
      return res.status(404).json({
        message: 'Memory not found'
      })
    }

    const memory = memoryResult.rows[0]

    if (!memory.image_url) {
      return res.status(400).json({
        message: 'This memory needs a photo before AI analysis'
      })
    }

    const aiResult = await analyzeMemory({
      imageUrl: memory.image_url,
      title: memory.title,
      description: memory.description,
      location: memory.location,
      memoryDate: memory.memory_date
    })

    const result = await pool.query(
      `
      INSERT INTO memory_ai_insights (
        memory_id,
        caption,
        summary,
        mood,
        themes
      )
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (memory_id)
      DO UPDATE SET
        caption = EXCLUDED.caption,
        summary = EXCLUDED.summary,
        mood = EXCLUDED.mood,
        themes = EXCLUDED.themes,
        updated_at = CURRENT_TIMESTAMP
      RETURNING
        id,
        memory_id,
        caption,
        summary,
        mood,
        themes,
        created_at,
        updated_at
      `,
      [
        memory.id,
        aiResult.caption,
        aiResult.summary,
        aiResult.mood,
        aiResult.themes
      ]
    )

    return res.status(200).json({
      message: 'Memory insight generated successfully',
      insight: result.rows[0]
    })
  } catch (error) {
    console.error('Generate memory insight error:', error)

    return res.status(500).json({
      message: 'Something went wrong while generating the memory insight'
    })
  }
}

module.exports = {
  generateMemoryInsight
}