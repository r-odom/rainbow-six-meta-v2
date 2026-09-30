import { OPERATORS, MAPS, SITES } from './seed';

type Role = 'Attacker' | 'Defender';

type CompNeeds = {
  hardBreacher: boolean;
  softBreacher: boolean;
  intel: boolean;
  antiRoam: boolean;
  support: boolean;
  entry: boolean;
};

function hasGadget(op: typeof OPERATORS[number], keywords: string[]) {
  const gadgets = (op.bestLoadout?.gadgets || []).map(g => g.toLowerCase());
  return keywords.some(k => gadgets.some(g => g.includes(k)));
}

function categoryFromName(op: typeof OPERATORS[number]) {
  const name = op.name.toLowerCase();
  const hard = ['thermite','tremor','sledge','hibana','ace'];
  const soft = ['thatcher','ash','jackal','lion'];
  const intel = ['valkyrie','dokkaebi','iq','maverick','jackal'];
  const support = ['rook','doc','finka','medic'];
  const antiRoam = ['vulcan','bandit','kapkan'];
  if (hard.includes(name)) return 'Hard Breacher';
  if (soft.includes(name)) return 'Entry Fragger';
  if (intel.includes(name)) return 'Intel';
  if (support.includes(name)) return 'Support';
  if (antiRoam.includes(name)) return 'Anti Roam';
  return op.category || 'General';
}

export function recommendOperator(
  teamComp: string[],
  map: string,
  site: string,
  roleFilter?: Role
): typeof OPERATORS {
  const hasHardBreacher = teamComp.some(id => {
    const op = OPERATORS.find(o => o.id === id);
    return op && hasGadget(op, ['charge','breach','sledgehammer','exothermic','hydra']);
  });

  const hasSoftBreacher = teamComp.some(id => {
    const op = OPERATORS.find(o => o.id === id);
    return op && hasGadget(op, ['flash','smoke','emp']);
  });

  const hasIntel = teamComp.some(id => {
    const op = OPERATORS.find(o => o.id === id);
    return op && hasGadget(op, ['camera','drone','pulse','ping']);
  });

  const needs: CompNeeds = {
    hardBreacher: !hasHardBreacher,
    softBreacher: !hasSoftBreacher,
    intel: !hasIntel,
    antiRoam: false,
    support: teamComp.length < 5,
    entry: !teamComp.some(id => {
      const op = OPERATORS.find(o => o.id === id);
      return op && categoryFromName(op) === 'Entry Fragger';
    })
  };

  let candidates = OPERATORS.filter(op => {
    if (roleFilter && op.role !== roleFilter) return false;
    if (teamComp.includes(op.id)) return false;
    return true;
  });

  const scored = candidates.map(op => {
    let score = 0;
    const cat = categoryFromName(op);
    if (needs.hardBreacher && hasGadget(op, ['charge','breach','exothermic','hydra'])) score += 4;
    if (needs.softBreacher && hasGadget(op, ['flash','smoke','emp','breaching'])) score += 3;
    if (needs.intel && hasGadget(op, ['camera','drone','pulse','ping','jammer'])) score += 3;
    if (needs.entry && cat === 'Entry Fragger') score += 2;
    if (needs.support && cat === 'Support') score += 2;
    
    // Map/site bias
    const mapSites = SITES[map as keyof typeof SITES];
    if (mapSites && site && mapSites.includes(site)) {
      // Favor operators with relevant gadgets for site
      if (site.toLowerCase().includes('vault') && hasGadget(op, ['hammer','charge'])) score += 1;
    }
    // Prefer Attackers for Attacker role filter etc.
    return { op, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(s => s.op);
}
