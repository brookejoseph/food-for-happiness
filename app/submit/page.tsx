
import React from 'react'
import {useState, useEffect} from 'react'
import {pipeline} from '@xenova/transformers';
import {CLIPModel} from '@xenova/transformers';
import {Processor} from '@xenova/transformers'


async function getEmbeddings(text: string) {
    try {
        const classifier = await pipeline('zero-shot-image-classification', 'Xenova/clip-vit-base-patch32');
        const url = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/tiger.jpg';
        const output = await classifier(url, ['tiger', 'horse', 'dog']);
        return output;
    } 
    catch (error) {
      console.error('Error generating embedding:', error);
      throw error;
    }
  }

useEffect

export default function Page() {
    return <p>Dashboard Page</p>;
  }