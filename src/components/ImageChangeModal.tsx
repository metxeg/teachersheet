import React, { useState } from 'react';
import { Sparkles, X, Upload, Link as LinkIcon, Image as ImageIcon, Check, Loader2, RefreshCw } from 'lucide-react';
import { RecipeSheet } from '../types';

interface ImageChangeModalProps {
  isOpen: boolean;
  recipe: RecipeSheet | null;
  onClose: () => void;
  onSaveImage: (recipeId: string, newImageUrl: string) => void;
}

const CULINARY_PRESETS = [
  { name: 'Sopas y Cremas', url: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80' },
  { name: 'Arroces y Paellas', url: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=800&q=80' },
  { name: 'Carnes y Solomillo', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80' },
  { name: 'Pescados y Mariscos', url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80' },
  { name: 'Postres y Tartas', url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80' },
  { name: 'Ensaladas y Huertas', url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80' },
  { name: 'Guisos y Legumbres', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80' },
  { name: 'Pastas y Masas', url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80' },
  { name: 'Croquetas y Tapas', url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80' },
];

export const ImageChangeModal: React.FC<ImageChangeModalProps> = ({
  isOpen,
  recipe,
  onClose,
  onSaveImage,
}) => {
  if (!isOpen || !recipe) return null;

  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'ai' | 'preset'>('upload');
  const [urlInput, setUrlInput] = useState(recipe.imageUrl || '');
  const [previewUrl, setPreviewUrl] = useState<string>(recipe.imageUrl || '');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Por favor selecciona un archivo de imagen (JPG, PNG, WEBP).');
      return;
    }

    setErrorMsg(null);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreviewUrl(result);
      setUrlInput(result);
    };
    reader.readAsDataURL(file);
  };

  const handleAiGenerate = async () => {
    setIsAiLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/generate-dish-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: recipe.title,
          category: recipe.category,
          description: recipe.subtitle,
        }),
      });
      const data = await res.json();
      if (data.imageUrl) {
        setPreviewUrl(data.imageUrl);
        setUrlInput(data.imageUrl);
      } else {
        throw new Error('No se pudo generar la imagen.');
      }
    } catch (err: any) {
      console.error('Error generating image:', err);
      setErrorMsg('Límite de IA alcanzado. Puedes subir una foto desde tu dispositivo o seleccionar una imagen de muestra.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleApply = () => {
    if (!previewUrl) {
      setErrorMsg('Selecciona o introduce una foto válida.');
      return;
    }
    onSaveImage(recipe.id, previewUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-400 text-slate-950 rounded-xl shadow-md">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-serif uppercase tracking-tight">
                Cambiar Foto de Presentación
              </h2>
              <p className="text-xs text-amber-200 truncate max-w-xs">
                {recipe.title}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs">
          
          {/* Current Preview Box */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block uppercase tracking-wider text-[11px]">
              Vista Previa de la Ficha:
            </label>
            <div className="relative h-44 rounded-2xl overflow-hidden border border-slate-300 bg-slate-100 flex items-center justify-center shadow-inner">
              {previewUrl ? (
                <img src={previewUrl} alt="Vista previa" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-4 text-slate-400 space-y-1">
                  <ImageIcon className="w-8 h-8 mx-auto text-slate-300" />
                  <p>Sin foto seleccionada</p>
                </div>
              )}
            </div>
          </div>

          {/* Mode Tabs */}
          <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 font-bold text-[11px]">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`py-2 rounded-xl flex items-center justify-center gap-1 transition-all ${
                activeTab === 'upload' ? 'bg-emerald-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Upload className="w-3.5 h-3.5" /> Subir
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`py-2 rounded-xl flex items-center justify-center gap-1 transition-all ${
                activeTab === 'url' ? 'bg-emerald-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" /> URL
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('ai')}
              className={`py-2 rounded-xl flex items-center justify-center gap-1 transition-all ${
                activeTab === 'ai' ? 'bg-emerald-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> IA
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('preset')}
              className={`py-2 rounded-xl flex items-center justify-center gap-1 transition-all ${
                activeTab === 'preset' ? 'bg-emerald-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" /> Galería
            </button>
          </div>

          {/* TAB 1: FILE UPLOAD */}
          {activeTab === 'upload' && (
            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <label className="block text-slate-700 font-bold">
                Selecciona una foto desde tu dispositivo (PC, Móvil, Tablet):
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="block w-full text-xs text-slate-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-900 file:text-white hover:file:bg-emerald-800 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">Soporta JPG, PNG, WEBP y fotos de cámara.</p>
            </div>
          )}

          {/* TAB 2: URL INPUT */}
          {activeTab === 'url' && (
            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <label className="block text-slate-700 font-bold">
                Pega la dirección URL directa de la imagen:
              </label>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => {
                  setUrlInput(e.target.value);
                  setPreviewUrl(e.target.value);
                }}
                placeholder="https://ejemplo.com/foto-plato.jpg"
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 font-mono text-xs focus:ring-2 focus:ring-emerald-800 focus:outline-none"
              />
            </div>
          )}

          {/* TAB 3: GENERATE WITH AI */}
          {activeTab === 'ai' && (
            <div className="space-y-3 bg-amber-50/70 p-4 rounded-2xl border border-amber-200">
              <p className="text-amber-950 font-semibold">
                Genera una fotografía gastronómica de nivel Estrella Michelin adaptada a <strong>"{recipe.title}"</strong>.
              </p>

              <button
                type="button"
                onClick={handleAiGenerate}
                disabled={isAiLoading}
                className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 px-4 rounded-xl shadow-md transition-all disabled:opacity-50"
              >
                {isAiLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Fotografiando plato con IA...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>Generar Foto Gastronómica con IA</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* TAB 4: PRESETS GALLERY */}
          {activeTab === 'preset' && (
            <div className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-200 max-h-48 overflow-y-auto">
              <p className="text-slate-600 font-bold text-[11px] mb-2">Selecciona una foto temática de la biblioteca:</p>
              <div className="grid grid-cols-3 gap-2">
                {CULINARY_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setPreviewUrl(p.url);
                      setUrlInput(p.url);
                    }}
                    className="relative rounded-xl overflow-hidden border-2 hover:border-emerald-700 transition-all group h-16 text-left"
                  >
                    <img src={p.url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <span className="absolute inset-x-0 bottom-0 bg-slate-950/80 text-white text-[9px] font-bold p-1 truncate">
                      {p.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl font-medium text-xs">
              {errorMsg}
            </div>
          )}

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleApply}
              className="flex items-center gap-2 px-5 py-2 bg-emerald-900 hover:bg-emerald-950 text-white font-bold rounded-xl shadow-md transition-all"
            >
              <Check className="w-4 h-4 text-amber-400" />
              <span>Guardar Nueva Foto</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
