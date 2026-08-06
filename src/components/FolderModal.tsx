import React, { useState } from 'react';
import { RecipeFolder } from '../types';
import { FolderPlus, X, Folder, Palette } from 'lucide-react';

interface FolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateFolder: (folder: RecipeFolder) => void;
}

const COLOR_OPTIONS = [
  { name: 'Esmeralda', value: 'emerald', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { name: 'Ámbar', value: 'amber', bg: 'bg-amber-100 text-amber-800 border-amber-300' },
  { name: 'Índigo', value: 'indigo', bg: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
  { name: 'Rosa', value: 'rose', bg: 'bg-rose-100 text-rose-800 border-rose-300' },
  { name: 'Cielo', value: 'sky', bg: 'bg-sky-100 text-sky-800 border-sky-300' },
  { name: 'Púrpura', value: 'purple', bg: 'bg-purple-100 text-purple-800 border-purple-300' },
];

export const FolderModal: React.FC<FolderModalProps> = ({
  isOpen,
  onClose,
  onCreateFolder,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('emerald');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newFolder: RecipeFolder = {
      id: `folder-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      color,
      createdAt: new Date().toISOString(),
    };

    onCreateFolder(newFolder);
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-800 text-amber-300 rounded-xl">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold font-serif text-sm uppercase">Nueva Carpeta de Fichas</h3>
              <p className="text-[11px] text-slate-300">Organiza tus fichas técnicas por módulos o temas</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          
          <div>
            <label className="font-bold text-slate-800 block mb-1">Nombre de la Carpeta *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: 1º Grado Medio - Postres Clásicos"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900 focus:ring-2 focus:ring-emerald-800 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Descripción o Notas (Opcional)</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: Fichas técnicas para el examen práctico del segundo trimestre..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900 focus:ring-2 focus:ring-emerald-800 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1.5">Color distintivo</label>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all ${c.bg} ${
                    color === c.value ? 'ring-2 ring-slate-950 scale-105' : 'opacity-70'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-xl text-slate-600 font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-950 text-white font-bold rounded-xl hover:bg-emerald-900"
            >
              Crear Carpeta
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
