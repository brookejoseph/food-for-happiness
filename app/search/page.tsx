"use client"

import React from "react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { type ClassValue, clsx } from 'clsx';
import { ArrowBigLeft, Search, X } from 'lucide-react';
import { PlaceholdersAndVanishInput } from "../components/aceternity/placeholder";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation, useAction } from "convex/react";
import TableComponent from "../components/shadcn/table";
import LoadingAnimation from "../components/fonts/loadingani";




const TypewriterEffect = ({ names }: any) => {
  const [currentNameIndex, setCurrentNameIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedNames, setTypedNames] = useState<any[]>([]);

  useEffect(() => {
    if (names.length === 0 || currentNameIndex >= names.length) return;

    const currentName = names[currentNameIndex].name;
    const timeoutId = setTimeout(() => {
      setDisplayedText(currentName.slice(0, currentIndex + 1));
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }, 100);

    if (currentIndex === currentName.length) {
      setTimeout(() => {
        setTypedNames((prevNames) => [...prevNames, currentName]);
        setCurrentIndex(0);
        setDisplayedText("");
        setCurrentNameIndex((prevIndex) => prevIndex + 1);
      }, 1500);
    }

    return () => clearTimeout(timeoutId);
  }, [currentIndex, currentNameIndex, names]);

  return (
    <div className="typewriter-effect-container bg-[#f9fafb] text-black mt-4">
      {typedNames.map((name: any, index) => (
        <div key={index} className="typed-name mb-4 mt-12 mr-12 ml-12">
        {name} is a Computer Science Student at the University of Waterloo. Based on your question, they are very compatabile!
        </div>
      ))}
      <div className="current-typed-name">{displayedText}</div>
    </div>
  );
};


const SearchComponent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const searchValue = useAction(api.ideas.handleQuery)
  const generateEmbeddings = useAction(api.ideas.generateEmbeddingsText);
  const [loading, setLoading] = useState(false);
  const [names, setNames] = useState<any[]>([]);

  const placeholders = [
    "Find me someone who likes talking about philosophy",
    "Find me someone who likes to code",
    "Find me someone who likes to cook",
    "Find me someone who likes to play chess",
    "Find me someone who can help me with calculus",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setSearchQuery(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log("submitted");
    e.preventDefault();
    setLoading(true);
    const query = await generateEmbeddings({ prompt: searchQuery });
    console.log("submitted");
    console.log("query", query);
    const fetchedNames = await searchValue({ query: query.embedding });
    console.log("fetchedNames", fetchedNames);
    setNames(fetchedNames);
    setLoading(false);
    console.log("loading", loading);
    console.log("conditional", !loading && names !== null );
  };
  console.log("conditional", names.length != 0 );
  const columns = ["Name", "School", "Program", "Compatible"];


  //            <div className="text-black chivo-Roman" key={index}>{name}</div>

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <LoadingAnimation />
        <p className="text-xl dm-serif-text-regular text-black mt-4">Processing your question, this takes a min...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <a href="/" className="absolute top-0 left-0 text-2xl p-4">
        <ArrowBigLeft color="#0f0f0f" />
      </a>
      {names.length !== 0 ? (
        <div className="bg-[#f9fafb] text-white chivo-Roman mt-[-250px] relative">
          <table className="custom-table mr-24">
            <thead>
              <tr>
                {columns.map((column, index) => (
                  <th className="text-black dm-serif-text-regular" key={index}>
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {names.map((name, index) => (
                <tr key={index}>
                  <td className="text-black chivo-Roman">{name.name}</td>
                  <td className="text-black chivo-Roman">University of Waterloo</td>
                  <td className="text-black chivo-Roman">Computer Science</td>
                  <td className="text-black chivo-Roman">{Math.floor(name.score * 100)} %</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full mx-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-8 text-black chivo-Roman text-center">
            Find
            <span className="dm-serif-text-regular-italic text-5xl md:text-5xl"> someone </span>
            who matches your
            <span className="font-mono text-5xl md:text-6xl"> weird interests</span>
          </h1>
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={handleChange}
            onSubmit={onSubmit}
          />
        </div>
      )}
    </div>
  );
};

  
  export default SearchComponent;

  //              placeholders={placeholders}
