// To add a new clothing item
export async function addClothing(clothingData) {
    try {
      const response = await fetch('/api/clothing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clothingData)
      });
      
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
        const response = await fetch('http://localhost:3000/api/clothing', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }); 
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching clothing:', error);
        throw error;
    }
}