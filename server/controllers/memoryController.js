const pool = require('../config/db')
const cloudinary = require('../config/cloudinary')

const MAX_TITLE_LENGTH = 200
const MAX_DESCRIPTION_LENGTH = 5000
const MAX_LOCATION_LENGTH = 200

const uploadImageToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'lifecaptured/memories',
        resource_type: 'image'
      },
      (error, result) => {
        if (error) {
          reject(error)
          return
        }

        resolve(result)
      }
    )

    uploadStream.end(buffer)
  })
}

const deleteCloudinaryImage = async (publicId) => {
  if (!publicId) {
    return true
  }

  try {
    const result = await cloudinary.uploader.destroy(
      publicId,
      {
        resource_type: 'image'
      }
    )

    if (
      result.result !== 'ok' &&
      result.result !== 'not found'
    ) {
      console.error(
        'Unexpected Cloudinary deletion result:',
        result
      )

      return false
    }

    return true
  } catch (error) {
    console.error(
      'Cloudinary image deletion error:',
      error
    )

    return false
  }
}

const parsePositiveInteger = (value) => {
  const parsed = Number(value)

  if (
    !Number.isInteger(parsed) ||
    parsed <= 0
  ) {
    return null
  }

  return parsed
}

const validateMemoryFields = ({
  title,
  description,
  memoryDate,
  location
}) => {
  if (
    typeof title !== 'string' ||
    !title.trim()
  ) {
    return 'Title is required'
  }

  if (
    title.trim().length >
    MAX_TITLE_LENGTH
  ) {
    return `Title must be ${MAX_TITLE_LENGTH} characters or fewer`
  }

  if (
    description !== undefined &&
    description !== null &&
    typeof description !== 'string'
  ) {
    return 'Description must be text'
  }

  if (
    typeof description === 'string' &&
    description.trim().length >
      MAX_DESCRIPTION_LENGTH
  ) {
    return `Description must be ${MAX_DESCRIPTION_LENGTH} characters or fewer`
  }

  if (
    typeof memoryDate !== 'string' ||
    !memoryDate.trim()
  ) {
    return 'Memory date is required'
  }

  const parsedDate = new Date(
    `${memoryDate}T00:00:00`
  )

  if (
    Number.isNaN(parsedDate.getTime())
  ) {
    return 'Please provide a valid memory date'
  }

  if (
    location !== undefined &&
    location !== null &&
    typeof location !== 'string'
  ) {
    return 'Location must be text'
  }

  if (
    typeof location === 'string' &&
    location.trim().length >
      MAX_LOCATION_LENGTH
  ) {
    return `Location must be ${MAX_LOCATION_LENGTH} characters or fewer`
  }

  return null
}

const createMemory = async (req, res) => {
  try {
    const {
      title,
      description,
      memoryDate,
      location
    } = req.body

    const validationError =
      validateMemoryFields({
        title,
        description,
        memoryDate,
        location
      })

    if (validationError) {
      return res.status(400).json({
        message: validationError
      })
    }

    const result = await pool.query(
      `
      INSERT INTO memories (
        user_id,
        title,
        description,
        memory_date,
        location
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING
        id,
        user_id,
        title,
        description,
        memory_date,
        location,
        created_at,
        updated_at
      `,
      [
        req.user.userId,
        title.trim(),
        description?.trim() || null,
        memoryDate.trim(),
        location?.trim() || null
      ]
    )

    return res.status(201).json({
      message: 'Memory created successfully',
      memory: result.rows[0]
    })
  } catch (error) {
    console.error(
      'Create memory error:',
      error
    )

    return res.status(500).json({
      message:
        'Something went wrong while creating the memory'
    })
  }
}

