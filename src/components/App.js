import { useState, useDeferredValue, useMemo } from 'react';
import useSWR from 'swr';
import keyBy from 'lodash/keyBy';
import sortBy from 'lodash/sortBy';
import get from 'lodash/get';
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
    .filter((event) => (filters.allowlistOnly ? isEventOfFollowedAddress(event, filters.followedAddresses) : true))
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
      <Filters
        filters={filters}
        onChange={(newFilters) => {
          setFilters(newFilters);
          storeFiltersInLocalStorage(newFilters);
        }}
      />
      {feed}
    </div>
  );
}

export default App;
