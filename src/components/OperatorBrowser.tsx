import { useState, useMemo } from 'react';
import { useAction } from 'deepspace';
import { OPERATORS } from '../../worker/seed';

type Op = typeof OPERATORS[number];

export default function OperatorBrowser({ selectedId, onSelect }: { selectedId?: string; onSelect?: (id:string)=>void }) {
  const [query, setQuery] = useState('');
  const [role, setRole] = useState<'All'|'Attacker'|'Defender'>('All');
  const getOperator = useAction('getOperatorAction');

  const filtered = useMemo(() => {
    return OPERATORS.filter(op => {
      const matchesQ = !query || op.name.toLowerCase().includes(query.toLowerCase()) || op.id.toLowerCase().includes(query.toLowerCase());
      const matchesR = role==='All' || op.role===role;
      return matchesQ && matchesR;
    });
  }, [query, role]);

  const [detail, setDetail] = useState<Op | null>(null);
  const [loading, setLoading] = useState(false);

  const openDetail = async (op: Op) => {
    setLoading(true);
    try {
      const res = await getOperator({ id: op.id });
      setDetail({ ...op, bestLoadout: res.operator.bestLoadout });
      // store community data in a global? For now just show bestLoadout
    } catch(e){ console.error(e); }
    finally { setLoading(false); }
  };

  return (
    <div className="grid grid-3">
      <div className="card" style={{ gridColumn: '1 / -1' }}>
        <div style={{display:'flex', gap:12, flexWrap:'wrap'}}>
          <input className="input" placeholder="Search operators..." value={query} onChange={e=>setQuery(e.target.value)} style={{flex:1, minWidth:200}}/>
          <select className="select" value={role} onChange={e=>setRole(e.target.value as any)}>
            <option>All</option>
            <option>Attacker</option>
            <option>Defender</option>
          </select>
        </div>
      </div>

      {filtered.map(op => (
        <div key={op.id} className="card">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <h3 style={{margin:'0 0 4px 0'}}>{op.name}</h3>
            <span className="tag">{op.role}</span>
          </div>
          <div className="hint">{op.id} • {op.category}</div>
          <div style={{marginTop:12}}>
            <div><strong>Primary:</strong> {op.bestLoadout.primary}</div>
            <div className="hint">Attachments: {op.bestLoadout.primaryAttachments?.join(', ') || '—'}</div>
            <div><strong>Secondary:</strong> {op.bestLoadout.secondary || '—'}</div>
            <div className="hint">Attachments: {op.bestLoadout.secondaryAttachments?.join(', ') || '—'}</div>
            <div><strong>Gadgets:</strong> {op.bestLoadout.gadgets.join(', ')}</div>
          </div>
          <div style={{display:'flex', gap:8, marginTop:12}}>
            <button className="btn" onClick={()=>{ onSelect?.(op.id); openDetail(op); }}>Details</button>
            <button className="btn" onClick={()=>onSelect?.(op.id)}>Select</button>
          </div>
        </div>
      ))}
    </div>
  );
}
