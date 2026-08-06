import React, { useRef, useState } from 'react';
import { RecipeFolder, RecipeSheet } from '../types';
import { ALL_ALLERGENS, calculateRecipeSheetCosts, formatCurrency, formatAllergenName } from '../utils/calculations';
import { ImageChangeModal } from './ImageChangeModal';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import {
  Printer,
  Edit,
  Copy,
  Trash2,
  Sparkles,
  ArrowLeft,
  Clock,
  Flame,
  Scale,
  GraduationCap,
  AlertTriangle,
  Star,
  CheckCircle2,
  Utensils,
  BookOpen,
  DollarSign,
  ChefHat,
  Info,
  ShieldAlert,
  Thermometer,
  Layers,
  Folder,
  Image as ImageIcon
} from 'lucide-react';

interface OfficialPdfSheetViewProps {
  recipe: RecipeSheet;
  onBack: () => void;
  onEdit: (recipe: RecipeSheet) => void;
  onDuplicate: (recipe: RecipeSheet) => void;
  onDelete: (id: string) => void;
  onUpdateImage?: (recipeId: string, newImageUrl: string) => void;
  onGenerateImage?: (recipe: RecipeSheet) => void;
  isGeneratingImage?: boolean;
  folders?: RecipeFolder[];
  onMoveFolder?: (recipeId: string, folderId: string) => void;
}

