import isNumber from 'lodash/isNumber';

export function ipfsToGatewayUri(ipfsUri) {
  const ipfsHash = ipfsUri.replace('ipfs://', '');
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
