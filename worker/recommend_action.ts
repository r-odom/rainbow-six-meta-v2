import { OPERATORS } from './seed';
import { recommendOperator as recommend } from './recommend';

export async function recommendOperatorAction(input: {
  teamComp: string[];
  map: string;
  site: string;
  role?: 'Attacker' | 'Defender';
}) {
  const results = recommend(
    input.teamComp || [],
    input.map || '',
    input.site || '',
    input.role
  );
  return results.map(op => ({
    id: op.id,
    name: op.name,
    role: op.role,
    category: op.category,
    bestLoadout: op.bestLoadout
  }));
}
