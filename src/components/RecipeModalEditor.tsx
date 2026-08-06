import React, { useState, useEffect } from 'react';
import { AllergenType, DifficultyLevel, EducationalLevel, FrequentIncidence, IngredientItem, RecipeCategory, RecipeFolder, RecipeSheet } from '../types';
import { ALL_ALLERGENS, formatAllergenName } from '../utils/calculations';
import { X, Plus, Trash2, Save, ChefHat, Sparkles, Upload, CheckCircle2, Wand2 } from 'lucide-react';

interface RecipeModalEditorProps {
  isOpen: boolean;
  initialRecipe?: RecipeSheet | null;
  onClose: () => void;
  onSave: (recipe: RecipeSheet) => void;
  folders?: RecipeFolder[];
}

export const RecipeModalEditor: React.FC<RecipeModalEditorProps> = ({
  isOpen,
  initialRecipe,
  onClose,
  onSave,
  folders = [],
}) => {
  // Header / Cabecera
  const [code, setCode] = useState(initialRecipe?.code || `TS-${Math.floor(10 + Math.random() * 90)}`);
  const [title, setTitle] = useState(initialRecipe?.title || '');
  const [subtitle, setSubtitle] = useState(initialRecipe?.subtitle || '');
  const [category, setCategory] = useState<RecipeCategory>(initialRecipe?.category || 'CREMAS Y SOPAS');
  const [folderId, setFolderId] = useState<string>(initialRecipe?.folderId || '');
  const [imageUrl, setImageUrl] = useState<string>(initialRecipe?.imageUrl || '');

  // 1. Datos Generales
  const [portions, setPortions] = useState(initialRecipe?.generalData?.portions || 10);
  const [preMinutes, setPreMinutes] = useState(initialRecipe?.generalData?.preElaborationMinutes || 20);
  const [elaMinutes, setElaMinutes] = useState(initialRecipe?.generalData?.elaborationMinutes || 35);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(initialRecipe?.generalData?.difficulty || 'MEDIA');

  // 2. Objetivo
  const [objective, setObjective] = useState(initialRecipe?.objective || '');

  // 3. Nivel Formativo Recomendado
  const [recommendedLevel, setRecommendedLevel] = useState<EducationalLevel>(initialRecipe?.recommendedLevel || 'Grado Medio');

  // 4. Módulos Profesionales Relacionados
  const [fpBasica, setFpBasica] = useState<string>(initialRecipe?.relatedModules?.fpBasica?.join('\n') || '');
  const [gradoMedio, setGradoMedio] = useState<string>(initialRecipe?.relatedModules?.gradoMedio?.join('\n') || '');
  const [gradoSuperior, setGradoSuperior] = useState<string>(initialRecipe?.relatedModules?.gradoSuperior?.join('\n') || '');

  // 5. Lista de Ingredientes
  const [ingredients, setIngredients] = useState<IngredientItem[]>(
    initialRecipe?.ingredients && initialRecipe.ingredients.length > 0
      ? initialRecipe.ingredients
      : [{ id: 'ing-1', name: '', quantity: '100 g', grossWeightGrams: 100, wastePercentage: 0, unitPriceKgOrL: 2.50 }]
  );

  // 6. Utillaje y Maquinaria
  const [utensils, setUtensils] = useState<string[]>(
    initialRecipe?.utensilsAndMachinery || []
  );

  // 7. Preelaboración (Mise en place)
  const [preSteps, setPreSteps] = useState<string[]>(
    initialRecipe?.preElaborationSteps || []
  );

  // 8. Elaboración (Paso a Paso)
  const [elaSteps, setElaSteps] = useState<string[]>(
    initialRecipe?.elaborationSteps || []
  );

  // 9. Técnicas Culinarias
  const [appliedTechniques, setAppliedTechniques] = useState<string[]>(
    initialRecipe?.appliedTechniques || []
  );

  // 10. Incidencias Frecuentes
  const [frequentIncidences, setFrequentIncidences] = useState<FrequentIncidence[]>(
    initialRecipe?.frequentIncidences || []
  );

  // 11. Puntos Críticos APPCC
  const [criticalPointsAppcc, setCriticalPointsAppcc] = useState<string[]>(
    initialRecipe?.criticalPointsAppcc || []
  );

  // 12. Conservación
  const [preservation, setPreservation] = useState(initialRecipe?.preservation || '');

  // 13. Regeneración
  const [regeneration, setRegeneration] = useState(initialRecipe?.regeneration || '');

  // 14. Presentación
  const [presentation, setPresentation] = useState(initialRecipe?.presentation || '');

  // 15. Alérgenos (14 UE)
  const [allergens, setAllergens] = useState<AllergenType[]>(initialRecipe?.allergens || []);

  // 16. Valor Nutricional
  const [nutritionalValue, setNutritionalValue] = useState(initialRecipe?.nutritionalValue || '');

  // 17. Criterios de Calidad
  const [qualityCriteria, setQualityCriteria] = useState<string[]>(
    initialRecipe?.qualityCriteria || []
  );

  // Loading & Feedback states
  const [isGenImageLoading, setIsGenImageLoading] = useState(false);
  const [isCompletingWithAi, setIsCompletingWithAi] = useState(false);
  const [aiCompletedNotice, setAiCompletedNotice] = useState(false);

  // Sync state whenever modal opens or initialRecipe changes
  useEffect(() => {
    if (isOpen) {
      if (initialRecipe) {
        setCode(initialRecipe.code || `TS-${Math.floor(10 + Math.random() * 90)}`);
        setTitle(initialRecipe.title || '');
        setSubtitle(initialRecipe.subtitle || '');
        setCategory(initialRecipe.category || 'CREMAS Y SOPAS');
        setFolderId(initialRecipe.folderId || '');
        setImageUrl(initialRecipe.imageUrl || '');

        setPortions(initialRecipe.generalData?.portions || 10);
        setPreMinutes(initialRecipe.generalData?.preElaborationMinutes || 20);
        setElaMinutes(initialRecipe.generalData?.elaborationMinutes || 35);
        setDifficulty(initialRecipe.generalData?.difficulty || 'MEDIA');

        setObjective(initialRecipe.objective || '');
        setRecommendedLevel(initialRecipe.recommendedLevel || 'Grado Medio');

        setFpBasica(initialRecipe.relatedModules?.fpBasica?.join('\n') || '');
        setGradoMedio(initialRecipe.relatedModules?.gradoMedio?.join('\n') || '');
        setGradoSuperior(initialRecipe.relatedModules?.gradoSuperior?.join('\n') || '');

        setIngredients(
          initialRecipe.ingredients && initialRecipe.ingredients.length > 0
            ? initialRecipe.ingredients
            : [{ id: 'ing-1', name: '', quantity: '100 g', grossWeightGrams: 100, wastePercentage: 0, unitPriceKgOrL: 2.50 }]
        );

        setUtensils(initialRecipe.utensilsAndMachinery || []);
        setPreSteps(initialRecipe.preElaborationSteps || []);
        setElaSteps(initialRecipe.elaborationSteps || []);
        setAppliedTechniques(initialRecipe.appliedTechniques || []);
        setFrequentIncidences(initialRecipe.frequentIncidences || []);
        setCriticalPointsAppcc(initialRecipe.criticalPointsAppcc || []);
        setPreservation(initialRecipe.preservation || '');
        setRegeneration(initialRecipe.regeneration || '');
        setPresentation(initialRecipe.presentation || '');
        setAllergens(initialRecipe.allergens || []);
        setNutritionalValue(initialRecipe.nutritionalValue || '');
        setQualityCriteria(initialRecipe.qualityCriteria || []);
      } else {
        setCode(`TS-${Math.floor(10 + Math.random() * 90)}`);
        setTitle('');
        setSubtitle('');
        setCategory('CREMAS Y SOPAS');
        setFolderId('');
        setImageUrl('');

        setPortions(10);
        setPreMinutes(20);
        setElaMinutes(35);
        setDifficulty('MEDIA');

        setObjective('');
        setRecommendedLevel('Grado Medio');

        setFpBasica('');
        setGradoMedio('');
        setGradoSuperior('');

        setIngredients([{ id: 'ing-1', name: '', quantity: '100 g', grossWeightGrams: 100, wastePercentage: 0, unitPriceKgOrL: 2.50 }]);
        setUtensils([]);
        setPreSteps([]);
        setElaSteps([]);
        setAppliedTechniques([]);
        setFrequentIncidences([]);
        setCriticalPointsAppcc([]);
        setPreservation('');
        setRegeneration('');
        setPresentation('');
        setAllergens([]);
        setNutritionalValue('');
        setQualityCriteria([]);
      }
    }
  }, [isOpen, initialRecipe]);

  if (!isOpen) return null;

  // Toggle allergen selection
  const handleToggleAllergen = (a: AllergenType) => {
    const normA = formatAllergenName(a);
    const exists = allergens.some((item) => formatAllergenName(item) === normA);
    if (exists) {
      setAllergens(allergens.filter((item) => formatAllergenName(item) !== normA));
    } else {
      setAllergens([...allergens, normA as AllergenType]);
    }
  };

  // Ingredient list handlers
  const handleAddIngredient = () => {
    setIngredients([
      ...ingredients,
      {
        id: `ing-${Date.now()}-${ingredients.length}`,
        name: '',
        quantity: '100 g',
        grossWeightGrams: 100,
        wastePercentage: 0,
        unitPriceKgOrL: 2.0,
      },
    ]);
  };

  const handleRemoveIngredient = (id: string) => {
    setIngredients(ingredients.filter((i) => i.id !== id));
  };

  // String array helper functions
  const handleAddArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, current: string[]) => {
    setter([...current, '']);
  };

  const handleUpdateArrayItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    current: string[],
    index: number,
    value: string
  ) => {
    const updated = [...current];
    updated[index] = value;
    setter(updated);
  };

  const handleRemoveArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, current: string[], index: number) => {
    setter(current.filter((_, i) => i !== index));
  };

  // Incidences handler
  const handleAddIncidence = () => {
    setFrequentIncidences([...frequentIncidences, { incidence: '', causes: '' }]);
  };

  const handleUpdateIncidence = (index: number, field: 'incidence' | 'causes', value: string) => {
    const updated = [...frequentIncidences];
    updated[index] = { ...updated[index], [field]: value };
    setFrequentIncidences(updated);
  };

  const handleRemoveIncidence = (index: number) => {
    setFrequentIncidences(frequentIncidences.filter((_, i) => i !== index));
  };

  // Generate Dish Image with AI
  const handleGenerateImageWithAi = async () => {
    if (!title.trim()) {
      alert('Por favor introduce primero el título de la receta para generar la foto.');
      return;
    }
    setIsGenImageLoading(true);
    try {
      const res = await fetch('/api/generate-dish-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category, description: subtitle }),
      });
      const data = await res.json();
      if (data.imageUrl) {
        setImageUrl(data.imageUrl);
      }
    } catch (err) {
      console.error('Error generating image:', err);
    } finally {
      setIsGenImageLoading(false);
    }
  };

  // Complete Empty Fields with AI
  const handleCompleteEmptyFieldsWithAi = async () => {
    if (!title.trim()) {
      alert('Por favor introduce al menos el título de la receta para que la IA complete los campos vacíos.');
      return;
    }

    setIsCompletingWithAi(true);
    try {
      const currentData = {
        code,
        title,
        subtitle,
        category,
        generalData: {
          portions,
          preElaborationMinutes: preMinutes,
          elaborationMinutes: elaMinutes,
          totalMinutes: preMinutes + elaMinutes,
          difficulty,
        },
        objective,
        recommendedLevel,
        relatedModules: {
          fpBasica: fpBasica.split('\n').filter(Boolean),
          gradoMedio: gradoMedio.split('\n').filter(Boolean),
          gradoSuperior: gradoSuperior.split('\n').filter(Boolean),
        },
        ingredients: ingredients.filter((i) => i.name.trim().length > 0),
        utensilsAndMachinery: utensils.filter(Boolean),
        preElaborationSteps: preSteps.filter(Boolean),
        elaborationSteps: elaSteps.filter(Boolean),
        appliedTechniques: appliedTechniques.filter(Boolean),
        frequentIncidences: frequentIncidences.filter((i) => i.incidence.trim().length > 0),
        criticalPointsAppcc: criticalPointsAppcc.filter(Boolean),
        preservation,
        regeneration,
        presentation,
        allergens,
        nutritionalValue,
        qualityCriteria: qualityCriteria.filter(Boolean),
      };

      const res = await fetch('/api/complete-recipe-fields', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentData),
      });

      const aiData = await res.json();
      if (!res.ok) throw new Error(aiData.error || 'Error al completar los campos vacíos con IA.');

      // Safely apply AI fills only to blank/empty fields
      if (!subtitle && aiData.subtitle) setSubtitle(aiData.subtitle);
      if (!objective && aiData.objective) setObjective(aiData.objective);

      if (aiData.relatedModules) {
        if (!fpBasica && aiData.relatedModules.fpBasica?.length) setFpBasica(aiData.relatedModules.fpBasica.join('\n'));
        if (!gradoMedio && aiData.relatedModules.gradoMedio?.length) setGradoMedio(aiData.relatedModules.gradoMedio.join('\n'));
        if (!gradoSuperior && aiData.relatedModules.gradoSuperior?.length) setGradoSuperior(aiData.relatedModules.gradoSuperior.join('\n'));
      }

      if ((!ingredients || ingredients.length === 0 || (ingredients.length === 1 && !ingredients[0].name.trim())) && aiData.ingredients?.length) {
        setIngredients(aiData.ingredients);
      }

      if ((!utensils || utensils.length === 0) && aiData.utensilsAndMachinery?.length) {
        setUtensils(aiData.utensilsAndMachinery);
      }

      if ((!preSteps || preSteps.length === 0) && aiData.preElaborationSteps?.length) {
        setPreSteps(aiData.preElaborationSteps);
      }

      if ((!elaSteps || elaSteps.length === 0) && aiData.elaborationSteps?.length) {
        setElaSteps(aiData.elaborationSteps);
      }

      if ((!appliedTechniques || appliedTechniques.length === 0) && aiData.appliedTechniques?.length) {
        setAppliedTechniques(aiData.appliedTechniques);
      }

      if ((!frequentIncidences || frequentIncidences.length === 0) && aiData.frequentIncidences?.length) {
        setFrequentIncidences(aiData.frequentIncidences);
      }

      if ((!criticalPointsAppcc || criticalPointsAppcc.length === 0) && aiData.criticalPointsAppcc?.length) {
        setCriticalPointsAppcc(aiData.criticalPointsAppcc);
      }

      if (!preservation && aiData.preservation) setPreservation(aiData.preservation);
      if (!regeneration && aiData.regeneration) setRegeneration(aiData.regeneration);
      if (!presentation && aiData.presentation) setPresentation(aiData.presentation);

      if ((!allergens || allergens.length === 0) && aiData.allergens?.length) {
        setAllergens(aiData.allergens);
      }

      if (!nutritionalValue && aiData.nutritionalValue) setNutritionalValue(aiData.nutritionalValue);

      if ((!qualityCriteria || qualityCriteria.length === 0) && aiData.qualityCriteria?.length) {
        setQualityCriteria(aiData.qualityCriteria);
      }

      if (!imageUrl && aiData.imageUrl) {
        setImageUrl(aiData.imageUrl);
      }

      setAiCompletedNotice(true);
      setTimeout(() => setAiCompletedNotice(false), 5000);
    } catch (err: any) {
      console.error('Error completing empty fields with AI:', err);
      alert(err.message || 'Ocurrió un error al intentar completar la ficha con IA.');
    } finally {
      setIsCompletingWithAi(false);
    }
  };

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Build the recipe sheet
    const cleanIngredients = ingredients.filter((i) => i.name.trim().length > 0);
    const cleanUtensils = utensils.filter((u) => u.trim().length > 0);
    const cleanPreSteps = preSteps.filter((s) => s.trim().length > 0);
    const cleanElaSteps = elaSteps.filter((s) => s.trim().length > 0);
    const cleanTechniques = appliedTechniques.filter((t) => t.trim().length > 0);
    const cleanIncidences = frequentIncidences.filter((i) => i.incidence.trim().length > 0);
    const cleanAppcc = criticalPointsAppcc.filter((p) => p.trim().length > 0);
    const cleanQuality = qualityCriteria.filter((q) => q.trim().length > 0);

    const savedRecipe: RecipeSheet = {
      id: initialRecipe?.id || `manual-${Date.now()}`,
      code,
      title: title.toUpperCase(),
      subtitle: subtitle || `${category} - Ficha Didáctica Culinaria`,
      category,
      generalData: {
        portions,
        preElaborationMinutes: preMinutes,
        elaborationMinutes: elaMinutes,
        totalMinutes: preMinutes + elaMinutes,
        difficulty,
      },
      objective: objective || 'Elaboración de taller aplicando técnicas gastronómicas profesionales.',
      recommendedLevel,
      relatedModules: {
        fpBasica: fpBasica ? fpBasica.split('\n').filter(Boolean) : ['Técnicas elementales de preelaboración.'],
        gradoMedio: gradoMedio ? gradoMedio.split('\n').filter(Boolean) : ['Preelaboración y conservación.', 'Técnicas culinarias.'],
        gradoSuperior: gradoSuperior ? gradoSuperior.split('\n').filter(Boolean) : ['Procesos de elaboración culinaria.'],
      },
      ingredients: cleanIngredients.length > 0 ? cleanIngredients : [
        { id: 'ing-default', name: 'Materia prima base', quantity: '100 g', grossWeightGrams: 100, wastePercentage: 0, unitPriceKgOrL: 2.50 }
      ],
      utensilsAndMachinery: cleanUtensils.length > 0 ? cleanUtensils : ['Tabla de corte', 'Cuchillo cebollero', 'Báscula de precisión'],
      preElaborationSteps: cleanPreSteps.length > 0 ? cleanPreSteps : ['Pesar y medir todos los ingredientes de la mise en place.'],
      elaborationSteps: cleanElaSteps.length > 0 ? cleanElaSteps : ['Proceder con el cocinado siguiendo técnicas culinarias estándar.'],
      appliedTechniques: cleanTechniques.length > 0 ? cleanTechniques : ['Cocción', 'Rehogado'],
      frequentIncidences: cleanIncidences.length > 0 ? cleanIncidences : [
        { incidence: 'Falta de sazón o punto de sal', causes: 'Falta de rectificación al final de la elaboración.' }
      ],
      criticalPointsAppcc: cleanAppcc.length > 0 ? cleanAppcc : [
        'Asegurar la temperatura interna de seguridad (>65ºC en caliente).',
        'Abatimiento rápido de temperatura si no se consume inmediatamente.'
      ],
      preservation: preservation || 'Conservar en refrigeración entre 0 y 4 ºC en recipiente cerrado.',
      regeneration: regeneration || 'Regenerar en horno o salamandra hasta alcanzar >70ºC en centro de producto.',
      presentation: presentation || 'Servir en vajilla adecuada respetando equilibrio visual y temperatura.',
      allergens: allergens.length > 0 ? allergens : [],
      nutritionalValue: nutritionalValue || 'Aporte nutricional equilibrado.',
      qualityCriteria: cleanQuality.length > 0 ? cleanQuality : ['Textura, aroma, color y sabor característicos del plato.'],
      targetFoodCostPercentage: initialRecipe?.targetFoodCostPercentage || 30,
      createdAt: initialRecipe?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFavorite: initialRecipe?.isFavorite || false,
      folderId: folderId || undefined,
      imageUrl: imageUrl || undefined,
    };

    onSave(savedRecipe);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden my-4 sm:my-8 max-h-[92vh] flex flex-col">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-6 bg-emerald-950 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-400 text-slate-950 rounded-2xl shadow-sm shrink-0">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-serif text-white uppercase tracking-tight">
                {initialRecipe ? 'Editar Ficha Técnica' : 'Nueva Ficha Técnica Culinaria Manual'}
              </h2>
              <p className="text-xs text-amber-200/90 font-medium">
                Modelo Oficial FP de Hostelería — 17 Secciones Estándar
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <button
              type="button"
              onClick={handleCompleteEmptyFieldsWithAi}
              disabled={isCompletingWithAi}
              className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-3.5 py-2 rounded-xl text-xs shadow-md transition-all disabled:opacity-50 shrink-0"
              title="Completa automáticamente con IA cualquier apartado que hayas dejado en blanco"
            >
              <Wand2 className="w-4 h-4 text-emerald-950" />
              <span>{isCompletingWithAi ? 'Generando secciones...' : 'Completar Vacíos con IA'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-300 hover:text-white rounded-xl hover:bg-emerald-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* AI Notification Banner */}
        {aiCompletedNotice && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-center gap-2 animate-pulse">
            <CheckCircle2 className="w-4 h-4 text-amber-300" />
            <span>¡Los apartados en blanco han sido rellenados automáticamente con IA según el título y categoría de tu receta!</span>
          </div>
        )}

        {/* Info Helper notice */}
        <div className="bg-amber-50/80 border-b border-amber-200/80 px-4 py-2 text-[11px] text-amber-950 flex items-center justify-between gap-2">
          <span className="font-medium">
            💡 <strong>Nota para docentes:</strong> Puedes rellenar manualmente los apartados que desees. Si dejas alguno en blanco o haces clic en <strong>"Completar Vacíos con IA"</strong>, la inteligencia artificial rellenará los campos faltantes.
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* CABECERA PRINCIPAL */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4">
            <h3 className="font-bold text-emerald-950 uppercase text-xs border-b border-slate-200 pb-1 flex items-center justify-between">
              <span>IDENTIFICACIÓN Y FOTO DE PRESENTACIÓN</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Código Oficial *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2 font-mono font-bold text-emerald-900"
                />
              </div>

              <div className="md:col-span-2">
                <label className="font-bold text-slate-800 block mb-1">Nombre de la Receta (Título) *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: VICHYSSOISE TRADICIONAL CON CROUTONS"
                  className="w-full bg-white border border-slate-300 rounded-xl p-2 font-extrabold text-slate-900 uppercase"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <label className="font-bold text-slate-800 block mb-1">Subtítulo / Descripción Culinaria</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Ej: Crema fría refinada de puerro y patata ligada con nata de cocina"
                  className="w-full bg-white border border-slate-300 rounded-xl p-2 text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Categoría Culinaria</label>
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
            </div>

            {/* Foto de presentación */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
              <label className="font-bold text-slate-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-amber-950">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  Foto de la Ficha Técnica
                </span>
                {imageUrl && (
                  <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-md">
                    ✓ Imagen asignada
                  </span>
                )}
              </label>

              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://... o sube una foto o genera con IA"
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs text-slate-900 min-w-[180px]"
                />

                <label className="flex items-center gap-1.5 bg-emerald-900 hover:bg-emerald-950 text-white font-bold px-3 py-2 rounded-xl text-xs cursor-pointer transition-all shrink-0">
                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                  <span>Subir Foto</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => setImageUrl(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>

                <button
                  type="button"
                  onClick={handleGenerateImageWithAi}
                  disabled={isGenImageLoading}
                  className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs shadow-xs transition-all disabled:opacity-50 shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isGenImageLoading ? 'Generando...' : 'Foto IA'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* 1. DATOS GENERALES */}
          <div className="border border-slate-200 rounded-2xl p-4 space-y-3 bg-white">
            <h3 className="font-bold text-emerald-950 uppercase text-xs flex items-center justify-between border-b pb-1">
              <span>1. DATOS GENERALES Y TIEMPOS</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Carpeta</label>
                <select
                  value={folderId}
                  onChange={(e) => setFolderId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 font-semibold text-slate-900"
                >
                  <option value="">Sin carpeta</option>
                  {folders.map((f) => (
                    <option key={f.id} value={f.id}>📁 {f.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Raciones</label>
                <input
                  type="number"
                  min="1"
                  value={portions}
                  onChange={(e) => setPortions(parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Preelaboración (min)</label>
                <input
                  type="number"
                  min="0"
                  value={preMinutes}
                  onChange={(e) => setPreMinutes(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Elaboración (min)</label>
                <input
                  type="number"
                  min="0"
                  value={elaMinutes}
                  onChange={(e) => setElaMinutes(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Dificultad</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 font-semibold text-slate-900"
                >
                  <option value="BAJA">BAJA</option>
                  <option value="MEDIA">MEDIA</option>
                  <option value="ALTA">ALTA</option>
                  <option value="EXPERTO">EXPERTO</option>
                </select>
              </div>
            </div>
          </div>

          {/* 2. OBJETIVO & 3. NIVEL FORMATIVO */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 border border-slate-200 rounded-2xl p-4 space-y-2 bg-white">
              <h3 className="font-bold text-emerald-950 uppercase text-xs border-b pb-1">
                2. OBJETIVO DE LA ELABORACIÓN
              </h3>
              <textarea
                rows={2}
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder="Describa los objetivos didácticos, texturas o técnicas clave a conseguir (Si se deja en blanco, la IA lo generará)"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900"
              />
            </div>

            <div className="border border-slate-200 rounded-2xl p-4 space-y-2 bg-white">
              <h3 className="font-bold text-emerald-950 uppercase text-xs border-b pb-1">
                3. NIVEL FORMATIVO
              </h3>
              <label className="font-bold text-slate-700 block text-[11px]">Nivel Educativo Recomendado</label>
              <select
                value={recommendedLevel}
                onChange={(e) => setRecommendedLevel(e.target.value as EducationalLevel)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 font-semibold text-slate-900"
              >
                <option value="Grado Básico">Grado Básico</option>
                <option value="Grado Medio">Grado Medio</option>
                <option value="Grado Superior">Grado Superior</option>
              </select>
            </div>
          </div>

          {/* 4. MÓDULOS PROFESIONALES RELACIONADOS */}
          <div className="border border-slate-200 rounded-2xl p-4 space-y-2 bg-white">
            <h3 className="font-bold text-emerald-950 uppercase text-xs border-b pb-1">
              4. MÓDULOS PROFESIONALES RELACIONADOS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">FP Básica (1 por línea)</label>
                <textarea
                  rows={2}
                  value={fpBasica}
                  onChange={(e) => setFpBasica(e.target.value)}
                  placeholder="Técnicas elementales de preelaboración..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Grado Medio (1 por línea)</label>
                <textarea
                  rows={2}
                  value={gradoMedio}
                  onChange={(e) => setGradoMedio(e.target.value)}
                  placeholder="Preelaboración y conservación, Técnicas culinarias..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Grado Superior (1 por línea)</label>
                <textarea
                  rows={2}
                  value={gradoSuperior}
                  onChange={(e) => setGradoSuperior(e.target.value)}
                  placeholder="Procesos de elaboración culinaria..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* 5. INGREDIENTES Y ESCANDALLO */}
          <div className="border border-slate-200 rounded-2xl p-4 space-y-3 bg-white">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-emerald-950 uppercase text-xs">
                5. LISTA DE INGREDIENTES Y ESCANDALLO
              </h3>
              <button
                type="button"
                onClick={handleAddIngredient}
                className="flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200"
              >
                <Plus className="w-3.5 h-3.5" /> Añadir Ingrediente
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              <div className="grid grid-cols-12 gap-2 text-[10px] font-bold text-slate-500 uppercase px-1 hidden sm:grid">
                <span className="col-span-4">Ingrediente *</span>
                <span className="col-span-2 text-center">Cantidad</span>
                <span className="col-span-2 text-center">Peso Bruto (g)</span>
                <span className="col-span-2 text-center">% Merma</span>
                <span className="col-span-1 text-right">€/kg</span>
                <span className="col-span-1 text-center">Acción</span>
              </div>

              {ingredients.map((ing) => (
                <div key={ing.id} className="grid grid-cols-12 gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 items-center">
                  <input
                    type="text"
                    placeholder="Ej: Puerro limpio"
                    value={ing.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      setIngredients(ingredients.map((i) => i.id === ing.id ? { ...i, name: val } : i));
                    }}
                    className="col-span-12 sm:col-span-4 bg-white border border-slate-300 rounded-lg p-1.5 font-bold text-slate-900"
                  />
                  <input
                    type="text"
                    placeholder="Cant. (700 g)"
                    value={ing.quantity}
                    onChange={(e) => {
                      const val = e.target.value;
                      setIngredients(ingredients.map((i) => i.id === ing.id ? { ...i, quantity: val } : i));
                    }}
                    className="col-span-4 sm:col-span-2 bg-white border border-slate-300 rounded-lg p-1.5 text-center font-bold"
                  />
                  <input
                    type="number"
                    placeholder="Bruto g"
                    value={ing.grossWeightGrams || ''}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setIngredients(ingredients.map((i) => i.id === ing.id ? { ...i, grossWeightGrams: val } : i));
                    }}
                    className="col-span-3 sm:col-span-2 bg-white border border-slate-300 rounded-lg p-1.5 text-center font-semibold"
                  />
                  <input
                    type="number"
                    placeholder="Merma %"
                    value={ing.wastePercentage || ''}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setIngredients(ingredients.map((i) => i.id === ing.id ? { ...i, wastePercentage: val } : i));
                    }}
                    className="col-span-2 sm:col-span-2 bg-white border border-slate-300 rounded-lg p-1.5 text-center font-semibold"
                  />
                  <input
                    type="number"
                    step="0.1"
                    placeholder="€/kg"
                    value={ing.unitPriceKgOrL || ''}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setIngredients(ingredients.map((i) => i.id === ing.id ? { ...i, unitPriceKgOrL: val } : i));
                    }}
                    className="col-span-2 sm:col-span-1 bg-white border border-slate-300 rounded-lg p-1.5 text-right font-bold text-emerald-950"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(ing.id)}
                    className="col-span-1 p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg flex justify-center transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 6. UTILLAJE Y MAQUINARIA */}
          <div className="border border-slate-200 rounded-2xl p-4 space-y-2 bg-white">
            <div className="flex items-center justify-between border-b pb-1">
              <h3 className="font-bold text-emerald-950 uppercase text-xs">
                6. UTILLAJE Y MAQUINARIA DE TALLER
              </h3>
              <button
                type="button"
                onClick={() => handleAddArrayItem(setUtensils, utensils)}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Añadir Utensilio
              </button>
            </div>
            {utensils.length === 0 ? (
              <p className="text-slate-400 italic text-[11px]">En blanco (Se generará automáticamente con IA)</p>
            ) : (
              <div className="space-y-1.5">
                {utensils.map((u, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={u}
                      onChange={(e) => handleUpdateArrayItem(setUtensils, utensils, idx, e.target.value)}
                      placeholder="Ej: Batidora industrial de brazo, Cacerola inox 5L..."
                      className="flex-1 bg-slate-50 border border-slate-300 rounded-lg p-1.5 text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveArrayItem(setUtensils, utensils, idx)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 7. PREELABORACIÓN */}
          <div className="border border-slate-200 rounded-2xl p-4 space-y-2 bg-white">
            <div className="flex items-center justify-between border-b pb-1">
              <h3 className="font-bold text-emerald-950 uppercase text-xs">
                7. PREELABORACIÓN (MISE EN PLACE)
              </h3>
              <button
                type="button"
                onClick={() => handleAddArrayItem(setPreSteps, preSteps)}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Añadir Paso
              </button>
            </div>
            {preSteps.length === 0 ? (
              <p className="text-slate-400 italic text-[11px]">En blanco (Se generará automáticamente con IA)</p>
            ) : (
              <div className="space-y-1.5">
                {preSteps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="font-mono font-bold text-emerald-900 w-5 shrink-0 text-center">{idx + 1}.</span>
                    <input
                      type="text"
                      value={step}
                      onChange={(e) => handleUpdateArrayItem(setPreSteps, preSteps, idx, e.target.value)}
                      placeholder="Paso de mise en place, pelado, corte o soplado..."
                      className="flex-1 bg-slate-50 border border-slate-300 rounded-lg p-1.5 text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveArrayItem(setPreSteps, preSteps, idx)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 8. ELABORACIÓN PASO A PASO */}
          <div className="border border-slate-200 rounded-2xl p-4 space-y-2 bg-white">
            <div className="flex items-center justify-between border-b pb-1">
              <h3 className="font-bold text-emerald-950 uppercase text-xs">
                8. ELABORACIÓN (PROCESO CULINARIO PASO A PASO)
              </h3>
              <button
                type="button"
                onClick={() => handleAddArrayItem(setElaSteps, elaSteps)}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Añadir Paso
              </button>
            </div>
            {elaSteps.length === 0 ? (
              <p className="text-slate-400 italic text-[11px]">En blanco (Se generará automáticamente con IA)</p>
            ) : (
              <div className="space-y-1.5">
                {elaSteps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="font-mono font-bold text-emerald-900 w-5 shrink-0 text-center">{idx + 1}.</span>
                    <textarea
                      rows={1}
                      value={step}
                      onChange={(e) => handleUpdateArrayItem(setElaSteps, elaSteps, idx, e.target.value)}
                      placeholder="Paso de cocción, salteado, triturado, sazonado o emulsionado..."
                      className="flex-1 bg-slate-50 border border-slate-300 rounded-lg p-1.5 text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveArrayItem(setElaSteps, elaSteps, idx)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 9. TÉCNICAS CULINARIAS */}
          <div className="border border-slate-200 rounded-2xl p-4 space-y-2 bg-white">
            <div className="flex items-center justify-between border-b pb-1">
              <h3 className="font-bold text-emerald-950 uppercase text-xs">
                9. TÉCNICAS CULINARIAS APLICADAS
              </h3>
              <button
                type="button"
                onClick={() => handleAddArrayItem(setAppliedTechniques, appliedTechniques)}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Añadir Técnica
              </button>
            </div>
            {appliedTechniques.length === 0 ? (
              <p className="text-slate-400 italic text-[11px]">En blanco (Se generará automáticamente con IA)</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {appliedTechniques.map((tech, idx) => (
                  <div key={idx} className="flex items-center gap-1 bg-slate-100 border border-slate-300 rounded-lg p-1 text-slate-900">
                    <input
                      type="text"
                      value={tech}
                      onChange={(e) => handleUpdateArrayItem(setAppliedTechniques, appliedTechniques, idx, e.target.value)}
                      placeholder="Ej: Rehogado, Triturado..."
                      className="bg-transparent border-none text-xs font-bold focus:outline-none w-28"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveArrayItem(setAppliedTechniques, appliedTechniques, idx)}
                      className="text-rose-600 hover:bg-rose-200 rounded p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 10. INCIDENCIAS FRECUENTES */}
          <div className="border border-slate-200 rounded-2xl p-4 space-y-2 bg-white">
            <div className="flex items-center justify-between border-b pb-1">
              <h3 className="font-bold text-emerald-950 uppercase text-xs">
                10. INCIDENCIAS FRECUENTES Y POSIBLES CAUSAS
              </h3>
              <button
                type="button"
                onClick={handleAddIncidence}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Añadir Incidencia
              </button>
            </div>
            {frequentIncidences.length === 0 ? (
              <p className="text-slate-400 italic text-[11px]">En blanco (Se generará automáticamente con IA)</p>
            ) : (
              <div className="space-y-2">
                {frequentIncidences.map((inc, idx) => (
                  <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 items-center">
                    <input
                      type="text"
                      value={inc.incidence}
                      onChange={(e) => handleUpdateIncidence(idx, 'incidence', e.target.value)}
                      placeholder="Incidencia (Ej: La crema se corta)"
                      className="bg-white border border-slate-300 rounded-lg p-1.5 font-bold text-slate-900"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={inc.causes}
                        onChange={(e) => handleUpdateIncidence(idx, 'causes', e.target.value)}
                        placeholder="Posible Causa (Ej: Hervor excesivo con lácteo)"
                        className="flex-1 bg-white border border-slate-300 rounded-lg p-1.5 text-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveIncidence(idx)}
                        className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 11. PUNTOS CRÍTICOS Y APPCC */}
          <div className="border border-slate-200 rounded-2xl p-4 space-y-2 bg-white">
            <div className="flex items-center justify-between border-b pb-1">
              <h3 className="font-bold text-emerald-950 uppercase text-xs">
                11. PUNTOS CRÍTICOS Y SEGURIDAD ALIMENTARIA (APPCC)
              </h3>
              <button
                type="button"
                onClick={() => handleAddArrayItem(setCriticalPointsAppcc, criticalPointsAppcc)}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Añadir Punto
              </button>
            </div>
            {criticalPointsAppcc.length === 0 ? (
              <p className="text-slate-400 italic text-[11px]">En blanco (Se generará automáticamente con IA)</p>
            ) : (
              <div className="space-y-1.5">
                {criticalPointsAppcc.map((point, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={point}
                      onChange={(e) => handleUpdateArrayItem(setCriticalPointsAppcc, criticalPointsAppcc, idx, e.target.value)}
                      placeholder="Punto crítico APPCC (Ej: Mantener temperatura >65ºC en el servicio)"
                      className="flex-1 bg-slate-50 border border-slate-300 rounded-lg p-1.5 text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveArrayItem(setCriticalPointsAppcc, criticalPointsAppcc, idx)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 12, 13, 14. CONSERVACIÓN, REGENERACIÓN, PRESENTACIÓN */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-slate-200 rounded-2xl p-4 space-y-2 bg-white">
              <h3 className="font-bold text-emerald-950 uppercase text-xs border-b pb-1">
                12. CONSERVACIÓN
              </h3>
              <textarea
                rows={2}
                value={preservation}
                onChange={(e) => setPreservation(e.target.value)}
                placeholder="Tª, abatimiento, refrigeración (En blanco = Generar con IA)"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900"
              />
            </div>

            <div className="border border-slate-200 rounded-2xl p-4 space-y-2 bg-white">
              <h3 className="font-bold text-emerald-950 uppercase text-xs border-b pb-1">
                13. REGENERACIÓN
              </h3>
              <textarea
                rows={2}
                value={regeneration}
                onChange={(e) => setRegeneration(e.target.value)}
                placeholder="Instrucciones de recalentado y pase (En blanco = Generar con IA)"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900"
              />
            </div>

            <div className="border border-slate-200 rounded-2xl p-4 space-y-2 bg-white">
              <h3 className="font-bold text-emerald-950 uppercase text-xs border-b pb-1">
                14. PRESENTACIÓN Y EMPLATADO
              </h3>
              <textarea
                rows={2}
                value={presentation}
                onChange={(e) => setPresentation(e.target.value)}
                placeholder="Vajilla, guarnición y emplatado (En blanco = Generar con IA)"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900"
              />
            </div>
          </div>

          {/* 15. ALÉRGENOS */}
          <div className="border border-slate-200 rounded-2xl p-4 space-y-2 bg-white">
            <h3 className="font-bold text-emerald-950 uppercase text-xs border-b pb-1">
              15. CONTROL DE ALÉRGENOS (14 UE)
            </h3>
            <div className="flex flex-wrap gap-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              {ALL_ALLERGENS.map((a) => {
                const isSelected = allergens.some((item) => formatAllergenName(item) === formatAllergenName(a.name));
                return (
                  <button
                    key={a.name}
                    type="button"
                    onClick={() => handleToggleAllergen(a.name)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border font-bold transition-all ${
                      isSelected
                        ? 'bg-rose-100 text-rose-950 border-rose-400 shadow-2xs scale-102'
                        : 'bg-white text-slate-500 border-slate-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    {a.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 16. VALOR NUTRICIONAL & 17. CRITERIOS DE CALIDAD */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-slate-200 rounded-2xl p-4 space-y-2 bg-white">
              <h3 className="font-bold text-emerald-950 uppercase text-xs border-b pb-1">
                16. VALOR NUTRICIONAL
              </h3>
              <textarea
                rows={3}
                value={nutritionalValue}
                onChange={(e) => setNutritionalValue(e.target.value)}
                placeholder="Análisis cualitativo o valores nutricionales (En blanco = Generar con IA)"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900"
              />
            </div>

            <div className="border border-slate-200 rounded-2xl p-4 space-y-2 bg-white">
              <div className="flex items-center justify-between border-b pb-1">
                <h3 className="font-bold text-emerald-950 uppercase text-xs">
                  17. CRITERIOS DE CALIDAD DEL RESULTADO FINAL
                </h3>
                <button
                  type="button"
                  onClick={() => handleAddArrayItem(setQualityCriteria, qualityCriteria)}
                  className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Añadir Criterio
                </button>
              </div>
              {qualityCriteria.length === 0 ? (
                <p className="text-slate-400 italic text-[11px]">En blanco (Se generará automáticamente con IA)</p>
              ) : (
                <div className="space-y-1.5">
                  {qualityCriteria.map((q, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={q}
                        onChange={(e) => handleUpdateArrayItem(setQualityCriteria, qualityCriteria, idx, e.target.value)}
                        placeholder="Ej: Textura suave y cremosa sin grumos"
                        className="flex-1 bg-slate-50 border border-slate-300 rounded-lg p-1.5 text-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveArrayItem(setQualityCriteria, qualityCriteria, idx)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t flex flex-col sm:flex-row justify-between items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleCompleteEmptyFieldsWithAi}
              disabled={isCompletingWithAi}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 font-bold px-4 py-2.5 rounded-xl text-xs transition-all disabled:opacity-50"
            >
              <Wand2 className="w-4 h-4 text-amber-600" />
              <span>{isCompletingWithAi ? 'Completando con IA...' : 'Completar Campos Vacíos con IA'}</span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex items-center justify-center gap-1.5 bg-emerald-950 hover:bg-emerald-900 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-all shadow-md"
              >
                <Save className="w-4 h-4 text-amber-400" />
                <span>Guardar Ficha Oficial</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
