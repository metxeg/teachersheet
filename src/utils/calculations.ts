import { AllergenType, RecipeSheet } from '../types';

export const ALL_ALLERGENS: { name: AllergenType; code: string }[] = [
  { name: 'Gluten', code: 'GLU' },
  { name: 'Crustáceos', code: 'CRU' },
  { name: 'Huevos', code: 'HUE' },
  { name: 'Pescado', code: 'PES' },
  { name: 'Cacahuetes', code: 'CAC' },
  { name: 'Soja', code: 'SOJ' },
  { name: 'Lácteos', code: 'LAC' },
  { name: 'Frutos de cáscara', code: 'FRU' },
  { name: 'Apio', code: 'API' },
  { name: 'Mostaza', code: 'MOS' },
  { name: 'Sésamo', code: 'SES' },
  { name: 'Dióxido de azufre y sulfitos', code: 'SUL' },
  { name: 'Altramuces', code: 'ALT' },
  { name: 'Moluscos', code: 'MOL' },
];

export function formatAllergenName(name: string): string {
  if (!name) return '';
  if (name.toUpperCase() === 'LÁCTEOS' || name.toUpperCase() === 'LACTEOS') {
    return 'Lácteos';
  }
  const found = ALL_ALLERGENS.find((a) => a.name.toLowerCase() === name.toLowerCase());
  if (found) return found.name;
  return name;
}

export interface RecipeCalculatedCosts {
  totalRawMaterialCostBase: number;
  costPerPortionBase: number;
  suggestedPvpNoIva: number;
  suggestedPvpWithIva10: number;
}

export function calculateRecipeSheetCosts(recipe: RecipeSheet): RecipeCalculatedCosts {
  let totalRawCost = 0;

  recipe.ingredients.forEach((ing) => {
    const price = ing.unitPriceKgOrL || 2.5; // fallback
    const weightGrams = ing.grossWeightGrams || 100;
    const cost = (weightGrams / 1000) * price;
    totalRawCost += cost;
  });

  const portions = Math.max(1, recipe.generalData.portions || 1);
  const costPerPortion = totalRawCost / portions;

  const targetFcPct = (recipe.targetFoodCostPercentage || 30) / 100;
  const pvpNoIva = costPerPortion / (targetFcPct || 0.3);
  const pvpWithIva = pvpNoIva * 1.10; // 10% IVA hostelería

  return {
    totalRawMaterialCostBase: totalRawCost,
    costPerPortionBase: costPerPortion,
    suggestedPvpNoIva: pvpNoIva,
    suggestedPvpWithIva10: pvpWithIva,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