const uploadMemoryImage = async (
  req,
  res
) => {
  let uploadedPublicId = null

  try {
    const id =
      parsePositiveInteger(req.params.id)

    if (!id) {
      return res.status(400).json({
        message: 'Invalid memory ID'
      })
    }

    if (!req.file) {
      return res.status(400).json({
        message: 'An image is required'
      })
    }

    const memoryResult = await pool.query(
      `
      SELECT id
      FROM memories
      WHERE id = $1
        AND user_id = $2
      `,
      [id, req.user.userId]
    )

    if (memoryResult.rows.length === 0) {
      return res.status(404).json({
        message: 'Memory not found'
      })
    }

    const uploadResult =
      await uploadImageToCloudinary(
        req.file.buffer
      )

    uploadedPublicId =
      uploadResult.public_id

    try {
      const imageResult =
        await pool.query(
          `
          INSERT INTO memory_images (
            memory_id,
            image_url,
            cloudinary_public_id
          )
          VALUES ($1, $2, $3)
          RETURNING
            id,
            memory_id,
            image_url,
            cloudinary_public_id,
            created_at
          `,
          [
            id,
            uploadResult.secure_url,
            uploadResult.public_id
          ]
        )

      uploadedPublicId = null

      return res.status(201).json({
        message:
          'Image uploaded successfully',
        image: imageResult.rows[0]
      })
    } catch (databaseError) {
      console.error(
        'Database insert after Cloudinary upload failed:',
        databaseError
      )

      await deleteCloudinaryImage(
        uploadedPublicId
      )

      throw databaseError
    }
  } catch (error) {
    console.error(
      'Upload memory image error:',
      error
    )

    return res.status(500).json({
      message:
        'Something went wrong while uploading the image'
    })
  }
}

const getMemories = async (
  req,
  res
) => {
  try {
    const result = await pool.query(
      `
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
            json_build_object(
              'id', mi.id,
              'imageUrl', mi.image_url
            )
            ORDER BY mi.created_at
          ) FILTER (
            WHERE mi.id IS NOT NULL
          ),
          '[]'
        ) AS images

      FROM memories m

      LEFT JOIN memory_images mi
        ON mi.memory_id = m.id

      WHERE m.user_id = $1

      GROUP BY m.id

      ORDER BY
        m.memory_date DESC,
        m.created_at DESC
      `,
      [req.user.userId]
    )

    return res.status(200).json({
      memories: result.rows
    })
  } catch (error) {
    console.error(
      'Get memories error:',
      error
    )

    return res.status(500).json({
      message:
        'Something went wrong while fetching memories'
    })
  }
}

const getMemoryById = async (
  req,
  res
) => {
  try {
    const id =
      parsePositiveInteger(req.params.id)

    if (!id) {
      return res.status(400).json({
        message: 'Invalid memory ID'
      })
    }

    const result = await pool.query(
      `
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
            json_build_object(
              'id', mi.id,
              'imageUrl', mi.image_url
            )
            ORDER BY mi.created_at
          ) FILTER (
            WHERE mi.id IS NOT NULL
          ),
          '[]'
        ) AS images,

        (
          SELECT json_build_object(
            'id', ai.id,
            'caption', ai.caption,
            'summary', ai.summary,
            'mood', ai.mood,
            'themes', ai.themes,
            'createdAt', ai.created_at,
            'updatedAt', ai.updated_at
          )
          FROM memory_ai_insights ai
          WHERE ai.memory_id = m.id
        ) AS ai_insight

      FROM memories m

      LEFT JOIN memory_images mi
        ON mi.memory_id = m.id

      WHERE m.id = $1
        AND m.user_id = $2

      GROUP BY m.id
      `,
      [
        id,
        req.user.userId
      ]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Memory not found'
      })
    }

    const row = result.rows[0]

    const memory = {
      id: row.id,
      title: row.title,
      description: row.description,
      memory_date:
        row.memory_date,
      location: row.location,
      created_at:
        row.created_at,
      updated_at:
        row.updated_at,
      images: row.images,
      aiInsight:
        row.ai_insight || null
    }

    return res.status(200).json({
      memory
    })
  } catch (error) {
    console.error(
      'Get memory error:',
      error
    )

    return res.status(500).json({
      message:
        'Something went wrong while fetching the memory'
    })
  }
}

