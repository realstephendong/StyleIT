// app/api/remove-background/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const imgurUrl = searchParams.get('url');
    
    if (!imgurUrl) {
      return NextResponse.json({ 
        success: false, 
        error: 'No URL provided' 
      }, { status: 400 });
    }

    // Call the separate background removal server
    const response = await fetch(`http://localhost:3001/remove-background?url=${encodeURIComponent(imgurUrl)}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to process image' 
    }, { status: 500 });
  }
}