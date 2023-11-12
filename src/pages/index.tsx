import { Button } from "@mui/material";
import Link from "next/link";
import React from "react";

const Home = () => {
  return (
    <div className="bg-black h-screen flex items-center justify-center flex-col md:flex-row">
      <div className="p-12 md:p-0 md:border-r md:px-24 md:mx-24 border-white md:h-1/2 flex items-center md:w-1/2 justify-end">
        <h1 className="text-8xl font-bold" style={{ color: "white" }}>
          Comic <br /> AI
        </h1>
      </div>
      <div className="p-12 md:p-0">
        <p className="text-xl md:w-1/2 mb-12" style={{ color: "white" }}>
          Unleash your creativity with our Comic Generator AI! Craft hilarious
          tales effortlessly. Bring characters to life in a click!
        </p>
        <Link href="/canvas">
          <Button variant="outlined" color="info">
            Launch Canvas!
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
