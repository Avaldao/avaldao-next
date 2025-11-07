// components/WalletAuth.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAppKit, useAppKitAccount, useAppKitProvider, useDisconnect } from '@reown/appkit/react';
import { AuthModal } from './auth-modal';
import { Wallet, Loader2, CheckCircle2 } from 'lucide-react';
import { Provider } from 'ethers';
import { BrowserProvider } from 'ethers';
import { Eip1193Provider } from 'ethers';

type AuthStep = 'disconnected' | 'connected' | 'signing' | 'verified';

const WalletAuth = () => {
  const [authStep, setAuthStep] = useState<AuthStep>('disconnected');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { open } = useAppKit();
  const { walletProvider } = useAppKitProvider<Eip1193Provider>("eip155");
  const { isConnected, address } = useAppKitAccount();
  const { disconnect } = useDisconnect();

  // Sincronizar estado con conexión de wallet
  useEffect(() => {
    if (isConnected && address) {
      setAuthStep('connected');
    } else {
      setAuthStep('disconnected');
    }
  }, [isConnected, address]);

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

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
      open({ view: 'Connect' });
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

      //get message from backend. to endpoint

      // /challenges/?connected addr, 
      const message = await getMessage();
      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();
      const signature = await signer.signMessage(message);

      //send signature to backend
      console.log("Signature:", signature);


      //Post request
      const response = await fetch("/api/sign-in", {
        method: "POST",
        body: JSON.stringify({
          message,
          signature
        })
      });

      const data = await response.json();
      console.log(data.user);





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

  const handleDisconnect = () => {
    disconnect();
    setAuthStep('disconnected');
    setShowAuthModal(false);
  };

  const getButtonContent = () => {
    switch (authStep) {
      case 'verified':
        return (
          <>
            <CheckCircle2 className="w-4 h-4" />
            {truncateAddress(address!)}
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
            Verificar Identidad
          </>
        );
      default:
        return (
          <>
            <Wallet className="w-4 h-4" />
            Conectar Wallet
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
      <button
        onClick={handleOpenAuth}
        className={`
          px-4 py-2 rounded-lg font-medium transition-all duration-300 min-w-[140px]
          flex items-center justify-center gap-2
          ${getButtonVariant() === 'success'
            ? 'bg-success text-white hover:bg-success-accent'
            : getButtonVariant() === 'loading'
              ? 'bg-violet-400 text-white cursor-not-allowed'
              : getButtonVariant() === 'primary'
                ? 'bg-secondary text-white hover:bg-secondary-accent'
                : 'bg-secondary text-gray-50 hover:bg-secondary-accent'
          }
        `}
        disabled={authStep === 'signing'}
      >
        {getButtonContent()}
      </button>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        authStep={authStep}
        address={address}
        onConnectWallet={handleConnectWallet}
        onSignMessage={handleSignMessage}
        onDisconnect={handleDisconnect}
        isSigning={authStep === 'signing'}
      />
    </>
  );
};

export default WalletAuth;