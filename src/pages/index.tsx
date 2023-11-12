import { Button } from "@mui/material";
import Link from "next/link";
import React from "react";

const Home = () => {
  return (
    <div className="bg-black h-screen flex items-center justify-center">
      <div className=" border-r px-24 mx-24 border-white h-1/2 flex items-center w-1/2 justify-end">
        <h1 className="text-8xl font-bold">
          Comic <br /> AI
        </h1>
      </div>
      <div>
        <p className="text-xl w-1/2 mb-12">
          Unleash your creativity with our Comic Generator AI! Craft hilarious
          tales effortlessly. Bring characters to life in a click!
        </p>
        <Link href="/canvas">
          <Button variant="contained" color="info">
            Launch Canvas!
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
