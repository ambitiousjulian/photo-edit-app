import { useState } from 'react'
import ImageUploader from './components/ImageUploader'
import PromptInput from './components/PromptInput'
import ImagePreview from './components/ImagePreview'
import LoadingSpinner from './components/LoadingSpinner'
import { editImage } from './services/api'

function App() {
  const [uploadedImage, setUploadedImage] = useState(null)
  const [imageBase64, setImageBase64] = useState(null)
  const [prompt, setPrompt] = useState('')
  const [editedImage, setEditedImage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [history, setHistory] = useState([])

  const handleImageUpload = (file, base64) => {
    setUploadedImage(URL.createObjectURL(file))
    setImageBase64(base64)
    setEditedImage(null)
    setError(null)
  }

  const handleSubmit = async () => {
    if (!imageBase64 || !prompt.trim()) {
      setError('Please upload an image and enter an edit prompt')
      return
    }

    setIsLoading(true)
    setError(null)
    setEditedImage(null)

    try {
      const result = await editImage(imageBase64, prompt)
      setEditedImage(result)

      // Add to history
      setHistory(prev => [{
        id: Date.now(),
        original: uploadedImage,
        edited: result,
        prompt: prompt
      }, ...prev])
    } catch (err) {
      setError(err.message || 'Failed to process image. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setUploadedImage(null)
    setImageBase64(null)
    setPrompt('')
    setEditedImage(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-700/50 backdrop-blur-sm bg-gray-900/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Photo Edit AI
              </h1>
            </div>
            {uploadedImage && (
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                Start Over
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Upload Section */}
          {!uploadedImage ? (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-3">
                  Transform Your Photos with AI
                </h2>
                <p className="text-gray-400">
                  Upload an image and describe how you want it edited
                </p>
              </div>
              <ImageUploader onImageUpload={handleImageUpload} />
            </div>
          ) : (
            <>
              {/* Editor Section */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Left: Original Image */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Original Image
                  </h3>
                  <div className="relative rounded-2xl overflow-hidden bg-gray-800/50 border border-gray-700/50">
                    <img
                      src={uploadedImage}
                      alt="Original"
                      className="w-full h-auto max-h-[500px] object-contain"
                    />
                  </div>
                  <ImageUploader
                    onImageUpload={handleImageUpload}
                    compact
                  />
                </div>

                {/* Right: Result */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    Edited Result
                  </h3>
                  <ImagePreview
                    image={editedImage}
                    isLoading={isLoading}
                    placeholder="Your edited image will appear here"
                  />
                </div>
              </div>

              {/* Prompt Input Section */}
              <div className="max-w-3xl mx-auto space-y-4">
                <PromptInput
                  value={prompt}
                  onChange={setPrompt}
                  onSubmit={handleSubmit}
                  disabled={isLoading}
                />

                {/* Error Message */}
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {error}
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || !prompt.trim()}
                  className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 disabled:shadow-none"
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="small" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Generate Edit
                    </>
                  )}
                </button>
              </div>
            </>
          )}

          {/* History Section */}
          {history.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-700/50">
              <h3 className="text-xl font-semibold text-white mb-6">Previous Edits</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {history.map((item) => (
                  <div key={item.id} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <img
                        src={item.original}
                        alt="Original"
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <img
                        src={item.edited}
                        alt="Edited"
                        className="w-full h-24 object-cover rounded-lg"
                      />
                    </div>
                    <p className="text-sm text-gray-400 truncate">{item.prompt}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-700/50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 text-sm">
            Powered by AI Image Generation
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
