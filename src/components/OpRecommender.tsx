import { useState } from 'react';
import { useAction } from 'deepspace';

type Operator = { id: string; name: string; role: string; category: string; bestLoadout?: any };

export default function OpRecommender() {
  const [team, setTeam] = useState<string[]>([]);
  const [map, setMap] = useState('Bank');
  const [site, setSite] = useState('Kilo');
  const [roleFilter, setRoleFilter] = useState<'Attacker' | 'Defender' | ''>('');
  const [recs, setRecs] = useState<Operator[]>([]);
  const [loading, setLoading] = useState(false);

  const recommend = useAction('recommendOperatorAction');

  const handleRecommend = async () => {
    setLoading(true);
    try {
      const result = await recommend({
        teamComp: team,
        map,
        site,
        role: roleFilter || undefined
      });
      setRecs(result || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>What OP should I pick?</h2>
      <input
        placeholder="Team ops comma separated"
        onChange={e => setTeam(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
      />
      <input placeholder="Map" value={map} onChange={e => setMap(e.target.value)} />
      <input placeholder="Site" value={site} onChange={e => setSite(e.target.value)} />
      <select value={roleFilter} onChange={e => setRoleFilter(e.target.value as any)}>
        <option value="">Any role</option>
        <option value="Attacker">Attacker</option>
        <option value="Defender">Defender</option>
      </select>
      <button onClick={handleRecommend} disabled={loading}>
        {loading ? 'Recommending...' : 'Recommend'}
      </button>
      <ul>
        {recs.map(r => (
          <li key={r.id}>
            {r.name} – {r.role} {r.category ? `(${r.category})` : ''}
            {r.bestLoadout && (
              <span> • {r.bestLoadout.primary} / {r.bestLoadout.secondary}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
