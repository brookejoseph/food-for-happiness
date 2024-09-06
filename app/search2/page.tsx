"use client";

import React, { useState } from "react";
import { ArrowBigLeft, Image } from "lucide-react";
import LoadingAnimation from "../components/fonts/loadingani";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";

const SearchComponent = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const searchValue = useAction(api.ideas.handleQuery);
  const pineconeSearch = useAction(api.ideas.grabIdFromPinecone);
  const generateEmbeddings = useAction(api.ideas.generateEmbeddingsText);
  const generateImageEmbed = useAction(api.ideas.generateEmbeddings);
  const generateQueryTags = useAction(api.ideas.produceRelevantTags);
  const multimodalRelevantUsers = useAction(api.ideas.returnRelevantUsers);

  const [loading, setLoading] = useState(false);
  const [names, setNames] = useState<any[]>([]);
  const [relevantName, setRelevantName] = useState<string | null>(null);

  const placeholders = [
    "Find me someone who likes talking about philosophy",
    "Find me someone who likes to code",
    "Find me someone who likes to cook",
    "Find me someone who likes to play chess",
    "Find me someone who can help me with calculus",
  ];

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        resolve(base64String);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const base64Image = await convertFileToBase64(e.target.files[0]);
      setUploadedImage(base64Image);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const newTextQuery = await generateQueryTags({ query: searchQuery });
    console.log("newTextQuery", newTextQuery);
    const query = await generateEmbeddings({ prompt: newTextQuery ?? "" }); //this converts the textual embeddings to a vector 
    let image;
    if(uploadedImage === null){
        image = null;
    }
    else{
        image = await generateImageEmbed({ prompt: uploadedImage ?? "" }); //this converts the image to a vector
    }
    const name = await multimodalRelevantUsers({ textQuery: query.embedding, imageQuery: image });
    setRelevantName(name);
    console.log("name withing the onsubmit in the search2", name);



    const fetchedNames = await searchValue({ query: query.embedding });
    const names = await pineconeSearch({ queryEmbed: query.embedding });
    setNames(fetchedNames);
    setLoading(false);
  };

  const columns = ["Name", "School", "Compatible"];

  const typewriterText = `
  Find someone who matches your weird interests at the University of Waterloo.
`;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <LoadingAnimation />
        <p className="text-xl dm-serif-text-regular text-black mt-4">Processing your question, this takes a min...</p>
      </div>
    );
  }

  

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <a href="/" className="absolute top-0 left-0 text-2xl p-4">
        <ArrowBigLeft color="#0f0f0f" />
      </a>
      {names.length !== 0 ? (
        <div className="bg-[#f9fafb] text-white chivo-Roman mt-[-250px] relative">
        <div className="typewriter-text text-black dm-serif-text-regular">
         {relevantName} {typewriterText}
        </div>
      </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full mx-4">
          {!uploadedImage && (
            <h1 className="text-4xl md:text-6xl font-bold mb-8 text-black chivo-Roman text-center">
              Find
              <span className="dm-serif-text-regular-italic text-5xl md:text-5xl"> someone </span>
              who matches your
              <span className="font-mono text-5xl md:text-6xl"> weird interests</span>
            </h1>
          )}

          {uploadedImage && (
            <div className="mb-8 mt-8">
              <img
                src={uploadedImage}
                alt="Uploaded"
                className="w-full h-64 object-cover rounded-lg shadow-lg"
              />
            </div>
          )}

        <form onSubmit={onSubmit} className="w-full fixed bottom-0 left-0 bg-[#f9fafb] p-4 flex items-center justify-center">
        <button
            type="button"
            onClick={() => document.getElementById('image-upload')?.click()}
            className=" bg-gray-50 p-3  hover:bg-black"
        >
            <Image color="#000" size={24} />
        </button>
        <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
        />
        <input
            type="text"
            value={searchQuery}
            onChange={handleChange}
            placeholder={placeholders[Math.floor(Math.random() * placeholders.length)]}
            className="font-mono border-black text-black border-2 border-gray-300 p-4 w-full flex-grow"
        />
        <button
            type="submit"
            className="ml-2 font-mono bg-black text-white px-4 py-4 h-full"
        >
            Search
        </button>
        </form>
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
