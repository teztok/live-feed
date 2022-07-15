import React from 'react';
import { DAppClient, NetworkType, PermissionScope } from '@airgap/beacon-sdk';
import { BeaconWallet } from '@taquito/beacon-wallet';

const DAppContext = React.createContext(undefined);

/**
 * React hook to get the instance of DAppClient (from @airgap/beacon-sdk)
 * @returns DAppClient
 */
const useDappClient = () => {
  const context = React.useContext(DAppContext);
  if (!context) {
    throw new Error('No DAppClient set, use WalletProvider to create and set one');
  }
  const { client, clientType } = context;
  if (typeof client === 'undefined') {
    return client;
  }
  const dappClient = clientType === 'taquito' ? client.client : client;
  return dappClient;
};

/**
 * React hook to get reset client method from provider
 */
const useContextData = () => {
  const context = React.useContext(DAppContext);
  if (!context) {
    throw new Error('No DAppClient set, use WalletProvider to create and set one');
  }
  const { resetClient, setAccountInfo, account } = context;
  return { resetClient, setAccountInfo, account };
};

/**
 * React hook to get the instance of BeaconWallet (from @taquito/beacon-wallet)
 * @returns BeaconWallet
 */
const useBeaconWallet = () => {
  const context = React.useContext(DAppContext);
  if (!context) {
    throw new Error('No BeaconWallet set, use WalletProvider to create and set one');
  }
  if (context.clientType === 'beacon') {
    throw new Error(`Provider was initialized with clientType: ${context.clientType}. Initialize provider with clientType: taquito`);
  }
  return context.client;
};

/**
 * Connect to the wallet
 * @param client DAppClient
 * @param network Network (optional)
 * @param rpcUrl string (optional)
 * @param networkName string (optional)
 * @param activeAccount AccountInfo (optional)
 * @returns Promise<AccountInfo | undefined>
 */
export const connectWallet = async (client, network, rpcUrl, networkName, activeAccount) => {
  const connectTo = network ? NetworkType[network] : client.preferredNetwork ?? NetworkType.MAINNET;
  let account = activeAccount ?? (await client.getActiveAccount());
  const opsRequest = account ? account.scopes.includes(PermissionScope.OPERATION_REQUEST) : undefined;
  const signRequest = account ? account.scopes.includes(PermissionScope.SIGN) : undefined;
  if (!opsRequest || !signRequest) {
    await client.requestPermissions({
      network: { type: connectTo, name: networkName, rpcUrl },
    });
    account = await client.getActiveAccount();
    localStorage.setItem('provider:wallet-connected', 'true');
  }

  return account;
};

/**
 * Disconnect from the wallet
 * @param client DAppClient
 */
export const disconnectWallet = async (client) => {
  localStorage.removeItem('provider:wallet-connected');
  await client.destroy();
};

/**
 * Sets up the wallet and returns
 * @param network Network (optional)
 * @param rpcUrl string (optional)
 * @param networkName string (optional)
 * @returns WalletResult
 */
const useWallet = (network, rpcUrl, networkName) => {
  const client = useDappClient();
  const { resetClient, setAccountInfo, account } = useContextData();
  const [connected, setConnected] = React.useState(false);
  const getAccountInfo = React.useCallback(async () => {
    const activeAccount = await client?.getActiveAccount();
    setAccountInfo(activeAccount);
  }, [client]); // eslint-disable-line
  React.useEffect(() => {
    getAccountInfo();
  }, [connected, client, getAccountInfo]);

  const connect = React.useCallback(async () => {
    if (client) {
      const accountInfo = await connectWallet(client, network, rpcUrl, networkName, account);
      if (accountInfo) {
        setAccountInfo(accountInfo);
        setConnected(true);
      }
      return accountInfo;
    }
    return undefined;
  }, [account, client, network, networkName, rpcUrl, setAccountInfo]);
  const disconnect = React.useCallback(async () => {
    if (client) {
      await disconnectWallet(client);
      resetClient();
      setConnected(false);
    }
  }, [client, resetClient, connected]); // eslint-disable-line

  React.useEffect(() => {
    if (connected) {
      connect();
    }
  }, []); // eslint-disable-line

  return {
    client,
    connect,
    disconnect,
    activeAccount: account,
    connected: localStorage.getItem('provider:wallet-connected') === 'true',
  };
};

/**
 * WalletProvider
 */
const WalletProvider = ({ children, clientType = 'beacon', network, ...rest }) => {
  const options = React.useMemo(() => ({ ...rest, preferredNetwork: network ? NetworkType[network] : undefined }), [network, rest]);
  const [client, setClient] = React.useState(undefined);
  const [account, setAccount] = React.useState(undefined);
  const setNewClient = React.useCallback(() => {
    const newClient = clientType === 'beacon' ? new DAppClient(options) : new BeaconWallet(options);
    setClient(newClient);
  }, [clientType, options]);
  React.useEffect(() => {
    if (typeof client === 'undefined') {
      setNewClient();
    }
  }, [client, setNewClient]);
  const setAccountInfo = (info) => {
    setAccount(info);
  };
  return (
    <DAppContext.Provider
      value={{
        client,
        clientType,
        resetClient: setNewClient,
        account,
        setAccountInfo,
      }}
    >
      {children}
    </DAppContext.Provider>
  );
};

export { WalletProvider, useBeaconWallet, useDappClient, useWallet };
