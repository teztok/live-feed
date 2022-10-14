import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { TEIA_CONTRACT_MARKETPLACE, OBJKT_CONTRACT_MARKETPLACE_V2, MAX_PRICE } from '../constants';
import { formatTz } from '../libs/utils';
import { getWallet } from '../libs/wallet';
import { useWallet } from '../libs/wallet-provider';

export default function BuyButton({ event }) {
  const { client, activeAccount } = useWallet();

  const button = (
    <Button
      disabled={!activeAccount || event.price > MAX_PRICE}
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

  if (event.price > MAX_PRICE) {
    return (
      <Tooltip arrow title={`Max price of ${formatTz(MAX_PRICE)} exceeded.`}>
        <span>{button}</span>
      </Tooltip>
    );
  }

  return button;
}
