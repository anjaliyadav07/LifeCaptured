const fs = require('fs')
const path = require('path')

const pool = require('../config/db')

const {
  createStoryVideo
} = require('../services/storyService')

const generateStory = async (req, res) => {
  const userId = req.user.userId

  const { year, month } = req.body

  const parsedYear = Number(year)
  const parsedMonth = Number(month)

  if (
    !Number.isInteger(parsedYear) ||
    !Number.isInteger(parsedMonth) ||
    parsedMonth < 1 ||
    parsedMonth > 12
  ) {
    return res.status(400).json({
      message: 'Valid year and month are required'
    })
  }

  try {
    const result = await pool.query(
      `
      SELECT
        m.id,
        m.title,
        m.description,
        m.memory_date,
        m.location,
        mi.image_url
      FROM memories m
      INNER JOIN memory_images mi
        ON mi.memory_id = m.id
      WHERE
        m.user_id = $1
        AND EXTRACT(YEAR FROM m.memory_date) = $2
        AND EXTRACT(MONTH FROM m.memory_date) = $3
      ORDER BY
        m.memory_date ASC,
        m.id ASC
      `,
      [
        userId,
        parsedYear,
        parsedMonth
      ]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'No memories found for this month'
      })
    }

    console.log(
      `Creating story from ${result.rows.length} memories`
    )

    const story = await createStoryVideo({
      memories: result.rows,
      year: parsedYear,
      month: parsedMonth
    })

    /*
     * Move the generated MP4 from the temporary
     * processing directory into a permanent
     * server directory.
     */

    const generatedStoriesDirectory = path.join(
      __dirname,
      '..',
      'generated-stories'
    )

    await fs.promises.mkdir(
      generatedStoriesDirectory,
      {
        recursive: true
      }
    )

    const filename =
      `story-${userId}-${parsedYear}-${parsedMonth}-${Date.now()}.mp4`

    const finalPath = path.join(
      generatedStoriesDirectory,
      filename
    )

    await fs.promises.copyFile(
      story.outputPath,
      finalPath
    )

    console.log(
      `Story saved to: ${finalPath}`
    )

    res.json({
      message: 'Story generated successfully',

      story: {
        year: parsedYear,
        month: parsedMonth,
        imageCount: story.imageCount,
        durationSeconds: story.durationSeconds,
        videoUrl: `/generated-stories/${filename}`
      }
    })
  } catch (error) {
    console.error(
      'Generate story error:',
      error
    )

    res.status(500).json({
      message: 'Failed to generate story'
    })
  }
}

module.exports = {
  generateStory
}