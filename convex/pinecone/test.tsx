"use server"

import { query } from "../_generated/server";
import { Id, TableNames } from "../_generated/dataModel";
import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeClient } from 'pinecone-client';


type Metadata = {};


const pinecone = new PineconeClient<Metadata>({
  apiKey: process.env.PINECONE_API_KEY!,
  baseUrl:  process.env.PINECONE_BASE_URL!,
  namespace: 'image vectors',
});


export async function InsertEmbed(embedding: number[], id: string) {
console.log("embedding within pinecone function", embedding)
const response = await pinecone.upsert({
  vectors: [
    { id: id, values: embedding },
  ],
});
console.log("response", response)
}

export async function grabEmbedding(queryEmbed: number[]) {
  console.log("queryEmbed", queryEmbed)
  
  const response = await pinecone.query({
      vector: queryEmbed,
      topK: 5,
  });
  console.log("response", response)
  return response;
}


/* 
await pinecone.upsert({
  vectors: [
    { id: '1', values: [1, 2, 3], metadata: { size: 3, tags: ['a', 'b', 'c'] } },
    { id: '2', values: [4, 5, 6], metadata: { size: 10, tags: null } },
  ],
});
*/