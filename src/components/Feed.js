import { useState } from 'react';
import useSWR from 'swr';
import keyBy from 'lodash/keyBy';
import sortBy from 'lodash/sortBy';
import get from 'lodash/get';
import isNumber from 'lodash/isNumber';
import laggy from '../libs/swr-laggy-middleware';

export function ipfsToGatewayUri(ipfsUri) {
  const ipfsHash = ipfsUri.replace('ipfs://', '');
  return `https://ipfs.io/ipfs/${ipfsHash}`;
}

export function formatTz(amount) {
  if (!isNumber(amount)) {
    return '–';
  }

  const amountFixed = (amount / 1000000).toFixed(2);
  return `${amountFixed.endsWith('.00') ? amountFixed.slice(0, -3) : amountFixed} ꜩ`;
}

function FeedItem({ event }) {
  return (
    <li>
      <strong>type:</strong> {event.type}
      <br />
      <strong>is sale:</strong> {event.implements === 'SALE' ? 'yes' : 'no'}
      <br />
      <strong>timestamp:</strong> {event.timestamp}
      <br />
      <strong>metadata status:</strong> {get(event, 'token.metadata_status')}
      <br />
      <strong>artist:</strong> {get(event, 'token.artist_profile.alias') || get(event, 'token.artist_address')}
      <br />
      <strong>platform:</strong> {get(event, 'token.platform')}
      <br />
      {event.price && (
        <>
          <strong>price:</strong> {formatTz(event.price)}
          <br />
        </>
      )}
      {get(event, 'token.display_uri') && (
        <img
          src={ipfsToGatewayUri(get(event, 'token.display_uri'))}
          alt={get(event, 'token.name')}
          loading="lazy"
          style={{
            width: '200px',
            height: 'auto',
          }}
        />
      )}
    </li>
  );
}

function Feed() {
  const [prevEvents, setPrevEvents] = useState([]);
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

  return (
    <div className="Feed">
      <ul>
        {(data || []).map((event) => (
          <FeedItem key={event.id} event={event} />
        ))}
      </ul>
    </div>
  );
}

export default Feed;
