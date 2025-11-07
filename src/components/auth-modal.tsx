// components/auth-modal.tsx
'use client';

import { useEffect } from 'react';
import {
  Wallet,
  CheckCircle2,
  Loader2,
  X,
  ArrowRight,
  Shield,
  Sparkles
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  authStep: 'disconnected' | 'connected' | 'signing' | 'verified';
  address?: string;
  onConnectWallet: () => void;
  onSignMessage: () => void;
  onDisconnect: () => void;
  isSigning?: boolean;
}

export const AuthModal = ({
  isOpen,
  onClose,
  authStep,
  address,
  onConnectWallet,
  onSignMessage,
  onDisconnect,
  isSigning = false
}: AuthModalProps) => {

  useEffect(() => {
    if (authStep === 'verified') {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [authStep, onClose]);

  const steps = [
    { id: 1, name: 'Conectar Wallet', status: authStep === 'disconnected' ? 'current' : 'completed' },
    {
      id: 2, name: 'Firmar Mensaje', status:
        authStep === 'connected' ? 'current' :
          authStep === 'signing' ? 'current' :
            authStep === 'verified' ? 'completed' : 'upcoming'
    },
    { id: 3, name: 'Verificado', status: authStep === 'verified' ? 'current' : 'upcoming' }
  ];

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md mx-4 bg-white rounded-xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900 font-heading">
            Verificar Identidad
          </h2>
          {authStep !== 'signing' && authStep !== 'verified' && (
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Progress Steps */}
        <div className="px-6 pt-6">
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center flex-1">
                <div className="flex items-center w-full">
                  {/* Línea conectadora */}
                  {index > 0 && (
                    <div className={`flex-1 h-1 ${step.status === 'completed' || step.status === 'current'
                      ? 'bg-primary'
                      : 'bg-gray-200'
                      }`} />
                  )}

                  {/* Círculo del paso */}
                  <div className={`
                    relative flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-medium
                    ${step.status === 'completed'
                      ? 'bg-primary border-secondary text-white'
                      : step.status === 'current'
                        ? 'border-secondary bg-white text-secondary'
                        : 'border-gray-300 bg-white text-gray-400'
                    }
                  `}>
                    {step.status === 'completed' ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      step.id
                    )}
                  </div>

                  {/* Línea conectadora */}
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-1 ${step.status === 'completed'
                      ? 'bg-primary'
                      : 'bg-gray-200'
                      }`} />
                  )}
                </div>

                {/* Nombre del paso */}
                <span className={`
                  mt-2 text-xs font-medium text-center 
                  ${step.status === 'current' ? 'text-primary' : 'text-gray-500'}
                `}>
                  {step.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {authStep === 'disconnected' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-gray-50" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Conecta tu Wallet
              </h3>
              <p className="text-gray-600 mb-6">
                Para comenzar, conecta tu wallet preferida. Esto nos permite identificar tu dirección de Ethereum de forma segura.
              </p>
              <button
                onClick={onConnectWallet}
                className="w-full py-3 bg-secondary text-white rounded-lg hover:bg-secondary-accent transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Wallet className="w-5 h-5" />
                Conectar Wallet
              </button>
            </div>
          )}

          {authStep === 'connected' && address && (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Wallet Conectada
              </h3>
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-sm font-mono text-gray-800">
                  {truncateAddress(address)}
                </p>
              </div>
              <p className="text-gray-600 mb-6">
                ¡Perfecto! Ahora necesitamos que firmes un mensaje para verificar que eres el propietario de esta wallet.
              </p>
              <div className="space-y-3">
                <button
                  onClick={onSignMessage}
                  disabled={isSigning}
                  className="w-full py-3 bg-secondary text-white rounded-lg hover:bg-secondary-accent transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSigning ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Shield className="w-5 h-5" />
                  )}
                  {isSigning ? 'Preparando...' : 'Firmar Mensaje'}
                </button>
                <button
                  onClick={onDisconnect}
                  className="w-full py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Wallet className="w-4 h-4" />
                  Usar Otra Wallet
                </button>
              </div>
            </div>
          )}

          {authStep === 'signing' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-8 h-8 text-secondary animate-spin" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Verificando Identidad
              </h3>
              <p className="text-gray-600 mb-4">
                Por favor, confirma la firma del mensaje en tu wallet. Esto demuestra que eres el propietario legítimo.
              </p>
              <div className="bg-[#7868E5]/10 border border-[#7868E5]/20 rounded-lg p-4">
                <div className="text-sm text-[#7868E5] flex items-center gap-2">
                  <Shield className="w-8 h-8" />
                  <div className="flex flex-col items-start pl-2">
                    <strong>No se requiere gas</strong>
                    Firmar un mensaje es gratis y no consume ETH
                  </div>
                </div>
              </div>
            </div>
          )}

          {authStep === 'verified' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ¡Identidad Verificada!
              </h3>
              <p className="text-gray-600 mb-4">
                Tu identidad ha sido verificada exitosamente. Ya puedes acceder a todas las funciones.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Redirigiendo...
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="px-6 pb-6">
          <div className="border-t pt-4">
            <div className="flex items-start gap-3 text-sm text-gray-600">
              <Shield className="w-5 h-5 text-secondary mt-0.5" />
              <div>
                <p className="font-medium">Tu seguridad es importante</p>
                <p className="text-xs mt-1">
                  Solo verificamos tu propiedad de la wallet. No podemos realizar transacciones sin tu autorización.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};