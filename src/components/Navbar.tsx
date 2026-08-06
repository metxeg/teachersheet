import React from 'react';
import { RecipeCategory } from '../types';
import {
  ChefHat,
  Sparkles,
  Plus,
  Search,
  BookOpen,
  Calculator,
  Download,
  Upload,
  Layers,
  Utensils,
  RotateCcw
} from 'lucide-react';

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  onOpenAiModal: () => void;
  onOpenCreateModal: () => void;
  onExportJson: () => void;
  onImportJson: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetToSample?: () => void;
  recipeCount: number;
  activeView: 'list' | 'detail' | 'calculator';
  setActiveView: (view: 'list' | 'detail' | 'calculator') => void;
}

const CATEGORIES: ('Todas' | RecipeCategory)[] = [
  'Todas',
  'CREMAS Y SOPAS',
  'PASTELERÍA',
  'COCINA CALIENTE',
  'COCINA FRÍA',
  'PANADERÍA',
  'SALSAS Y FONDOS',
  'POSTRES DE RESTAURANTE',
  'GARDE MANGER',
];

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onOpenAiModal,
  onOpenCreateModal,
  onExportJson,
  onImportJson,
  onResetToSample,
  recipeCount,
  activeView,
  setActiveView,
}) => {
  return (
    <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-md border-b border-slate-800">
      
      {/* Top Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand */}
        <div
          onClick={() => setActiveView('list')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-700 text-white rounded-xl shadow-md group-hover:scale-105 transition-transform">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-lg font-bold tracking-tight text-white group-hover:text-amber-300 transition-colors uppercase">
                TeacherSheet
              </h1>
              <span className="bg-amber-500 text-slate-950 font-extrabold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                Docentes FP
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Fichas Técnicas Oficiales (17 Secciones)
            </p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por técnica, código (ej: CS-01), ingrediente..."
            className="w-full bg-slate-800/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/80 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Actions & View Switcher */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          <button
            onClick={() => setActiveView('list')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeView === 'list'
                ? 'bg-slate-800 text-amber-300 border border-amber-500/30'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Catálogo</span>
          </button>

          <button
            onClick={() => setActiveView('calculator')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeView === 'calculator'
                ? 'bg-slate-800 text-amber-300 border border-amber-500/30'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span className="hidden sm:inline">Escandallo</span>
          </button>

          {/* AI Generator Button */}
          <button
            onClick={onOpenAiModal}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs shadow-md shadow-amber-500/20 transition-all hover:scale-102"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">Crear con IA</span>
          </button>

          {/* Manual Create Button */}
          <button
            onClick={onOpenCreateModal}
            className="p-2 sm:px-3 sm:py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-colors border border-slate-700 flex items-center gap-1.5"
            title="Crear Ficha Manual"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span className="hidden md:inline">Manual</span>
          </button>

          {/* Export / Import / Reset */}
          <div className="hidden lg:flex items-center border-l border-slate-800 pl-2 gap-1">
            <button
              onClick={onExportJson}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Exportar archivo JSON de mis fichas"
            >
              <Download className="w-4 h-4" />
            </button>

            <label
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Importar archivo JSON"
            >
              <Upload className="w-4 h-4" />
              <input
                type="file"
                accept=".json"
                onChange={onImportJson}
                className="hidden"
              />
            </label>

            {onResetToSample && (
              <button
                onClick={onResetToSample}
                className="p-2 text-amber-400/80 hover:text-amber-300 hover:bg-slate-800 rounded-lg transition-colors"
                title="Dejar solo ficha de muestra (Coulant) para compartir la web limpia"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

      </div>

      {/* Category Filter Navigation Bar */}
      {activeView === 'list' && (
        <div className="bg-slate-950/80 border-t border-slate-800 px-4 sm:px-6 lg:px-8 py-2 overflow-x-auto scrollbar-none flex items-center gap-2 text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Módulos / Categorías:
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      )}

    </header>
  );
};
