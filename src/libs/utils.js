import get from 'lodash/get';
import isNumber from 'lodash/isNumber';

function getIpfsUri(event) {
  const platform = get(event, 'token.platform');

  if (platform === 'HEN') {
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
  return `${address.substr(0, 5)}…${address.substr(-5)}`;
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
