import { defineSchema } from 'deepspace/worker';

export const schema = defineSchema({
  operators: {
    name: String,
    role: String,
    imageUrl: String,
  },
  loadouts: {
    ownerId: String,
    operatorId: String,
    primary: String,
    secondary: String,
    gadgets: [String],
    attachments: [String],
    notes: String,
    isPublic: Boolean,
  },
  votes: {
    loadoutId: String,
    userId: String,
  },
  comments: {
    loadoutId: String,
    userId: String,
    text: String,
  }
});
