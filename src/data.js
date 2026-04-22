export const INITIAL_GAINS = {
  stcg: {
    profits: 100,
    losses: 500,
  },
  ltcg: {
    profits: 1200,
    losses: 100,
  }
};

export const MOCK_ASSETS = [
  {
    id: '1',
    name: 'Bitcoin',
    symbol: 'BTC',
    icon: 'https://static.coinpaprika.com/coin/btc-bitcoin/logo.png',
    holdings: 0.12,
    price: 64230.50,
    value: 7707.66,
    shortTermPerformance: -850,
    longTermPerformance: 0,
    type: 'ST'
  },
  {
    id: '2',
    name: 'Ethereum',
    symbol: 'ETH',
    icon: 'https://static.coinpaprika.com/coin/eth-ethereum/logo.png',
    holdings: 2.5,
    price: 3450.20,
    value: 8625.50,
    shortTermPerformance: 500,
    longTermPerformance: -1000,
    type: 'LT'
  },
  {
    id: '3',
    name: 'Polygon',
    symbol: 'MATIC',
    icon: 'https://static.coinpaprika.com/coin/matic-polygon/logo.png',
    holdings: 5000,
    price: 0.72,
    value: 3600,
    shortTermPerformance: -350,
    longTermPerformance: 0,
    type: 'ST'
  }
];
