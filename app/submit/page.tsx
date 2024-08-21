
"use client"
import React from 'react'
import {useState, useEffect, } from 'react'
import {pipeline} from '@xenova/transformers';
import {CLIPModel} from '@xenova/transformers';
import {Processor} from '@xenova/transformers'
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation, useAction } from "convex/react";


export default function Component() {
    const [image, setImage] = useState();
    const generateUploadUrl = useMutation(api.ideas.generateUploadUrl)
    const storeImage = useAction(api.ideas.storeImageToFiles)
    const genEmbed = useAction(api.ideas.generateEmbeddings)
    
  
    const handleImageUpload = async (event: any) => {
      setImage(event.target.files[0]);
      const url = URL.createObjectURL(event.target.files[0]);
      console.log('Image URL:', url);
      const file = event.target.files[0];
      console.log('Image file:', file);
      console.log("file type", file?.type)


      const uploadUrl = await generateUploadUrl();
      console.log('Generated Upload URL:', uploadUrl);

      // Upload the image to the generated URL
      await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file?.type,
        },
        body: file,
      });
      const publicImageUrl = await storeImage({ imageURL: uploadUrl });
      console.log('Public Image URL:', publicImageUrl);

      //const generated = await generateUploadUrl()
      const embed = await genEmbed({prompt: "ur mom"})
      console.log("embed val", embed)
      //const results = await storeImage({imageURL: generated})
      //console.log("results", results)
    };


    const handleSubmit = async () => {
      if (image) {
        console.log('Image submitted:', image);
        const generated = await generateUploadUrl()
        console.log(generated)
      } else {
        console.log('No image selected');
      }
    };
  
    return (
      <div>
        <input type="file" onChange={handleImageUpload} />
        <button onClick={handleSubmit}>Submit</button>
        <p>Dashboard Page</p>
      </div>
    );
  };
  
