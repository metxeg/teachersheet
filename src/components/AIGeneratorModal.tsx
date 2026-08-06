import React, { useState } from 'react';
import { EducationalLevel, RecipeCategory, RecipeFolder, RecipeSheet } from '../types';
import {
  Sparkles,
  X,
  ChefHat,
  Loader2,
  AlertCircle,
  Wand2,
  Link,
  FileText,
  Upload,
  Image as ImageIcon,
  FolderPlus,
  Check,
  FileSpreadsheet,
  Globe
} from 'lucide-react';

interface AIGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecipeGenerated: (recipe: RecipeSheet) => void;
  folders?: RecipeFolder[];
  selectedFolderId?: string;
}

type ImportSourceTab = 'url' | 'file' | 'prompt';

export const AIGeneratorModal: React.FC<AIGeneratorModalProps> = ({
  isOpen,
  onClose,
  onRecipeGenerated,
  folders = [],
  selectedFolderId,
}) => {
  const [activeTab, setActiveTab] = useState<ImportSourceTab>('url');

  // Input states
  const [urlInput, setUrlInput] = useState('');
  const [promptInput, setPromptInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);

  // Educator parameters
  const [category, setCategory] = useState<RecipeCategory>('CREMAS Y SOPAS');
  const [educationalLevel, setEducationalLevel] = useState<EducationalLevel>('Grado Medio');
  const [portions, setPortions] = useState(10);
  const [targetCost, setTargetCost] = useState(30);
  const [targetFolderId, setTargetFolderId] = useState<string>(selectedFolderId || '');
  const [customNotes, setCustomNotes] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);

    if (selected.type.startsWith('image/')) {
      const url = URL.createObjectURL(selected);
      setFilePreviewUrl(url);
    } else {
      setFilePreviewUrl(null);
    }
  };

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setStatusMessage('Analizando receta con IA y rellenando 17 secciones oficiales...');

    try {
      let reqBody: any = {
        category,
        educationalLevel,
        portions,
        targetCost,
        customNotes,
      };

      if (activeTab === 'url') {
        if (!urlInput.trim()) {
          throw new Error('Por favor introduce una URL válida.');
        }
        reqBody.inputType = 'url';
        reqBody.url = urlInput.trim();
      } else if (activeTab === 'file') {
        if (!file) {
          throw new Error('Por favor selecciona un archivo o foto de la receta.');
        }

        reqBody.inputType = 'file';
        reqBody.fileName = file.name;

        const isPdf = file.type === 'application/pdf' || file.type.includes('pdf') || file.name.toLowerCase().endsWith('.pdf');
        const isImage = file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif|bmp)$/i.test(file.name);

        reqBody.mimeType = isPdf ? 'application/pdf' : (isImage ? (file.type || 'image/jpeg') : file.type);

        // If file is image or pdf -> read as Base64 for Gemini vision/document parser
        if (isPdf || isImage) {
          const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              const res = reader.result as string;
              const commaIdx = res.indexOf(',');
              resolve(commaIdx !== -1 ? res.slice(commaIdx + 1) : res);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
          reqBody.fileDataBase64 = base64;
        } else {
          // Plain text / CSV / Docx text
          const textContent = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsText(file);
          });
          reqBody.fileText = textContent;
        }
      } else {
        if (!promptInput.trim()) {
          throw new Error('Por favor describe la receta o escribe el texto.');
        }
        reqBody.inputType = 'text';
        reqBody.fileText = promptInput.trim();
      }

      const response = await fetch('/api/import-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqBody),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Error al procesar e importar la receta.');
      }

      const newRecipe: RecipeSheet = await response.json();
      if (targetFolderId) {
        newRecipe.folderId = targetFolderId;
      }

      onRecipeGenerated(newRecipe);
      onClose();
    } catch (err: any) {
      console.error('Error importing recipe:', err);
      setErrorMessage(err?.message || 'Error al transformar la receta.');
    } finally {
      setIsLoading(false);
      setStatusMessage('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-400 text-slate-950 rounded-xl shadow-md">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif text-white uppercase">
                Importador Universal de Recetas con IA
              </h2>
              <p className="text-xs text-amber-200">
                Transforma cualquier URL, Foto, PDF, Word, Excel o Texto a Ficha Oficial (17 Secciones FP)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleImport} className="p-6 space-y-5 text-xs">
          
          {/* Source Tabs */}
          <div className="space-y-2">
            <label className="font-bold text-slate-800 uppercase tracking-wider block">
              1. Selecciona el Formato de Origen:
            </label>
            <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
              
              <button
                type="button"
                onClick={() => setActiveTab('url')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold transition-all ${
                  activeTab === 'url'
                    ? 'bg-emerald-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Globe className="w-4 h-4 text-amber-400" />
                <span>Enlace / URL</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('file')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold transition-all ${
                  activeTab === 'file'
                    ? 'bg-emerald-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Upload className="w-4 h-4 text-amber-400" />
                <span>Foto / PDF / Doc</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('prompt')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold transition-all ${
                  activeTab === 'prompt'
                    ? 'bg-emerald-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Wand2 className="w-4 h-4 text-amber-400" />
                <span>Texto / Idea</span>
              </button>

            </div>
          </div>

          {/* TAB 1: URL */}
          {activeTab === 'url' && (
            <div className="space-y-2 bg-emerald-50/50 border border-emerald-200 p-4 rounded-2xl">
              <label className="font-bold text-emerald-950 flex items-center gap-1.5">
                <Link className="w-4 h-4 text-emerald-700" />
                Pegar enlace web de la receta (Blogs, webs de cocina, Google Docs públicos...)
              </label>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://www.ejemplo.com/receta-tartaleta-de-limon"
                className="w-full bg-white border border-slate-300 rounded-xl p-3 font-mono text-xs text-slate-900 focus:ring-2 focus:ring-emerald-800 focus:outline-none"
              />
              <p className="text-[11px] text-slate-500 italic">
                💡 La IA extraerá los ingredientes y pasos de la web y creará la ficha técnica pedagógica de 17 secciones.
              </p>
            </div>
          )}

          {/* TAB 2: FILE UPLOAD */}
          {activeTab === 'file' && (
            <div className="space-y-3 bg-slate-50 border border-slate-200 p-4 rounded-2xl">
              <label className="font-bold text-slate-900 flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-amber-600" />
                Subir Foto/Escaneo, PDF, Documento Word (.docx) o Excel (.xlsx/.csv)
              </label>

              <div className="border-2 border-dashed border-slate-300 hover:border-emerald-700 rounded-2xl p-6 text-center cursor-pointer bg-white transition-colors">
                <input
                  type="file"
                  id="recipe-file-input"
                  accept="image/*,application/pdf,.doc,.docx,.txt,.csv,.xlsx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="recipe-file-input" className="cursor-pointer block space-y-2">
                  {filePreviewUrl ? (
                    <div className="relative max-h-36 overflow-hidden rounded-xl mx-auto inline-block border">
                      <img src={filePreviewUrl} alt="Vista previa" className="h-32 object-contain" />
                    </div>
                  ) : file ? (
                    <div className="flex items-center justify-center gap-2 text-emerald-800 font-bold">
                      <FileCheck className="w-6 h-6" />
                      <span>{file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex justify-center gap-3 text-slate-400 my-1">
                        <ImageIcon className="w-6 h-6 text-emerald-800" />
                        <FileText className="w-6 h-6 text-amber-600" />
                        <FileSpreadsheet className="w-6 h-6 text-indigo-600" />
                      </div>
                      <p className="font-bold text-slate-800">Haz clic o arrastra aquí tu archivo o foto de receta</p>
                      <p className="text-[11px] text-slate-500">
                        Soporta imágenes (JPG, PNG), escaneos de libros, documentos PDF, Word o libros de Excel
                      </p>
                      <p className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 border border-emerald-200 rounded-lg py-1 px-2.5 inline-block mt-1">
                        ✨ La IA analiza el documento completo y extraerá el 100% de los ingredientes (incluidos marinados, caldos, especias y aceites).
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          )}

          {/* TAB 3: PROMPT / RAW TEXT */}
          {activeTab === 'prompt' && (
            <div className="space-y-2 bg-amber-50/50 border border-amber-200 p-4 rounded-2xl">
              <label className="font-bold text-slate-900 flex items-center gap-1.5">
                <Wand2 className="w-4 h-4 text-amber-600" />
                Escribir nombre o pegar texto bruto de la receta
              </label>
              <textarea
                rows={3}
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder="Ej: Focaccia artesanal de romero y aceitunas negras con masa madre hidratada al 75%..."
                className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          )}

          {/* Educator Parameters */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <span className="font-bold text-slate-800 uppercase tracking-wider block">
              2. Parámetros de Formación Profesional
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              <div>
                <label className="font-bold text-slate-700">Categoría Culinaria</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as RecipeCategory)}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2 font-semibold text-slate-900"
                >
                  <option value="CREMAS Y SOPAS">CREMAS Y SOPAS</option>
                  <option value="PASTELERÍA">PASTELERÍA</option>
                  <option value="COCINA CALIENTE">COCINA CALIENTE</option>
                  <option value="COCINA FRÍA">COCINA FRÍA</option>
                  <option value="PANADERÍA">PANADERÍA</option>
                  <option value="SALSAS Y FONDOS">SALSAS Y FONDOS</option>
                  <option value="POSTRES DE RESTAURANTE">POSTRES DE RESTAURANTE</option>
                  <option value="GARDE MANGER">GARDE MANGER</option>
                  <option value="PESCADOS Y MARISCOS">PESCADOS Y MARISCOS</option>
                  <option value="CARNES Y AVES">CARNES Y AVES</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700">Nivel Educativo</label>
                <select
                  value={educationalLevel}
                  onChange={(e) => setEducationalLevel(e.target.value as EducationalLevel)}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2 font-semibold text-slate-900"
                >
                  <option value="Grado Básico">Grado Básico (FP Básica)</option>
                  <option value="Grado Medio">Grado Medio (Técnico Cocina/Pastelería)</option>
                  <option value="Grado Superior">Grado Superior (Técnico Superior Dirección)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700">Raciones Base de Taller</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={portions}
                  onChange={(e) => setPortions(parseInt(e.target.value) || 10)}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2 font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Carpeta de Destino</label>
                <select
                  value={targetFolderId}
                  onChange={(e) => setTargetFolderId(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2 font-semibold text-slate-900"
                >
                  <option value="">Sin carpeta (General)</option>
                  {folders.map((f) => (
                    <option key={f.id} value={f.id}>
                      📁 {f.name}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            <div>
              <label className="font-bold text-slate-700">Notas / Indicaciones del Docente (Opcional)</label>
              <input
                type="text"
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="Ej: Enfatizar seguridad en corte, tiempos de fermentación y temperaturas APPCC..."
                className="w-full bg-white border border-slate-300 rounded-xl p-2 text-slate-900"
              />
            </div>
          </div>

          {/* Rellenado Inteligente Badge */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-950 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span className="text-[11px] font-medium leading-relaxed">
              <strong>Compleción Didáctica Inteligente:</strong> La IA completará automáticamente todos los puntos técnicos faltantes (alérgenos UE, control APPCC, incidencias de taller, mermas e insumos) para generar la ficha de 17 secciones.
            </span>
          </div>

          {/* Error Notice */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 bg-emerald-950 hover:bg-emerald-900 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-lg transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  <span>{statusMessage || 'Transformando a Ficha Oficial...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Transformar a Ficha Técnica Oficial</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

function FileCheck(props: { className?: string }) {
  return <Check className={props.className || "w-4 h-4"} />;
}
