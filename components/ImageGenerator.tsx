'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Download, Sparkles, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface GeneratedImage {
  id: string;
  prompt: string;
  imageUrl: string;
  timestamp: number;
}

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    
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

      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        prompt,
        imageUrl: data.imageUrl,
        timestamp: Date.now(),
      };

      setGeneratedImages(prev => [newImage, ...prev]);
      setCurrentImage(data.imageUrl);
      setPrompt('');
      toast.success('Image generated successfully!');
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || 'Failed to generate image');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = async (imageUrl: string, prompt: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${prompt.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('Image downloaded!');
    } catch (error) {
      toast.error('Failed to download image');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      generateImage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AI Image Generator
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Transform your imagination into stunning visuals with AI
          </p>
        </div>

        {/* Input Section */}
        <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <Input
                placeholder="Describe the image you want to generate..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 text-lg py-3 px-4 border-2 border-purple-200 focus:border-purple-400 rounded-lg transition-all duration-200"
                disabled={isGenerating}
              />
              <Button
                onClick={generateImage}
                disabled={isGenerating || !prompt.trim()}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Current Image Display */}
        {currentImage && (
          <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <ImageIcon className="w-6 h-6" />
                Generated Image
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative group">
                <img
                  src={currentImage}
                  alt="Generated image"
                  className="w-full h-auto rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button
                    onClick={() => downloadImage(currentImage, generatedImages[0]?.prompt || 'generated-image')}
                    variant="secondary"
                    size="sm"
                    className="bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Generation History */}
        {generatedImages.length > 1 && (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl">Recent Generations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {generatedImages.slice(1).map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.imageUrl}
                      alt={image.prompt}
                      className="w-full h-48 object-cover rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                      onClick={() => setCurrentImage(image.imageUrl)}
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                      <Button
                        onClick={() => downloadImage(image.imageUrl, image.prompt)}
                        variant="secondary"
                        size="sm"
                        className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 rounded-b-lg">
                      <p className="text-white text-sm font-medium truncate">
                        {image.prompt}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isGenerating && (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-4">
                  <Loader2 className="w-10 h-10 text-white animate-spin" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Creating your image...</h3>
                <p className="text-gray-600">This may take a few moments</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!currentImage && !isGenerating && (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full mb-4">
                <ImageIcon className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Ready to create amazing images?</h3>
              <p className="text-gray-600">Enter a prompt above and let AI bring your ideas to life</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}