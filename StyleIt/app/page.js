import { Navbar } from "./components/navbar";
import Footer from "./components/Footer";
import Slider from "./components/slider";
import { getClothing } from "./utils/api";

export default async function Home() {
  const data = await getClothing();

  return (
    <div className="p-8">
      <Slider heading="Hats" items={data.Hat} />
      <Slider heading="Tops" items={data.Tops} />
      <Slider heading="Pants" items={data.Pants} />
    </div>
  );
}
