import { makeCopyBag } from '@agoric/store';
export default {
    rentals: [
        {
            offerId: `create-rental-smoke-test-0`,
            utility: {
                keyword: 'KREAdITEM',
                value: makeCopyBag(
                    harden([
                        [
                            {
                                artistMetadata: 'https://www.instagram.com/enmanueljrperez/',
                                category: 'mask',
                                colors: ['#0000ff'],
                                description:
                                    'Rare mask from Elephia. A facial covering with various uses, from protection to disguise.',
                                durability: 6,
                                filtering: 11,
                                functional: true,
                                image: 'Qmc55m7RrzZtB25mM9B2c9BdtXcLDbhSrErWMAa7azCet6/Items%20webP/Mask/Elephia%202,%2013,%20blue.webp',
                                level: 55,
                                name: 'Elephia 2',
                                origin: 'Elephia',
                                rarity: 55,
                                reserves: 10,
                                sense: 13,
                                thumbnail:
                                    'Qmc55m7RrzZtB25mM9B2c9BdtXcLDbhSrErWMAa7azCet6/Items%20webP/Mask/Elephia%202,%2013,%20blue_thumbnail.webp',
                                weight: 15,
                            },
                            1n,
                        ],
                    ]),
                ),
            },
            rentalFeePerUnit: { keyword: 'IST', value: 10000n }, // 0.01 IST
            collateral: { keyword: 'IST', value: 100000n }, // 0.1 IST
            rentalConfig: {
                utilityTitle: 'Elephia 2',
                utilityDescription:
                    'Rare mask from Elephia. A facial covering with various uses, from protection to disguise.',
                rentingTier: 'Ad-Hoc',
                rentingDurationUnit: 'minute',
                minRentingDurationUnits: 1n,
                maxRentingDurationUnits: 60n,
                gracePeriodDuration: 60n, // 1 min grace period
            },
        },
    ],
    buyouts: [
        {
            offerId: `buyout-rental-smoke-test-0`,
            rentalIndex: 0,
            rentingDuration: 1n,
        },
    ],
    returns: [
        {
            offerId: `return-utility-smoke-test-0`,
            rentalIndex: 0,
            buyoutIndex: 0,
        },
    ],
    withdrawFees: [
        {
            offerId: `withdraw-fee-smoke-test-0`,
            rentalIndex: 0,
        },
    ],
    withdrawUtils: [
        {
            offerId: `withdraw-utility-smoke-test-0`,
            rentalIndex: 0,
        },
    ],
    withdrawCollaterals: [
        {
            offerId: `withdraw-collateral-smoke-test-0`,
            rentalIndex: 0,
        },
    ],
};
