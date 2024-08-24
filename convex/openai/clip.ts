import {pipeline} from '@xenova/transformers';
import {CLIPModel} from '@xenova/transformers';
import {Processor} from '@xenova/transformers'
//import Replicate from 'replicate';
import { internalAction } from '../_generated/server';
import { v } from 'convex/values';
import { internal } from '../_generated/api';
import Replicate from 'replicate';



const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

export async function getEmbeddings(text: string) {
  console.log("text", text)
  const input = {
    image: text
  }
    try {
        const output = await replicate.run("krthr/clip-embeddings:1c0371070cb827ec3c7f2f28adcdde54b50dcd239aa6faea0bc98b174ef03fb4", { input }) as {embedding: []};
        console.log("outputty", output)
        return output.embedding;
    } 
    catch (error) {
      console.error('Error generating embedding:', error);
      throw error;
    }
}

export async function getEmbeddingsText(text: string) {
  console.log("text", text)
  const input = {
    text: text
  }
    try {
        const output = await replicate.run("krthr/clip-embeddings:1c0371070cb827ec3c7f2f28adcdde54b50dcd239aa6faea0bc98b174ef03fb4", { input }) as {embedding: []};
        console.log("outputty", output)
        return output;
    } 
    catch (error) {
      console.error('Error generating embedding:', error);
      throw error;
    }
}


  /*
export const getEmbeddings = internalAction({
  args: {
      image: v.any(),
  },
  handler: async (_, args) => {
        const input = {
          image: args.image
        }
        console.log("input within clip folder", input)
      const output = await replicate.run("daanelson/imagebind:0383f62e173dc821ec52663ed22a076d9c970549c209666ac3db181618b7a304", { input }) as [];
      return output
  }
});

*/

  