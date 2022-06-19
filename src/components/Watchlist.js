import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import UserPicker from './UserPicker';

function Filters({ filters, onChange, onBackClick }) {
  return (
    <div className="Filters">
      <Box>
        <FormGroup>
          <Button
            onClick={() => {
              onBackClick();
            }}
          >
            Back
          </Button>

          <Box
            sx={{
              m: 4,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                mb: 3,
              }}
            >
              <Typography variant="body1" component="p">
                <strong>Watchlist</strong>
              </Typography>
              <FormControlLabel
                control={<Switch checked={filters.allowlistOnly} size="small" sx={{ mr: 0 }} />}
                onChange={() => {
                  onChange({ ...filters, allowlistOnly: !filters.allowlistOnly });
                }}
                sx={{
                  ml: 'auto',
                  mr: 0,
                }}
              />
            </Box>
            <UserPicker
              addresses={filters.followedAddresses}
              onChange={(addresses) => {
                onChange({ ...filters, followedAddresses: addresses });
              }}
            />
          </Box>
        </FormGroup>
      </Box>
    </div>
  );
}

export default Filters;
