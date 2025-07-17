'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSplash, setShowSplash] = useState(true);

  const splashLetters = "DREAMPIXEL".split("");

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), splashLetters.length * 400 + 1000);
    return () => clearTimeout(timer);
  }, []);

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate image');

      setImageUrl(`data:image/png;base64,${data.imageUrl}`);
    } catch (err) {
      setError(err.message || 'Failed to generate image');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading) generateImage();
  };

  if (showSplash) {
    return (
      <main className="h-screen w-screen bg-black text-white flex items-center justify-center">
        <AnimatePresence>
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1 } }}
            className="text-6xl font-extrabold flex gap-2"
          >
            {splashLetters.map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.4, duration: 0.5 }}
              >
                {char}
              </motion.span>
            ))}
          </motion.div>
        </AnimatePresence>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 pt-8">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-2 tracking-tight drop-shadow-xl">
            DreamPixel
          </h1>
          <p className="text-gray-400 text-lg">Where ideas come alive</p>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/10 mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Describe your idea..."
              className="flex-1 px-4 py-3 border border-white/20 rounded-xl bg-white/10 text-white placeholder:text-gray-500 text-lg focus:outline-none focus:ring-2 focus:ring-white/30"
              disabled={loading}
            />
            <button
              onClick={generateImage}
              disabled={loading || !prompt.trim()}
              className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all duration-300 shadow-md hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Crafting...' : 'Craft'}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700">
              {error}
            </div>
          )}
        </div>

        {loading && (
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/10 text-center">
            <div className="inline-block w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
            <h3 className="text-xl font-semibold mb-2">Converting your ideas...</h3>
            <p className="text-gray-400">Hold tight while we create your dream</p>
            <p className="text-sm text-gray-500 mt-2">Prompt: "{prompt}"</p>
          </div>
        )}

        {imageUrl && !loading && (
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/10">
            <h2 className="text-xl font-semibold mb-4">Generated Image</h2>
            <div className="relative group">
              <img
                src={imageUrl}
                alt="Generated image"
                className="w-full h-auto rounded-xl shadow-xl transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = imageUrl;
                  link.download = `dreampixel-${Date.now()}.png`;
                  link.click();
                }}
                className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                Download
              </button>
            </div>

            <div className="mt-4 p-3 bg-white/10 rounded-xl">
              <p className="text-sm font-medium mb-1">Prompt used:</p>
              <p className="text-sm text-gray-400">"{prompt}"</p>
            </div>
          </div>
        )}

        {!imageUrl && !loading && (
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-12 shadow-xl border border-white/10 text-center">
            <div className="w-16 h-16 border border-white rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">🎨</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Bring Ideas to Real Visuals</h3>
            <p className="text-gray-400 mb-6">Enter a prompt above and let DreamPixel bring it to life</p>
            <div className="text-left max-w-md mx-auto">
              <p className="text-sm font-medium mb-2">Example prompts:</p>
              <div className="space-y-1 text-sm text-gray-500">
                <p>• "A surreal waterfall in a neon forest"</p>
                <p>• "Cyberpunk dragon flying through Tokyo skyline"</p>
                <p>• "3D abstract glass sculpture with galaxy reflection"</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
