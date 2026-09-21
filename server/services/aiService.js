const OpenAI = require('openai')

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })
  : null

const analyzeMemory = async ({
  imageUrl,
  title,
  description,
  location,
  memoryDate
}) => {
  if (!openai) {
    throw new Error(
      'AI memory analysis is currently unavailable because OPENAI_API_KEY is not configured'
    )
  }

  if (!imageUrl) {
    throw new Error('Memory image is required for AI analysis')
  }

  const response = await openai.responses.create({
    model: 'gpt-5.6-luna',

    input: [
      {
        role: 'user',
        content: [
          {
            type: 'input_text',
            text: `
You are the memory intelligence engine for LifeCaptured,
a personal visual life archive.

Analyze this memory using both the photograph and the
user-provided information.

Memory information:

Title: ${title || 'Not provided'}
Description: ${description || 'Not provided'}
Location: ${location || 'Not provided'}
Date: ${memoryDate || 'Not provided'}

Return ONLY valid JSON.

The JSON must have exactly these fields:

{
  "caption": "A short, natural caption for the photograph.",
  "summary": "A meaningful 1-2 sentence summary of the memory.",
  "mood": "One primary mood.",
  "themes": [
    "theme 1",
    "theme 2",
    "theme 3"
  ]
}

Rules:

- Do not invent people, places, events, or facts that cannot
  reasonably be inferred from the image or provided information.
- Keep the caption concise and emotionally natural.
- The summary should feel personal, not like a generic photo description.
- Choose one clear mood such as peaceful, joyful, nostalgic,
  adventurous, calm, reflective, exciting, warm, or serene.
- Return 3 to 5 concise themes.
- Do not include markdown.
- Do not include explanations outside the JSON.
            `
          },
          {
            type: 'input_image',
            image_url: imageUrl
          }
        ]
      }
    ]
  })

  const text = response.output_text?.trim()

  if (!text) {
    throw new Error('AI returned an empty response')
  }

  let parsedResult

  try {
    parsedResult = JSON.parse(text)
  } catch {
    throw new Error('AI returned an invalid JSON response')
  }

  if (
    typeof parsedResult.caption !== 'string' ||
    typeof parsedResult.summary !== 'string' ||
    typeof parsedResult.mood !== 'string' ||
    !Array.isArray(parsedResult.themes)
  ) {
    throw new Error('AI returned an invalid memory analysis')
  }

  return {
    caption: parsedResult.caption.trim(),
    summary: parsedResult.summary.trim(),
    mood: parsedResult.mood.trim(),
    themes: parsedResult.themes
      .filter((theme) => typeof theme === 'string')
      .map((theme) => theme.trim())
      .filter(Boolean)
      .slice(0, 5)
  }
}

module.exports = {
  analyzeMemory
}