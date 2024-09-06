"use client";
import React, { useState, useRef, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/shadcn/card";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation, useAction } from "convex/react";
import { Progress } from "../components/shadcn/progess";
import Particles from "../components/aceternity/particles";
import { useTheme } from "next-themes";
import LoadingAnimation from "../components/fonts/loadingani";
import NumberTicker from "../components/fonts/counter";
import ShineBorder from "../components/fonts/shine";
import { ArrowBigLeft, Search, X } from 'lucide-react';
import {InsertEmbed} from "@/convex/pinecone/test";
//const index = pc.index('quickstart');



export default function Component() {
  const { theme } = useTheme();
  const [image, setImage] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [userInput, setUserInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const generateEmbeddings = useAction(api.ideas.generateEmbeddings);
  const storingEmbedName = useMutation(api.ideas.storeinfo);
  const handleSearch = useAction(api.ideas.handleSearch);
  const grabMostRelevantPerson = useAction(api.ideas.grabMostRelevantPerson);

  const [isLoading, setIsLoading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mostRelevantPerson, setMostRelevantPerson] = useState("");
  const [mostRelevantTopics, setMostRelevantTopics] = useState([""]);
  const [color, setColor] = useState("#000000");
  const [compatibility, setCompatibility] = useState(0);

  useEffect(() => {
    setColor(theme === "dark" ? "#ffffff" : "#000000");
  }, [theme]);

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
        setImage(base64Url);
      } catch (error) {
        console.error('Error converting file to base64:', error);
      }
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current && !image) {
      fileInputRef.current.click();
    }
  };

  const handleSubmitImage = async () => {
    if (!image) return;

    setIsLoading(true);
    setSubmitted(true);
    try {
      const result = await generateEmbeddings({ prompt: image });

      const top5 = await handleSearch({ query: result });
      setMostRelevantTopics(top5.topicNames);
      console.log("top5 setMostRelevantTopics", top5.topicNames);
      const id = await storingEmbedName({ name: userInput, embedding: result, top3: top5.averageVector });
      await InsertEmbed(result, id);
      const mostRelevantPerson = await grabMostRelevantPerson({ id: id, query: top5.averageVector });
      setMostRelevantPerson(mostRelevantPerson?.name);
      const percentage = Math.floor((mostRelevantPerson?.score ?? 0) * 100);
      setCompatibility(percentage);
    } catch (error) {
      console.error('Error processing image:', error);
    }

    setIsLoading(false);
    setUploadComplete(true);
  };

  const handleSubmitInterest = () => {
    setStep(2);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <a href="/" className="absolute top-0 left-0 text-2xl p-4">
        <ArrowBigLeft color="#0f0f0f" />
      </a>
      {step === 1 && (
        <div className="w-11/12 max-w-lg mx-auto">
          <h2 className="text-xl text-black dm-serif-text-regular mb-4 text-center">Enter Your Name</h2>
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="w-full h-32 p-2 border focus:outline-none"
            placeholder="Jane Doe"
            style={{ 
              backgroundColor: 'transparent', 
              color: 'black', 
              borderColor: 'black', 
              borderWidth: '1px' 
            }}
          />
          <div className="flex justify-center">
            <button
              onClick={handleSubmitInterest}
              className="mt-4 px-4 py-2 bg-black text-white dm-serif-text-regular rounded"
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {step === 2 && !submitted && !isLoading && (
        <div className="w-full max-w-md bg-gray-100">
          <Card className="w-full max-w-md bg-black">
            <CardHeader>
              <CardTitle className="dm-serif-text-regular">Upload Image</CardTitle>
              <CardDescription className="dm-serif-text-regular">
                <p className="mb-2 dm-serif-text-regular">Here are some ideas for images you can upload:</p>
                <ul className="list-disc pl-5 mb-4 dm-serif-text-regular">
                  <li>Your favorite hobby in action</li>
                  <li>A place you love visiting</li>
                  <li>A memorable event or moment</li>
                </ul>
                Upload an image, then submit when ready.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!image && (
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              )}
              {image && (
                <img src={image} alt="Uploaded" className="w-full h-auto mt-4" />
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <button className="dm-serif-text-regular" onClick={handleUploadClick} disabled={!!image}>
                Upload Image
              </button>
              <button className="dm-serif-text-regular" onClick={handleSubmitImage} disabled={!image}>
                Submit
              </button>
            </CardFooter>
          </Card>
        </div>
      )}

      {isLoading && (
        <div className="w-full max-w-md mx-auto text-center">
          <LoadingAnimation />
          <p className="text-xl dm-serif-text-regular text-black mt-4">Processing your image this takes a min...</p>
        </div>
      )}

      {uploadComplete && !isLoading && (
        <div className="w-full max-w-md mx-auto text-center mt-4">
          <Card className="bg-gray-50">
            <CardTitle>
              <p className="text-xl text-black dm-serif-text-regular-italic mt-8">Your connection:</p>
              <p className="text-xl text-black chivo-Roman ">{mostRelevantPerson}</p>
            </CardTitle>
            <p className="whitespace-pre-wrap text-8xl font-medium tracking-tighter text-black dark:text-white mt-12 mb-12">
              <NumberTicker className="dm-serif-text-regular text-black" value={compatibility} />
            </p>
            <div className="text-lg text-black chivo-Roman mb-8">
              You guys should talk about
              <ul className="text-sm chivo-Roman">
                {mostRelevantTopics.map((topic, index) => (
                  <li key={index}>{topic}</li>
                ))}
              </ul>
            </div>
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