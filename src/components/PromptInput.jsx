const EXAMPLE_PROMPTS = [
  "Make this person raise their hands",
  "Add a thumbs up gesture",
  "Change the background to a beach",
  "Add sunglasses to the person",
  "Make it look like sunset lighting",
  "Add a hat to the person",
  "Remove the background",
  "Make the person smile",
]

function PromptInput({ value, onChange, onSubmit, disabled }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !disabled) {
      e.preventDefault()
      onSubmit()
    }
  }

  const handleExampleClick = (example) => {
    onChange(example)
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
          Describe your edit
        </label>
        <div className="relative">
          <textarea
            id="prompt"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="e.g., Make this person raise their hands, add a thumbs up, change background to sunset..."
            rows={3}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <div className="absolute right-3 bottom-3 text-xs text-gray-500">
            Press Enter to submit
          </div>
        </div>
      </div>

      {/* Example prompts */}
      <div>
        <p className="text-xs text-gray-500 mb-2">Try an example:</p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_PROMPTS.slice(0, 4).map((example) => (
            <button
              key={example}
              onClick={() => handleExampleClick(example)}
              disabled={disabled}
              className="px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 disabled:hover:bg-gray-800 text-gray-400 hover:text-white disabled:hover:text-gray-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-700"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PromptInput
