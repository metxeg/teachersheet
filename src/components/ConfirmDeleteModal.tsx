import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  title,
  message,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 bg-rose-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-600 text-white rounded-xl shadow-md">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-serif uppercase tracking-tight">
                {title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-rose-300 hover:text-white rounded-xl hover:bg-rose-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          <p className="text-slate-700 font-medium text-sm leading-relaxed">
            {message}
          </p>

          <p className="text-[11px] text-slate-500 italic bg-slate-50 p-3 rounded-xl border border-slate-200">
            Esta acción no se puede deshacer. Se borrarán todos los datos escandallados y de alérgenos de esta ficha.
          </p>

          {/* Actions */}
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
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex items-center gap-2 px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md transition-all"
            >
              <Trash2 className="w-4 h-4" />
              <span>Sí, Eliminar Ficha</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
