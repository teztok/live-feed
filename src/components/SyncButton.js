import { useWallet } from '@tezos-contrib/react-wallet-provider';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { shortenTzAddress } from '../libs/utils';

export default function SyncButton() {
  const { activeAccount, connect, disconnect } = useWallet();

  return (
    <>
      {!activeAccount && <Button onClick={connect} variant="outlined" size="small">Sync</Button>}
      {activeAccount && (
        <Box>
          <Typography variant="body2" component="strong" sx={{ mr: 2 }}>{shortenTzAddress(activeAccount?.address)}</Typography>
          <Button onClick={disconnect} variant="contained" size="small">Unsync</Button>
        </Box>
      )}
    </>
  );
}
