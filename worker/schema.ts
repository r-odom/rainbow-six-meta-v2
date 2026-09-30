import { defineSchema } from 'deepspace/worker';

export const schema = defineSchema({
  operators: {
    id: String,
    name: String,
    role: String,
    category: String,
    imageUrl: String,
    bestLoadout: {
      primary: String,
      primaryAttachments: [String],
      secondary: String,
      gadgets: [String],
      notes: String,
    },
    permissions: {
      read: 'public',
      write: 'admin'
    }
  },
  loadouts: {
    ownerId: String,
    operatorId: String,
    primary: String,
    primaryAttachments: [String],
    secondary: String,
    secondaryAttachments: [String],
    gadgets: [String],
    attachments: [String],
    notes: String,
    isPublic: Boolean,
    createdAt: Date,
    permissions: {
      read: (ctx, doc) => doc.isPublic || doc.ownerId === ctx.user.id,
      write: (ctx, doc) => doc.ownerId === ctx.user.id
    }
  },
  votes: {
    loadoutId: String,
    userId: String,
    value: Number,
    permissions: {
      read: 'public',
      write: 'authenticated'
    }
  },
  comments: {
    loadoutId: String,
    userId: String,
    text: String,
    createdAt: Date,
    permissions: {
      read: 'public',
      write: 'authenticated'
    }
  }
});
