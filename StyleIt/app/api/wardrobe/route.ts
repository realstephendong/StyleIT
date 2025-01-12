import { NextResponse } from 'next/server';
import connectDB from '../../../utils/mongodb';

// POST handler for adding new clothing
export async function POST(request: Request) {
  try {
    const client = await connectDB();
    const db = client.db("deltahacks");
    
    // Get the data from request body
    const data = await request.json();
    
    // Insert into database
    const result = await db.collection('wardrobe')
    .insertOne({ name: data.name, clothes: data.clothes });

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error saving clothing:', error);
  }
}

// GET handler for fetching clothing
export async function GET(request: Request) {
  try {
    const client = await connectDB();
    const db = client.db("deltahacks");
    const wardrobe = await db.collection('wardrobe').find({}).toArray();


    return NextResponse.json({ success: true, data: wardrobe});

  } catch (error) {
    console.error('Error fetching clothing:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch clothing items' 
    }, { status: 500 });
  }
}

