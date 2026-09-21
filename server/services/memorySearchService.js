const OpenAI = require('openai')

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const cleanArray = (value) => {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .filter((item) => typeof item === 'string')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 10)
}

const interpretMemorySearch = async (query) => {
  if (!query || !query.trim()) {
    throw new Error('Search query is required')
  }

  const cleanedQuery = query.trim()

  const response = await openai.responses.create({
    model: 'gpt-5.6-luna',

    input: [
      {
        role: 'user',
        content: [
          {
            type: 'input_text',
            text: `
You are the search intelligence engine for LifeCaptured,
a personal visual life archive.

The user wants to search their own memories using natural language.

User query:
"${cleanedQuery}"

Interpret the query for database retrieval.

Return ONLY valid JSON with exactly these fields:

{
  "keywords": [],
  "moods": [],
  "themes": [],
  "locations": [],
  "intent": ""
}

Rules:

- keywords:
  Include important concepts that could appear in a memory title,
  description, caption, or summary.

- moods:
  Include likely emotional moods.
  Examples: peaceful, joyful, nostalgic, adventurous,
  calm, reflective, exciting, warm, serene.

- themes:
  Include meaningful concepts or situations.
  Examples: travel, nature, water, beach, mountains,
  family, friends, food, celebration, sunset.

- locations:
  Include ONLY places explicitly mentioned by the user.
  Never invent a location.

- intent:
  Briefly describe what the user is looking for.

Important:

- Think about synonyms and closely related concepts.
- For example:
  "peaceful moments near water"
  may relate to:
  peaceful, calm, serene, water, lake, river, beach,
  nature, relaxation.

- Do not invent specific personal memories.
- Do not invent specific locations.
- Keep every array concise.
- Use lowercase strings.
- Return valid JSON only.
            `
          }
        ]
      }
    ]
  })

  const text = response.output_text?.trim()

  if (!text) {
    throw new Error('AI returned an empty search interpretation')
  }

  let parsedResult

  try {
    parsedResult = JSON.parse(text)
  } catch {
    throw new Error(
      'AI returned an invalid search interpretation'
    )
  }

  return {
    keywords: cleanArray(parsedResult.keywords),
    moods: cleanArray(parsedResult.moods),
    themes: cleanArray(parsedResult.themes),
    locations: cleanArray(parsedResult.locations),
    intent:
      typeof parsedResult.intent === 'string'
        ? parsedResult.intent.trim()
        : ''
  }
}

module.exports = {
  interpretMemorySearch
}