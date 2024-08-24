('use node');

import OpenAI from "openai";


const api = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export const TEXT_MODEL = "gpt-4";
export const VISION_MODEL = "gpt-4-turbo";

export async function main() {
  const response = await api.chat.completions.create({
    model: VISION_MODEL,
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "What’s in this image?" },
          {
            type: "image_url",
            image_url: {
              "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg",
            },
          },
        ],
      },
    ],
  });
  console.log(response.choices[0]);
}


export async function generateTopicIdea() {
    const completion = await api.chat.completions.create({
      messages: [{ role: "system", content: `come up with a one word random topics people might have in common and not even know it` 
    }],
      model: TEXT_MODEL,
    });
    console.log(completion.choices[0]);
    return completion.choices[0].message.content;
  }
