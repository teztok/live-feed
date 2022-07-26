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
import Button from '@mui/material/Button';

function ToggleFilter({ checked, disabled, onChange, children }) {
  return (
    <FormControlLabel
      control={<Switch disabled={disabled} checked={checked} size="small" />}
      onChange={() => {
        onChange(!checked);
      }}
      label={
        <Typography variant="body2" color="textSecondary">
          {children}
        </Typography>
      }
      sx={{
        width: '100%',
      }}
    />
  );
}

function Filters({ filters, onChange, onWatchlistClick }) {
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
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
              <MenuItem value={200}>200</MenuItem>
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
              ml: 4,
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

            <ToggleFilter
              checked={filters.showMints}
              onChange={(checked) => {
                onChange({ ...filters, showMints: checked });
              }}
            >
              Mints
            </ToggleFilter>

            <ToggleFilter
              checked={filters.showSwaps}
              onChange={(checked) => {
                onChange({ ...filters, showSwaps: checked });
              }}
            >
              Swaps
            </ToggleFilter>

            <ToggleFilter
              checked={filters.showSecondarySwaps}
              disabled={!filters.showSwaps}
              onChange={(checked) => {
                onChange({ ...filters, showSecondarySwaps: checked });
              }}
            >
              Swaps <Chip size="small" label="Secondary Market" variant="outlined" sx={{ ml: 0.5 }}></Chip>
            </ToggleFilter>

            <ToggleFilter
              checked={filters.showSales}
              onChange={(checked) => {
                onChange({ ...filters, showSales: checked });
              }}
            >
              Sales
            </ToggleFilter>

            <ToggleFilter
              checked={filters.showOffers}
              onChange={(checked) => {
                onChange({ ...filters, showOffers: checked });
              }}
            >
              Offers
            </ToggleFilter>
          </Box>

          <Divider />

          <Box
            sx={{
              m: 4,
              ml: 4,
            }}
          >
            <Typography
              variant="body1"
              component="p"
              sx={{
                mb: 2,
              }}
            >
              <strong>Platform filters</strong>
            </Typography>

            <ToggleFilter
              checked={filters.showHenTokens}
              onChange={(checked) => {
                onChange({ ...filters, showHenTokens: checked });
              }}
            >
              Teia / HEN
            </ToggleFilter>

            <ToggleFilter
              checked={filters.showVersumTokens}
              onChange={(checked) => {
                onChange({ ...filters, showVersumTokens: checked });
              }}
            >
              Versum
            </ToggleFilter>

            <ToggleFilter
              checked={filters.showObjktTokens}
              onChange={(checked) => {
                onChange({ ...filters, showObjktTokens: checked });
              }}
            >
              OBJKT
            </ToggleFilter>

            <ToggleFilter
              checked={filters.showFxhashTokens}
              onChange={(checked) => {
                onChange({ ...filters, showFxhashTokens: checked });
              }}
            >
              FXHASH
            </ToggleFilter>

            <ToggleFilter
              checked={filters.show8bidouTokens}
              onChange={(checked) => {
                onChange({ ...filters, show8bidouTokens: checked });
              }}
            >
              8BIDOU
            </ToggleFilter>

            <ToggleFilter
              checked={filters.showTypedTokens}
              onChange={(checked) => {
                onChange({ ...filters, showTypedTokens: checked });
              }}
            >
              TYPED
            </ToggleFilter>

            <ToggleFilter
              checked={filters.show8scriboTokens}
              onChange={(checked) => {
                onChange({ ...filters, show8scriboTokens: checked });
              }}
            >
              8SCRIBO
            </ToggleFilter>

            <ToggleFilter
              checked={filters.showOtherTokens}
              onChange={(checked) => {
                onChange({ ...filters, showOtherTokens: checked });
              }}
            >
              Others
            </ToggleFilter>
          </Box>

          <Divider />

          <Box
            sx={{
              m: 4,
              ml: 4,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <Typography variant="body1" component="p">
                <strong>Watchlist</strong>
              </Typography>

              <Box
                sx={{
                  ml: 'auto',
                  mr: -3,
                }}
              >
                <ToggleFilter
                  checked={filters.allowlistOnly}
                  onChange={(checked) => {
                    onChange({ ...filters, allowlistOnly: checked });
                  }}
                ></ToggleFilter>
              </Box>
            </Box>

            <Button
              variant="contained"
              onClick={() => {
                onWatchlistClick();
              }}
              sx={{
                width: '100%',
                mt: 2,
              }}
            >
              Edit Watchlist ({filters.followedAddresses.length})
            </Button>
          </Box>

          <Divider />

          <Box
            sx={{
              m: 4,
              ml: 4,
            }}
          >
            <Typography
              variant="body1"
              component="p"
              sx={{
                mb: 2,
              }}
            >
              <strong>Donate</strong>
            </Typography>
            <Typography variant="body2" component="p">
              If you want to support this community project, feel free to donate any amount to this Tezos address:
            </Typography>
            <Typography
              variant="body2"
              component="p"
              sx={{
                mt: 1,
              }}
            >
              <strong>tz1WWKoicGTSCASDJJikZGys7wffEQyuqdys</strong>
            </Typography>
          </Box>
        </FormGroup>
      </Box>
    </div>
  );
}

export default Filters;
