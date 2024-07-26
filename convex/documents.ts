import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";

// Return all documents for the current authenticated User
export const getDocuments = query({
  async handler(ctx) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userId) {
      throw new ConvexError('Not authenticated')
    };

    return await ctx.db.query('documents')
      .withIndex('by_tokenIdentifier', (q) => q.eq('tokenIdentifier',
        userId
      )).collect()
  },
})

// Create a new document with the given text
export const createDocument = mutation({
  args: {
    title: v.string()
  },
  handler: async (ctx, args) => {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userId) {
      throw new ConvexError('Not authenticated')
    };

    await ctx.db.insert('documents', {
      title: args.title,
      tokenIdentifier: userId
    })
  },
})