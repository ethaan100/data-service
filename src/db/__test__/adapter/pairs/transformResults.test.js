const { BigNumber } = require('@waves/data-entities');

const transformResults = require('../../../adapter/pairs/transformResults');

const WAVES_DECIMALS = 8;
const aDecimals = 8;
const pDecimals = 2;

const resultCommon = [
  { decimals: aDecimals },
  { decimals: pDecimals },
  { price: new BigNumber(10).pow(8) },
  { price: new BigNumber(10).pow(8).multipliedBy(2) },
  { volume: new BigNumber(10).pow(10) },
];

describe('Pairs transformResult function', () => {
  it('covers case when WAVES — amount asset', () => {
    const pair = {
      amountAsset: 'WAVES',
      priceAsset: 'Ft8X1v1LTa1ABafufpaCWyVj8KkaxUWE6xBhW6sNFJck',
    };
    const result = resultCommon;
    const expected = {
      first_price: new BigNumber(10).pow(6),
      last_price: new BigNumber(10).pow(6).multipliedBy(2),
      volume: new BigNumber(10).pow(2),
      volume_waves: new BigNumber(10).pow(2),
    };

    expect(transformResults(pair)(result)).toEqual(expected);
  });

  it('covers case when WAVES — price asset', () => {
    const pair = {
      priceAsset: 'WAVES',
      amountAsset: '474jTeYx2r2Va35794tCScAXWJG9hU2HcgxzMowaZUnu',
    };

    const result = [
      ...resultCommon,
      { volume_price_asset: new BigNumber(1200000000) },
    ];
    const expected = {
      first_price: new BigNumber(10).pow(6),
      last_price: new BigNumber(10).pow(6).multipliedBy(2),
      volume: new BigNumber(10).pow(2),
      volume_waves: new BigNumber(12),
    };

    expect(transformResults(pair)(result)).toEqual(expected);
  });

  describe('WAVES is neither price nor amount asset', () => {
    const pair = {
      priceAsset: 'Ft8X1v1LTa1ABafufpaCWyVj8KkaxUWE6xBhW6sNFJck',
      amountAsset: '474jTeYx2r2Va35794tCScAXWJG9hU2HcgxzMowaZUnu',
    };

    it('covers case `priceAsset/WAVES` is a valid pair, should multiply by avg_price', () => {
      const volumePriceAsset = new BigNumber(10).pow(10).multipliedBy(2);
      const avgPrice = new BigNumber(10).pow(6).multipliedBy(3);

      const result = [
        ...resultCommon,
        { volume_price_asset: volumePriceAsset },
        {
          price_asset: 'WAVES',
          amount_asset: 'Ft8X1v1LTa1ABafufpaCWyVj8KkaxUWE6xBhW6sNFJck',
          avg_price: avgPrice,
        },
      ];

      const expected = {
        first_price: new BigNumber(10).pow(6),
        last_price: new BigNumber(10).pow(6).multipliedBy(2),
        volume: new BigNumber(10).pow(2),
        volume_waves: volumePriceAsset
          .multipliedBy(new BigNumber(10).pow(-pDecimals)) // to true volume
          .multipliedBy(avgPrice)
          .multipliedBy(new BigNumber(10).pow(-8 + pDecimals - WAVES_DECIMALS)), // to true price (Waves dec — 8)
      };

      expect(transformResults(pair)(result)).toEqual(expected);
    });

    it('covers case `WAVES/priceAsset` is a valid pair, should divide by avg_price', () => {
      const volumePriceAsset = new BigNumber(10).pow(10).multipliedBy(6);
      const avgPrice = new BigNumber(10).pow(6).multipliedBy(3);

      const result = [
        ...resultCommon,
        { volume_price_asset: volumePriceAsset },
        {
          price_asset: 'Ft8X1v1LTa1ABafufpaCWyVj8KkaxUWE6xBhW6sNFJck',
          amount_asset: 'WAVES',
          avg_price: avgPrice,
        },
      ];

      const expected = {
        first_price: new BigNumber(10).pow(6),
        last_price: new BigNumber(10).pow(6).multipliedBy(2),
        volume: new BigNumber(10).pow(2),
        volume_waves: volumePriceAsset
          .multipliedBy(new BigNumber(10).pow(-pDecimals)) // to true volume
          .dividedBy(avgPrice)
          .dividedBy(new BigNumber(10).pow(-8 + WAVES_DECIMALS - pDecimals)), // to true price (Waves dec — 8)
      };

      expect(transformResults(pair)(result)).toEqual(expected);
    });
  });

  describe('corner cases', () => {
    const resultCommonNull = [null, null, null, null, { volume: null }];
    it('WAVES — amount asset, no transactions happened within a day', () => {
      const pair = {
        amountAsset: 'WAVES',
        priceAsset: 'Ft8X1v1LTa1ABafufpaCWyVj8KkaxUWE6xBhW6sNFJck',
      };

      expect(transformResults(pair)(resultCommonNull)).toEqual(null);
    });

    it('WAVES — price asset, no transactions happened within a day', () => {
      const pair = {
        amountAsset: 'Ft8X1v1LTa1ABafufpaCWyVj8KkaxUWE6xBhW6sNFJck',
        priceAsset: 'WAVES',
      };

      expect(transformResults(pair)(resultCommonNull)).toEqual(null);
    });

    it('WAVES is neither price nor amount, transactions within pair occured, but no transactions priceAsset--WAVES happened', () => {
      const pair = {
        amountAsset: '474jTeYx2r2Va35794tCScAXWJG9hU2HcgxzMowaZUnu',
        priceAsset: 'Ft8X1v1LTa1ABafufpaCWyVj8KkaxUWE6xBhW6sNFJck',
      };
      const result = [
        ...resultCommon,
        { volume_price_asset: new BigNumber(1000000) },
        {
          price_asset: null,
          amount_asset: null,
          avg_price: null,
        },
      ];
      const expected = {
        first_price: new BigNumber(10).pow(6),
        last_price: new BigNumber(10).pow(6).multipliedBy(2),
        volume: new BigNumber(10).pow(2),
        volume_waves: null,
      };

      expect(transformResults(pair)(result)).toEqual(expected);
    });
  });
});