const updateMemory = async (
  req,
  res
) => {
  try {
    const id =
      parsePositiveInteger(req.params.id)

    if (!id) {
      return res.status(400).json({
        message: 'Invalid memory ID'
      })
    }

    const {
      title,
      description,
      memoryDate,
      location
    } = req.body

    const validationError =
      validateMemoryFields({
        title,
        description,
        memoryDate,
        location
      })

    if (validationError) {
      return res.status(400).json({
        message: validationError
      })
    }

    const result = await pool.query(
      `
      UPDATE memories
      SET
        title = $1,
        description = $2,
        memory_date = $3,
        location = $4,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
        AND user_id = $6
      RETURNING
        id,
        title,
        description,
        memory_date,
        location,
        created_at,
        updated_at
      `,
      [
        title.trim(),
        description?.trim() || null,
        memoryDate.trim(),
        location?.trim() || null,
        id,
        req.user.userId
      ]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Memory not found'
      })
    }

    return res.status(200).json({
      message:
        'Memory updated successfully',
      memory: result.rows[0]
    })
  } catch (error) {
    console.error(
      'Update memory error:',
      error
    )

    return res.status(500).json({
      message:
        'Something went wrong while updating the memory'
    })
  }
}

const replaceMemoryImage = async (
  req,
  res
) => {
  let newPublicId = null

  let client = null

  try {
    const id =
      parsePositiveInteger(req.params.id)

    if (!id) {
      return res.status(400).json({
        message: 'Invalid memory ID'
      })
    }

    if (!req.file) {
      return res.status(400).json({
        message: 'An image is required'
      })
    }

    client = await pool.connect()

    await client.query('BEGIN')

    const memoryResult =
      await client.query(
        `
        SELECT id
        FROM memories
        WHERE id = $1
          AND user_id = $2
        FOR UPDATE
        `,
        [
          id,
          req.user.userId
        ]
      )

    if (memoryResult.rows.length === 0) {
      await client.query('ROLLBACK')

      return res.status(404).json({
        message: 'Memory not found'
      })
    }

    const existingImageResult =
      await client.query(
        `
        SELECT
          id,
          cloudinary_public_id
        FROM memory_images
        WHERE memory_id = $1
        ORDER BY created_at
        LIMIT 1
        `,
        [id]
      )

    const uploadResult =
      await uploadImageToCloudinary(
        req.file.buffer
      )

    newPublicId =
      uploadResult.public_id

    await client.query(
      `
      DELETE FROM memory_images
      WHERE memory_id = $1
      `,
      [id]
    )

    const imageResult =
      await client.query(
        `
        INSERT INTO memory_images (
          memory_id,
          image_url,
          cloudinary_public_id
        )
        VALUES ($1, $2, $3)
        RETURNING
          id,
          memory_id,
          image_url,
          cloudinary_public_id,
          created_at
        `,
        [
          id,
          uploadResult.secure_url,
          uploadResult.public_id
        ]
      )

    await client.query('COMMIT')

    newPublicId = null

    const oldPublicId =
      existingImageResult.rows[0]
        ?.cloudinary_public_id

    if (oldPublicId) {
      const deleted =
        await deleteCloudinaryImage(
          oldPublicId
        )

      if (!deleted) {
        console.error(
          `Old Cloudinary image could not be deleted for memory ${id}. Public ID: ${oldPublicId}`
        )
      }
    }

    return res.status(200).json({
      message:
        'Memory image replaced successfully',
      image: imageResult.rows[0]
    })
  } catch (error) {
    if (client) {
      try {
        await client.query(
          'ROLLBACK'
        )
      } catch (rollbackError) {
        console.error(
          'Rollback error:',
          rollbackError
        )
      }
    }

    if (newPublicId) {
      await deleteCloudinaryImage(
        newPublicId
      )
    }

    console.error(
      'Replace memory image error:',
      error
    )

    return res.status(500).json({
      message:
        'Something went wrong while replacing the image'
    })
  } finally {
    if (client) {
      client.release()
    }
  }
}

