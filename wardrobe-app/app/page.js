import React from "react";
import { Navbar } from "./components/navbar";
import Slider from "./components/slider";
import { getClothing } from "./utils/api";

export default async function Home() {
  const data = await getClothing();

  const shirts = [
    { title: "Shirt 1", image: "sample.png" },
    { title: "Shirt 2", image: "sample.png" },
    { title: "Shirt 3", image: "sample.png" },
    { title: "Shirt 4", image: "sample.png" },
    { title: "Shirt 5", image: "sample.png" },
    { title: "Shirt 6", image: "sample.png" },
    { title: "Shirt 7", image: "sample.png" },
    { title: "Shirt 8", image: "sample.png" },
  ];

  const pants = [
    { title: "Pants 1", image: "sample.png" },
    { title: "Pants 2", image: "sample.png" },
    { title: "Pants 3", image: "sample.png" },
    { title: "Pants 4", image: "sample.png" },
    { title: "Pants 5", image: "sample.png" },
    { title: "Pants 6", image: "sample.png" },
    { title: "Pants 7", image: "sample.png" },
    { title: "Pants 8", image: "sample.png" },
    { title: "Pants 9", image: "sample.png" },
    { title: "Pants 10", image: "sample.png" },
  ];

  const discover = [
    { title: "Discover 1", image: "sample.png" },
    { title: "Discover 2", image: "sample.png" },
    { title: "Discover 3", image: "sample.png" },
    { title: "Discover 4", image: "sample.png" },
    { title: "Discover 5", image: "sample.png" },
    { title: "Discover 6", image: "sample.png" },
    { title: "Discover 7", image: "sample.png" },
    { title: "Discover 8", image: "sample.png" },
    { title: "Discover 9", image: "sample.png" },
    { title: "Discover 10", image: "sample.png" },
    { title: "Discover 11", image: "sample.png" },
    { title: "Discover 12", image: "sample.png" },
    { title: "Discover 13", image: "sample.png" },
    { title: "Discover 14", image: "sample.png" },
    { title: "Discover 15", image: "sample.png" },
    { title: "Discover 16", image: "sample.png" },
    { title: "Discover 17", image: "sample.png" },
    { title: "Discover 18", image: "sample.png" },
  ];

  return (
    <>
      <Navbar />

      <div className="min-h-screen p-8">
        <Slider heading="Shirts" items={shirts} />
        <Slider heading="Pants" items={pants} />
        <Slider heading="Discover" items={discover} />
      </div>
    </>
  );
}
