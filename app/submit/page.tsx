"use client";
import React, { useState, useRef } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/shadcn/card";
import { Trash2 } from 'lucide-react';
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation, useAction } from "convex/react";
import ImageUploader from "../components/imageupload";
import ImageUploader2 from "../components/imageupload2";
import ImageUploader3 from "../components/imageupload3";


export default function Component() {
  const [images, setImages] = useState<string[]>([]);
  const [step, setStep] = useState(1);
  const [userInput, setUserInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const generateEmbeddings = useAction(api.ideas.generateEmbeddings);
  const storingEmbedName = useMutation(api.ideas.storeinfo);
  const handleSearch = useAction(api.ideas.handleSearch);
  const grabMostRelevantPerson = useAction(api.ideas.grabMostRelevantPerson);

  const [isLoading, setIsLoading] = useState(false);

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
      try {
        const result = await generateEmbeddings({ prompt: currentImage });
        const top5 = await handleSearch({ query: result });
        const id = await storingEmbedName({ name: userInput, embedding: result, top3: top5.averageVector });
        const mostRelevantPerson = await grabMostRelevantPerson({ id: id, query: top5.averageVector });
      } catch (error) {
        console.error(`Error processing image ${i + 1}:`, error);
      }
    }
    setIsLoading(false);
  };

  const handleSubmitInterest = () => {
    setStep(2);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      {step === 1 && (
        <div className="w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">Enter Your Interests</h2>
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="w-full h-32 p-2 border rounded"
            placeholder="Enter your interests..."
          />
          <button
            onClick={handleSubmitInterest}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Submit
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="w-full max-w-md">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Upload Images</CardTitle>
              <CardDescription>
                <p className="mb-2">Here are some ideas for images you can upload:</p>
                <ul className="list-disc pl-5 mb-4">
                  <li>Your favorite hobby in action</li>
                  <li>A place you love visiting</li>
                  <li>A memorable event or moment</li>
                </ul>
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
      )}
    </div>
  );
}



/*
export default function Component() {
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const topic = useAction(api.ideas.generateTopicIdea2);
  const storeTopicAndEmbedding = useMutation(api.ideas.storeTopicAndEmbedding);
  const generateTextEmbeddings = useAction(api.ideas.generateEmbeddingsText);



  const generateEmbeddings = useAction(api.ideas.generateEmbeddings);
  const storingEmbedName = useMutation(api.ideas.storeinfo);
  const handleSearch = useAction(api.ideas.handleSearch);

  const [previewSrc, setPreviewSrc] = useState(null);
  const [resizedSrc, setResizedSrc] = useState(null);

  const [previewSrc2, setPreviewSrc2] = useState(null);
  const [resizedSrc2, setResizedSrc2] = useState(null);

  const [previewSrc3, setPreviewSrc3] = useState(null);
  const [resizedSrc3, setResizedSrc3] = useState(null);


  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitImage = async () => {
      setIsLoading(true);
      const callBackend = async () => {
        try {
          console.log("resizedSrc", resizedSrc);
          const result = await generateEmbeddings({prompt: resizedSrc ?? ``});
          console.log("result", result);
          const id = await storingEmbedName({name: "test", embedding: result});
          const top5 = await handleSearch({query: result});
          console.log("top5", top5);
          setIsLoading(false);
        } catch (error) {
          console.error(error);
        }
      };
      void callBackend();
  }
  return (
    <>
  <div className="flex justify-center items-center min-h-screen">
    <div>
      <h1>Start by uploading an image</h1>
      <ImageUploader
      previewSrc={previewSrc} 
      setPreviewSrc={setPreviewSrc}
      setResizedSrc={setResizedSrc} />
    </div>
    <button onClick={handleSubmitImage}> Submit </button>
  </div>

  <div className="flex justify-center items-center min-h-screen">
    <div>
      <h1>Start by uploading an image</h1>
      <ImageUploader2
      previewSrc={previewSrc2} 
      setPreviewSrc={setPreviewSrc2}
      setResizedSrc={setResizedSrc2} />
    </div>
    <button onClick={handleSubmitImage}> Submit </button>
  </div>


  <div className="flex justify-center items-center min-h-screen">
    <div>
      <h1>Start by uploading an image</h1>
      <ImageUploader3
      previewSrc={previewSrc3} 
      setPreviewSrc={setPreviewSrc3}
      setResizedSrc={setResizedSrc3} />
    </div>
    <button onClick={handleSubmitImage}> Submit </button>
  </div>
  </>
  );
}


*/





/*
  const handleSubmit = async () => {
      const callBackend = async () => {
        try {
          const prompt = await topic();
          const realPrompt = prompt ?? ""
          console.log("prompt", realPrompt);
          const result = await generateTextEmbeddings({prompt: realPrompt});
          console.log("result", result);
          const id = await storeTopicAndEmbedding({topic: realPrompt, embedding: result});
          console.log("result", result);
          setIsLoading(false);
        } catch (error) {
          console.error(error);
        }
      };
      void callBackend();
  }*/

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