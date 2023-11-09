import { Inter } from "next/font/google";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [images, setImages] = useState([]);
  const [p1, setP1] = useState<string>("");
  const [prompts, setPrompt] = useState<string[]>([]);

  const getImage = (text: String) => {
    fetch(
      "https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud",
      {
        headers: {
          Accept: "image/png",
          Authorization:
            "Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: "Astronaut riding a horse" }),
      }
    )
      .then((res) => res.blob())
      .then((blob) => {
        // setImages(data);
        console.log(blob);
      });
  };
  return (
    <main
      className={`flex min-h-screen flex-col items-center gap-12 p-12 ${inter.className}`}
    >
      <div className="bg-black py-2 px-10 border rounded-lg border-gray-600">
        <h2 className="text-2xl font-bold">Dashtoon Comix</h2>
      </div>
      <div
        id="input-form"
        className="border rounded-lg border-gray-600 w-full p-12 bg-slate-800 bg-opacity-50"
      >
        <h3>Text Prompts</h3>
        {prompts && prompts.map((p, index: number) => <div key={index}></div>)}
        {prompts.length < 10 && (
          <input
            placeholder="Enter new prompt..."
            value={p1}
            onChange={(e) => setP1(e.target.value)}
          ></input>
        )}
      </div>
    </main>
  );
}
