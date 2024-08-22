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
      console.log("File within convert:", file);
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0]; // Handling the first file only for this example
      console.log("File:", file);
      try {
        const base64Url = await convertFileToBase64(file);
        console.log("base64Url", base64Url);
        setImages((prevImages) => [...prevImages, base64Url]);
        console.log("Images:", images);
      } catch (error) {
        console.error('Error converting file to base64:', error);
      }
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      console.log("fileInputRef", fileInputRef.current);
      fileInputRef.current.click();
    }
  };

  const handleSubmitImage = async () => {
    if (resizedSrc === null) {
      alert("Please upload an image first");
      return;
    } else if (!isLoading) {
      setIsLoading(true);
      const callBackend = async () => {
        try {
          console.log("resizedSrc", resizedSrc);
          console.log("userInput", userInput);
          //const result = await generateEmbeddings({ prompt: resizedSrc });
          //console.log("result", result);
          //const id = await storingEmbedName({ name: userInput, embedding: result });
          //console.log("result", result);
          setIsLoading(false);
        } catch (error) {
          console.error(error);
        }
      };
      void callBackend();
    }
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
          </CardContent>
          <CardFooter className="flex justify-between">
            <button onClick={handleUploadClick} disabled={images.length >= 5}>
              Upload Images
            </button>
            <button onClick={() => console.log("Images submitted:", images)}>
              Submit
            </button>
          </CardFooter>
        </Card>
        <input
          type="text"
          placeholder="Enter a value"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="mt-4 p-2 border border-gray-300"
        />
        <button onClick={handleSubmitImage} className="mt-4 p-2 bg-blue-500 text-white rounded">
          Submit
        </button>
      </div>
    </div>
  );
}









/*
"use client";
import React, { useState, useRef } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/shadcn/card";
import { Trash2 } from 'lucide-react';
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation, useAction } from "convex/react";
import ImageUploader from "../components/imageupload";

export default function Component() {
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const generateEmbeddings = useAction(api.ideas.generateEmbeddings);
  const storingEmbedName = useMutation(api.ideas.storeinfo);
  const [previewSrc, setPreviewSrc] = useState(null);
  const [resizedSrc, setResizedSrc] = useState(null);
  const [originalImgHeight, setOriginalImgHeight] = useState(0);
  const [originalImgWidth, setOriginalImgWidth] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitImage = async () => {
    if (resizedSrc === null) {
      alert("Please upload an image first");
      return;
    } else if (!isLoading) {
      setIsLoading(true);
      const callBackend = async () => {
        try {
          console.log("resizedSrc", resizedSrc);
          const result = await generateEmbeddings({prompt: resizedSrc});
          const id = await storingEmbedName({name: "test", embedding: result});
          console.log("result", result);
          setIsLoading(false);
        } catch (error) {
          console.error(error);
        }
      };
      void callBackend();
    }
  }

  return (
<div className="flex justify-center items-center min-h-screen">
  <div>
          <h1>Start by uploading an image</h1>
          <ImageUploader 
          previewSrc={previewSrc} 
          setPreviewSrc={setPreviewSrc} 
          setResizedSrc={setResizedSrc}
          setOriginalImgHeight={setOriginalImgHeight} 
          setOriginalImgWidth={ setOriginalImgWidth} />
        </div>
        <button onClick={handleSubmitImage}>
        Submit
      </button>
</div>
  );
}

*/

{  /*<Card className="w-full max-w-md">
  <CardHeader>
    <CardTitle>Upload Images</CardTitle>
    <CardDescription>
      Click the button to upload up to 5 images, then submit when ready.
    </CardDescription>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-3 gap-4">
      {images.map((image, index) => (
        <div key={index} className="relative">
          <img
            src={image}
            alt={`Image ${index + 1}`}
            width={200}
            height={200}
            className="rounded-md object-cover"
            style={{ aspectRatio: "200/200", objectFit: "cover" }}
          />
          <button
            onClick={() => handleRemoveImage(index)}
            className="absolute top-0 right-0 text-white rounded-full p-1"
          >
            <Trash2/>
          </button>
        </div>
      ))}
    </div>
    {images.length < 5 && (
      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
      />
    )}
  </CardContent>
  <CardFooter className="flex justify-between">
    <button onClick={handleUploadImages} disabled={images.length >= 5}>
      Upload Images
    </button>
    <button onClick={() => console.log("Images submitted:", images)}>
      Submit
    </button>
  </CardFooter>
</Card>
*/}

/*

  const handleFileInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const newImages: string[] = [];

    

    for (let i = 0; i < files!.length; i++) {
      if (images.length + newImages.length < 5) {
        //const url = URL.createObjectURL(files![i]).replace(/^blob:/, '');
        console.log("File:", files![i]);
        const url = await getPermantURl()
        console.log("URL:", url);
        newImages.push(url?.URL ?? "");
      } else {
        break;
      }
    }
    setImages((prevImages) => [...prevImages, ...newImages]);
    console.log("Images:", images);
  };

  const handleUploadImages = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

*/