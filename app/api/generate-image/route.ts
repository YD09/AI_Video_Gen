import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const client = new OpenAI({
    baseURL: 'https://api.studio.nebius.com/v1/',
    apiKey: process.env.NEBIUS_API_KEY,
});
export const dynamic = 'force-dynamic'; 
export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    if (!process.env.NEBIUS_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }
    const response = await client.images.generate({
    "model": "black-forest-labs/flux-schnell",
    "response_format": "b64_json",
    "response_extension": "png",
    "width": 1024,
    "height": 1024,
    "num_inference_steps": 4,
    "negative_prompt": "",
    "seed": -1,
    "loras": null,
    "prompt": prompt

    })
    console.log('Image generated:', response);

    const base64Image = response.data[0].b64_json;

    if (!base64Image) {
        return NextResponse.json(
            { error: 'Failed to generate image' },
            { status: 500 }
        );
}

return NextResponse.json({ imageUrl: base64Image });

  } catch (error: any) {
    console.error('Error generating image:', error);
    
    if (error.status === 400) {
      return NextResponse.json(
        { error: 'Invalid prompt or request' },
        { status: 400 }
      );
    }
    
    if (error.status === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate image. Please try again.' },
      { status: 500 }
    );
  }
}