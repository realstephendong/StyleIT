import { NextResponse } from 'next/server';
import connectDB from '../../../utils/mongodb';
import { ObjectId } from 'mongodb';

// POST handler for adding new clothing
export async function POST(request: Request) {
  try {
    console.log('Attempting to connect to MongoDB...');
    const client = await connectDB();
    console.log('Connected to MongoDB successfully');
    
    const db = client.db("deltahacks");
    
    // Get the data from request body
    const data = await request.json();
    console.log('Received data:', data);
    
    // Insert into database
    const result = await db.collection('clothes').insertOne({
      type: data.type,
      price: data.price,
      url: data.url,
      brand: data.brand,
    });

    console.log('Insert result:', result);

    return NextResponse.json({ 
      success: true, 
      data: result 
    });

  } catch (error) {
    console.error('Detailed error in POST handler:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to save clothing item' 
    }, { status: 500 });
  }
}

// GET handler for fetching clothing
export async function GET(request: Request) {
  try {
    console.log('Attempting to connect to MongoDB...');
    const client = await connectDB();
    console.log('Connected to MongoDB successfully');
    
    const db = client.db("deltahacks");
    console.log('Connected to database: deltahacks');

    // List all collections to verify 'clothes' exists
    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));

    if (!collections.some(c => c.name === 'clothes')) {
      console.log('Creating clothes collection...');
      await db.createCollection('clothes');
      console.log('Created clothes collection');
    }

    console.log('Fetching clothes data...');
    const clothesData = await db.collection('clothes').find({}).toArray();
    console.log('Fetched clothes data:', clothesData);

    const clothes = clothesData.reduce((acc, item) => {
      acc[item.type] = acc[item.type] || [];
      acc[item.type].push(item);
      return acc;
    }, { Tops: [], Pants: [], Hat: [] });

    console.log('Processed clothes data:', clothes);

    return NextResponse.json({ 
      success: true, 
      data: clothes 
    });

  } catch (error) {
    console.error('Detailed error in GET handler:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to fetch clothing items' 
    }, { status: 500 });
  }
}

// DELETE handler for removing clothing
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Item ID is required' 
      }, { status: 400 });
    }

    console.log('Attempting to connect to MongoDB...');
    const client = await connectDB();
    console.log('Connected to MongoDB successfully');
    
    const db = client.db("deltahacks");
    
    const result = await db.collection('clothes').deleteOne({ _id: new ObjectId(id) });

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
    console.error('Detailed error in DELETE handler:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to delete item' 
    }, { status: 500 });
  }
}


