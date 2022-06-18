import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import FormHelperText from '@mui/material/FormHelperText';
import Chip from '@mui/material/Chip';
import UserPicker from './UserPicker';

function Filters({ filters, onChange }) {
  return (
    <div className="Filters">
      <Box>
        <FormGroup>
          <Typography 
            variant="body1" 
            component="p" 
            sx={{
              m: 4,
              mb: 3,
            }}
          >
            <strong>Amount of events</strong>
          </Typography>
          <FormControl 
            size="small"
            sx={{
              m: 4,
              mt: 0,
            }}
          >
            <InputLabel id="limit">Limit</InputLabel>
            <Select
              labelId="limit"
              value={filters.itemLimit}
              label="Limit"
              onChange={(ev) => {
                onChange({ ...filters, itemLimit: ev.target.value });
              }}
            >
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
              <MenuItem value={200}>200</MenuItem>
              <MenuItem value={500}>500</MenuItem>
              <MenuItem value={1000}>1000</MenuItem>
            </Select>
            <FormHelperText
              sx={{
                mt: 2,
              }}
            >
              Warning: The higher you set this limit, the lower the overall browser performance will most probably be.
            </FormHelperText>
          </FormControl>

          <Divider />

          <Box 
              sx={{
              m: 4,
              ml: 5,
            }}
          >
            <Typography 
              variant="body1" 
              component="p" 
              sx={{
                mb: 2,
              }}
            >
              <strong>Event filters</strong>
            </Typography>
            <FormControlLabel
              control={<Switch checked={filters.showMints} size="small" />}
              onChange={() => {
                onChange({ ...filters, showMints: !filters.showMints });
              }}
              label={<Typography variant="body2" color="textSecondary">Mints</Typography>}
              sx={{
                width: '100%',
              }}
            />
            <FormControlLabel
              control={<Switch checked={filters.showSwaps} size="small" />}
              onChange={() => {
                onChange({ ...filters, showSwaps: !filters.showSwaps });
              }}
              label={<Typography variant="body2" color="textSecondary">Swaps</Typography>}
              sx={{
                width: '100%',
              }}
            />
            <FormControlLabel
              control={<Switch disabled={!filters.showSwaps} checked={filters.showSecondarySwaps} size="small" />}
              onChange={() => {
                onChange({ ...filters, showSecondarySwaps: !filters.showSecondarySwaps });
              }}
              label={<Typography variant="body2" color="textSecondary">Swaps <Chip size="small" label="Secondary" variant="outlined" sx={{ ml: 0.5 }}></Chip></Typography>}
              sx={{
                width: '100%',
              }}
            />

            <FormControlLabel
              control={<Switch checked={filters.showSales} size="small" />}
              onChange={() => {
                onChange({ ...filters, showSales: !filters.showSales });
              }}
              label={<Typography variant="body2" color="textSecondary">Sales</Typography>}
              sx={{
                width: '100%',
              }}
            />
            <FormControlLabel
              control={<Switch checked={filters.showOffers} size="small" />}
              onChange={() => {
                onChange({ ...filters, showOffers: !filters.showOffers });
              }}
              label={<Typography variant="body2" color="textSecondary">Offers</Typography>}
              sx={{
                width: '100%',
              }}
            />
          </Box>

          <Divider />
          
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
              <Typography 
                variant="body1" 
                component="p" 
              >
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
