# Photo Edit AI

A modern React application for AI-powered photo editing. Upload an image, describe your desired edit, and let AI transform your photo.

## Features

- **Drag & Drop Upload**: Easy image upload with drag-and-drop support
- **AI-Powered Editing**: Describe edits in natural language (e.g., "make this person raise their hands", "add sunglasses")
- **Side-by-Side Preview**: Compare original and edited images
- **Edit History**: Keep track of all your edits in the current session
- **Download Results**: Save your edited images with one click
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean, dark-themed interface with smooth animations

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Replicate API** - AI image generation/editing

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd photo-edit-app
npm install
```

### 2. Set Up API Key

1. Sign up at [Replicate](https://replicate.com) and get your API token
2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
3. Add your API token to `.env`:
   ```
   VITE_REPLICATE_API_TOKEN=your_token_here
   ```

### 3. Run Development Server

```bash
npm run dev
```

The app will open at `http://localhost:3000`

## Usage

1. **Upload an Image**: Drag and drop an image onto the upload area, or click to browse
2. **Enter Your Edit Request**: Describe what changes you want (e.g., "add a hat to the person", "change background to beach")
3. **Generate**: Click "Generate Edit" and wait for the AI to process
4. **Download**: Hover over the result to download your edited image

### Example Prompts

- "Make this person raise their hands"
- "Add sunglasses to the face"
- "Change the background to a sunset"
- "Make the person smile"
- "Add a thumbs up gesture"
- "Remove the background"

## Project Structure

```
photo-edit-app/
├── src/
│   ├── components/
│   │   ├── ImageUploader.jsx   # Drag-and-drop image upload
│   │   ├── ImagePreview.jsx    # Result display with download
│   │   ├── PromptInput.jsx     # Edit prompt input
│   │   └── LoadingSpinner.jsx  # Loading indicator
│   ├── services/
│   │   └── api.js              # Replicate API integration
│   ├── App.jsx                 # Main application
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
├── public/
├── .env.example                # Environment template
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## Configuration

### Using Different AI Models

The app uses Replicate's API, which provides access to various AI models. You can modify `src/services/api.js` to use different models:

- **SDXL** (default) - General purpose image generation/editing
- **InstructPix2Pix** - Specifically designed for instruction-based editing

### API Rate Limits

Replicate has usage-based pricing. Check your usage at [replicate.com/account](https://replicate.com/account).

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Troubleshooting

### "API key not configured" error
Make sure you've created a `.env` file with your Replicate API token.

### Image upload fails
Check that your image is:
- JPG, PNG, or WebP format
- Under 10MB in size

### Slow processing
AI image processing typically takes 10-30 seconds. The loading indicator will show progress.

## License

MIT
