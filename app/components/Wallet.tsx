import React from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

const Wallet: React.FC = () => {
  const { isConnected } = useAccount();
  const { connect } = useConnect()
  const { disconnect } = useDisconnect();

  return (
    <div className="wallet-container">
      {isConnected ? (
        <>
          <button onClick={() => disconnect()}>Disconnect</button>
        </>
      ) : (
        <button onClick={() => {
          connect({ connector: injected() })
        }}>Connect Wallet</button>
      )}
    </div>
  );
};

export default Wallet;
