import { useMemo } from 'react';
import { useQuery, useAction } from 'deepspace';
import { useAuth } from 'deepspace';
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
  notes?: string;
  isPublic?: boolean;
  ownerId?: string;
};

export default function MyLoadouts() {
  const { user } = useAuth();
  const { data: loadouts = [], loading } = useQuery('loadouts');
  const { data: votes = [] } = useQuery('votes');
  const createLoadout = useAction('createLoadoutAction');

  const myLoadouts = useMemo(()=>{
    if (!user) return [];
    return (loadouts as Loadout[]).filter(l=>l.ownerId===user.id);
  }, [loadouts, user]);

  const scoreMap = useMemo(()=>{
    const map = new Map<string, number>();
    for (const v of votes as any[]) {
      const id = v.loadoutId;
      map.set(id, (map.get(id)||0) + (v.value||0));
    }
    return map;
  }, [votes]);

  if (!user) {
    return (
      <div className="card">
        <h3>Your Loadouts</h3>
        <p className="hint">Sign in to view and manage your loadouts.</p>
      </div>
    );
  }

  if (loading) return <div className="card">Loading...</div>;

  return (
    <div className="grid">
      <div className="card">
        <h3 style={{marginTop:0}}>Your Loadouts</h3>
        {myLoadouts.length===0 ? (
          <div className="hint">You haven’t created any loadouts yet.</div>
        ) : (
          <ul className="list">
            {myLoadouts.map(l=>{
              const op = OPERATORS.find(o=>o.id===l.operatorId);
              const id = l._id || l.id || '';
              const score = scoreMap.get(id)||0;
              return (
                <li key={id} className="card" style={{padding:12}}>
                  <div><strong>{op?.name || l.operatorId}</strong> — {l.primary} / {l.secondary || '—'}</div>
                  <div className="hint">Gadgets: {l.gadgets?.join(', ') || '—'} • Score {score} • Public: {l.isPublic ? 'Yes':'No'}</div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
