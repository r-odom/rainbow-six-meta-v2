import { getDB } from 'deepspace/worker';

export async function voteLoadoutAction(input: {
  loadoutId: string;
  value: number;
}, ctx: any) {
  if (!ctx.user) throw new Error('Authentication required');
  if (![1, -1].includes(input.value)) throw new Error('Value must be 1 or -1');

  const db = getDB();
  const existing = await db.votes.findOne({
    loadoutId: input.loadoutId,
    userId: ctx.user.id
  });

  if (existing) {
    // update existing vote
    await db.votes.updateOne(
      { _id: existing._id },
      { $set: { value: input.value } }
    );
  } else {
    await db.votes.insertOne({
      loadoutId: input.loadoutId,
      userId: ctx.user.id,
      value: input.value
    });
  }

  // return updated score
  const votes = await db.votes.find({ loadoutId: input.loadoutId }).toArray();
  const score = votes.reduce((s, v) => s + (v.value || 0), 0);
  return { score };
}
