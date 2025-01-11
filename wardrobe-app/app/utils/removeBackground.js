import { removeBackground } from "@imgly/background-removal-node";
import imgur from "imgur";

async function processAndUploadImage(imgurUrl, imgurClientId) {
  try {
    // Step 1: Fetch the image from the Imgur URL
    const response = await fetch(imgurUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    // Convert response to Blob
    const imageBlob = await response.blob();
    console.log("Fetched image blob");

    // Step 2: Remove background using removeBackground
    const processedBlob = await removeBackground(imageBlob);
    console.log("Removed background");
    console.log("Processed Blob:", processedBlob);

    // Convert the processed Blob to Buffer and then Base64
    const arrayBuffer = await processedBlob.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    // Step 3: Upload to Imgur using the imgur package
    imgur.setClientId(imgurClientId); // Set your Imgur client ID
    const imgurResponse = await imgur.uploadBase64(base64);

    // Log the uploaded image URL
    console.log("Uploaded to Imgur:", imgurResponse.link);

    // Return the URL for further use
    return imgurResponse.link;
  } catch (error) {
    console.error("Error processing or uploading image:", error);
  }
}

// Example usage
const imgurUrl = "https://i.imgur.com/zTpfZV5.jpeg"; // Source image URL
const imgurClientId = process.env.IMGUR_ID; // Replace with your Imgur API Client ID

processAndUploadImage(imgurUrl, imgurClientId).then((uploadedUrl) => {
  console.log("Uploaded image URL:", uploadedUrl);
});
