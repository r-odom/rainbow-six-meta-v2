import { useState } from 'react';
import { DeepSpaceProvider, useAuth, LoginButton } from 'deepspace';
import { useLoadouts } from './hooks/useLoadouts';
import OpRecommender from './components/OpRecommender';
import LoadoutManager from './components/LoadoutManager';

export default function App() {
  const { user } = useAuth();
  const { loadouts, createLoadout } = useLoadouts();
  const [selectedOp, setSelectedOp] = useState('sledge');

  return (
    <DeepSpaceProvider>
      <div>
        <h1>Rainbow Six Meta Loadouts</h1>
        {user ? (
          <div>
            <p>Welcome {user.name}</p>
            <OpRecommender />
            <input value={selectedOp} onChange={e=>setSelectedOp(e.target.value)} placeholder="operator id" />
            <LoadoutManager operatorId={selectedOp} />
            <button onClick={() => createLoadout()}>New Loadout</button>
            <ul>
              {loadouts.map(l => <li key={l.id}>{l.operatorId} - {l.primary}</li>)}
            </ul>
          </div>
        ) : (
          <LoginButton />
        )}
      </div>
    </DeepSpaceProvider>
  );
}
