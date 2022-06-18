import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

function Filters({ filters, onChange }) {
  return (
    <div className="Filters" style={{ maxWidth: 200 }}>
      <FormGroup>
        <FormControlLabel
          control={<Switch checked={filters.showMints} />}
          onChange={() => {
            onChange({ ...filters, showMints: !filters.showMints });
          }}
          label="Mints"
        />
        <FormControlLabel
          control={<Switch checked={filters.showSwaps} />}
          onChange={() => {
            onChange({ ...filters, showSwaps: !filters.showSwaps });
          }}
          label="Swaps"
        />
        <FormControlLabel
          control={<Switch checked={filters.showSales} />}
          onChange={() => {
            onChange({ ...filters, showSales: !filters.showSales });
          }}
          label="Sales"
        />
        <FormControlLabel
          control={<Switch checked={filters.showOffers} />}
          onChange={() => {
            onChange({ ...filters, showOffers: !filters.showOffers });
          }}
          label="Offers"
        />
        <FormControl size="small">
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
        </FormControl>
      </FormGroup>
    </div>
  );
}

export default Filters;
