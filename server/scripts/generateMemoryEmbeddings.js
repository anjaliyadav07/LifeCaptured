require('dotenv').config()

const pool = require('../config/db')

const {
  generateMemoryEmbedding
} = require('../services/memoryEmbeddingService')

const generateAllEmbeddings = async () => {
  try {
    const result = await pool.query(
      `
      SELECT id, title
      FROM memories
      ORDER BY id
      `
    )

    console.log(
      `Found ${result.rows.length} memories.`
    )

    for (const memory of result.rows) {
      try {
        console.log(
          `Generating embedding for memory ${memory.id}: ${memory.title}`
        )

        await generateMemoryEmbedding(memory.id)

        console.log(
          `✓ Embedding saved for memory ${memory.id}`
        )
      } catch (error) {
        console.error(
          `✗ Failed for memory ${memory.id}:`,
          error.message
        )
      }
    }

    console.log(
      'Memory embedding generation complete.'
    )
  } catch (error) {
    console.error(
      'Embedding backfill failed:',
      error
    )
  } finally {
    await pool.end()
  }
}

generateAllEmbeddings()