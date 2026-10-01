import { useState } from 'react';
import { useAction } from 'deepspace';
import { OPERATORS, MAPS, SITES } from '../../worker/seed';

type Operator = { id: string; name: string; role: string; category: string; bestLoadout?: any };

export default function OpRecommender({ onPick }: { onPick?: (id:string)=>void }) {
  const [teamInput, setTeamInput] = useState('');
  const [map, setMap] = useState('Bank');
  const [site, setSite] = useState('Kilo');
  const [roleFilter, setRoleFilter] = useState<'Attacker' | 'Defender' | ''>('');
  const [recs, setRecs] = useState<Operator[]>([]);
  const [loading, setLoading] = useState(false);

  const recommend = useAction('recommendOperatorAction');

  const teamIds = teamInput.split(',').map(s=>s.trim().toLowerCase()).filter(Boolean);

  const sitesForMap = (SITES as any)[map] || [];

  const handleRecommend = async () => {
    setLoading(true);
    try {
      const result = await recommend({
        teamComp: teamIds,
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
    <div className="card">
      <h2 style={{marginTop:0}}>What OP should I pick?</h2>
      <div className="grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:12}}>
        <div>
          <label className="hint">Team composition (comma separated IDs)</label>
          <input className="input" placeholder="e.g. sledge, ash, thermite" value={teamInput} onChange={e=>setTeamInput(e.target.value)} />
        </div>
        <div>
          <label className="hint">Map</label>
          <select className="select" value={map} onChange={e=>setMap(e.target.value)}>
            {MAPS.map(m=> <option key={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label className="hint">Site</label>
          <select className="select" value={site} onChange={e=>setSite(e.target.value)}>
            {sitesForMap.map(s=> <option key={s}>{s}</option>)}
            {sitesForMap.length===0 && <option>{site}</option>}
          </select>
        </div>
        <div>
          <label className="hint">Role filter</label>
          <select className="select" value={roleFilter} onChange={e=>setRoleFilter(e.target.value as any)}>
            <option value="">Any</option>
            <option value="Attacker">Attacker</option>
            <option value="Defender">Defender</option>
          </select>
        </div>
      </div>
      <div style={{marginTop:12}}>
        <button className="btn primary" onClick={handleRecommend} disabled={loading}>
          {loading ? 'Recommending...' : 'Recommend'}
        </button>
      </div>

      {recs.length>0 && (
        <div style={{marginTop:20}}>
          <h3>Top picks</h3>
          <div className="grid grid-3">
            {recs.map(r => (
              <div key={r.id} className="card">
                <div style={{display:'flex', justifyContent:'space-between'}}>
                  <strong>{r.name}</strong>
                  <span className="tag">{r.role}</span>
                </div>
                <div className="hint">{r.id}</div>
                {r.bestLoadout && (
                  <div style={{marginTop:8}}>
                    <div><strong>Primary:</strong> {r.bestLoadout.primary}</div>
                    <div><strong>Secondary:</strong> {r.bestLoadout.secondary || '—'}</div>
                    <div><strong>Gadgets:</strong> {r.bestLoadout.gadgets?.join(', ')}</div>
                  </div>
                )}
                <div style={{marginTop:12}}>
                  <button className="btn" onClick={()=>onPick?.(r.id)}>Select</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
