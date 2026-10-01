import { useState } from 'react';
import { DeepSpaceProvider, useAuth, LoginButton } from 'deepspace';
import './styles/global.css';
import OpRecommender from './components/OpRecommender';
import OperatorBrowser from './components/OperatorBrowser';
import LoadoutManager from './components/LoadoutManager';

export default function App() {
  const { user } = useAuth();
  const [tab, setTab] = useState<'recommend'|'operators'|'loadouts'>('recommend');
  const [selectedOp, setSelectedOp] = useState('sledge');

  return (
    <DeepSpaceProvider>
      <div className="container">
        <header className="header">
          <h1>Rainbow Six Meta Loadouts</h1>
          <div style={{ display:'flex', gap:12, alignItems:'center' }}>
            {user ? (
              <>
                <span className="badge">Welcome {user.name}</span>
                <button className="btn" onClick={() => setTab('loadouts')}>My Loadouts</button>
              </>
            ) : (
              <LoginButton />
            )}
          </div>
        </header>

        <nav style={{ display:'flex', gap:8, marginBottom:20 }}>
          {[
            ['recommend','Recommend Op'],
            ['operators','Operators'],
            ['loadouts','Community Loadouts']
          ].map(([k,label]) => (
            <button
              key={k}
              className={`btn ${tab===k?'primary':''}`}
              onClick={()=>setTab(k as any)}
            >
              {label}
            </button>
          ))}
        </nav>

        {tab==='recommend' && <OpRecommender onPick={(id)=>{setSelectedOp(id); setTab('operators');}} />}
        {tab==='operators' && <OperatorBrowser selectedId={selectedOp} onSelect={setSelectedOp} />}
        {tab==='loadouts' && <LoadoutManager operatorId={selectedOp} />}
      </div>
    </DeepSpaceProvider>
  );
}
