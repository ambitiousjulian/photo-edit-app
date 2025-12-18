import { useState, useRef } from 'react'

function ImageUploader({ onImageUpload, compact = false }) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const handleFile = (file) => {
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
    if (!validTypes.includes(file.type)) {
      alert('Please upload a JPG, PNG, or WebP image')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Image must be smaller than 10MB')
      return
    }

    // Convert to base64
    const reader = new FileReader()
    reader.onload = (e) => {
      const base64 = e.target.result.split(',')[1]
      onImageUpload(file, base64)
    }
    reader.readAsDataURL(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleInputChange = (e) => {
    const file = e.target.files[0]
    handleFile(file)
  }

  if (compact) {
    return (
      <button
        onClick={handleClick}
        className="w-full py-3 px-4 border border-dashed border-gray-600 hover:border-purple-500 rounded-xl text-gray-400 hover:text-purple-400 transition-colors text-sm flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        Upload Different Image
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/jpg,image/webp"
          onChange={handleInputChange}
          className="hidden"
        />
      </button>
    )
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      className={`
        relative cursor-pointer rounded-2xl border-2 border-dashed
        transition-all duration-300 p-12
        ${isDragging
          ? 'border-purple-500 bg-purple-500/10'
          : 'border-gray-600 hover:border-gray-500 bg-gray-800/30 hover:bg-gray-800/50'
        }
      `}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/jpg,image/webp"
        onChange={handleInputChange}
        className="hidden"
      />

      <div className="text-center">
        <div className={`
          mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors
          ${isDragging ? 'bg-purple-500/20' : 'bg-gray-700/50'}
        `}>
          <svg
            className={`w-8 h-8 ${isDragging ? 'text-purple-400' : 'text-gray-400'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>

        <p className="text-lg font-medium text-white mb-2">
          {isDragging ? 'Drop your image here' : 'Drag and drop your image'}
        </p>
        <p className="text-gray-400 text-sm mb-4">
          or click to browse
        </p>
        <p className="text-gray-500 text-xs">
          Supports JPG, PNG, WebP (max 10MB)
        </p>
      </div>

      {/* Animated border effect when dragging */}
      {isDragging && (
        <div className="absolute inset-0 rounded-2xl pointer-events-none">
          <div className="absolute inset-0 rounded-2xl animate-pulse bg-gradient-to-r from-purple-500/20 to-pink-500/20" />
        </div>
      )}
    </div>
  )
}

export default ImageUploader
