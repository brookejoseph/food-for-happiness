"use client"

import { useState } from 'react';

interface ImageUploaderProps {
  previewSrc: any;
  setPreviewSrc: any;
  setResizedSrc: any;
  setOriginalImgHeight: any;
  setOriginalImgWidth: any;
}

export default function ImageUploader({ previewSrc, setPreviewSrc, setResizedSrc, setOriginalImgHeight, setOriginalImgWidth} : ImageUploaderProps) {
  const handleImageChange = (uploaded:any) => {
    console.log("uploaded", uploaded)
    const file = uploaded.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewSrc(reader.result);
        const img = new Image();
        img.onload = () => {
          const landscape = { width: 500, height: 350 };
          const portrait = { width: 350, height: 500 };

          // Downscale the image if it is larger than the maximum dimensions
          const MAX_WIDTH = 2000;
          const MAX_HEIGHT = 2000;
          if (img.width > MAX_WIDTH) {
            const scaleFactor = MAX_WIDTH / img.width;
            img.width = MAX_WIDTH;
            img.height *= scaleFactor;
          }

          // Determine the orientation of the original image
          setOriginalImgHeight(img.height);
          setOriginalImgWidth(img.width);
          const isPortrait = img.height > img.width;
          const targetWidth = isPortrait ? portrait.width : landscape.width;
          const targetHeight = isPortrait ? portrait.height : landscape.height;

          // Create an off-screen canvas
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');

          // Set the canvas dimensions to the target dimensions
          canvas.width = targetWidth;
          canvas.height = targetHeight;

          // Draw the image onto the canvas with the new dimensions
          context!.drawImage(img, 0, 0, targetWidth, targetHeight);

          // Get the base64 encoded image from the canvas
          const resizedImage = canvas.toDataURL('image/png');

          // Update the preview source
          setResizedSrc(resizedImage);
        };

        // Set the image source to the file reader result
        img.src = reader.result as string;
      };
      return reader.readAsDataURL(file);
    }
    
  };

  const triggerFileInput = () => {
    if (typeof document !== 'undefined') {
      const fileInput = document.getElementById('fileInput') as HTMLInputElement;
      fileInput.click();
    }
  };

  
  return (
    
    <div>
      <input
        id="fileInput"
        type="file"
        accept="image/*,text/plain"
        onChange={handleImageChange}
        className="hidden"
      />
      <button
        onClick={triggerFileInput}
        className="w-full mt-2 secondary-gradient primary-shadow mx-auto flex items-center text-white justify-center gap-3 rounded-md px-4 py-2 text-center text-sm md:px-12"
      >
        Select Image
      </button>
      <div className="mt-3 py-3 w-full h-[400px] border-2 border-gray-400 border-dashed rounded-md flex items-center justify-center text-gray-600 text-sm">
        {previewSrc ? <img src={previewSrc} alt="Image Preview" className='max-h-[370px] max-w-full' /> : <p>Uploaded image will appear here</p>}
      </div>
    </div>
  );
}