export const OfficialPdfSheetView: React.FC<OfficialPdfSheetViewProps> = ({
  recipe,
  onBack,
  onEdit,
  onDuplicate,
  onDelete,
  onUpdateImage,
  onGenerateImage,
  isGeneratingImage,
  folders = [],
  onMoveFolder,
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const costs = calculateRecipeSheetCosts(recipe);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Action Controls Bar (Hidden when printing) */}
      <div className="print:hidden bg-slate-900 text-white p-4 rounded-2xl shadow-lg flex flex-wrap items-center justify-between gap-4">
        
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Catálogo</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          
          {onMoveFolder && (
            <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl text-xs">
              <Folder className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-slate-300 font-semibold hidden sm:inline">Carpeta:</span>
              <select
                value={recipe.folderId || ''}
                onChange={(e) => onMoveFolder(recipe.id, e.target.value)}
                className="bg-slate-900 border border-slate-700 text-white rounded-lg px-2 py-1 text-xs font-bold focus:outline-none"
              >
                <option value="">Sin carpeta</option>
                {folders.map((f) => (
                  <option key={f.id} value={f.id}>
                    📁 {f.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={() => onEdit(recipe)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs transition-colors shadow-md cursor-pointer"
            title="Modificar cualquier dato, ingrediente, tiempo o texto de esta ficha"
          >
            <Edit className="w-4 h-4 text-emerald-950" />
            <span>Editar Ficha / Corregir</span>
          </button>

          <button
            type="button"
            onClick={() => setIsImageModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
          >
            <ImageIcon className="w-4 h-4 text-amber-400" />
            <span>Cambiar Foto</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / Descargar PDF</span>
          </button>

          <button
            onClick={() => onDuplicate(recipe)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors"
          >
            <Copy className="w-4 h-4" />
            <span>Duplicar</span>
          </button>

          <button
            type="button"
            onClick={() => setIsConfirmDeleteOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-rose-950/80 hover:bg-rose-900 text-rose-200 font-bold rounded-xl text-xs transition-colors"
            title="Eliminar Ficha"
          >
            <Trash2 className="w-4 h-4" />
            <span>Eliminar</span>
          </button>

        </div>
      </div>

      {/* Tip Banner for Editing */}
      <div className="print:hidden bg-amber-500/10 border border-amber-400/30 rounded-2xl p-3 text-xs text-amber-200 flex items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2">
          <Edit className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>¿Detectas algún error o dato por ajustar?</strong> Puedes corregir cualquier apartado, ingrediente, peso o texto pulsando el botón <strong className="text-amber-300">"Editar Ficha / Corregir"</strong>.
          </span>
        </div>
        <button
          onClick={() => onEdit(recipe)}
          className="underline font-bold text-amber-300 hover:text-white shrink-0 text-xs"
        >
          Abrir Editor
        </button>
      </div>

      {/* Financial Banner Summary for Teacher / Chef (Hidden on Print) */}
      <div className="print:hidden bg-amber-50 border border-amber-200 rounded-2xl p-3 sm:p-4 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-xs">
        <div>
          <span className="text-[10px] uppercase font-bold text-amber-800 block truncate">Costo Materia Prima Total</span>
          <p className="text-base font-black text-amber-950">{formatCurrency(costs.totalRawMaterialCostBase)}</p>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-amber-800 block truncate">Costo / Ración ({recipe.generalData.portions} ud)</span>
          <p className="text-base font-black text-amber-900">{formatCurrency(costs.costPerPortionBase)}</p>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-emerald-800 block truncate">PVP Sugerido (S/ IVA - 30% FC)</span>
          <p className="text-base font-black text-emerald-950">{formatCurrency(costs.suggestedPvpNoIva)}</p>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-700 block truncate">PVP Carta (Con 10% IVA)</span>
          <p className="text-base font-black text-slate-900">{formatCurrency(costs.suggestedPvpWithIva10)}</p>
        </div>
      </div>

      {/* OFFICIAL PDF PRINT CONTAINER (Exact 1:1 Layout of Spanish Culinary School Sheet) */}
      <div
        ref={printRef}
        id="official-pdf-sheet"
        className="bg-white border border-slate-300 rounded-2xl shadow-xl max-w-4xl mx-auto p-4 sm:p-6 text-slate-900 font-sans print:p-0 print:border-none print:shadow-none print:max-w-none text-xs leading-snug space-y-4 overflow-hidden"
      >
        
        {/* HEADER BAR */}
        <div className="flex flex-col-reverse sm:flex-row print:flex-row items-center sm:items-stretch justify-between gap-4 border-b-2 border-emerald-900 pb-3">
          
          {/* Badge & Title */}
          <div className="flex-1 space-y-2 w-full min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 bg-emerald-900 text-white px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider max-w-full">
                <ChefHat className="w-4 h-4 text-amber-300 shrink-0" />
                <span className="truncate">FICHA TÉCNICA — {recipe.category}</span>
              </div>

              <div className="bg-emerald-900 text-white px-3 py-1 rounded-md font-mono font-black text-sm shrink-0">
                {recipe.code}
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-emerald-950 font-serif tracking-tight uppercase border-b border-emerald-100 pb-1 break-words">
              {recipe.title}
            </h1>

            {recipe.subtitle && (
              <p className="text-xs text-slate-600 font-medium italic break-words">
                {recipe.subtitle}
              </p>
            )}
          </div>

          {/* Header Image */}
          <div className="relative group w-full sm:w-36 h-40 sm:h-28 rounded-xl overflow-hidden border border-slate-300 shrink-0 shadow-2xs bg-slate-100 flex flex-col items-center justify-center">
            {recipe.imageUrl ? (
              <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center justify-center p-2 text-center text-slate-400">
                <Utensils className="w-6 h-6 opacity-40 mb-1" />
                <span className="text-[9px] font-bold text-slate-500">Sin foto</span>
              </div>
            )}

            {/* Hover overlay to change or upload photo */}
            <button
              type="button"
              onClick={() => setIsImageModalOpen(true)}
              className="print:hidden absolute inset-0 bg-slate-950/75 text-white flex flex-col items-center justify-center p-1 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-2xs cursor-pointer"
              title="Cambiar o subir foto de la elaboración"
            >
              <ImageIcon className="w-5 h-5 text-amber-400 mb-0.5" />
              <span>Cambiar Foto</span>
            </button>
          </div>

        </div>

        {/* SECTION 1: DATOS GENERALES */}
        <div className="space-y-1.5">
          <h2 className="font-bold text-xs text-emerald-950 uppercase tracking-wide flex items-center gap-1">
            <span className="text-emerald-800 font-mono font-bold">1.</span> DATOS GENERALES
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 print:grid-cols-5 gap-2 text-center">
            <div className="border border-slate-300 rounded-xl p-2 bg-slate-50/50 flex flex-col justify-center items-center min-w-0">
              <span className="block text-[9px] sm:text-[10px] uppercase font-bold text-slate-500 truncate w-full" title="RACIONES">RACIONES</span>
              <span className="font-bold text-slate-900 text-xs sm:text-sm">{recipe.generalData.portions}</span>
            </div>
            <div className="border border-slate-300 rounded-xl p-2 bg-slate-50/50 flex flex-col justify-center items-center min-w-0">
              <span className="block text-[9px] sm:text-[10px] uppercase font-bold text-slate-500 truncate w-full" title="PREELABORACIÓN">PREELABORACIÓN</span>
              <span className="font-bold text-slate-900 text-xs sm:text-sm">{recipe.generalData.preElaborationMinutes} min</span>
            </div>
            <div className="border border-slate-300 rounded-xl p-2 bg-slate-50/50 flex flex-col justify-center items-center min-w-0">
              <span className="block text-[9px] sm:text-[10px] uppercase font-bold text-slate-500 truncate w-full" title="ELABORACIÓN">ELABORACIÓN</span>
              <span className="font-bold text-slate-900 text-xs sm:text-sm">{recipe.generalData.elaborationMinutes} min</span>
            </div>
            <div className="border border-slate-300 rounded-xl p-2 bg-slate-50/50 flex flex-col justify-center items-center min-w-0">
              <span className="block text-[9px] sm:text-[10px] uppercase font-bold text-slate-500 truncate w-full" title="TIEMPO TOTAL">TIEMPO TOTAL</span>
              <span className="font-bold text-slate-900 text-xs sm:text-sm">{recipe.generalData.totalMinutes} min</span>
            </div>
            <div className="border border-slate-300 rounded-xl p-2 bg-slate-50/50 flex flex-col justify-center items-center min-w-0 col-span-2 sm:col-span-1">
              <span className="block text-[9px] sm:text-[10px] uppercase font-bold text-slate-500 truncate w-full" title="DIFICULTAD">DIFICULTAD</span>
              <span className="font-black text-emerald-900 text-xs sm:text-sm">{recipe.generalData.difficulty}</span>
            </div>
          </div>
        </div>

        {/* SECTION 2: OBJETIVO DE LA ELABORACIÓN */}
        <div className="space-y-1">
          <h2 className="font-bold text-xs text-emerald-950 uppercase tracking-wide">
            <span className="text-emerald-800 font-mono font-bold">2.</span> OBJETIVO DE LA ELABORACIÓN
          </h2>
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-[11px] leading-snug">
            {recipe.objective}
          </div>
        </div>

        {/* SECTION 3 & 4: NIVEL FORMATIVO Y MÓDULOS PROFESIONALES */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* 3. NIVEL FORMATIVO */}
          <div className="md:col-span-4 space-y-1">
            <h2 className="font-bold text-xs text-emerald-950 uppercase tracking-wide">
              <span className="text-emerald-800 font-mono font-bold">3.</span> NIVEL FORMATIVO RECOMENDADO
            </h2>
            <div className="border border-slate-200 rounded-xl p-2 space-y-1.5 bg-slate-50/30">
              {(['Grado Básico', 'Grado Medio', 'Grado Superior'] as const).map((lvl) => {
                const isActive = recipe.recommendedLevel === lvl;
                return (
                  <div
                    key={lvl}
                    className={`flex items-center gap-2 p-1.5 rounded-lg border text-[11px] font-semibold ${
                      isActive
                        ? 'bg-emerald-900 text-white border-emerald-900 font-bold'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    <GraduationCap className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span>{lvl}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. MÓDULOS PROFESIONALES RELACIONADOS */}
          <div className="md:col-span-8 space-y-1">
            <h2 className="font-bold text-xs text-emerald-950 uppercase tracking-wide">
              <span className="text-emerald-800 font-mono font-bold">4.</span> MÓDULOS PROFESIONALES RELACIONADOS
            </h2>
            <div className="border border-slate-200 rounded-xl p-2 bg-slate-50/30 grid grid-cols-1 sm:grid-cols-3 print:grid-cols-3 gap-2 text-[10px]">
              
              <div className="space-y-1 border-r border-slate-200 pr-2">
                <span className="font-bold text-emerald-950 block border-b pb-0.5">FORMACIÓN PROFESIONAL BÁSICA</span>
                <p className="text-[9px] font-semibold text-slate-700">Título Profesional Básico en Cocina y Restauración</p>
                <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                  {recipe.relatedModules?.fpBasica?.map((m, i) => (
                    <li key={i}>{m}</li>
                  )) || <li>Técnicas elementales de preelaboración.</li>}
                </ul>
              </div>

              <div className="space-y-1 border-r border-slate-200 pr-2">
                <span className="font-bold text-emerald-950 block border-b pb-0.5">GRADO MEDIO</span>
                <p className="text-[9px] font-semibold text-slate-700">Técnico en Cocina y Gastronomía</p>
                <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                  {recipe.relatedModules?.gradoMedio?.map((m, i) => (
                    <li key={i}>{m}</li>
                  )) || <li>Preelaboración y conservación.</li>}
                </ul>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-emerald-950 block border-b pb-0.5">GRADO SUPERIOR</span>
                <p className="text-[9px] font-semibold text-slate-700">Técnico Superior Dirección Cocina</p>
                <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                  {recipe.relatedModules?.gradoSuperior?.map((m, i) => (
                    <li key={i}>{m}</li>
                  )) || <li>Procesos de elaboración culinaria.</li>}
                </ul>
              </div>

            </div>
          </div>

        </div>

        {/* SECTION 5 & 6: INGREDIENTES Y UTILLAJE */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* 5. INGREDIENTES TABLE */}
          <div className="md:col-span-7 space-y-1">
            <h2 className="font-bold text-xs text-emerald-950 uppercase tracking-wide">
              <span className="text-emerald-800 font-mono font-bold">5.</span> INGREDIENTES
            </h2>
            <div className="border border-slate-300 rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-left text-[11px] border-collapse">
                <thead>
                  <tr className="bg-emerald-900 text-white font-bold uppercase text-[10px]">
                    <th className="py-1.5 px-3">INGREDIENTE</th>
                    <th className="py-1.5 px-3 text-right">CANTIDAD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {recipe.ingredients.map((ing, idx) => (
                    <tr key={ing.id || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="py-1 px-3 font-semibold text-slate-900">{ing.name}</td>
                      <td className="py-1 px-3 text-right font-bold text-emerald-950">{ing.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 6. UTILLAJE Y MAQUINARIA */}
          <div className="md:col-span-5 space-y-1">
            <h2 className="font-bold text-xs text-emerald-950 uppercase tracking-wide">
              <span className="text-emerald-800 font-mono font-bold">6.</span> UTILLAJE Y MAQUINARIA
            </h2>
            <div className="border border-slate-200 rounded-xl p-2.5 bg-slate-50/50 min-h-[140px]">
              <ul className="grid grid-cols-1 gap-1 text-[10px]">
                {recipe.utensilsAndMachinery.map((u, i) => (
                  <li key={i} className="flex items-center gap-1.5 text-slate-800">
                    <span className="w-1.5 h-1.5 bg-emerald-800 rounded-full shrink-0"></span>
                    <span>{u}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* SECTION 7: PREELABORACIÓN */}
        <div className="space-y-1">
          <h2 className="font-bold text-xs text-emerald-950 uppercase tracking-wide">
            <span className="text-emerald-800 font-mono font-bold">7.</span> PREELABORACIÓN ({recipe.generalData.preElaborationMinutes} min)
          </h2>
          <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/30 space-y-1.5">
            {recipe.preElaborationSteps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2 text-[11px]">
                <span className="w-5 h-5 bg-emerald-900 text-white rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-slate-800 pt-0.5">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 8: ELABORACIÓN */}
        <div className="space-y-1">
          <h2 className="font-bold text-xs text-emerald-950 uppercase tracking-wide">
            <span className="text-emerald-800 font-mono font-bold">8.</span> ELABORACIÓN ({recipe.generalData.elaborationMinutes} min)
          </h2>
          <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/30 space-y-1.5">
            {recipe.elaborationSteps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2 text-[11px]">
                <span className="w-5 h-5 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-slate-900 font-medium pt-0.5">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 9: TÉCNICAS CULINARIAS APLICADAS */}
        <div className="space-y-1">
          <h2 className="font-bold text-xs text-emerald-950 uppercase tracking-wide">
            <span className="text-emerald-800 font-mono font-bold">9.</span> TÉCNICAS CULINARIAS APLICADAS
          </h2>
          <div className="border border-slate-200 rounded-xl p-2.5 bg-slate-50/50 flex flex-wrap gap-x-4 gap-y-1 text-[10px]">
            {recipe.appliedTechniques.map((tech, i) => (
              <div key={i} className="flex items-center gap-1 font-medium text-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>{tech}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 10: INCIDENCIAS FRECUENTES Y POSIBLES CAUSAS */}
        <div className="space-y-1">
          <h2 className="font-bold text-xs text-emerald-950 uppercase tracking-wide">
            <span className="text-emerald-800 font-mono font-bold">10.</span> INCIDENCIAS FRECUENTES Y POSIBLES CAUSAS
          </h2>
          <div className="border border-rose-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-[10px] border-collapse">
              <thead>
                <tr className="bg-rose-900 text-white font-bold uppercase text-[9px]">
                  <th className="py-1 px-3 w-1/3 border-r border-rose-800">INCIDENCIA</th>
                  <th className="py-1 px-3">POSIBLES CAUSAS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-100 bg-rose-50/20">
                {recipe.frequentIncidences.map((item, i) => (
                  <tr key={i}>
                    <td className="py-1 px-3 font-bold text-rose-950 border-r border-rose-100">{item.incidence}</td>
                    <td className="py-1 px-3 text-slate-800">{item.causes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 11: PUNTOS CRÍTICOS / APPCC */}
        <div className="space-y-1">
          <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-xl text-amber-950 text-[10px] space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-xs text-amber-900 border-b border-amber-200 pb-0.5">
              <ShieldAlert className="w-4 h-4 text-amber-700" />
              <span>11. PUNTOS CRÍTICOS / APPCC</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 pl-1 text-slate-800 font-medium">
              {recipe.criticalPointsAppcc.map((pt, i) => (
                <li key={i}>{pt}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* SECTION 12, 13, 14, 15, 16: GRID DE TARJETAS DE SERVICIO */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 print:grid-cols-5 gap-2 text-[10px]">
          
          {/* 12. CONSERVACIÓN */}
          <div className="border border-slate-200 rounded-xl p-2 bg-slate-50/50 space-y-1">
            <span className="font-bold text-emerald-950 block border-b pb-0.5">12. CONSERVACIÓN</span>
            <p className="text-slate-700 leading-snug">{recipe.preservation}</p>
          </div>

          {/* 13. REGENERACIÓN */}
          <div className="border border-slate-200 rounded-xl p-2 bg-slate-50/50 space-y-1">
            <span className="font-bold text-emerald-950 block border-b pb-0.5">13. REGENERACIÓN</span>
            <p className="text-slate-700 leading-snug">{recipe.regeneration}</p>
          </div>

          {/* 14. PRESENTACIÓN */}
          <div className="border border-slate-200 rounded-xl p-2 bg-slate-50/50 space-y-1">
            <span className="font-bold text-emerald-950 block border-b pb-0.5">14. PRESENTACIÓN</span>
            <p className="text-slate-700 leading-snug">{recipe.presentation}</p>
          </div>

          {/* 15. ALÉRGENOS */}
          <div className="border border-slate-200 rounded-xl p-2 bg-slate-50/50 space-y-1 text-center">
            <span className="font-bold text-emerald-950 block border-b pb-0.5">15. ALÉRGENOS</span>
            <div className="flex flex-wrap justify-center gap-1 pt-1">
              {recipe.allergens.map((alg) => (
                <span key={alg} className="bg-rose-100 text-rose-900 border border-rose-300 font-bold px-2 py-0.5 rounded text-[9px]">
                  {formatAllergenName(alg)}
                </span>
              ))}
            </div>
          </div>

          {/* 16. VALOR NUTRICIONAL */}
          <div className="border border-slate-200 rounded-xl p-2 bg-slate-50/50 space-y-1">
            <span className="font-bold text-emerald-950 block border-b pb-0.5">16. VALOR NUTRICIONAL</span>
            <p className="text-slate-700 text-[9px] leading-tight">{recipe.nutritionalValue}</p>
          </div>

        </div>

        {/* SECTION 17: CRITERIOS DE CALIDAD DEL RESULTADO FINAL */}
        <div className="space-y-1">
          <div className="bg-emerald-950 text-white border border-emerald-800 rounded-xl p-3 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-xs text-amber-300 border-b border-emerald-800 pb-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>17. CRITERIOS DE CALIDAD DEL RESULTADO FINAL</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
              {recipe.qualityCriteria.map((crit, i) => (
                <div key={i} className="flex items-center gap-1.5 text-emerald-100">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{crit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER BAR */}
        <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[9px] text-slate-500 font-semibold uppercase">
          <span>FICHA TÉCNICA — {recipe.category}</span>
          <span>CÓDIGO: {recipe.code}</span>
          <span>PÁGINA 1</span>
        </div>

      </div>

      {/* Image Change Modal */}
      <ImageChangeModal
        isOpen={isImageModalOpen}
        recipe={recipe}
        onClose={() => setIsImageModalOpen(false)}
        onSaveImage={(recipeId, newImageUrl) => {
          if (onUpdateImage) {
            onUpdateImage(recipeId, newImageUrl);
          } else {
            onEdit({ ...recipe, imageUrl: newImageUrl, updatedAt: new Date().toISOString() });
          }
        }}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isConfirmDeleteOpen}
        title="Eliminar Ficha Técnica"
        message={`¿Estás seguro de que deseas eliminar permanentemente la ficha técnica "${recipe.title}"?`}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={() => onDelete(recipe.id)}
      />

    </div>
  );
};
