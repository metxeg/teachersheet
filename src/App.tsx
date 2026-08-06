import React, { useState, useEffect } from 'react';
import { RecipeFolder, RecipeSheet } from './types';
import { SAMPLE_RECIPES } from './data/sampleRecipes';
import { Navbar } from './components/Navbar';
import { OfficialPdfSheetView } from './components/OfficialPdfSheetView';
import { RecipeModalEditor } from './components/RecipeModalEditor';
import { AIGeneratorModal } from './components/AIGeneratorModal';
import { FolderModal } from './components/FolderModal';
import { ImageChangeModal } from './components/ImageChangeModal';
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal';
import { AllergensBadgeList } from './components/AllergensBadgeList';
import { calculateRecipeSheetCosts, formatCurrency } from './utils/calculations';
import {
  ChefHat,
  Sparkles,
  Heart,
  Calculator,
  FolderPlus,
  Folder,
  FolderOpen,
  Trash2,
  Download,
  Image as ImageIcon,
  RotateCcw
} from 'lucide-react';

const STORAGE_KEY_RECIPES = 'teachersheet_docentes_recipes_v3';
const LEGACY_STORAGE_KEY_RECIPES = 'chefsheet_docentes_recipes_v3';
const STORAGE_KEY_FOLDERS = 'teachersheet_docentes_folders_v3';
const LEGACY_STORAGE_KEY_FOLDERS = 'chefsheet_docentes_folders_v3';

const DEFAULT_FOLDERS: RecipeFolder[] = [
  {
    id: 'f-gm-cocina',
    name: '1º Grado Medio - Cocina Culinaria',
    description: 'Fichas técnicas para módulos de preelaboración y técnicas básicas',
    color: 'emerald',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'f-gs-pasteleria',
    name: '2º Grado Superior - Pastelería & Repostería',
    description: 'Procesos avanzados de pastelería, postres de restaurante y chocolatería',
    color: 'amber',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'f-panaderia',
    name: 'Taller de Panadería & Masas',
    description: 'Elaboraciones con fermentación dirigida y masa madre',
    color: 'indigo',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'f-examenes',
    name: 'Exámenes Prácticos Taller',
    description: 'Pruebas de evaluación continua e incitación de servicio',
    color: 'rose',
    createdAt: new Date().toISOString(),
  },
];

