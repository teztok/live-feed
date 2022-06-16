import { useState, useDeferredValue, useMemo } from 'react';
import useSWR from 'swr';
import keyBy from 'lodash/keyBy';
import sortBy from 'lodash/sortBy';
import { getFiltersFromLocalStorage, storeFiltersInLocalStorage } from '../libs/utils';
import Feed from './Feed';
import Filters from './Filters';
import laggy from '../libs/swr-laggy-middleware';

const DEFAULT_FILTERS = {
  showMints: true,
  showSwaps: true,
  showSales: false,
};

const MINT_EVENTS = [
  '8BID_8X8_COLOR_MINT',
  '8BID_24X24_COLOR_MINT',
  '8BID_24X24_MONOCHROME_MINT',
  'HEN_MINT',
  'VERSUM_MINT',
  'FX_MINT_ISSUER_V3',
  'OBJKT_MINT_ARTIST',
];

const SWAP_EVENTS = ['8BID_8X8_COLOR_SWAP', '8BID_24X24_COLOR_SWAP', 'HEN_SWAP_V2', 'TEIA_SWAP', 'VERSUM_SWAP', 'FX_LISTING'];

function filterEvents(events, filters) {
  return events
    .filter((event) => (!filters.showMints ? !MINT_EVENTS.includes(event.type) : true))
    .filter((event) => (!filters.showSwaps ? !SWAP_EVENTS.includes(event.type) : true))
    .filter((event) => (!filters.showSales ? event.implements !== 'SALE' : true));
}

function App() {
  const [filters, setFilters] = useState(getFiltersFromLocalStorage() || DEFAULT_FILTERS);
  const [prevEvents, setPrevEvents] = useState([]);
  const deferredFilters = useDeferredValue(filters);
  const { data } = useSWR(
    'feed',
    async () => {
      const response = await fetch('https://livefeed-api.teztok.com/feed');
      const newEvents = (await response.json()).data.events;

      const newEventsById = keyBy(newEvents, 'id');
      const prevEventsById = keyBy(prevEvents, 'id');
      const events = sortBy(Object.values({ ...prevEventsById, ...newEventsById }), 'opid').reverse();
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
    return <div>loading...</div>;
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
