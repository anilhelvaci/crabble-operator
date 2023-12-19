/* eslint-env node */
import { makeOfferFilterPositions } from '@agoric/governance/src/contractGovernance/governFilter.js';
import { makeApiInvocationPositions } from '@agoric/governance/src/contractGovernance/governApi.js';

export default {
    rentals: [
        {
            offerId: 'createRental-1',
            utilityValue: [
                {
                    organization: 'Airbnb rental',
                    address: 'Sesame Street n12345',
                    accessKeyHash: 'bf34q7hiufb3',
                    imagePath: 'link',
                },
            ],
            rentalFeeValue: 10n,
            collateralValue: 100n,
            rentalConfig: {
                utilityTitle: 'Crab',
                utilityDescription: 'Crabs are decapod crustaceans of the infraorder Brachyura',
                rentingTier: 'Ad-Hoc',
                rentingDurationUnit: 'minute',
                minRentingDurationUnits: 1n,
                maxRentingDurationUnits: 60n,
                gracePeriodDuration: 60n, // 1 min grace period
            },
        },
        {
            offerId: 'createRental-2',
            utilityValue: [
                {
                    organization: 'Airbnb rental',
                    address: 'Sesame Street n123456',
                    accessKeyHash: 'bf34q7hiufb3',
                    imagePath: 'link',
                },
            ],
            rentalFeeValue: 10n,
            collateralValue: 100n,
            rentalConfig: {
                utilityTitle: 'House',
                utilityDescription: 'Family house available for vacations',
                rentingTier: 'Ad-Hoc',
                rentingDurationUnit: 'minute',
                minRentingDurationUnits: 1n,
                maxRentingDurationUnits: 60n,
                gracePeriodDuration: 10n * 60n, // 10 mins grace period
            },
        },
        {
            offerId: 'createRental-3',
            utilityValue: [
                {
                    organization: 'Airbnb rental',
                    address: 'Sesame Street n1234567',
                    accessKeyHash: 'bf34q7hiufb3',
                    imagePath: 'link',
                },
            ],
            rentalFeeValue: 30n,
            collateralValue: 200n,
            rentalConfig: {
                utilityTitle: 'Crab',
                utilityDescription: 'Crabs are decapod crustaceans of the infraorder Brachyura',
                rentingTier: 'Auction',
                rentingDurationUnit: 'minute',
                minRentingDurationUnits: 1n,
                maxRentingDurationUnits: 60n,
                gracePeriodDuration: 10n * 60n, // 10 mins grace period
            },
        },
        {
            offerId: 'createRental-4',
            utilityValue: [
                {
                    organization: 'Airbnb rental',
                    address: 'Sesame Street n12345678',
                    accessKeyHash: 'bf34q7hiufb3',
                    imagePath: 'link',
                },
            ],
            rentalFeeValue: 10n,
            collateralValue: 100n,
            rentalConfig: {
                utilityTitle: 'House',
                utilityDescription: 'Family house available for vacations',
                rentingTier: 'Auction',
                rentingDurationUnit: 'minute',
                minRentingDurationUnits: 1n,
                maxRentingDurationUnits: 60n,
                gracePeriodDuration: 10n * 60n, // 10 mins grace period
            },
        },
    ],
    buyouts: [
        {
            offerId: 'buyout-1',
            rentalIndex: 0,
            rentingDuration: 1n, // 1 min
        },
        {
            offerId: 'buyout-2',
            rentalIndex: 1,
            rentingDuration: 1n, // 1 min
        },
    ],
    adhocReturns: [
        {
            offerId: 'adhoc-return-1',
            buyoutIndex: 0,
        },
        {
            offerId: 'adhoc-return-2',
            buyoutIndex: 1,
        },
    ],
    withdrawUtility: [
        {
            offerId: 'withdraw-utility-1',
            rentalIndex: 0,
        },
    ],
    updateRental: [
        {
            offerId: 'update-rental-1',
            existingRentalIndex: 0,
            updatedRentalIndex: 2,
        },
    ],
    bids: [
        {
            offerId: 'bid-1',
            rentalIndex: 0,
            collateralValue: 100n,
            rentalFeePerUnitValue: 10n,
            bidConfig: {
                rentingDuration: 1n, // 1 min
                expirationTime: 60n * 60n, // expires in an hour
            },
        },
        {
            offerId: 'bid-2',
            rentalIndex: 0,
            collateralValue: 100n,
            rentalFeePerUnitValue: 10n,
            bidConfig: {
                rentingDuration: 2n, // 2 mins
                expirationTime: 60n * 60n, // expires in an hour
            },
        },
        {
            offerId: 'bid-3',
            rentalIndex: 0,
            collateralValue: 100n,
            rentalFeePerUnitValue: 10n,
            bidConfig: {
                rentingDuration: 3n, // 3 mins
                expirationTime: 60n * 60n, // expires in an hour
            },
        },
        {
            offerId: 'bid-4',
            rentalIndex: 0,
            collateralValue: 100n,
            rentalFeePerUnitValue: 10n,
            bidConfig: {
                rentingDuration: 4n, // 4 mins
                expirationTime: 60n * 60n, // expires in an hour
            },
        },
    ],
    governance: [
        {
            filters: ['make rental'],
            positions: makeOfferFilterPositions(['make rental']),
        },
        {
            filters: [],
            positions: makeOfferFilterPositions([]),
        },
        {
            apiMethod: 'addNewAsset',
            methodArgs: [process.env.KEYWORD],
            positions: makeApiInvocationPositions('addNewAsset', [process.env.KEYWORD]),
        },
    ],
    assets: ['ChainboardCollection', 'CrabbleCollection', 'CrabbleIST'],
    content: [
        {
            keyword: 'ChainboardCollection',
            value: turn => [
                {
                    topic: 'Agoric',
                    intakeClass: 'October 2023',
                    instructor: 'Anil Helvaci',
                    duration: '10 weeks',
                    participants: '3',
                    imagePath:
                        'https://firebasestorage.googleapis.com/v0/b/crabble-nfts.appspot.com/o/Chainboard%20Collection%2F1.jpg?alt=media&token=f7570df6-18e6-436d-bc01-e7445ee62dd0',
                    turn,
                    timestamp: Date.now(),
                },
            ],
        },
        {
            keyword: 'CrabbleIST',
            value: 1000000n * 10n ** 6n,
        },
        {
            keyword: 'CrabbleCollection',
            value: turn => [
                {
                    name: 'BytePitch Boys',
                    color: 'Orange',
                    age: '100',
                    imagePath:
                        'https://firebasestorage.googleapis.com/v0/b/crabble-nfts.appspot.com/o/Crabble%20Collection%2F1.jpg?alt=media',
                    turn,
                    timestamp: Date.now(),
                },
            ],
        },
    ],
};
