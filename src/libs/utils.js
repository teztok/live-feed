import get from 'lodash/get';
import isNumber from 'lodash/isNumber';

function getIpfsUri(event) {
  const platform = get(event, 'token.platform');

  if (platform === 'HEN' || platform === 'RARIBLE') {
    return get(event, 'token.display_uri');
  }

  if (
    platform === 'FXHASH' &&
    get(event, 'token.thumbnail_uri') === 'ipfs://QmbvEAn7FLMeYBDroYwBP8qWc3d3VVWbk19tTB83LCMB5S' &&
    get(event, 'token.fx_collection_thumbnail_uri')
  ) {
    return get(event, 'token.fx_collection_thumbnail_uri');
  }

  return get(event, 'token.thumbnail_uri');
}

export function getPreviewImage(event) {
  const ipfsUri = getIpfsUri(event);

  if (!ipfsUri) {
    return null; // TODO: placeholder image
  }

  const ipfsHash = ipfsUri.replace('ipfs://', '');

  if (get(event, 'token.platform') === 'FXHASH') {
    return `https://gateway.fxhash.xyz/ipfs/${ipfsHash}`;
  }

  return `https://ipfs.io/ipfs/${ipfsHash}`;
}

export function shortenTzAddress(address) {
  if (!address) {
    return '';
  }

  return `${address.substr(0, 5)}…${address.substr(-5)}`;
}

export function getArtistInfo(event) {
  const artistProfile = get(event, 'token.artist_profile') || get(event, 'artist_profile');
  const artistAddress = get(event, 'token.artist_address') || get(event, 'artist_address');

  return {
    address: artistAddress,
    name: get(artistProfile, 'alias') || shortenTzAddress(artistAddress),
    twitter: get(artistProfile, 'twitter'),
  };
}

export function getUserInfo(event, field) {
  const profile = get(event, `${field}_profile`);
  const address = get(event, `${field}_address`);

  return {
    address,
    name: get(profile, 'alias') || shortenTzAddress(address),
    twitter: get(profile, 'twitter'),
  };
}

export function isTokenUpToDate(event) {
  if (event.type === 'FX_MINT_ISSUER_V3') {
    return true;
  }

  if (get(event, 'token.metadata_status') !== 'processed') {
    return false;
  }

  return get(event, 'token.last_processed_event_level') >= event.level;
}

export function getSwapPrice(event) {
  if (event.start_price !== null) {
    return event.start_price;
  }

  return event.price;
}

export function isBestPrice(event) {
  if (!isTokenUpToDate(event)) {
    return false;
  }

  const swapPrice = getSwapPrice(event);
  const tokenPrice = get(event, 'token.price');

  if (tokenPrice === null) {
    return true;
  }

  return swapPrice <= tokenPrice;
}

export function getPlatform(event) {
  const platform = get(event, 'token.platform');

  if (platform) {
    return platform;
  }

  if (event.type.startsWith('FX_')) {
    return 'FXHASH';
  }

  return platform;
}

export function getTokenLink(event) {
  const { token_id, fa2_address } = event;
  const platform = get(event, 'token.platform');

  if (token_id === null || fa2_address === null) {
    return false;
  }

  switch (platform) {
    case 'HEN': {
      return `https://teia.art/objkt/${token_id}`;
    }
    case 'RARIBLE': {
      return `https://rarible.com/token/tezos/${fa2_address}:${token_id}`;
    }
    case 'FXHASH': {
      return `https://www.fxhash.xyz/gentk/${token_id}`;
    }
    case 'VERSUM': {
      return `https://versum.xyz/token/versum/${token_id}`;
    }
    case 'TYPED': {
      return `https://typed.art/${token_id}`;
    }
    case '8SCRIBO': {
      return `https://8scribo.xyz/haikus/${token_id}`;
    }
    case 'KALAMINT': {
      return `https://kalamint.io/${fa2_address}/token/${token_id}`;
    }
    case '8BIDOU': {
      if (fa2_address === 'KT1MxDwChiDwd6WBVs24g1NjERUoK622ZEFp') {
        return `https://www.8bidou.com/listing/?id=${token_id}`;
      }

      if (fa2_address === 'KT1TR1ErEQPTdtaJ7hbvKTJSa1tsGnHGZTpf') {
        return `https://ui.8bidou.com/item_g/?id=${token_id}`;
      }

      if (fa2_address === 'KT1VikAWA8wQHLZgHoAGL7Z9kCjgbCEnvWA3') {
        return `https://www.8bidou.com/r_item/?id=${token_id}`;
      }
      break;
    }
    default: {
      return `https://objkt.com/asset/${fa2_address}/${token_id}`;
    }
  }
}

export function formatTz(amount) {
  if (!isNumber(amount)) {
    return '';
  }

  const amountFixed = (amount / 1000000).toFixed(2);

  return `${amountFixed} ꜩ`;
}

export function getFiltersFromLocalStorage() {
  const filtersRaw = localStorage.getItem('livefeed:filters');

  if (!filtersRaw) {
    return false;
  }

  try {
    return JSON.parse(filtersRaw);
  } catch (err) {
    console.log(err);
    return false;
  }
}

export function storeFiltersInLocalStorage(filters) {
  localStorage.setItem('livefeed:filters', JSON.stringify(filters));
}
