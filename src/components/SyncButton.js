import { useWallet } from '@tezos-contrib/react-wallet-provider';
import { shortenTzAddress } from '../libs/utils';

export default function SyncButton() {
  const { activeAccount, connect, disconnect } = useWallet();

  return (
    <div>
      {!activeAccount && <button onClick={connect}>Sync</button>}
      {activeAccount && (
        <div>
          <span>{shortenTzAddress(activeAccount?.address)}</span>
          <button onClick={disconnect}>Unsync</button>
        </div>
      )}
    </div>
  );
}
