import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';
import test from 'node:test';

export default defineSchema({
    Image: defineTable({
        name: v.string(),
        embedding: v.array(v.number()),
        top3: v.optional(v.array(v.number())),
    }).vectorIndex("by_embedding", {
        vectorField: "top3",
        dimensions: 768,
      }),
    Categories: defineTable({
        topic: v.string(),
        embedding: v.any(),
    }).vectorIndex("by_embedding", {
        vectorField: "embedding",
        dimensions: 768,
      }),
  });