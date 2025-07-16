'use client';

import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setLoading(true);
    setError('');
    setImageUrl('');

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      // Convert base64 to data URL for rendering
      const base64Image = `data:image/png;base64,${data.imageUrl}`;
      setImageUrl(base64Image);
      
    } catch (err: any) {
      setError(err.message || 'Failed to generate image');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      generateImage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            AI Image Generator
          </h1>
          <p className="text-gray-600">Transform your ideas into stunning visuals</p>
        </div>

        {/* Input Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe the image you want to generate..."
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none text-lg"
              disabled={loading}
            />
            <button
              onClick={generateImage}
              disabled={loading || !prompt.trim()}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {loading ? 'Generating...' : 'Generate'}
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 text-center">
            <div className="inline-block w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Creating your image...</h3>
            <p className="text-gray-600">This may take a few moments</p>
            <p className="text-sm text-gray-500 mt-2">Prompt: "{prompt}"</p>
          </div>
        )}

        {/* Image Display */}
        {imageUrl && !loading && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="9" cy="9" r="2"/>
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
              </svg>
              Generated Image
            </h2>
            
            <div className="relative group">
              <img
                src={imageUrl}
                alt="Generated image"
                className="w-full h-auto rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-[1.02]"
              />
              
              {/* Download Button */}
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = imageUrl;
                  link.download = `generated-image-${Date.now()}.png`;
                  link.click();
                }}
                className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7,10 12,15 17,10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </button>
            </div>

            {/* Prompt Info */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-1">Original Prompt:</p>
              <p className="text-sm text-gray-600">"{prompt}"</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!imageUrl && !loading && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-xl border border-white/20 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="9" cy="9" r="2"/>
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Ready to create amazing images?</h3>
            <p className="text-gray-600 mb-6">Enter a prompt above and let AI bring your ideas to life</p>
            
            <div className="text-left max-w-md mx-auto">
              <p className="text-sm font-medium text-gray-700 mb-2">Try these example prompts:</p>
              <div className="space-y-1 text-sm text-gray-600">
                <p>• "A futuristic city skyline at sunset"</p>
                <p>• "A cute robot reading a book in a library"</p>
                <p>• "Abstract art with vibrant colors"</p>
                <p>• "A peaceful mountain lake with reflection"</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}