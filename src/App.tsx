import { DeepSpaceProvider, useAuth, LoginButton } from 'deepspace';
import { useLoadouts } from './hooks/useLoadouts';

export default function App() {
  const { user } = useAuth();
  const { loadouts, createLoadout } = useLoadouts();

  return (
    <DeepSpaceProvider>
      <div>
        <h1>Rainbow Six Meta Loadouts</h1>
        {user ? (
          <div>
            <p>Welcome {user.name}</p>
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
