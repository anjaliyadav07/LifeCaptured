const fs = require('fs')
const path = require('path')
const os = require('os')
const https = require('https')
const { execFile } = require('child_process')

const FFMPEG_PATH =
  process.env.FFMPEG_PATH || 'ffmpeg'

const VIDEO_WIDTH = 1920
const VIDEO_HEIGHT = 1080

const INTRO_DURATION = 3
const MEMORY_DURATION = 4
const OUTRO_DURATION = 3

const FPS = 30

const runCommand = (command, args) => {
  return new Promise((resolve, reject) => {
    execFile(
      command,
      args,
      {
        windowsHide: true,
        maxBuffer: 1024 * 1024 * 20
      },
      (error, stdout, stderr) => {
        if (error) {
          console.error(stderr)
          reject(error)
          return
        }

        resolve({
          stdout,
          stderr
        })
      }
    )
  })
}

const downloadFile = (url, destination) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destination)

    const request = https.get(url, (response) => {
      if (
        response.statusCode >= 300 &&
        response.statusCode < 400 &&
        response.headers.location
      ) {
        file.close()

        fs.unlink(destination, () => {})

        downloadFile(
          response.headers.location,
          destination
        )
          .then(resolve)
          .catch(reject)

        return
      }

      if (response.statusCode !== 200) {
        file.close()

        fs.unlink(destination, () => {})

        reject(
          new Error(
            `Image download failed with status ${response.statusCode}`
          )
        )

        return
      }

      response.pipe(file)

      file.on('finish', () => {
        file.close(resolve)
      })
    })

    request.on('error', (error) => {
      file.close()

      fs.unlink(destination, () => {})

      reject(error)
    })
  })
}

const escapeDrawtext = (text = '') => {
  return String(text)
    .replace(/\\/g, '\\\\')
    .replace(/:/g, '\\:')
    .replace(/'/g, "\\'")
    .replace(/,/g, '\\,')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
    .replace(/%/g, '\\%')
}

const formatDate = (date) => {
  if (!date) {
    return ''
  }

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return ''
  }

  return parsedDate.toLocaleDateString(
    'en-US',
    {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }
  )
}

const getMonthName = (year, month) => {
  return new Date(
    year,
    month - 1,
    1
  ).toLocaleString('en-US', {
    month: 'long'
  })
}

const createTitleCard = async ({
  outputPath,
  year,
  month,
  memoryCount
}) => {
  const monthName = getMonthName(
    year,
    month
  )

  const monthText = escapeDrawtext(
    monthName.toUpperCase()
  )

  const yearText = escapeDrawtext(
    String(year)
  )

  const countText = escapeDrawtext(
    `${memoryCount} ${
      memoryCount === 1
        ? 'moment'
        : 'moments'
    }`
  )

  const filter = [
    'format=yuv420p',

    `drawtext=text='LIFECAPTURED':fontcolor=white:fontsize=44:x=(w-text_w)/2:y=350:alpha='if(lt(t,1),t,if(lt(t,2),1,3-t))'`,

    `drawtext=text='${monthText}':fontcolor=white:fontsize=86:x=(w-text_w)/2:y=440:alpha='if(lt(t,0.8),0,if(lt(t,1.8),(t-0.8),if(lt(t,2.5),1,3-t)))'`,

    `drawtext=text='${yearText}':fontcolor=white@0.55:fontsize=48:x=(w-text_w)/2:y=545`,

    `drawtext=text='${countText}':fontcolor=white@0.45:fontsize=28:x=(w-text_w)/2:y=625`
  ].join(',')

  await runCommand(FFMPEG_PATH, [
    '-y',
    '-f',
    'lavfi',
    '-i',
    `color=c=black:s=${VIDEO_WIDTH}x${VIDEO_HEIGHT}:d=${INTRO_DURATION}`,
    '-vf',
    filter,
    '-r',
    String(FPS),
    '-c:v',
    'libx264',
    '-pix_fmt',
    'yuv420p',
    outputPath
  ])
}

