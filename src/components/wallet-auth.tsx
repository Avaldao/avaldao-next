// components/WalletAuth.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAppKit, useAppKitAccount, useAppKitProvider, useDisconnect } from '@reown/appkit/react';
import { AuthModal } from './auth-modal';
import { Wallet, Loader2, CheckCircle2 } from 'lucide-react';
import { BrowserProvider, getAddress } from 'ethers';
import { Eip1193Provider } from 'ethers';
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AccountDropdown } from './account-dropdown';
import { AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';


export const truncateAddress = (addr: string) => {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
};

type AuthStep = 'disconnected' | 'connected' | 'signing' | 'verified';

const WalletAuth = () => {
  const { data: session, status } = useSession();
  const { t, language } = useLanguage();
  const [authStep, setAuthStep] = useState<AuthStep>('disconnected');
  const [showAuthModal, setShowAuthModal] = useState(false);

  const { open } = useAppKit();
  const { walletProvider } = useAppKitProvider<Eip1193Provider>("eip155");
  const { isConnected, address } = useAppKitAccount();
  const { disconnect } = useDisconnect();
  const router = useRouter();

  useEffect(() => {
    if (status == "authenticated" && address) {
      setAuthStep('verified');
    }
  }, [status, address])


  // Sincronizar estado con conexión de wallet
  useEffect(() => {
    if (isConnected && address) {
      setAuthStep('connected');
    } else {
      setAuthStep('disconnected');
    }
  }, [isConnected, address]);



  const handleOpenAuth = () => {
    setShowAuthModal(true);
    if (!isConnected) {
      setAuthStep('disconnected');
    } else {
      setAuthStep('connected');
    }
  };

  const handleConnectWallet = async () => {
    try {
      setAuthStep('disconnected');
      await open({ view: 'Connect' });
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };


  const getMessage = async () => {
    const response = await fetch(`/api/challenges?address=${address}`)
    const data = await response.json();
    return data.message;
  }

  const handleSignMessage = async () => {
    try {
      setAuthStep('signing');

      const message = await getMessage();
      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();
      const signature = await signer.signMessage(message);

      const response = await signIn("message-signature", {
        redirect: false,
        message,
        signature,
      });

      if (response?.error != undefined) {
        if (response.error == "USER_NOT_FOUND") {
          localStorage.setItem("auth_message", message);
          localStorage.setItem("auth_signature", signature);

          localStorage.setItem("auth_ts", Date.now().toString());

          router.push("/users/signup");
        }

        console.log("handle errors", response.error)
      } else if (response?.ok) {
        router.refresh();
      }

      // Una vez firmado exitosamente
      setAuthStep('verified');

      // Cerrar modal automáticamente después de éxito
      setTimeout(() => {
        setShowAuthModal(false);
      }, 1500);

    } catch (error) {
      console.error('Error signing message:', error);
      setAuthStep('connected'); // Volver al paso anterior en caso de error
    }
  };

  const handleDisconnect = async () => {
    await disconnect(); //await disconnect y llevarlo al punto 1
    setAuthStep('disconnected');
    setShowAuthModal(false);
  };

  const getButtonContent = () => {
    switch (authStep) {
      case 'verified':
        return (
          <>
            <CheckCircle2 className="w-4 h-4" />
            {address && truncateAddress(getAddress(address!))}
          </>
        );
      case 'signing':
        return (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Firmando...
          </>
        );
      case 'connected':
        return (
          <>
            <Wallet className="w-4 h-4" />
            {t('auth.modal.verify-identity')}
          </>
        );
      default:
        return (
          <>
            <Wallet className="w-4 h-4" />
            {t('auth.modal.connect.button')}
          </>
        );
    }
  };

  const getButtonVariant = () => {
    switch (authStep) {
      case 'verified':
        return 'success';
      case 'signing':
        return 'loading';
      case 'connected':
        return 'primary';
      default:
        return 'default';
    }
  };

  return (
    <>
      {authStep == "verified" && address ? (
        <AnimatePresence>
          <AccountDropdown address={getAddress(address)} />
        </AnimatePresence>

      ) : (
        <button
          onClick={handleOpenAuth}
          className={`
            flex min-w-35 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 shadow-md
            ${getButtonVariant() === 'success'
              ? 'bg-emerald-500 text-white hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/30'
              : getButtonVariant() === 'loading'
                ? 'cursor-not-allowed bg-violet-400 text-white'
                : getButtonVariant() === 'primary'
                  ? 'bg-linear-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-700 hover:to-fuchsia-700 hover:shadow-lg hover:shadow-violet-500/40'
                  : 'bg-linear-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-700 hover:to-fuchsia-700 hover:shadow-lg hover:shadow-violet-500/40'
            }
          `}
          disabled={authStep === 'signing'}
        >
          {getButtonContent()}
        </button>
      )}



      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        authStep={authStep}
        address={address}
        onConnectWallet={handleConnectWallet}
        onSignMessage={handleSignMessage}
        onDisconnect={handleDisconnect}
        isSigning={authStep === 'signing'}
        language={language}
      />
    </>
  );
};

export default WalletAuth;


