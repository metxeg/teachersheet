export type RecipeCategory = 
  | 'CREMAS Y SOPAS'
  | 'PASTELERÍA'
  | 'COCINA CALIENTE'
  | 'COCINA FRÍA'
  | 'PANADERÍA'
  | 'SALSAS Y FONDOS'
  | 'POSTRES DE RESTAURANTE'
  | 'GARDE MANGER'
  | 'PESCADOS Y MARISCOS'
  | 'CARNES Y AVES';

export type EducationalLevel = 'Grado Básico' | 'Grado Medio' | 'Grado Superior';

export type DifficultyLevel = 'BAJA' | 'MEDIA' | 'ALTA' | 'EXPERTO';

export type AllergenType = 
  | 'Gluten'
  | 'Crustáceos'
  | 'Huevos'
  | 'Pescado'
  | 'Cacahuetes'
  | 'Soja'
  | 'Lácteos'
  | 'Frutos de cáscara'
  | 'Apio'
  | 'Mostaza'
  | 'Sésamo'
  | 'Dióxido de azufre y sulfitos'
  | 'Altramuces'
  | 'Moluscos';

export interface IngredientItem {
  id: string;
  name: string;
  quantity: string; // e.g. "700 g", "2 litros", "c/s"
  grossWeightGrams?: number; // Para cálculo de escandallo
  wastePercentage?: number;
  unitPriceKgOrL?: number; // Precio en €/kg o €/L
}

export interface FrequentIncidence {
  incidence: string;
  causes: string;
}

export interface RelatedModules {
  fpBasica?: string[];
  gradoMedio?: string[];
  gradoSuperior?: string[];
}

export interface RecipeFolder {
  id: string;
  name: string;
  description?: string;
  color?: string; // e.g. 'emerald', 'amber', 'indigo', 'rose', 'sky'
  createdAt: string;
}

export interface RecipeSheet {
  id: string;
  folderId?: string; // ID de la carpeta contenedora si está archivada
  code: string; // Ej: CS-01
  category: RecipeCategory;
  title: string; // Ej: VICHYSSOISE
  subtitle?: string;
  imageUrl?: string;
  
  // 1. DATOS GENERALES
  generalData: {
    portions: number;
    preElaborationMinutes: number;
    elaborationMinutes: number;
    totalMinutes: number;
    difficulty: DifficultyLevel;
  };

  // 2. OBJETIVO DE LA ELABORACIÓN
  objective: string;

  // 3. NIVEL FORMATIVO RECOMENDADO
  recommendedLevel: EducationalLevel;

  // 4. MÓDULOS PROFESIONALES RELACIONADOS
  relatedModules: RelatedModules;

  // 5. INGREDIENTES
  ingredients: IngredientItem[];

  // 6. UTILLAJE Y MAQUINARIA
  utensilsAndMachinery: string[];

  // 7. PREELABORACIÓN (pasos numerados)
  preElaborationSteps: string[];

  // 8. ELABORACIÓN (pasos numerados)
  elaborationSteps: string[];

  // 9. TÉCNICAS CULINARIAS APLICADAS
  appliedTechniques: string[];

  // 10. INCIDENCIAS FRECUENTES Y POSIBLES CAUSAS
  frequentIncidences: FrequentIncidence[];

  // 11. PUNTOS CRÍTICOS / APPCC
  criticalPointsAppcc: string[];

  // 12. CONSERVACIÓN
  preservation: string;

  // 13. REGENERACIÓN
  regeneration: string;

  // 14. PRESENTACIÓN
  presentation: string;

  // 15. ALÉRGENOS
  allergens: AllergenType[];

  // 16. VALOR NUTRICIONAL
  nutritionalValue: string;

  // 17. CRITERIOS DE CALIDAD DEL RESULTADO FINAL
  qualityCriteria: string[];

  // ESCANDALLO Y COSTES (Para gestión del docente)
  targetFoodCostPercentage?: number;
  createdAt: string;
  updatedAt: string;
  isFavorite?: boolean;
}
