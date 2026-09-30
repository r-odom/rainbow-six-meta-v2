import { OPERATORS } from './seed';
import { getDB } from 'deepspace/worker';

export async function getOperatorAction(input: { id: string }) {
  const op = OPERATORS.find(o => o.id === input.id);
  if (!op) throw new Error('Operator not found');

  const db = getDB();
  const loadouts = await db.loadouts.find({ operatorId: input.id }).toArray();
  const votes = await db.votes.find({ loadoutId: { $in: loadouts.map(l => l._id?.toString() || l.id) } }).toArray();

  const scoreMap = new Map<string, number>();
  for (const v of votes) {
    const id = v.loadoutId;
    scoreMap.set(id, (scoreMap.get(id) || 0) + (v.value || 0));
  }

  const community = loadouts.map(l => {
    const id = l._id?.toString() || l.id;
    return { ...l, score: scoreMap.get(id) || 0 };
  }).sort((a,b) => b.score - a.score).slice(0, 20);

  return { operator: op, communityLoadouts: community };
}
