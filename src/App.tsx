import { CreateTemplate } from './components/DocumentManagement';

function App() {
  const handleSave = (template: any) => {
    console.log('Saved Template:', template);
    alert(`Template "${template.name}" successfully compiled and saved!\nCheck console logs for the full serialized template model.`);
  };

  const handleAutosave = (template: any) => {
    console.log('Autosaved Template:', template);
  };

  return (
    <div className="w-screen h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <div className="bg-indigo-900 text-white px-6 py-2.5 flex items-center justify-between border-b border-indigo-950 shadow-sm shrink-0">
        <div className="flex items-center space-x-2">
          <div className="h-6 w-6 rounded-lg bg-white/10 flex items-center justify-center">
            <span className="font-bold text-xs">O</span>
          </div>
          <div>
            <h1 className="text-xs font-bold uppercase tracking-widest text-indigo-200">Orbit UI Toolkit</h1>
            <h2 className="text-[10px] font-bold text-slate-300">Document Management Portal</h2>
          </div>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="text-[9px] font-semibold bg-white/10 px-2 py-0.5 rounded text-indigo-200 border border-indigo-800">V0.1.29</span>
        </div>
      </div>
      <div className="flex-grow min-h-0 overflow-hidden">
        <CreateTemplate
          onSave={handleSave}
          onAutosave={handleAutosave}
        />
      </div>
    </div>
  );
}

export default App;
