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
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Chip from '@mui/material/Chip';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import GitHubIcon from '@mui/icons-material/GitHub';
import Sidebar from './Sidebar';
import { getFiltersFromLocalStorage, storeFiltersInLocalStorage, getPlatform } from '../libs/utils';
import {
  DEFAULT_FILTERS,
  MINT_EVENTS,
  SWAP_EVENTS,
  OFFER_EVENTS,
  EVENT_CATEGORY_MINT,
  EVENT_CATEGORY_SWAP,
  EVENT_CATEGORY_SALE,
  EVENT_CATEGORY_OFFER,
  TEZTOK_LIVEFEED_API,
} from '../constants';
import SyncButton from './SyncButton';
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
    .filter((event) => (!filters.showObjktTokens ? getPlatform(event) !== 'OBJKT' : true))
    .filter((event) => (!filters.showHenTokens ? getPlatform(event) !== 'HEN' : true))
    .filter((event) => (!filters.showVersumTokens ? getPlatform(event) !== 'VERSUM' : true))
    .filter((event) => (!filters.showFxhashTokens ? getPlatform(event) !== 'FXHASH' : true))
    .filter((event) => (!filters.show8bidouTokens ? getPlatform(event) !== '8BIDOU' : true))
    .filter((event) => (!filters.showTypedTokens ? getPlatform(event) !== 'TYPED' : true))
    .filter((event) => (!filters.showOtherTokens ? getPlatform(event) !== null : true))
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
      const response = await fetch(TEZTOK_LIVEFEED_API);
      const newEvents = (await response.json()).events;

      const newEventsById = keyBy(newEvents, 'id');
      const prevEventsById = keyBy(prevEvents, 'id');
      const latestEvents = sortBy(Object.values({ ...prevEventsById, ...newEventsById }), 'opid').reverse();
      const latestLevel = latestEvents[0].level;

      const events = latestEvents.map((event) => {
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
          isNew: event.level === latestLevel,
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

  const feed = useMemo(
    () => <Feed events={filterEvents(data || [], deferredFilters)} imageSize={deferredFilters.imageSize} />,
    [deferredFilters, data]
  );

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
            <strong>NFT LiveFeed</strong>&nbsp;by TezTok <Chip size="small" label="BETA" variant="outlined" sx={{ ml: 1 }}></Chip>
            <IconButton
              size="small"
              href="https://github.com/teztok/live-feed"
              target="_blank"
              sx={{
                ml: 1,
              }}
            >
              <GitHubIcon fontSize="inherit" />
            </IconButton>
          </>
          <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
            <ToggleButtonGroup
              size="small"
              value={filters.imageSize}
              exclusive
              onChange={(ev, newImageSize) => {
                const newFilters = { ...filters, imageSize: newImageSize };
                setFilters(newFilters);
                storeFiltersInLocalStorage(newFilters);
              }}
            >
              <ToggleButton value="small" size="small">
                <FullscreenExitIcon />
              </ToggleButton>
              <ToggleButton value="large" size="small">
                <FullscreenIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <SyncButton />
          <IconButton
            color="primary"
            onClick={() => {
              setShowSettings(true);
            }}
            sx={{
              ml: 2,
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
