import React from "react";
import { Navbar } from "./components/navbar";
import Footer from "./components/Footer/Footer";
import Slider from "./components/slider";
import { getClothing } from "./utils/api";

export default async function Home() {
  const data = await getClothing();

  return (
    <>
      <Navbar />

      <div className="min-h-screen p-8">
        <Slider heading="Shirts" items={data.Shirt} />
        <Slider heading="Pants" items={data.Pants} />
        <Slider heading="Hats" items={data.Hat} />
      </div>

      <Footer />
    </>
  );
}