export default function App() {
  const [folders, setFolders] = useState<RecipeFolder[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FOLDERS) || localStorage.getItem(LEGACY_STORAGE_KEY_FOLDERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading folders:', e);
    }
    return DEFAULT_FOLDERS;
  });

  const [recipes, setRecipes] = useState<RecipeSheet[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RECIPES) || localStorage.getItem(LEGACY_STORAGE_KEY_RECIPES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading recipes:', e);
    }
    return SAMPLE_RECIPES.map((r, idx) => ({
      ...r,
      folderId: idx === 0 ? 'f-gm-cocina' : 'f-gs-pasteleria',
    }));
  });

  const [activeView, setActiveView] = useState<'list' | 'detail' | 'calculator'>('list');
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeSheet | null>(SAMPLE_RECIPES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [selectedFolderId, setSelectedFolderId] = useState<string>('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [recipeToEdit, setRecipeToEdit] = useState<RecipeSheet | null>(null);
  const [recipeToDelete, setRecipeToDelete] = useState<RecipeSheet | null>(null);
  const [recipeForImageModal, setRecipeForImageModal] = useState<RecipeSheet | null>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleResetToSample = () => {
    const defaultSample = SAMPLE_RECIPES.map((r) => ({
      ...r,
      folderId: 'f-gs-pasteleria',
    }));
    setRecipes(defaultSample);
    setSelectedRecipe(defaultSample[0]);
    showToast('Catálogo restablecido.');
    setIsResetModalOpen(false);
  };

  const handleUpdateRecipeImage = (recipeId: string, newImageUrl: string) => {
    setRecipes((prev) =>
      prev.map((r) => (r.id === recipeId ? { ...r, imageUrl: newImageUrl, updatedAt: new Date().toISOString() } : r))
    );
    if (selectedRecipe && selectedRecipe.id === recipeId) {
      setSelectedRecipe((prev) => (prev ? { ...prev, imageUrl: newImageUrl, updatedAt: new Date().toISOString() } : null));
    }
    showToast('Imagen actualizada.');
  };

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_RECIPES, JSON.stringify(recipes));
    } catch (e) {
      console.error('Error saving recipes:', e);
    }
  }, [recipes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FOLDERS, JSON.stringify(folders));
    } catch (e) {
      console.error('Error saving folders:', e);
    }
  }, [folders]);

  const filteredRecipes = recipes.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.ingredients.some((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'Todas' || r.category === selectedCategory;
    const matchesFavorite = !onlyFavorites || r.isFavorite;
    const matchesFolder =
      selectedFolderId === 'all' ||
      (selectedFolderId === 'none' ? !r.folderId : r.folderId === selectedFolderId);
    return matchesSearch && matchesCategory && matchesFavorite && matchesFolder;
  });

  const handleCreateFolder = (newFolder: RecipeFolder) => {
    setFolders([...folders, newFolder]);
    setSelectedFolderId(newFolder.id);
    showToast(`Carpeta "${newFolder.name}" creada.`);
  };

  const handleDeleteFolder = (folderId: string) => {
    setRecipes((prev) =>
      prev.map((r) => (r.folderId === folderId ? { ...r, folderId: undefined } : r))
    );
    setFolders((prev) => prev.filter((f) => f.id !== folderId));
    if (selectedFolderId === folderId) {
      setSelectedFolderId('all');
    }
    showToast('Carpeta eliminada.');
  };

  const handleMoveRecipeFolder = (recipeId: string, folderId: string) => {
    const targetFId = folderId === '' ? undefined : folderId;
    setRecipes((prev) =>
      prev.map((r) => (r.id === recipeId ? { ...r, folderId: targetFId } : r))
    );
    showToast('Ficha trasladada.');
  };

  const handleSelectRecipe = (recipe: RecipeSheet) => {
    setSelectedRecipe(recipe);
    setActiveView('detail');
  };

  const handleToggleFavorite = (id: string) => {
    setRecipes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isFavorite: !r.isFavorite } : r))
    );
    if (selectedRecipe && selectedRecipe.id === id) {
      setSelectedRecipe((prev) => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null));
    }
  };

  const handleDeleteRecipe = (id: string) => {
    setRecipes((prev) => prev.filter((r) => r.id !== id));
    if (selectedRecipe && selectedRecipe.id === id) {
      setSelectedRecipe(null);
      setActiveView('list');
    }
    showToast('Ficha eliminada.');
  };

  const handleDuplicateRecipe = (recipe: RecipeSheet) => {
    const duplicated: RecipeSheet = {
      ...recipe,
      id: `copy-${Date.now()}`,
      code: `${recipe.code}-C`,
      title: `${recipe.title} (Copia)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setRecipes([duplicated, ...recipes]);
    setSelectedRecipe(duplicated);
    setActiveView('detail');
    showToast('Ficha duplicada.');
  };

  const handleSaveRecipe = (saved: RecipeSheet) => {
    const exists = recipes.some((r) => r.id === saved.id);
    if (exists) {
      setRecipes((prev) => prev.map((r) => (r.id === saved.id ? saved : r)));
    } else {
      setRecipes([saved, ...recipes]);
    }
    setSelectedRecipe(saved);
    setActiveView('detail');
    showToast('Ficha guardada.');
  };

  const handleRecipeGenerated = (newRecipe: RecipeSheet) => {
    setRecipes([newRecipe, ...recipes]);
    setSelectedRecipe(newRecipe);
    setActiveView('detail');
    showToast('✨ Ficha generada por IA.');
  };

  const handleGenerateImage = async (recipe: RecipeSheet) => {
    setIsGeneratingImage(true);
    try {
      const res = await fetch('https://teachersheets.onrender.com/api/index.py', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receta: `${recipe.title} - ${recipe.subtitle || 'Receta gastronómica'}`
        }),
      });
      const data = await res.json();
      if (data.ficha) {
        const updated = { 
          ...recipe, 
          description: data.ficha,
          updatedAt: new Date().toISOString() 
        };
        handleSaveRecipe(updated);
        showToast('✨ Ficha técnica generada.');
      } else {
        showToast('No se pudo generar la ficha.');
      }
    } catch (e) {
      console.error('Error:', e);
      showToast('Error al conectar con la IA.');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(recipes, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Fichas_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('JSON exportado.');
  };

  const handleExportFolderJson = (folder: RecipeFolder) => {
    const folderRecipes = recipes.filter((r) => r.folderId === folder.id);
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(folderRecipes, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Dossier_${folder.name.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast(`Dossier "${folder.name}" exportado.`);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          setRecipes((prev) => [...imported, ...prev]);
          showToast(`Se importaron ${imported.length} fichas.`);
        }
      } catch (err) {
        alert('Formato JSON no válido.');
      }
    };
    reader.readAsText(file);
  };

  const currentFolder = folders.find((f) => f.id === selectedFolderId);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col">
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onOpenAiModal={() => setIsAiModalOpen(true)}
        onOpenCreateModal={() => {
          setRecipeToEdit(null);
          setIsEditorOpen(true);
        }}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
        onResetToSample={() => setIsResetModalOpen(true)}
        recipeCount={recipes.length}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-800 text-xs font-semibold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeView === 'list' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-emerald-800" />
                  <h2 className="font-serif font-bold text-sm uppercase text-slate-900">
                    Archivador de Carpetas Culinarias
                  </h2>
                  <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[11px] font-bold">
                    {folders.length} Carpetas
                  </span>
                </div>
                <button
                  onClick={() => setIsFolderModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl transition-all"
                >
                  <FolderPlus className="w-4 h-4 text-amber-400" />
                  <span>Nueva Carpeta</span>
                </button>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
                <button
                  onClick={() => setSelectedFolderId('all')}
                  className={`px-3.5 py-2 rounded-2xl font-bold flex items-center gap-2 shrink-0 border transition-all ${
                    selectedFolderId === 'all'
                      ? 'bg-slate-900 text-amber-300 border-slate-900 shadow-md'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Folder className="w-4 h-4" />
                  <span>Todas las Fichas</span>
                  <span className="bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded-md text-[10px]">
                    {recipes.length}
                  </span>
                </button>
                {folders.map((f) => {
                  const count = recipes.filter((r) => r.folderId === f.id).length;
                  const isSelected = selectedFolderId === f.id;
                  return (
                    <div key={f.id} className="relative group shrink-0">
                      <button
                        onClick={() => setSelectedFolderId(f.id)}
                        className={`px-3.5 py-2 rounded-2xl font-bold flex items-center gap-2 border transition-all ${
                          isSelected
                            ? 'bg-emerald-900 text-white border-emerald-900 shadow-md'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <Folder className={`w-4 h-4 ${isSelected ? 'text-amber-300' : 'text-emerald-700'}`} />
                        <span>{f.name}</span>
                        <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                          isSelected ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-200 text-slate-800 font-bold'
                        }`}>
                          {count}
                        </span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFolder(f.id);
                        }}
                        className="absolute -top-1 -right-1 hidden group-hover:flex p-1 bg-rose-600 text-white rounded-full hover:bg-rose-700 shadow-md"
                        title="Eliminar carpeta"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
                {recipes.some((r) => !r.folderId) && (
                  <button
                    onClick={() => setSelectedFolderId('none')}
                    className={`px-3 py-2 rounded-2xl font-semibold flex items-center gap-1.5 shrink-0 border transition-all ${
                      selectedFolderId === 'none'
                        ? 'bg-slate-800 text-white border-slate-800'
                        : 'bg-slate-50 text-slate-500 border-slate-200'
                    }`}
                  >
                    <span>Sin Carpeta</span>
                    <span className="bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded text-[10px] font-bold">
                      {recipes.filter((r) => !r.folderId).length}
                    </span>
                  </button>
                )}
              </div>
              {currentFolder && (
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <p className="italic">📁 <strong>{currentFolder.name}:</strong> {currentFolder.description || 'Sin descripción'}</p>
                  <button
                    onClick={() => handleExportFolderJson(currentFolder)}
                    className="flex items-center gap-1 font-bold text-emerald-800 hover:text-emerald-950 text-[11px]"
                  >
                    <Download className="w-3.5 h-3.5" /> Exportar Dossier
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800">Catálogo General</span>
                <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-xs font-bold">
                  {filteredRecipes.length} Fichas
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <button
                  onClick={() => setOnlyFavorites(!onlyFavorites)}
                  className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-semibold transition-all ${
                    onlyFavorites
                      ? 'bg-rose-50 text-rose-700 border-rose-300'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-rose-600' : ''}`} />
                  <span>Favoritas</span>
                </button>
                <button
                  onClick={() => setIsResetModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold transition-all flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                  <span>Modo Limpio</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes.map((recipe) => {
                const costs = calculateRecipeSheetCosts(recipe);
                const recipeFolder = folders.find((f) => f.id === recipe.folderId);
                return (
                  <div
                    key={recipe.id}
                    onClick={() => handleSelectRecipe(recipe)}
                    className="bg-white border border-slate-200 rounded-2xl shadow-2xs hover:shadow-lg transition-all duration-200 overflow-hidden group cursor-pointer flex flex-col hover:-translate-y-0.5"
                  >
                    <div className="relative h-44 bg-emerald-950 overflow-hidden">
                      {recipe.imageUrl ? (
                        <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-tr from-emerald-950 via-emerald-900 to-slate-900 p-6 flex flex-col justify-between">
                          <span className="font-mono text-amber-400 font-bold text-xs">{recipe.code}</span>
                          <ChefHat className="w-12 h-12 text-white/20 self-center" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                        <span className="bg-emerald-900/90 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md border border-white/20 uppercase">
                          {recipe.category}
                        </span>
                        {recipeFolder && (
                          <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                            <Folder className="w-3 h-3" /> {recipeFolder.name}
                          </span>
                        )}
                      </div>
                      <div className="absolute top-3 right-3 flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setRecipeForImageModal(recipe);
                          }}
                          className="p-2 rounded-xl bg-slate-950/60 backdrop-blur-xs text-white hover:bg-slate-900 transition-colors"
                          title="Cambiar Foto"
                        >
                          <ImageIcon className="w-4 h-4 text-amber-400" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleFavorite(recipe.id);
                          }}
                          className="p-2 rounded-xl bg-slate-950/60 backdrop-blur-xs text-white hover:bg-slate-900 transition-colors"
                          title="Favorito"
                        >
                          <Heart className={`w-4 h-4 ${recipe.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setRecipeToDelete(recipe);
                          }}
                          className="p-2 rounded-xl bg-slate-950/60 backdrop-blur-xs text-rose-300 hover:bg-rose-900 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                          <span className="text-emerald-800 font-bold">{recipe.code}</span>
                          <span>Nivel: {recipe.recommendedLevel}</span>
                        </div>
                        <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-2 font-serif uppercase">
                          {recipe.title}
                        </h3>
                        {recipe.subtitle && (
                          <p className="text-xs text-slate-500 line-clamp-2 italic">{recipe.subtitle}</p>
                        )}
                      </div>
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]" onClick={(e) => e.stopPropagation()}>
                        <span className="text-slate-500 font-semibold flex items-center gap-1">
                          <Folder className="w-3.5 h-3.5 text-amber-600" /> Carpeta:
                        </span>
                        <select
                          value={recipe.folderId || ''}
                          onChange={(e) => handleMoveRecipeFolder(recipe.id, e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded-lg p-1 text-[11px] font-bold text-slate-800 focus:outline-none"
                        >
                          <option value="">Sin carpeta</option>
                          {folders.map((f) => (
                            <option key={f.id} value={f.id}>{f.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="pt-2 border-t border-slate-100">
                        <AllergensBadgeList recipeAllergens={recipe.allergens} size="sm" />
                      </div>
                      <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-1.5 sm:gap-2 text-center text-[11px]">
                        <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200 min-w-0">
                          <span className="block text-[9px] text-slate-400 uppercase font-semibold truncate">Raciones</span>
                          <span className="font-bold text-slate-800">{recipe.generalData.portions}</span>
                        </div>
                        <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200 min-w-0">
                          <span className="block text-[9px] text-slate-400 uppercase font-semibold truncate">Tiempo</span>
                          <span className="font-bold text-slate-800">{recipe.generalData.totalMinutes}m</span>
                        </div>
                        <div className="bg-emerald-50 p-1.5 rounded-lg border border-emerald-200 min-w-0">
                          <span className="block text-[9px] text-emerald-800 uppercase font-semibold truncate">Coste/Rac</span>
                          <span className="font-extrabold text-emerald-950 truncate block">{formatCurrency(costs.costPerPortionBase)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeView === 'detail' && selectedRecipe && (
          <OfficialPdfSheetView
            recipe={selectedRecipe}
            onBack={() => setActiveView('list')}
            onEdit={(r) => {
              setRecipeToEdit(r);
              setIsEditorOpen(true);
            }}
            onDuplicate={handleDuplicateRecipe}
            onDelete={handleDeleteRecipe}
            onUpdateImage={handleUpdateRecipeImage}
            onGenerateImage={handleGenerateImage}
            isGeneratingImage={isGeneratingImage}
            folders={folders}
            onMoveFolder={(id, fId) => {
              handleMoveRecipeFolder(id, fId);
              if (selectedRecipe && selectedRecipe.id === id) {
                setSelectedRecipe((prev) => (prev ? { ...prev, folderId: fId || undefined } : null));
              }
            }}
          />
        )}

        {activeView === 'calculator' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="p-3 bg-emerald-900 text-amber-400 rounded-2xl">
                  <Calculator className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 font-serif">
                    Escandallo Global de Costes
                  </h2>
                  <p className="text-xs text-slate-500">
                    Cálculo de costo de materia prima y PVP recomendado
                  </p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-emerald-900 text-white border-b border-slate-200 font-bold uppercase text-[11px]">
                      <th className="py-3 px-4">Código / Receta</th>
                      <th className="py-3 px-3">Categoría</th>
                      <th className="py-3 px-3">Carpeta</th>
                      <th className="py-3 px-3 text-center">Raciones</th>
                      <th className="py-3 px-3 text-right">Costo M.P. Total</th>
                      <th className="py-3 px-3 text-right">Costo por Ración</th>
                      <th className="py-3 px-3 text-right">PVP S/IVA</th>
                      <th className="py-3 px-4 text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recipes.map((r) => {
                      const costs = calculateRecipeSheetCosts(r);
                      const f = folders.find((fol) => fol.id === r.folderId);
                      return (
                        <tr key={r.id} className="hover:bg-slate-50">
                          <td className="py-3 px-4">
                            <span className="font-mono text-[10px] text-emerald-800 font-bold block">{r.code}</span>
                            <span className="font-bold text-slate-900 text-xs uppercase">{r.title}</span>
                          </td>
                          <td className="py-3 px-3 text-slate-600 font-medium">{r.category}</td>
                          <td className="py-3 px-3 text-slate-600 font-semibold">{f ? f.name : '—'}</td>
                          <td className="py-3 px-3 text-center font-bold text-slate-800">{r.generalData.portions}</td>
                          <td className="py-3 px-3 text-right font-bold text-slate-900">{formatCurrency(costs.totalRawMaterialCostBase)}</td>
                          <td className="py-3 px-3 text-right font-black text-emerald-900">{formatCurrency(costs.costPerPortionBase)}</td>
                          <td className="py-3 px-3 text-right font-medium text-slate-800">{formatCurrency(costs.suggestedPvpNoIva)}</td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => handleSelectRecipe(r)}
                              className="px-3 py-1 bg-emerald-900 text-white rounded-lg text-xs font-bold hover:bg-emerald-800"
                            >
                              Ver Ficha
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      <AIGeneratorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onRecipeGenerated={handleRecipeGenerated}
        folders={folders}
        selectedFolderId={selectedFolderId !== 'all' && selectedFolderId !== 'none' ? selectedFolderId : undefined}
      />

      <RecipeModalEditor
        isOpen={isEditorOpen}
        initialRecipe={recipeToEdit}
        folders={folders}
        onClose={() => {
          setIsEditorOpen(false);
          setRecipeToEdit(null);
        }}
        onSave={handleSaveRecipe}
      />

      <FolderModal
        isOpen={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
        onCreateFolder={handleCreateFolder}
      />

      <ImageChangeModal
        isOpen={Boolean(recipeForImageModal)}
        recipe={recipeForImageModal}
        onClose={() => setRecipeForImageModal(null)}
        onSaveImage={handleUpdateRecipeImage}
      />

      <ConfirmDeleteModal
        isOpen={Boolean(recipeToDelete)}
        title="Eliminar Ficha Técnica"
        message={`¿Estás seguro de que deseas eliminar permanentemente la ficha técnica "${recipeToDelete?.title}"?`}
        onClose={() => setRecipeToDelete(null)}
        onConfirm={() => {
          if (recipeToDelete) {
            handleDeleteRecipe(recipeToDelete.id);
            setRecipeToDelete(null);
          }
        }}
      />

      <ConfirmDeleteModal
        isOpen={isResetModalOpen}
        title="Modo Limpio para Compartir"
        message="¿Deseas restablecer el catálogo para dejar ÚNICAMENTE la ficha técnica de muestra (Coulant de Chocolate 70%)?"
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleResetToSample}
      />
    </div>
  );
}
