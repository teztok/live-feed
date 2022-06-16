import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

function Filters({ filters, onChange }) {
  return (
    <div className="Filters">
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
      </FormGroup>
    </div>
  );
}

export default Filters;
