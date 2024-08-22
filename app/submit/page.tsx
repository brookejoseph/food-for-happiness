"use client";
import React, { useState, useRef } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/shadcn/card";
import { Trash2 } from 'lucide-react';
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation, useAction } from "convex/react";
import ImageUploader from "../components/imageupload";
import { log } from "console";



export default function Component() {
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const generateEmbeddings = useAction(api.ideas.generateEmbeddings);
  const storingEmbedName = useMutation(api.ideas.storeinfo);
  
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [resizedSrc, setResizedSrc] = useState<string | null>(null);
  const [originalImgHeight, setOriginalImgHeight] = useState(0);
  const [originalImgWidth, setOriginalImgWidth] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [userInput, setUserInput] = useState("");

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

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      try {
        const base64Url = await convertFileToBase64(file);
        setImages((prevImages) => [...prevImages, base64Url]);
      } catch (error) {
        console.error('Error converting file to base64:', error);
      }
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmitImage = async () => {
      setIsLoading(true);
      for (let i = 0; i < images.length; i++) {
        const currentImage = images[i];
        const callBackend = async () => {
          try {
            console.log(`Processing image ${i + 1} of ${images.length}`);
            console.log("currentImage", currentImage);
            console.log("userInput", userInput);
            const result = await generateEmbeddings({ prompt: currentImage });
            console.log("result", result);
            const id = await storingEmbedName({ name: userInput, embedding: result });
            console.log(`Image ${i + 1} processed and stored with ID:`, id);
          } catch (error) {
            console.error(`Error processing image ${i + 1}:`, error);
          }
        };
        await callBackend();
      }
      setIsLoading(false);
      console.log("All images processed.");
  };
  

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Upload Images</CardTitle>
            <CardDescription>
              Click the button to upload up to 5 images, then submit when ready.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {images.length < 5 && (
              <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            )}
            <div className="grid grid-cols-2 gap-2 mt-4">
              {images.map((image, index) => (
                <img key={index} src={image} alt={`Uploaded ${index + 1}`} className="w-full h-auto" />
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <button onClick={handleUploadClick} disabled={images.length >= 5}>
              Upload Images
            </button>
            <button onClick={handleSubmitImage}>
              Submit
            </button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}




