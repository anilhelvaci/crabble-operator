import { BASE_OFFER_IDs, getAmounts, INSTANCE_KEYWORDS } from './constants.js';
import { pollTx } from '../_agstate/yarn-links/agoric/src/lib/chain.js';
import { execFileSync } from 'child_process';
import scenarioConfigs from './scenarioConfigs.js';

const makeAuctionFlow = ({ offerSender, rpc, chainId, getState, getRental }) => {
    const runFlow = async ({ ownerKey, borrowerKey, sleep, turn }) => {
        const createRentalId = `${BASE_OFFER_IDs.AUCTION.CREATE_RENTAL}-${turn}`;
        const bidId = `${BASE_OFFER_IDs.AUCTION.BID}-${turn}`;
        const acceptBidId = `${BASE_OFFER_IDs.AUCTION.ACCEPT_BID}-${turn}`;
        const borrowRentalId = `${BASE_OFFER_IDs.AUCTION.BORROW_RENTAL}-${turn}`;
        const returnRentalId = `${BASE_OFFER_IDs.AUCTION.RETURN_UTIL}-${turn}`;
        const withdrawFeeId = `${BASE_OFFER_IDs.AUCTION.WITHDRAW_FEE}-${turn}`;
        const withdrawUtilId = `${BASE_OFFER_IDs.AUCTION.WITHDRAW_UTIL}-${turn}`;

        const { instances: rawInst, brands: rawBrands } = await getState();
        const instances = Object.fromEntries(rawInst);
        const brands = Object.fromEntries(rawBrands);
        const { utilityAmount, rentalFeeAmount, collateralAmountFungible, rentalFeePerUnitAmount } = getAmounts(
            brands,
            turn,
        );

        console.log('Fund account: owner...');
        const { txhash: ownerFundHash } = offerSender.fundAppUser(
            {
                keyword: 'CrabbleCollection',
                amount: utilityAmount,
            },
            ownerKey,
        );

        await pollTx(ownerFundHash, {
            execFileSync,
            delay: sleep,
            rpcAddrs: [rpc],
        });

        const { rentalHandle } = await getRental(`rental${turn}`);

        // create renal
        const { txhash: createTxHash } = offerSender.sendCreateRentalOffer(
            {
                id: createRentalId,
                instance: instances[INSTANCE_KEYWORDS.crabble],
                proposal: {
                    give: {
                        Utility: utilityAmount,
                    },
                },
                rentalConfig: {
                    utilityAmount,
                    ...scenarioConfigs.rentals[2].rentalConfig,
                },
            },
            ownerKey,
        );

        await pollTx(createTxHash, {
            execFileSync,
            delay: sleep,
            rpcAddrs: [rpc],
        });

        // bid
        const { txhash: bidTxHash } = offerSender.sendBidOffer(
            {
                id: bidId,
                instance: instances['Crabble'],
                rentalHandle,
                bidConfig: {
                    collateralAmount: collateralAmountFungible,
                    rentalFeePerUnitAmount,
                    ...scenarioConfigs.bids[0].bidConfig,
                },
            },
            borrowerKey,
        );

        await pollTx(bidTxHash, {
            execFileSync,
            delay: sleep,
            rpcAddrs: [rpc],
        });

        // accept
        const {} = offerSender.sendBidOffer({});
        // borrow
        // return
        // withdraw utility
        // withdraw rental fee
    };
};
