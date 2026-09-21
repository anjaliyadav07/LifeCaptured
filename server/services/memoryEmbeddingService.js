const OpenAI = require('openai')

const pool = require('../config/db')

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const EMBEDDING_MODEL = 'text-embedding-3-small'

const buildMemorySearchText = (memory) => {
  const parts = []

  if (memory.title) {
    parts.push(`Title: ${memory.title}`)
  }

  if (memory.description) {
    parts.push(`Story: ${memory.description}`)
  }

  if (memory.location) {
    parts.push(`Location: ${memory.location}`)
  }

  if (memory.memory_date) {
    parts.push(`Date: ${memory.memory_date}`)
  }

  if (memory.ai_caption) {
    parts.push(`AI Caption: ${memory.ai_caption}`)
  }

  if (memory.ai_summary) {
    parts.push(`AI Summary: ${memory.ai_summary}`)
  }

  if (memory.ai_mood) {
    parts.push(`Mood: ${memory.ai_mood}`)
  }

  if (Array.isArray(memory.ai_themes) && memory.ai_themes.length > 0) {
    parts.push(
      `Themes: ${memory.ai_themes.join(', ')}`
    )
  }

  return parts.join('\n')
}

const generateEmbedding = async (text) => {
  if (!text || !text.trim()) {
    throw new Error(
      'Memory text is required for embedding generation'
    )
  }

  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text.trim()
  })

  const embedding = response.data?.[0]?.embedding

  if (!Array.isArray(embedding) || embedding.length !== 1536) {
    throw new Error(
      'OpenAI returned an invalid memory embedding'
    )
  }

  return embedding
}

const saveMemoryEmbedding = async (
  memoryId,
  embedding
) => {
  const vectorValue = `[${embedding.join(',')}]`

  const result = await pool.query(
    `
    INSERT INTO memory_embeddings (
      memory_id,
      embedding
    )
    VALUES ($1, $2::vector)
    ON CONFLICT (memory_id)
    DO UPDATE SET
      embedding = EXCLUDED.embedding,
      updated_at = CURRENT_TIMESTAMP
    RETURNING
      id,
      memory_id,
      created_at,
      updated_at
    `,
    [
      memoryId,
      vectorValue
    ]
  )

  return result.rows[0]
}

const generateMemoryEmbedding = async (memoryId) => {
  const result = await pool.query(
    `
    SELECT
      m.id,
      m.title,
      m.description,
      m.memory_date,
      m.location,

      ai.caption AS ai_caption,
      ai.summary AS ai_summary,
      ai.mood AS ai_mood,
      ai.themes AS ai_themes

    FROM memories m

    LEFT JOIN memory_ai_insights ai
      ON ai.memory_id = m.id

    WHERE m.id = $1
    `,
    [memoryId]
  )

  if (result.rows.length === 0) {
    throw new Error('Memory not found')
  }

  const memory = result.rows[0]

  const searchText = buildMemorySearchText(memory)

  if (!searchText.trim()) {
    throw new Error(
      'Memory does not contain enough information for embedding'
    )
  }

  const embedding = await generateEmbedding(searchText)

  return saveMemoryEmbedding(
    memory.id,
    embedding
  )
}

module.exports = {
  buildMemorySearchText,
  generateEmbedding,
  saveMemoryEmbedding,
  generateMemoryEmbedding
}