import { useWallet } from '@tezos-contrib/react-wallet-provider';
import { getWallet } from '../libs/wallet';
import { TEIA_CONTRACT_MARKETPLACE, OBJKT_CONTRACT_MARKETPLACE_V2 } from '../constants';
import Button from '@mui/material/Button';

export default function BuyButton({ event }) {
  const { client, activeAccount } = useWallet();

  return (
    <Button
      disabled={!activeAccount}
      onClick={async () => {
        const wallet = getWallet(client);

        if (event.type === 'TEIA_SWAP') {
          const contract = await wallet.at(TEIA_CONTRACT_MARKETPLACE);
          const res = await contract.methods.collect(event.swap_id);

          await res.send({
            amount: event.price,
            mutez: true,
            storageLimit: 350,
          });
        } else if (event.type === 'OBJKT_ASK_V2') {
          const contract = await wallet.at(OBJKT_CONTRACT_MARKETPLACE_V2);
          const res = await contract.methods.fulfill_ask(event.ask_id);

          await res.send({
            amount: event.price,
            mutez: true,
            storageLimit: 350,
          });
        }
      }}
      color="secondary"
      variant="outlined"
      size="small"
    >
      Buy
    </Button>
  );
}
