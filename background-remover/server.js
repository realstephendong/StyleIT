const express = require('express');
const { removeBackground } = require('@imgly/background-removal-node');
const { ImgurClient } = require('imgur');
const sharp = require('sharp');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new ImgurClient({ clientId: process.env.IMGUR_ID });

async function trimTransparentEdges(imageBuffer) {
  try {
    // Trim transparent edges and get the trimmed buffer
    const trimmedBuffer = await sharp(imageBuffer)
      .trim() // This removes transparent pixels from edges
      .toBuffer();
    
    console.log('Image trimmed successfully');
    return trimmedBuffer;
  } catch (error) {
    console.error('Error trimming image:', error);
    throw error;
  }
}

app.get('/remove-background', async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    console.log('Processing image:', url);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    console.log('Image fetched successfully');
    const imageBlob = await response.blob();
    console.log('Starting background removal...');
    
    const processedBlob = await removeBackground(imageBlob);
    console.log('Background removed successfully');

    // Convert processed blob to buffer for Sharp
    const arrayBuffer = await processedBlob.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);

    // Trim transparent edges
    console.log('Trimming transparent edges...');
    const trimmedBuffer = await trimTransparentEdges(imageBuffer);

    // Convert to base64 for Imgur upload
    const base64 = trimmedBuffer.toString('base64');

    console.log('Uploading to Imgur...');
    const imgurResponse = await client.upload({
      image: base64,
      type: 'base64'
    });
    
    console.log('Upload successful');
    const imageUrl = imgurResponse.data.link;

    res.json({ success: true, url: imageUrl });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to process image' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Background removal server running on port ${PORT}`);
});