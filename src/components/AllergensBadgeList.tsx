import React from 'react';
import { AllergenType } from '../types';
import { ALL_ALLERGENS, formatAllergenName } from '../utils/calculations';
import { AlertCircle } from 'lucide-react';

interface AllergensBadgeListProps {
  recipeAllergens: AllergenType[];
  size?: 'sm' | 'md' | 'lg';
}

export const AllergensBadgeList: React.FC<AllergensBadgeListProps> = ({
  recipeAllergens = [],
  size = 'md',
}) => {
  if (!recipeAllergens || recipeAllergens.length === 0) {
    return (
      <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium italic">
        <span>Sin alérgenos declarados</span>
      </div>
    );
  }

  const badgeSizeClass =
    size === 'sm'
      ? 'text-[10px] px-2 py-0.5 rounded-md'
      : size === 'lg'
      ? 'text-xs px-3 py-1 rounded-xl'
      : 'text-[11px] px-2.5 py-1 rounded-lg';

  return (
    <div className="flex flex-wrap gap-1.5 items-center">
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mr-1 shrink-0 flex items-center gap-1">
        <AlertCircle className="w-3 h-3 text-rose-500" /> Alérgenos ({recipeAllergens.length}):
      </span>

      {recipeAllergens.map((rawAllergen) => {
        const allergenName = formatAllergenName(rawAllergen);
        const found = ALL_ALLERGENS.find((a) => a.name.toLowerCase() === allergenName.toLowerCase());

        return (
          <span
            key={rawAllergen}
            title={allergenName}
            className={`bg-rose-100 text-rose-950 border border-rose-300 font-bold shadow-2xs ${badgeSizeClass}`}
          >
            {allergenName}
          </span>
        );
      })}
    </div>
  );
};
