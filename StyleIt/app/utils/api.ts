// Helper function to get the base URL
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Browser should use relative path
    return '';
  }
  if (process.env.VERCEL_URL) {
    // Vercel deployment
    return `https://${process.env.VERCEL_URL}`;
  }
  // Default to localhost for development
  return 'http://localhost:3000';
};

// To add a new clothing item
export async function addClothing(clothingData) {
    try {
      const response = await fetch(`${getBaseUrl()}/api/clothing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clothingData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error adding clothing:', error);
      throw error;
    }
}
  
// To fetch clothing items
export async function getClothing() {
    try {
        const response = await fetch(`${getBaseUrl()}/api/clothing`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }); 

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Response was not JSON');
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching clothing:', error);
        throw error;
    }
}

export async function getOutfits() {
  try {
    const response = await fetch('/api/wardrobe', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }); 
    const data = await response.json();
    return data.data;
  } catch (error) {
      console.error('Error fetching outfits:', error);
      throw error;
  }
}

export async function addOutfit(outfitData) {
  try {
    const response = await fetch('/api/wardrobe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(outfitData)
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding outfit:', error);
    throw error;
  }
}

export const deleteOutfit = async (outfitId: string) => {
  const response = await fetch(`/api/wardrobe?id=${outfitId}`, {
    method: 'DELETE',
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to delete outfit');
  }
  
  return data;
};

// To delete a clothing item
export async function deleteClothing(id: string) {
  try {
    const response = await fetch(`/api/clothing?id=${id}`, {
      method: 'DELETE',
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete clothing item');
    }
    
    return data;
  } catch (error) {
    console.error('Error deleting clothing:', error);
    throw error;
  }
}

