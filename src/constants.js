export const DEFAULT_FILTERS = {
  showMints: true,
  showSwaps: true,
  showSecondarySwaps: true, // TODO
  showSales: false,
  showOffers: false,
  itemLimit: 100
};

export const MINT_EVENTS = [
  '8BID_8X8_COLOR_MINT',
  '8BID_24X24_COLOR_MINT',
  '8BID_24X24_MONOCHROME_MINT',
  'HEN_MINT',
  'VERSUM_MINT',
  'FX_MINT_ISSUER_V3',
  'OBJKT_MINT_ARTIST',
];

export const SWAP_EVENTS = ['8BID_8X8_COLOR_SWAP', '8BID_24X24_COLOR_SWAP', 'HEN_SWAP_V2', 'TEIA_SWAP', 'VERSUM_SWAP', 'FX_LISTING'];

export const OFFER_EVENTS = ['OBJKT_OFFER', 'VERSUM_MAKE_OFFER'];

export const EVENT_CATEGORY_MINT = 'MINT';
export const EVENT_CATEGORY_SWAP = 'SWAP';
export const EVENT_CATEGORY_SALE = 'SALE';
export const EVENT_CATEGORY_OFFER = 'OFFER';

export const TEZTOK_API = 'https://api.teztok.com/v1/graphql';
