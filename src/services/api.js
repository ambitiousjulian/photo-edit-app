// API Service for Image Editing
// Uses Vite's proxy to handle CORS and authentication

const API_URL = '/api/replicate/v1/predictions'

// Poll for prediction result with better status handling
const pollForResult = async (predictionId, maxAttempts = 120) => {
  for (let i = 0; i < maxAttempts; i++) {
    const response = await fetch(`${API_URL}/${predictionId}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Poll error:', errorText)
      throw new Error('Failed to check prediction status')
    }

    const prediction = await response.json()
    console.log(`Status: ${prediction.status} (attempt ${i + 1})`)

    if (prediction.status === 'succeeded') {
      const output = prediction.output
      if (Array.isArray(output)) {
        return output[0]
      }
      return output
    }

    if (prediction.status === 'failed' || prediction.status === 'canceled') {
      throw new Error(prediction.error || 'Image generation failed')
    }

    // Wait 1.5 seconds before polling again
    await new Promise(resolve => setTimeout(resolve, 1500))
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
  try {
    // Create prediction using the model identifier (Replicate will use latest version)
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Use model identifier - Replicate resolves to latest version
        model: 'timothybrooks/instruct-pix2pix',
        input: {
          image: `data:image/png;base64,${imageBase64}`,
          prompt: prompt,
          num_inference_steps: 30,
          guidance_scale: 7.5,
          image_guidance_scale: 1.2,
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('API Error:', errorData)
      throw new Error(errorData.detail || `API Error: ${response.status}`)
    }

    const prediction = await response.json()
    console.log('Prediction created:', prediction.id)

    // Poll for the result
    const resultUrl = await pollForResult(prediction.id)
    return resultUrl
  } catch (error) {
    console.error('Image editing error:', error)
    throw error
  }
}