const createMemoryClip = async ({
  imagePath,
  outputPath,
  title,
  date,
  location,
  index
}) => {
  const escapedTitle = escapeDrawtext(
    title || 'Untitled memory'
  )

  const escapedDate = escapeDrawtext(
    formatDate(date)
  )

  const escapedLocation = escapeDrawtext(
    location || ''
  )

  /*
   * Alternate between a slow zoom-in and
   * a slow zoom-out for visual variety.
   */

  const zoomExpression =
    index % 2 === 0
      ? 'min(zoom+0.0008,1.15)'
      : 'max(zoom-0.0008,1.0)'

  const locationText = escapedLocation
    ? `drawtext=text='${escapedLocation}':fontcolor=white@0.65:fontsize=25:x=90:y=h-105`
    : ''

  const dateText = escapedDate
    ? `drawtext=text='${escapedDate}':fontcolor=white@0.65:fontsize=25:x=90:y=h-145`
    : ''

  const filter = [
    `scale=${VIDEO_WIDTH}:${VIDEO_HEIGHT}:force_original_aspect_ratio=increase`,

    `crop=${VIDEO_WIDTH}:${VIDEO_HEIGHT}`,

    `zoompan=z='${zoomExpression}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${MEMORY_DURATION * FPS}:s=${VIDEO_WIDTH}x${VIDEO_HEIGHT}:fps=${FPS}`,

    'format=yuv420p',

    'drawbox=x=0:y=0:w=iw:h=ih:color=black@0.18:t=fill',

    `drawtext=text='${escapedTitle}':fontcolor=white:fontsize=48:x=90:y=h-215:alpha='if(lt(t,0.7),t/0.7,if(gt(t,3.2),(4-t)/0.8,1))'`,

    dateText,

    locationText,

    'fade=t=in:st=0:d=0.6',

    `fade=t=out:st=${MEMORY_DURATION - 0.7}:d=0.7`
  ]
    .filter(Boolean)
    .join(',')

  await runCommand(FFMPEG_PATH, [
    '-y',
    '-loop',
    '1',
    '-i',
    imagePath,
    '-t',
    String(MEMORY_DURATION),
    '-vf',
    filter,
    '-r',
    String(FPS),
    '-c:v',
    'libx264',
    '-pix_fmt',
    'yuv420p',
    outputPath
  ])
}

const createOutroCard = async ({
  outputPath,
  year,
  month
}) => {
  const monthName = getMonthName(
    year,
    month
  )

  const closingText = escapeDrawtext(
    `${monthName}, remembered.`
  )

  const taglineText = escapeDrawtext(
    'Your moments. Your story.'
  )

  const filter = [
    'format=yuv420p',

    `drawtext=text='${closingText}':fontcolor=white:fontsize=58:x=(w-text_w)/2:y=430:alpha='if(lt(t,1),t,if(lt(t,2),1,3-t))'`,

    `drawtext=text='${taglineText}':fontcolor=white@0.45:fontsize=30:x=(w-text_w)/2:y=525:alpha='if(lt(t,1.2),0,if(lt(t,2.2),(t-1.2),1))'`
  ].join(',')

  await runCommand(FFMPEG_PATH, [
    '-y',
    '-f',
    'lavfi',
    '-i',
    `color=c=black:s=${VIDEO_WIDTH}x${VIDEO_HEIGHT}:d=${OUTRO_DURATION}`,
    '-vf',
    filter,
    '-r',
    String(FPS),
    '-c:v',
    'libx264',
    '-pix_fmt',
    'yuv420p',
    outputPath
  ])
}

