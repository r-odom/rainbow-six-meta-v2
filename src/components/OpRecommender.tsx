import { useState } from 'react';

type Operator = { id: string; name: string; role: string; category: string };

const OPERATORS: Operator[] = [
  { id: 'sledge', name: 'Sledge', role: 'Attacker', category: 'Hard Breacher' },
  { id: 'ash', name: 'Ash', role: 'Attacker', category: 'Entry Fragger' },
  { id: 'thermite', name: 'Thermite', role: 'Attacker', category: 'Hard Breacher' },
  { id: 'rook', name: 'Rook', role: 'Defender', category: 'Support' },
  { id: 'mira', name: 'Mira', role: 'Defender', category: 'Support' },
];

export default function OpRecommender() {
  const [team, setTeam] = useState<string[]>([]);
  const [map, setMap] = useState('Bank');
  const [site, setSite] = useState('Kilo');
  const [recs, setRecs] = useState<Operator[]>([]);

  const recommend = () => {
    // Simple client-side heuristic mirroring worker/recommend.ts
    const hasHardBreacher = team.some(id => {
      const op = OPERATORS.find(o => o.id === id);
      return op?.category === 'Hard Breacher';
    });
    const needsHard = !hasHardBreacher;
    const candidates = OPERATORS.filter(op => !team.includes(op.id));
    const scored = candidates.map(op => {
      let score = 0;
      if (needsHard && op.category === 'Hard Breacher') score += 3;
      if (map === 'Bank' && op.id === 'mira') score += 1;
      return { op, score };
    });
    setRecs(scored.sort((a,b)=>b.score-a.score).slice(0,3).map(s=>s.op));
  };

  return (
    <div>
      <h2>What OP should I pick?</h2>
      <input placeholder="Team ops comma separated" onChange={e=>setTeam(e.target.value.split(','))} />
      <input placeholder="Map" value={map} onChange={e=>setMap(e.target.value)} />
      <input placeholder="Site" value={site} onChange={e=>setSite(e.target.value)} />
      <button onClick={recommend}>Recommend</button>
      <ul>
        {recs.map(r => <li key={r.id}>{r.name} - {r.category}</li>)}
      </ul>
    </div>
  );
}
