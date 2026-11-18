import { AppProvider, useApp } from './lib/store.jsx';
import { Header, Toast, AuthModal } from './components/ui.jsx';
import Landing from './pages/Landing.jsx';
import Survey from './pages/Survey.jsx';
import Results from './pages/Results.jsx';
import Compare from './pages/Compare.jsx';
import Detail from './pages/Detail.jsx';
import Saved from './pages/Saved.jsx';

function Router() {
  const { route } = useApp();
  const p = route.path;
  if (p.startsWith('/camera/')) return <Detail id={p.split('/')[2]} />;
  if (p === '/survey') return <Survey />;
  if (p === '/results') return <Results />;
  if (p === '/compare') return <Compare />;
  if (p === '/saved') return <Saved />;
  return <Landing />;
}

export default function App() {
  return (
    <AppProvider>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <div id="main"><Router /></div>
      <Toast />
      <AuthModal />
    </AppProvider>
  );
}
