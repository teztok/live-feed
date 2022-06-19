import { useWallet } from '@tezos-contrib/react-wallet-provider';
import Button from '@mui/material/Button';
import { shortenTzAddress } from '../libs/utils';

export default function SyncButton() {
  const { activeAccount, connect, disconnect } = useWallet();

  return (
    <div>
      {!activeAccount && <Button onClick={connect}>Sync</Button>}
      {activeAccount && (
        <div>
          <span>{shortenTzAddress(activeAccount?.address)}</span>
          <Button onClick={disconnect}>Unsync</Button>
        </div>
      )}
    </div>
  );
}