const concatenateClips = async ({
  clipPaths,
  outputPath,
  concatFilePath
}) => {
  const concatContent = clipPaths
    .map((clipPath) => {
      const normalizedPath = clipPath
        .replace(/\\/g, '/')
        .replace(/'/g, "'\\''")

      return `file '${normalizedPath}'`
    })
    .join('\n')

  await fs.promises.writeFile(
    concatFilePath,
    concatContent,
    'utf8'
  )

  await runCommand(FFMPEG_PATH, [
    '-y',
    '-f',
    'concat',
    '-safe',
    '0',
    '-i',
    concatFilePath,
    '-c',
    'copy',
    '-movflags',
    '+faststart',
    outputPath
  ])
}

const createStoryVideo = async ({
  memories,
  year,
  month
}) => {
  if (
    !Array.isArray(memories) ||
    memories.length === 0
  ) {
    throw new Error(
      'No memories available for this story'
    )
  }

  const temporaryDirectory =
    await fs.promises.mkdtemp(
      path.join(
        os.tmpdir(),
        'lifecaptured-story-'
      )
    )

  const clipsDirectory = path.join(
    temporaryDirectory,
    'clips'
  )

  await fs.promises.mkdir(
    clipsDirectory,
    {
      recursive: true
    }
  )

  try {
    const usableMemories = memories
      .filter(
        (memory) => memory.image_url
      )
      .slice(0, 30)

    if (usableMemories.length === 0) {
      throw new Error(
        'No usable photographs found'
      )
    }

    console.log(
      `Creating cinematic story from ${usableMemories.length} memories`
    )

    const clipPaths = []

    /*
     * INTRO
     */

    const introPath = path.join(
      clipsDirectory,
      '000-intro.mp4'
    )

    console.log(
      'Creating opening title card'
    )

    await createTitleCard({
      outputPath: introPath,
      year,
      month,
      memoryCount:
        usableMemories.length
    })

    clipPaths.push(introPath)

    /*
     * MEMORY CLIPS
     */

    for (
      let index = 0;
      index < usableMemories.length;
      index += 1
    ) {
      const memory =
        usableMemories[index]

      const imagePath = path.join(
        temporaryDirectory,
        `image-${String(index).padStart(3, '0')}.jpg`
      )

      const clipPath = path.join(
        clipsDirectory,
        `${String(index + 1).padStart(3, '0')}-memory.mp4`
      )

      console.log(
        `Downloading memory ${index + 1}/${usableMemories.length}`
      )

      await downloadFile(
        memory.image_url,
        imagePath
      )

      console.log(
        `Creating cinematic memory ${index + 1}/${usableMemories.length}`
      )

      await createMemoryClip({
        imagePath,
        outputPath: clipPath,
        title:
          memory.title ||
          'Untitled memory',
        date: memory.memory_date,
        location:
          memory.location || '',
        index
      })

      clipPaths.push(clipPath)
    }

    /*
     * OUTRO
     */

    const outroPath = path.join(
      clipsDirectory,
      '999-outro.mp4'
    )

    console.log(
      'Creating closing title card'
    )

    await createOutroCard({
      outputPath: outroPath,
      year,
      month
    })

    clipPaths.push(outroPath)

    /*
     * FINAL VIDEO
     */

    const outputPath = path.join(
      temporaryDirectory,
      `story-${year}-${month}.mp4`
    )

    const concatFilePath = path.join(
      temporaryDirectory,
      'concat.txt'
    )

    console.log(
      'Combining cinematic story clips...'
    )

    await concatenateClips({
      clipPaths,
      outputPath,
      concatFilePath
    })

    console.log(
      `Cinematic story generated successfully: ${outputPath}`
    )

    return {
      outputPath,
      year,
      month,
      imageCount:
        usableMemories.length,
      durationSeconds:
        INTRO_DURATION +
        usableMemories.length *
          MEMORY_DURATION +
        OUTRO_DURATION
    }
  } catch (error) {
    console.error(
      'Story generation failed:',
      error
    )

    throw error
  }
}

module.exports = {
  createStoryVideo
}