import { useState, useMemo } from 'react';
import { useQuery, useAction } from 'deepspace';
import { OPERATORS } from '../../worker/seed';

type Loadout = {
  _id?: string;
  id?: string;
  operatorId: string;
  primary: string;
  primaryAttachments?: string[];
  secondary?: string;
  secondaryAttachments?: string[];
  gadgets?: string[];
  isPublic?: boolean;
  ownerId?: string;
};

export default function LoadoutManager({ operatorId }: { operatorId: string }) {
  const { data: loadouts = [], loading } = useQuery('loadouts', {
    filter: { operatorId }
  });
  const { data: votes = [] } = useQuery('votes');
  const createLoadout = useAction('createLoadoutAction');
  const voteLoadout = useAction('voteLoadoutAction');

  const [primary, setPrimary] = useState('');
  const [secondary, setSecondary] = useState('');
  const [gadgets, setGadgets] = useState('');
  const [attachments, setAttachments] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const operator = useMemo(()=> OPERATORS.find(o=>o.id===operatorId), [operatorId]);

  const scoreMap = useMemo(()=>{
    const map = new Map<string, number>();
    for (const v of votes as any[]) {
      const id = v.loadoutId;
      map.set(id, (map.get(id)||0) + (v.value||0));
    }
    return map;
  }, [votes]);

  const enriched = useMemo(()=>{
    return (loadouts as Loadout[]).map(l=>{
      const id = l._id || l.id || '';
      return { ...l, id, score: scoreMap.get(id)||0 };
    }).sort((a,b)=> b.score - a.score);
  }, [loadouts, scoreMap]);

  const handleAdd = async () => {
    if (!primary) return;
    setSubmitting(true);
    try {
      await createLoadout({
        operatorId,
        primary,
        primaryAttachments: attachments.split(',').map(s=>s.trim()).filter(Boolean),
        secondary,
        secondaryAttachments: [],
        gadgets: gadgets.split(',').map(s=>s.trim()).filter(Boolean),
        isPublic
      });
      setPrimary('');
      setSecondary('');
      setGadgets('');
      setAttachments('');
    } catch(e){ console.error(e); }
    finally { setSubmitting(false); }
  };

  const vote = async (loadoutId: string, value: number) => {
    try { await voteLoadout({ loadoutId, value }); } catch(e){ console.error(e); }
  };

  if (loading) return <div className="card">Loading loadouts...</div>;

  return (
    <div className="grid" style={{gridTemplateColumns:'1fr'}}>
      <div className="card">
        <h3 style={{marginTop:0}}>Community Loadouts {operator && <span className="tag">{operator.name}</span>}</h3>
        <div className="grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:12}}>
          <input className="input" placeholder="Primary weapon" value={primary} onChange={e=>setPrimary(e.target.value)} />
          <input className="input" placeholder="Secondary weapon" value={secondary} onChange={e=>setSecondary(e.target.value)} />
          <input className="input" placeholder="Gadgets comma separated" value={gadgets} onChange={e=>setGadgets(e.target.value)} />
          <input className="input" placeholder="Attachments comma separated" value={attachments} onChange={e=>setAttachments(e.target.value)} />
          <label style={{display:'flex', alignItems:'center', gap:8}}>
            <input type="checkbox" checked={isPublic} onChange={e=>setIsPublic(e.target.checked)} /> Public
          </label>
        </div>
        <div style={{marginTop:12}}>
          <button className="btn primary" onClick={handleAdd} disabled={submitting}>
            {submitting ? 'Adding...' : 'Add variation'}
          </button>
        </div>
      </div>

      <div className="card">
        <h4 style={{marginTop:0}}>Top community loadouts</h4>
        {enriched.length===0 ? (
          <div className="hint">No loadouts yet. Be the first to add one!</div>
        ) : (
          <ul className="list">
            {enriched.map(l => (
              <li key={l.id} className="card" style={{padding:'12px'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <div>
                    <strong>{l.primary}</strong>
                    {l.secondary && <span className="hint"> / {l.secondary}</span>}
                  </div>
                  <span className="badge">Score {l.score}</span>
                </div>
                <div className="hint" style={{marginTop:4}}>
                  {l.gadgets?.join(', ') || 'No gadgets'} {l.primaryAttachments?.length ? `• Attachments: ${l.primaryAttachments.join(', ')}` : ''}
                </div>
                <div className="vote" style={{marginTop:8}}>
                  <button onClick={()=>vote(l.id!,1)}>▲</button>
                  <span>{l.score}</span>
                  <button onClick={()=>vote(l.id!,-1)}>▼</button>
                  <span className="hint" style={{marginLeft:8}}>Owner: {l.ownerId?.slice(0,6) || 'anon'}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
