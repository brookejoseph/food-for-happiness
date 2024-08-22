"use client"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./card"

export default function upload() {
  const [images, setImages] = useState<any[]>([])
  const handleUploadImages = () => {
    const newImages = []
    for (let i = 0; i < 5; i++) {
      newImages.push(`/placeholder.svg?height=200&width=200`)
    }
    setImages(newImages)
  }
  const handleSubmit = () => {
    console.log("Images submitted:", images)
  }
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Upload Images</CardTitle>
        <CardDescription>Click the button to upload 5 random images, then submit when ready.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {images.map((image, index) => (
            <img
              key={index}
              src="/placeholder.svg"
              alt={`Image ${index + 1}`}
              width={200}
              height={200}
              className="rounded-md object-cover"
              style={{ aspectRatio: "200/200", objectFit: "cover" }}
            />
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <button onClick={handleUploadImages}>Upload 5 Random Images</button>
        <button onClick={handleSubmit}>Submit</button>
      </CardFooter>
    </Card>
  )
}