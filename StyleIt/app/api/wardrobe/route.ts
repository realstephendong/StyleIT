import { NextResponse } from 'next/server';
import connectDB from '../../../utils/mongodb';
import { ObjectId } from 'mongodb';

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
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to save clothing item' 
    }, { status: 500 });
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

// DELETE handler for removing clothing
export async function DELETE(request: Request) {
  try {
    console.log("WORKING");
    const client = await connectDB();
    const db = client.db("deltahacks");
    
    // Get the ID from the URL
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'No ID provided' 
      }, { status: 400 });
    }

    // Delete from database
    const result = await db.collection('wardrobe')
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Item not found' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Item deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting clothing:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete clothing item' 
    }, { status: 500 });
  }
}