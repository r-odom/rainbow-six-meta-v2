import { useState } from 'react';
import { DeepSpaceProvider, useAuth, LoginButton } from 'deepspace';
import './styles/global.css';
import OpRecommender from './components/OpRecommender';
import OperatorBrowser from './components/OperatorBrowser';
import OperatorDetail from './components/OperatorDetail';
import MyLoadouts from './components/MyLoadouts';

export default function App() {
  const { user } = useAuth();
  const [tab, setTab] = useState<'recommender'|'loadouts'|'my'>('recommender');
  const [selectedOp, setSelectedOp] = useState<string>('sledge');

  return (
    <DeepSpaceProvider>
      <div className="container">
        <header className="header">
          <h1>Rainbow Six Meta Loadouts</h1>
          <div style={{ display:'flex', gap:12, alignItems:'center' }}>
            {user ? (
              <>
                <span className="badge">Welcome {user.name}</span>
                <button className="btn" onClick={() => setTab('my')}>My Loadouts</button>
              </>
            ) : (
              <LoginButton />
            )}
          </div>
        </header>

        <nav style={{ display:'flex', gap:8, marginBottom:20 }}>
          {[
            ['recommender','Op Recommender'],
            ['loadouts','Loadouts'],
            ['my','Your Loadouts']
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

        {tab==='recommender' && <OpRecommender onPick={(id)=>{setSelectedOp(id); setTab('loadouts');}} />}
        {tab==='loadouts' && (
          <div className="grid">
            <OperatorBrowser selectedId={selectedOp} onSelect={setSelectedOp} />
            <OperatorDetail operatorId={selectedOp} />
          </div>
        )}
        {tab==='my' && <MyLoadouts />}
      </div>
    </DeepSpaceProvider>
  );
}
