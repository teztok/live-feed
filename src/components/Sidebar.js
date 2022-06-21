import { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Filters from './Filters';
import Watchlist from './Watchlist';

const DRAWER_WIDTH = 400;
const VIEW_FILTERS = 'filters';
const VIEW_WATCHLIST = 'watchlist';

function Sidebar({ open, filters, onClose, onFiltersUpdate }) {
  const [view, setView] = useState(VIEW_FILTERS);
  let content = null;

  if (view === VIEW_FILTERS) {
    content = (
      <Filters
        filters={filters}
        onChange={onFiltersUpdate}
        onWatchlistClick={() => {
          setView(VIEW_WATCHLIST);
        }}
      />
    );
  } else {
    content = (
      <Watchlist
        filters={filters}
        onChange={onFiltersUpdate}
        onBackClick={() => {
          setView(VIEW_FILTERS);
        }}
      />
    );
  }

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
      {content}
    </Drawer>
  );
}

export default Sidebar;
