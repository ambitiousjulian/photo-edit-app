import LoadingSpinner from './LoadingSpinner'

function ImagePreview({ image, isLoading, placeholder }) {
  const handleDownload = () => {
    if (!image) return

    const link = document.createElement('a')
    link.href = image
    link.download = `edited-image-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (isLoading) {
    return (
      <div className="relative rounded-2xl overflow-hidden bg-gray-800/50 border border-gray-700/50 min-h-[300px] flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-gray-400">Generating your edit...</p>
          <p className="mt-1 text-gray-500 text-sm">This may take a moment</p>
        </div>
      </div>
    )
  }

  if (!image) {
    return (
      <div className="relative rounded-2xl overflow-hidden bg-gray-800/30 border border-gray-700/50 border-dashed min-h-[300px] flex items-center justify-center">
        <div className="text-center p-8">
          <div className="mx-auto w-16 h-16 rounded-full bg-gray-700/30 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-500">{placeholder}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative rounded-2xl overflow-hidden bg-gray-800/50 border border-gray-700/50 group">
      <img
        src={image}
        alt="Edited result"
        className="w-full h-auto max-h-[500px] object-contain"
      />

      {/* Download button overlay */}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <button
          onClick={handleDownload}
          className="px-6 py-3 bg-white text-gray-900 rounded-xl font-medium flex items-center gap-2 hover:bg-gray-100 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download
        </button>
      </div>
    </div>
  )
}

export default ImagePreview