const deleteMemory = async (
  req,
  res
) => {
  let client = null

  try {
    const id =
      parsePositiveInteger(req.params.id)

    if (!id) {
      return res.status(400).json({
        message: 'Invalid memory ID'
      })
    }

    client = await pool.connect()

    await client.query('BEGIN')

    const memoryResult =
      await client.query(
        `
        SELECT id
        FROM memories
        WHERE id = $1
          AND user_id = $2
        FOR UPDATE
        `,
        [
          id,
          req.user.userId
        ]
      )

    if (memoryResult.rows.length === 0) {
      await client.query('ROLLBACK')

      return res.status(404).json({
        message: 'Memory not found'
      })
    }

    const imagesResult =
      await client.query(
        `
        SELECT cloudinary_public_id
        FROM memory_images
        WHERE memory_id = $1
        `,
        [id]
      )

    await client.query(
      `
      DELETE FROM memory_images
      WHERE memory_id = $1
      `,
      [id]
    )

    const deleteMemoryResult =
      await client.query(
        `
        DELETE FROM memories
        WHERE id = $1
          AND user_id = $2
        `,
        [
          id,
          req.user.userId
        ]
      )

    if (
      deleteMemoryResult.rowCount === 0
    ) {
      throw new Error(
        'Memory could not be deleted'
      )
    }

    await client.query('COMMIT')

    for (
      const image of imagesResult.rows
    ) {
      if (
        image.cloudinary_public_id
      ) {
        const deleted =
          await deleteCloudinaryImage(
            image.cloudinary_public_id
          )

        if (!deleted) {
          console.error(
            `Cloudinary cleanup failed after deleting memory ${id}. Public ID: ${image.cloudinary_public_id}`
          )
        }
      }
    }

    return res.status(200).json({
      message:
        'Memory deleted successfully'
    })
  } catch (error) {
    if (client) {
      try {
        await client.query(
          'ROLLBACK'
        )
      } catch (rollbackError) {
        console.error(
          'Rollback error:',
          rollbackError
        )
      }
    }

    console.error(
      'Delete memory error:',
      error
    )

    return res.status(500).json({
      message:
        'Something went wrong while deleting the memory'
    })
  } finally {
    if (client) {
      client.release()
    }
  }
}

const getMemoriesByMonth = async (
  req,
  res
) => {
  try {
    const {
      year,
      month
    } = req.params

    const parsedYear =
      Number(year)

    const parsedMonth =
      Number(month)

    if (
      !Number.isInteger(parsedYear) ||
      parsedYear < 1900 ||
      parsedYear > 2200 ||
      !Number.isInteger(parsedMonth) ||
      parsedMonth < 1 ||
      parsedMonth > 12
    ) {
      return res.status(400).json({
        message:
          'Invalid year or month'
      })
    }

    const result = await pool.query(
      `
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
            json_build_object(
              'id', mi.id,
              'imageUrl', mi.image_url
            )
            ORDER BY mi.created_at
          ) FILTER (
            WHERE mi.id IS NOT NULL
          ),
          '[]'
        ) AS images,

        (
          SELECT json_build_object(
            'id', ai.id,
            'caption', ai.caption,
            'summary', ai.summary,
            'mood', ai.mood,
            'themes', ai.themes,
            'createdAt', ai.created_at,
            'updatedAt', ai.updated_at
          )
          FROM memory_ai_insights ai
          WHERE ai.memory_id = m.id
        ) AS ai_insight

      FROM memories m

      LEFT JOIN memory_images mi
        ON mi.memory_id = m.id

      WHERE
        m.user_id = $1
        AND EXTRACT(
          YEAR FROM m.memory_date
        ) = $2
        AND EXTRACT(
          MONTH FROM m.memory_date
        ) = $3

      GROUP BY m.id

      ORDER BY
        m.memory_date ASC,
        m.created_at ASC
      `,
      [
        req.user.userId,
        parsedYear,
        parsedMonth
      ]
    )

    return res.status(200).json({
      year: parsedYear,
      month: parsedMonth,
      memories: result.rows
    })
  } catch (error) {
    console.error(
      'Get memories by month error:',
      error
    )

    return res.status(500).json({
      message:
        'Something went wrong while fetching this month'
    })
  }
}

module.exports = {
  createMemory,
  uploadMemoryImage,
  getMemories,
  getMemoryById,
  getMemoriesByMonth,
  updateMemory,
  deleteMemory,
  replaceMemoryImage
}