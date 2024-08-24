"use client"

import React from "react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { type ClassValue, clsx } from 'clsx';
import { ArrowBigLeft, Search, X } from 'lucide-react';
import { PlaceholdersAndVanishInput } from "../components/aceternity/placeholder";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation, useAction } from "convex/react";


const SearchComponent = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const searchValue = useAction(api.ideas.handleQuery)
    const generateEmbeddings = useAction(api.ideas.generateEmbeddingsText);
    const [loading, setLoading] = useState(false);
    const [names, setNames] = useState<any[]>([]);


    const placeholders = [
      "Find me someone who likes doge challengers",
      "Find me someone who likes to code",
      "Find me someone who likes to cook",
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log(e.target.value);
      setSearchQuery(e.target.value);
    };
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      setLoading(true);
      e.preventDefault();
      const query = await generateEmbeddings({prompt: searchQuery});
      console.log("submitted");
      console.log("query", query);
      const fetchedNames = await searchValue({query: query});
      console.log("fetchedNames", fetchedNames);
      setNames(fetchedNames); 
      setIsSubmitted(true);
      setLoading(false);
    };
    
    console.log(loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <a href="/" className="absolute top-0 left-0 text-2xl p-4">
          <ArrowBigLeft color="#0f0f0f" />
        </a>
        {!loading && isSubmitted ? (
          <div>
            {names.map((name, index) => (
              <div key={index}>{name}</div> // Display each name
            ))}
          </div>
        ) : (
            <div className="flex items-center justify-center">
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
