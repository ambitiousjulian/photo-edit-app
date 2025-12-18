// API Service for Image Editing
// Uses Vite's proxy to handle CORS and authentication

const API_URL = '/api/replicate/v1/predictions'

// Poll for prediction result
const pollForResult = async (predictionId, maxAttempts = 60) => {
  for (let i = 0; i < maxAttempts; i++) {
    const response = await fetch(`${API_URL}/${predictionId}`)

    if (!response.ok) {
      throw new Error('Failed to check prediction status')
    }

    const prediction = await response.json()

    if (prediction.status === 'succeeded') {
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
  // Using InstructPix2Pix - designed for instruction-based image editing
  const model = 'timothybrooks/instruct-pix2pix:30c1d0b916a6f8efce20493f5d61ee27491ab2a60437c13c588468b9810ec23f'

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
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
    const resultUrl = await pollForResult(prediction.id)

    return resultUrl
  } catch (error) {
    console.error('Image editing error:', error)
    throw error
  }
}
