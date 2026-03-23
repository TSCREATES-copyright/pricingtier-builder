import React, { useState, useEffect } from 'react';
import { PricingProject } from '../types/pricing';
import { saveProject, getProjects, deleteProject, clearAllProjects } from '../systems/storageManager';
import { Save, FolderOpen, Trash2, X, AlertOctagon } from 'lucide-react';
import { useToast } from '../hooks/useToast';

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentProject: PricingProject;
  onLoadProject: (project: PricingProject) => void;
}

export function HistoryPanel({ isOpen, onClose, currentProject, onLoadProject }: HistoryPanelProps) {
  const [projects, setProjects] = useState<PricingProject[]>([]);
  const [saveName, setSaveName] = useState('');
  const { toast, confirmDestructive } = useToast();

  useEffect(() => {
    if (isOpen) {
      setProjects(getProjects());
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!saveName.trim()) return;
    const newProject = {
      ...currentProject,
      id: Date.now().toString(),
      name: saveName,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const success = saveProject(newProject);
    if (success) {
      setProjects(getProjects());
      setSaveName('');
      toast('Project saved successfully.', 'success');
    } else {
      toast('Failed to save project. Storage full.', 'error');
    }
  };

  const handleDelete = (id: string) => {
    confirmDestructive('Are you sure you want to delete this? 🗑️', () => {
      deleteProject(id);
      setProjects(getProjects());
      toast('Project deleted.', 'info');
    });
  };

  const handleClearAll = () => {
    confirmDestructive('Are you sure you want to delete ALL saved projects? This cannot be undone. 🚨', () => {
      clearAllProjects();
      setProjects([]);
      toast('All projects cleared.', 'info');
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-zinc-900/20 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]">
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-zinc-900">Project Library</h3>
            {projects.length > 0 && (
              <button 
                onClick={handleClearAll}
                className="text-xs font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2 py-1 rounded transition-colors flex items-center gap-1"
              >
                <AlertOctagon className="w-3 h-3" />
                Clear All
              </button>
            )}
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-600 rounded-md hover:bg-zinc-100">
            <X className="w-5 h-5" />
          </button>
        </div>
            
            <div className="p-4 border-b border-zinc-100">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Name this experiment..." 
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
                <button 
                  onClick={handleSave}
                  disabled={!saveName.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium text-sm hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {projects.length === 0 ? (
                <p className="text-center text-zinc-500 text-sm py-8">No saved projects yet.</p>
              ) : (
                projects.map(p => (
                  <div key={p.id} className="flex items-center justify-between p-3 rounded-lg border border-zinc-100 hover:border-zinc-200 hover:bg-zinc-50 group transition-colors">
                    <div>
                      <p className="font-medium text-sm text-zinc-900">{p.name}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {new Date(p.createdAt).toLocaleDateString()} • {p.input.productType}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => { onLoadProject(p); onClose(); toast('Project loaded.', 'info'); }}
                        className="px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-md hover:bg-emerald-100"
                      >
                        Load
                      </button>
                      <button 
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
  );
}
