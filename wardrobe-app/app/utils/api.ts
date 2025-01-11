// To add a new clothing item
async function addClothing(clothingData) {
    try {
      const response = await fetch('/api/clothing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clothingData)
      });
      
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      
      return data;
    } catch (error) {
      console.error('Error adding clothing:', error);
      throw error;
    }
}
  
  // To fetch clothing items
async function getClothing(type?: string) {
    try {
        const url = type 
        ? `/api/clothing?type=${encodeURIComponent(type)}`
        : '/api/clothing';
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (!data.success) throw new Error(data.error);
        
        return data.data;
    } catch (error) {
        console.error('Error fetching clothing:', error);
        throw error;
    }
}