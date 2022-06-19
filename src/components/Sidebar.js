import Drawer from '@mui/material/Drawer';
import Filters from './Filters';
import SyncButton from './SyncButton';

const DRAWER_WIDTH = 400;

function Sidebar({ open, filters, onClose, onFiltersUpdate }) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
        },
      }}
    >
      <SyncButton />
      <Filters filters={filters} onChange={onFiltersUpdate} />
    </Drawer>
  );
}

export default Sidebar;
