// background-server/server.js
const express = require('express');
const { removeBackground } = require('@imgly/background-removal-node');
const imgur = require('imgur');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/remove-background', async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const response = await fetch(url);
    const imageBlob = await response.blob();
    const processedBlob = await removeBackground(imageBlob);
    
    const arrayBuffer = await processedBlob.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    imgur.setClientId(process.env.IMGUR_ID);
    const imgurResponse = await imgur.uploadBase64(base64);

    res.json({ success: true, url: imgurResponse.link });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to process image' });
  }
});

app.listen(3001, () => {
  console.log('Background removal server running on port 3001');
});