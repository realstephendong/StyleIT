import { Navbar } from "./components/navbar";
import Footer from "./components/Footer";
import Slider from "./components/slider";
import { getClothing } from "./utils/api";

export default async function Home() {
  try {
    console.log('Fetching clothing data...');
    const data = await getClothing();
    console.log('Fetched data:', data);

    if (!data) {
      throw new Error('No data received from API');
    }

    return (
      <div className="p-8">
        <Slider heading="Hats" items={data.Hat || []} />
        <Slider heading="Tops" items={data.Tops || []} />
        <Slider heading="Pants" items={data.Pants || []} />
      </div>
    );
  } catch (error) {
    console.error('Error in Home component:', error);
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600">Error loading clothing items</h1>
        <p className="text-gray-600">{error.message}</p>
      </div>
    );
  }
}
