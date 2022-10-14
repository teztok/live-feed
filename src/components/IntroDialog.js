import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { MAX_PRICE } from '../constants';
import { formatTz } from '../libs/utils';

export default function IntroDialog() {
  const [open, setOpen] = React.useState(true);

  const handleClose = (event, reason) => {
    if (reason === 'backdropClick') {
      return false;
    } else {
      setOpen(false);
    }
  };

  const [agreed, setAgreed] = React.useState(false);

  const handleAgreedChange = () => {
    setAgreed((agreed) => !agreed);
  };

  return (
    <Dialog open={open} disableEscapeKeyDown onClose={handleClose}>
      <DialogTitle color="primary">{'Warning'}</DialogTitle>
      <DialogContent
        sx={{
          width: '500px',
        }}
      >
        <Box>
          The use of <strong>NFT LiveFeed</strong> is at your own risk. It is your own responsibility to check if the drops displayed are
          legitimate.
          <ol>
            <li>
              The feed <strong>won't protect</strong> you from <strong>copyminters</strong>
            </li>
            <li>
              Buy buttons are limited to <strong>Objkt</strong> and <strong>Teia</strong> swaps
            </li>
            <li>
              Swaps above <strong>{formatTz(MAX_PRICE)}</strong> can't be purchased
            </li>
            <li>The data displayed is to the best of our knowledge</li>
            <li>
              Objkt and Teia <strong>contracts</strong> are used for <strong>purchases</strong>
            </li>
          </ol>
        </Box>
      </DialogContent>
      <Divider />
      <DialogActions
        sx={{
          justifyContent: 'flex-start',
          padding: 3,
        }}
      >
        <FormGroup>
          <FormControlLabel control={<Checkbox checked={agreed} onChange={handleAgreedChange} />} label="I agree and do understand" />
        </FormGroup>
        <Button
          disabled={!agreed}
          variant="contained"
          onClick={handleClose}
          sx={{
            ml: 'auto',
          }}
        >
          Accept
        </Button>
      </DialogActions>
    </Dialog>
  );
}
