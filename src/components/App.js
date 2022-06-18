import { useState, useDeferredValue, useMemo } from 'react';
import useSWR from 'swr';
import keyBy from 'lodash/keyBy';
import sortBy from 'lodash/sortBy';
import { getFiltersFromLocalStorage, storeFiltersInLocalStorage } from '../libs/utils';
import {
  DEFAULT_FILTERS,
  MINT_EVENTS,
  SWAP_EVENTS,
  OFFER_EVENTS,
  EVENT_CATEGORY_MINT,
  EVENT_CATEGORY_SWAP,
  EVENT_CATEGORY_SALE,
  EVENT_CATEGORY_OFFER,
} from '../constants';
import Feed from './Feed';
import Filters from './Filters';
import laggy from '../libs/swr-laggy-middleware';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';

const drawerWidth = 400;

function filterEvents(events, filters) {
  return events
    .filter((event) => (!filters.showMints ? event.category !== EVENT_CATEGORY_MINT : true))
    .filter((event) => (!filters.showSwaps ? event.category !== EVENT_CATEGORY_SWAP : true))
    .filter((event) => (!filters.showSales ? event.category !== EVENT_CATEGORY_SALE : true))
    .filter((event) => (!filters.showOffers ? event.category !== EVENT_CATEGORY_OFFER : true))
    .slice(0, filters.itemLimit);
}

function App() {
  const [filters, setFilters] = useState(
    getFiltersFromLocalStorage() ? { ...DEFAULT_FILTERS, ...getFiltersFromLocalStorage() } : DEFAULT_FILTERS
  );
  const [prevEvents, setPrevEvents] = useState([]);
  const deferredFilters = useDeferredValue(filters);
  const { data } = useSWR(
    'feed',
    async () => {
      const response = await fetch('https://livefeed-api.teztok.com/feed');
      const newEvents = (await response.json()).data.events;

      const newEventsById = keyBy(newEvents, 'id');
      const prevEventsById = keyBy(prevEvents, 'id');
      const events = sortBy(Object.values({ ...prevEventsById, ...newEventsById }), 'opid')
        .reverse()
        .map((event) => {
          let category;

          if (event.implements === 'SALE') {
            category = EVENT_CATEGORY_SALE;
          } else if (MINT_EVENTS.includes(event.type)) {
            category = EVENT_CATEGORY_MINT;
          } else if (SWAP_EVENTS.includes(event.type)) {
            category = EVENT_CATEGORY_SWAP;
          } else if (OFFER_EVENTS.includes(event.type)) {
            category = EVENT_CATEGORY_OFFER;
          }

          return {
            ...event,
            category,
          };
        });

      setPrevEvents(events);

      return events;
    },
    {
      refreshInterval: 1000,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      use: [laggy],
    }
  );

  const feed = useMemo(() => <Feed events={filterEvents(data || [], deferredFilters)} />, [deferredFilters, data]);

  if (!data) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100vw',
          height: '100vh',
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <div className="App">
      <AppBar position="fixed">
        <Toolbar>
          <>
            <strong>NFT LiveFeed</strong>&nbsp;by TezTok
          </>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton
            color="primary"
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer 
        anchor="right"
        open
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
          },
        }}
      >
        <Filters
          filters={filters}
          onChange={(newFilters) => {
            setFilters(newFilters);
            storeFiltersInLocalStorage(newFilters);
          }}
        />
      </Drawer>
      {feed}
    </div>
  );
}

export default App;
