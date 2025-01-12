// Create a post route that takes an imgururl as a parameter and returns the image url

import { NextResponse } from 'next/server';
import connectDB from "../../../utils/mongodb"

// POST handler for adding new clothing
export async function POST(request: Request) {
  try {
    const client = await connectDB();
    const db = client.db("deltahacks");
    
    // Get the data from request body
    const data = await request.json();
    
    // Insert into database
    const result = await db.collection('clothes').insertOne({
      type: data.type,
      imagePath: data.imagePath,
      price: data.price,
      url: data.url,
      brand: data.brand,
    });

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error saving clothing:', error);
  }
}
