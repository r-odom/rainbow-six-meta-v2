import { getDB } from 'deepspace/worker';
import { OPERATORS } from './seed';

export async function getLoadoutsWithScoreAction(input: {
  operatorId?: string;
  limit?: number;
}) {
  const db = getDB();
  const filter: any = {};
  if (input.operatorId) filter.operatorId = input.operatorId;

  const loadouts = await db.loadouts.find(filter).toArray();
  const loadoutIds = loadouts.map(l => l._id?.toString() || l.id);
  const votes = await db.votes.find({ loadoutId: { $in: loadoutIds } }).toArray();

  const scoreMap = new Map<string, number>();
  for (const v of votes) {
    const id = v.loadoutId;
    scoreMap.set(id, (scoreMap.get(id) || 0) + (v.value || 0));
  }

  const enriched = loadouts.map(l => {
    const id = l._id?.toString() || l.id;
    return {
      ...l,
      score: scoreMap.get(id) || 0,
      operator: OPERATORS.find(o => o.id === l.operatorId)
    };
  });

  enriched.sort((a, b) => b.score - a.score);
  const limit = input.limit || 50;
  return enriched.slice(0, limit);
}
