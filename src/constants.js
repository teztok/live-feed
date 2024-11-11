export const DEFAULT_FILTERS = {
  imageSize: 'small',
  showMints: true,
  showSwaps: true,
  showSecondarySwaps: false,
  showSales: false,
  showOffers: false,
  showObjktTokens: true,
  showHenTokens: true,
  showVersumTokens: true,
  showFxhashTokens: true,
  show8bidouTokens: true,
  showTypedTokens: true,
  show8scriboTokens: true,
  showRaribleTokens: true,
  showKalamintTokens: true,
  showOtherTokens: true,
  allowlistOnly: false,
  enableTags: false,
  tags: '',
  itemLimit: 100,
  followedAddresses: [],
  followedStrictMode: true,
};

export const MINT_EVENTS = [
  'KALAMINT_MINT',
  '8BID_8X8_COLOR_MINT',
  '8BID_24X24_COLOR_MINT',
  '8BID_24X24_MONOCHROME_MINT',
  'HEN_MINT',
  'VERSUM_MINT',
  'OBJKT_CREATE_TOKEN',
  'OBJKT_MINT_ARTIST',
  'TYPED_MINT',
  '8SCRIBO_MINT',
  'RARIBLE_MINT',
];

export const SWAP_EVENTS = [
  'KALAMINT_LIST_TOKEN',
  '8BID_8X8_COLOR_SWAP',
  '8BID_24X24_COLOR_SWAP',
  'HEN_SWAP_V2',
  'TEIA_SWAP',
  'VERSUM_SWAP',
  'FX_LISTING',
  'OBJKT_ASK_V2',
  'OBJKT_ASK_V3',
  'OBJKT_ASK_V3_2',
  'TYPED_SWAP',
  '8SCRIBO_SWAP',
];

export const OFFER_EVENTS = ['OBJKT_OFFER', 'VERSUM_MAKE_OFFER', 'FX_OFFER_V3', 'OBJKT_OFFER_V3', 'OBJKT_OFFER_V3_2'];

export const EVENTS_WITH_BUY_SUPPORT = ['TEIA_SWAP', 'OBJKT_ASK_V2'];

export const EVENT_CATEGORY_MINT = 'MINT';
export const EVENT_CATEGORY_SWAP = 'SWAP';
export const EVENT_CATEGORY_SALE = 'SALE';
export const EVENT_CATEGORY_OFFER = 'OFFER';

export const TEIA_CONTRACT_MARKETPLACE = 'KT1PHubm9HtyQEJ4BBpMTVomq6mhbfNZ9z5w';
export const OBJKT_CONTRACT_MARKETPLACE_V2 = 'KT1WvzYHCNBvDSdwafTHv7nJ1dWmZ8GCYuuC';

export const MAX_PRICE = 300000000;

export const TEZTOK_GRAPHQL_API = 'https://api.teztok.com/v1/graphql';
export const TEZTOK_LIVEFEED_API = 'https://livefeed-proxy.teztok.com/feed';
