import React from 'react';
import { AlertCircle, Trash2, CheckCircle2 } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  targetName?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  targetName,
  onConfirm,
  onCancel,
  isDeleting = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-rose-100 max-w-sm w-full p-5 sm:p-6 text-center animate-scaleUp">
        <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
          <Trash2 className="w-6 h-6 text-rose-500 animate-pulse" />
        </div>

        <h3 className="text-lg font-black text-slate-800 tracking-tight mb-1">
          {title}
        </h3>

        {targetName && (
          <div className="inline-block px-3 py-1 bg-rose-50 text-rose-700 font-extrabold text-xs rounded-full mb-2">
            &quot;{targetName}&quot;
          </div>
        )}

        <p className="text-xs text-slate-500 leading-relaxed mb-5">
          {message}
        </p>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer shadow-md shadow-rose-600/25 flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {isDeleting ? (
              <span>삭제 중...</span>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>삭제하기</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
