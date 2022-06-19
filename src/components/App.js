import { useState, useDeferredValue, useMemo } from 'react';
import useSWR from 'swr';
import keyBy from 'lodash/keyBy';
import sortBy from 'lodash/sortBy';
import get from 'lodash/get';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import Sidebar from './Sidebar';
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
import laggy from '../libs/swr-laggy-middleware';

function isEventOfFollowedAddress(event, followedAddresses) {
  return followedAddresses.some((address) => {
    return (
      get(event, 'artist_address') === address ||
      get(event, 'buyer_address') === address ||
      get(event, 'token.artist_address') === address ||
      (get(event, 'token.creators') || []).includes(address) ||
      (get(event, 'token.royalty_receivers') || []).map(({ receiver_address }) => receiver_address).includes(address)
    );
  });
}

function filterEvents(events, filters) {
  return events
    .filter((event) => (!filters.showMints ? event.category !== EVENT_CATEGORY_MINT : true))
    .filter((event) => (!filters.showSwaps ? event.category !== EVENT_CATEGORY_SWAP : true))
    .filter((event) => (event.category === EVENT_CATEGORY_SWAP && !filters.showSecondarySwaps ? !event.isSecondarySwap : true))
    .filter((event) => (!filters.showSales ? event.category !== EVENT_CATEGORY_SALE : true))
    .filter((event) => (!filters.showOffers ? event.category !== EVENT_CATEGORY_OFFER : true))
    .filter((event) => (!filters.showObjktTokens ? get(event, 'token.platform') !== 'OBJKT' : true))
    .filter((event) => (!filters.showHenTokens ? get(event, 'token.platform') !== 'HEN' : true))
    .filter((event) => (!filters.showVersumTokens ? get(event, 'token.platform') !== 'VERSUM' : true))
    .filter((event) => (!filters.showFxhashTokens ? get(event, 'token.platform') !== 'FXHASH' : true))
    .filter((event) => (!filters.show8bidouTokens ? get(event, 'token.platform') !== '8BIDOU' : true))
    .filter((event) => (!filters.showOtherTokens ? get(event, 'token.platform') !== null : true))
    .filter((event) => (filters.allowlistOnly ? isEventOfFollowedAddress(event, filters.followedAddresses) : true))
    .slice(0, filters.itemLimit);
}

function App() {
  const [showSettings, setShowSettings] = useState(false);
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
          let isSecondarySwap;

          if (event.implements === 'SALE') {
            category = EVENT_CATEGORY_SALE;
          } else if (MINT_EVENTS.includes(event.type)) {
            category = EVENT_CATEGORY_MINT;
          } else if (SWAP_EVENTS.includes(event.type)) {
            isSecondarySwap = get(event, 'token.artist_address') !== event.seller_address;
            category = EVENT_CATEGORY_SWAP;
          } else if (OFFER_EVENTS.includes(event.type)) {
            category = EVENT_CATEGORY_OFFER;
          }

          return {
            ...event,
            category,
            isSecondarySwap,
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
            onClick={() => {
              setShowSettings(true);
            }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      {feed}
      <Sidebar
        open={showSettings}
        filters={filters}
        onClose={() => {
          setShowSettings(false);
        }}
        onFiltersUpdate={(newFilters) => {
          setFilters(newFilters);
          storeFiltersInLocalStorage(newFilters);
        }}
      />
    </div>
  );
}

export default App;
