'use client';

import { useEffect } from 'react';
import { CheckCircle2, Loader2, X, Send, AlertCircle } from 'lucide-react';

export type TxStep = 'waiting_wallet' | 'waiting_confirmation' | 'confirmed' | 'error';

interface TxModalProps {
  isOpen: boolean;
  onClose: () => void;
  step: TxStep;
  errorMessage?: string;
  txHash?: string;
  explorerUrl?: string;
  networkName?: string;
}

export const TxModal = ({ isOpen, onClose, step, errorMessage, txHash, explorerUrl, networkName }: TxModalProps) => {
  useEffect(() => {
    if (step === 'confirmed') {
      const timer = setTimeout(() => onClose(), 3000);
      return () => clearTimeout(timer);
    }
  }, [step, onClose]);

  if (!isOpen) return null;

  const canClose = step !== 'waiting_confirmation';

  const stepsConfig = [
    {
      id: 1,
      name: 'Enviar desde wallet',
      status:
        step === 'waiting_wallet' ? 'current'
          : step === 'error' && !txHash ? 'error'
            : 'completed',
    },
    {
      id: 2,
      name: 'Confirmación',
      status:
        step === 'waiting_wallet' ? 'upcoming'
          : step === 'waiting_confirmation' ? 'current'
            : step === 'confirmed' ? 'completed'
              : step === 'error' && txHash ? 'error'
                : 'upcoming',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md mx-4 bg-white rounded-xl shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 font-heading">
              Transacción en curso
            </h2>
            {networkName && (
              <span className="text-xs text-gray-500 font-medium">{networkName}</span>
            )}
          </div>
          {canClose && (
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Progress Steps */}
        <div className="px-6 pt-6">
          <div className="flex items-center justify-between mb-8">
            {stepsConfig.map((s, index) => (
              <div key={s.id} className="flex flex-col items-center flex-1">
                <div className="flex items-center w-full">
                  {index > 0 && (
                    <div className={`flex-1 h-1 ${
                      s.status === 'completed' || s.status === 'current'
                        ? 'bg-primary'
                        : 'bg-gray-200'
                    }`} />
                  )}

                  <div className={`
                    relative flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-medium
                    ${s.status === 'completed'
                      ? 'bg-primary border-secondary text-white'
                      : s.status === 'current'
                        ? 'border-secondary bg-white text-secondary'
                        : s.status === 'error'
                          ? 'border-red-500 bg-red-50 text-red-500'
                          : 'border-gray-300 bg-white text-gray-400'
                    }
                  `}>
                    {s.status === 'completed' ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : s.status === 'error' ? (
                      <AlertCircle className="w-4 h-4" />
                    ) : s.status === 'current' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      s.id
                    )}
                  </div>

                  {index < stepsConfig.length - 1 && (
                    <div className={`flex-1 h-1 ${
                      s.status === 'completed' ? 'bg-primary' : 'bg-gray-200'
                    }`} />
                  )}
                </div>

                <span className={`
                  mt-2 text-xs font-medium text-center
                  ${s.status === 'current' ? 'text-primary' : 'text-gray-500'}
                `}>
                  {s.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 pt-2">
          {step === 'waiting_wallet' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Confirmar en tu wallet
              </h3>
              <p className="text-gray-600 mb-4">
                Por favor, revisá y confirmá la transacción en tu wallet para continuar.
              </p>
              <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4">
                <div className="flex items-center gap-2 text-sm text-secondary justify-center">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Esperando acción en wallet...
                </div>
              </div>
            </div>
          )}

          {step === 'waiting_confirmation' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-8 h-8 text-secondary animate-spin" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Esperando confirmación
              </h3>
              <p className="text-gray-600 mb-4">
                La transacción fue enviada. Aguardando confirmación en la blockchain...
              </p>
              {txHash && explorerUrl && (
                <a
                  href={`${explorerUrl}/tx/${txHash}`}
                  target="_blank"
                  className="text-xs text-secondary underline underline-offset-2"
                >
                  Ver en explorador
                </a>
              )}
            </div>
          )}

          {step === 'confirmed' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ¡Transacción confirmada!
              </h3>
              <p className="text-gray-600 mb-4">
                La operación se completó exitosamente.
              </p>
              {txHash && explorerUrl && (
                <a
                  href={`${explorerUrl}/tx/${txHash}`}
                  target="_blank"
                  className="text-xs text-secondary underline underline-offset-2"
                >
                  Ver en explorador
                </a>
              )}
            </div>
          )}

          {step === 'error' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Error en la transacción
              </h3>
              <p className="text-gray-600 mb-4">
                {errorMessage || 'Ocurrió un error al procesar la transacción.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
