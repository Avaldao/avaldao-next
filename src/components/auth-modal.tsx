// components/auth-modal.tsx
'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Wallet,
  CheckCircle2,
  Loader2,
  X,
  ArrowRight,
  Shield,
  Sparkles
} from 'lucide-react';
import { getAddress } from 'ethers';
import { Language, translations } from '@/translations';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  authStep: 'disconnected' | 'connected' | 'signing' | 'verified';
  address?: string;
  onConnectWallet: () => void;
  onSignMessage: () => void;
  onChangeWallet: () => void;
  onDisconnect: () => void;
  isSigning?: boolean;
  language?: Language;
}

export const AuthModal = ({
  isOpen,
  onClose,
  authStep,
  address,
  onConnectWallet,
  onSignMessage,
  onChangeWallet,
  onDisconnect,
  isSigning = false,
  language = 'es'
}: AuthModalProps) => {
  const [mounted, setMounted] = useState(false);

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (authStep === 'verified') {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [authStep, onClose]);

  const steps = [
    { id: 1, name: t('auth.modal.step.connect-wallet'), status: authStep === 'disconnected' ? 'current' : 'completed' },
    {
      id: 2, name: t('auth.modal.step.sign-message'), status:
        authStep === 'connected' ? 'current' :
          authStep === 'signing' ? 'current' :
            authStep === 'verified' ? 'completed' : 'upcoming'
    },
    { id: 3, name: t('auth.modal.step.verified'), status: authStep === 'verified' ? 'current' : 'upcoming' }
  ];

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-zinc-900 shadow-xl ring-1 ring-black/5 dark:ring-white/10 overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              {t('auth.modal.title')}
            </h2>
            {authStep !== 'signing' && authStep !== 'verified' && (
              <button
                onClick={handleClose}
                className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center flex-1">
                <div className="flex items-center w-full">
                  {/* Línea conectadora */}
                  {index > 0 && (
                    <div className={`flex-1 h-0.5 ${step.status === 'completed' || step.status === 'current'
                      ? 'bg-violet-500'
                      : 'bg-zinc-200 dark:bg-zinc-700'
                      }`} />
                  )}

                  {/* Círculo del paso */}
                  <div className={`
                    relative flex items-center justify-center w-7 h-7 rounded-full border-2 text-xs font-medium
                    ${step.status === 'completed'
                      ? 'bg-violet-500 border-violet-500 text-white'
                      : step.status === 'current'
                        ? 'border-violet-500 bg-white dark:bg-zinc-900 text-violet-500'
                        : 'border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500'
                    }
                  `}>
                    {step.status === 'completed' ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      step.id
                    )}
                  </div>

                  {/* Línea conectadora */}
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 ${step.status === 'completed'
                      ? 'bg-violet-500'
                      : 'bg-zinc-200 dark:bg-zinc-700'
                      }`} />
                  )}
                </div>

                {/* Nombre del paso */}
                <span className={`
                  mt-2 text-[11px] font-medium text-center 
                  ${step.status === 'current' ? 'text-violet-500' : 'text-zinc-400 dark:text-zinc-500'}
                `}>
                  {step.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-4">
          {authStep === 'disconnected' && (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 bg-violet-100 dark:bg-violet-950/40 rounded-full flex items-center justify-center mx-auto">
                <Wallet className="w-7 h-7 text-violet-600 dark:text-violet-400" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                  {t('auth.modal.connect.title')}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {t('auth.modal.connect.description')}
                </p>
              </div>
              <button
                onClick={onConnectWallet}
                className="w-full rounded-xl py-2.5 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 transition-colors flex items-center justify-center gap-2"
              >
                <Wallet className="w-4 h-4" />
                {t('auth.modal.connect.button')}
              </button>
            </div>
          )}

          {authStep === 'connected' && address && (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/40 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                  {t('auth.modal.connected.title')}
                </h3>
                <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800 ring-1 ring-zinc-100 dark:ring-zinc-700 px-3 py-2 mt-2">
                  <p className="text-xs font-mono text-zinc-700 dark:text-zinc-300">
                    {truncateAddress(getAddress(address))}
                  </p>
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 pt-2">
                  {t('auth.modal.connected.description')}
                </p>
              </div>
              <div className="space-y-2">
                <button
                  onClick={onSignMessage}
                  disabled={isSigning}
                  className="w-full rounded-xl py-2.5 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {isSigning ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Shield className="w-4 h-4" />
                  )}
                  {isSigning ? t('auth.modal.connected.signing-button') : t('auth.modal.connected.sign-button')}
                </button>
                <button
                  onClick={onChangeWallet}
                  className="w-full rounded-xl py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Wallet className="w-4 h-4" />
                  {t('auth.modal.connected.change-wallet')}
                </button>
              </div>
            </div>
          )}

          {authStep === 'signing' && (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 bg-violet-100 dark:bg-violet-950/40 rounded-full flex items-center justify-center mx-auto">
                <Loader2 className="w-7 h-7 text-violet-600 dark:text-violet-400 animate-spin" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                  {t('auth.modal.signing.title')}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {t('auth.modal.signing.description')}
                </p>
              </div>
              <div className="rounded-lg bg-violet-50 dark:bg-violet-950/40 ring-1 ring-violet-100 dark:ring-violet-900 px-4 py-3">
                <div className="flex items-center gap-2.5 text-left">
                  <Shield className="w-5 h-5 text-violet-600 dark:text-violet-400 shrink-0" />
                  <div className="text-xs text-violet-700 dark:text-violet-400">
                    <div className="font-semibold">{t('auth.modal.signing.no-gas.title')}</div>
                    <div className="mt-0.5">{t('auth.modal.signing.no-gas.description')}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {authStep === 'verified' && (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/40 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                  {t('auth.modal.verified.title')}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {t('auth.modal.verified.description')}
                </p>
              </div>
              <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/40 ring-1 ring-emerald-100 dark:ring-emerald-900 px-4 py-2.5">
                <div className="flex items-center justify-center gap-2 text-xs text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  {t('auth.modal.verified.redirecting')}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="px-6 pb-6 pt-4">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-400">
            <Shield className="w-3.5 h-3.5" />
            {t('auth.modal.footer.title')}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};