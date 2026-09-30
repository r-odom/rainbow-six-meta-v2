import { OPERATORS } from './seed';

type Role = 'Attacker' | 'Defender';
type CompNeeds = {
  hardBreacher: boolean;
  softBreacher: boolean;
  intel: boolean;
  antiRoam: boolean;
  support: boolean;
};

export function recommendOperator(
  teamComp: string[],
  map: string,
  site: string,
  roleFilter?: Role
): typeof OPERATORS {
  // Simple heuristic based on team composition gaps
  const hasHardBreacher = teamComp.some(id => {
    const op = OPERATORS.find(o => o.id === id);
    return op?.category === 'Hard Breacher';
  });

  const needs: CompNeeds = {
    hardBreacher: !hasHardBreacher,
    softBreacher: !teamComp.includes('ash') && !teamComp.includes('jackal'),
    intel: !teamComp.some(id => ['valkyrie','valkyrie','mira','jackal'].includes(id)),
    antiRoam: false,
    support: teamComp.length < 5
  };

  let candidates = OPERATORS.filter(op => {
    if (roleFilter && op.role !== roleFilter) return false;
    return true;
  });

  // Score candidates by how well they fill needs
  const scored = candidates.map(op => {
    let score = 0;
    if (needs.hardBreacher && op.category === 'Hard Breacher') score += 3;
    if (needs.softBreacher && op.category === 'Entry Fragger') score += 2;
    if (needs.intel && op.category === 'Intel') score += 2;
    if (needs.support && op.category === 'Support') score += 1;
    // Map/site bias - simple placeholder
    if (map === 'Bank' && op.id === 'mira') score += 1;
    return { op, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(s => s.op);
}
