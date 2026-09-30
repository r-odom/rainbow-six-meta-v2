import { useState } from 'react';
import { useQuery, useAction } from 'deepspace';

type Loadout = {
  id?: string;
  operatorId: string;
  primary: string;
  primaryAttachments: string[];
  secondary: string;
  secondaryAttachments: string[];
  gadgets: string[];
  isPublic: boolean;
  ownerId: string;
};

export default function LoadoutManager({ operatorId }: { operatorId: string }) {
  const { data: loadouts = [], loading } = useQuery('loadouts', {
    filter: { operatorId }
  });
  const { data: votes = [] } = useQuery('votes', {
    filter: { loadoutId: { $in: loadouts.map(l => l.id) } }
  });
  const createLoadout = useAction('createLoadoutAction');
  const voteLoadout = useAction('voteLoadoutAction');

  const [primary, setPrimary] = useState('');
  const [secondary, setSecondary] = useState('');
  const [gadgets, setGadgets] = useState('');

  const handleAdd = async () => {
    await createLoadout({
      operatorId,
      primary,
      primaryAttachments: [],
      secondary,
      secondaryAttachments: [],
      gadgets: gadgets.split(',').map(g => g.trim()),
      isPublic: true
    });
  };

  const vote = async (loadoutId: string, value: number) => {
    await voteLoadout({ loadoutId, value });
  };

  const score = (loadoutId: string) => {
    return votes.filter(v => v.loadoutId === loadoutId).reduce((s, v) => s + (v.value || 0), 0);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h3>Community Loadouts</h3>
      <div>
        <input placeholder="Primary weapon" value={primary} onChange={e => setPrimary(e.target.value)} />
        <input placeholder="Secondary weapon" value={secondary} onChange={e => setSecondary(e.target.value)} />
        <input placeholder="Gadgets comma separated" value={gadgets} onChange={e => setGadgets(e.target.value)} />
        <button onClick={handleAdd}>Add variation</button>
      </div>
      <ul>
        {loadouts.map(l => (
          <li key={l.id}>
            <strong>{l.primary}</strong> / {l.secondary} – {l.gadgets?.join(', ')}
            <div>
              <button onClick={() => vote(l.id!, 1)}>▲</button>
              <span>{score(l.id!)}</span>
              <button onClick={() => vote(l.id!, -1)}>▼</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
