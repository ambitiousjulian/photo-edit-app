// API Service for Image Editing
// This uses Replicate's API by default, which offers various image editing models
// You can modify this to use other APIs like Stability AI, OpenAI, etc.

const REPLICATE_API_URL = 'https://api.replicate.com/v1/predictions'

// Helper to get the API key from environment variables
const getApiKey = () => {
  const key = import.meta.env.VITE_REPLICATE_API_TOKEN
  if (!key) {
    throw new Error('API key not configured. Please add VITE_REPLICATE_API_TOKEN to your .env file')
  }
  return key
}

// Poll for prediction result
const pollForResult = async (predictionId, apiKey, maxAttempts = 60) => {
  for (let i = 0; i < maxAttempts; i++) {
    const response = await fetch(`${REPLICATE_API_URL}/${predictionId}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to check prediction status')
    }

    const prediction = await response.json()

    if (prediction.status === 'succeeded') {
      // Return the output image URL
      const output = prediction.output
      if (Array.isArray(output)) {
        return output[0]
      }
      return output
    }

    if (prediction.status === 'failed') {
      throw new Error(prediction.error || 'Image generation failed')
    }

    // Wait 2 seconds before polling again
    await new Promise(resolve => setTimeout(resolve, 2000))
  }

  throw new Error('Request timed out. Please try again.')
}

/**
 * Edit an image using AI
 * @param {string} imageBase64 - Base64 encoded image data (without data URI prefix)
 * @param {string} prompt - Description of the desired edit
 * @returns {Promise<string>} - URL or base64 of the edited image
 */
export async function editImage(imageBase64, prompt) {
  const apiKey = getApiKey()

  // Using Stability AI's SDXL model for image editing via Replicate
  // This model is good for general image editing tasks
  // You can change this to other models on Replicate
  const model = 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b'

  try {
    // Create the prediction
    const response = await fetch(REPLICATE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: model.split(':')[1],
        input: {
          image: `data:image/png;base64,${imageBase64}`,
          prompt: prompt,
          negative_prompt: 'blurry, bad quality, distorted, ugly',
          num_inference_steps: 30,
          guidance_scale: 7.5,
          prompt_strength: 0.8,
        },
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to start image processing')
    }

    const prediction = await response.json()

    // Poll for the result
    const resultUrl = await pollForResult(prediction.id, apiKey)

    return resultUrl
  } catch (error) {
    console.error('Image editing error:', error)
    throw error
  }
}

/**
 * Alternative: Edit image using a different model (img2img)
 * This version uses a model specifically designed for image-to-image transformations
 */
export async function editImageWithInstructPix2Pix(imageBase64, prompt) {
  const apiKey = getApiKey()

  // InstructPix2Pix - designed specifically for instruction-based image editing
  const model = 'timothybrooks/instruct-pix2pix:30c1d0b916a6f8efce20493f5d61ee27491ab2a60437c13c588468b9810ec23f'

  try {
    const response = await fetch(REPLICATE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: model.split(':')[1],
        input: {
          image: `data:image/png;base64,${imageBase64}`,
          prompt: prompt,
          num_inference_steps: 50,
          guidance_scale: 7.5,
          image_guidance_scale: 1.5,
        },
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to start image processing')
    }

    const prediction = await response.json()
    const resultUrl = await pollForResult(prediction.id, apiKey)

    return resultUrl
  } catch (error) {
    console.error('Image editing error:', error)
    throw error
  }
}
