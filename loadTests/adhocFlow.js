import { pollTx } from '../_agstate/yarn-links/agoric/src/lib/chain.js';
import { execFileSync } from 'child_process';
import { BASE_OFFER_IDs, getAmounts, INSTANCE_KEYWORDS } from './constants.js';
import scenarioConfigs from './scenarioConfigs.js';

const makeAdhocFlow = ({ offerSender, rpc, chainId, getState, getRental }) => {
    const runFlow = async ({ ownerKey, borrowerKey, sleep, turn = 1 }) => {
        const createRentalId = `${BASE_OFFER_IDs.ADHOC.CREATE_RENTAL}-${turn}`;
        const buyoutRentalId = `${BASE_OFFER_IDs.ADHOC.BUYOUT_RENTAL}-${turn}`;
        const returnRentalId = `${BASE_OFFER_IDs.ADHOC.RETURN_UTIL}-${turn}`;
        const withdrawFeeId = `${BASE_OFFER_IDs.ADHOC.WITHDRAW_FEE}-${turn}`;
        const withdrawUtilId = `${BASE_OFFER_IDs.ADHOC.WITHDRAW_UTIL}-${turn}`;

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

        const { txhash: createRentalHash } = await offerSender.sendCreateRentalOffer(
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
                    rentalFeePerUnitAmount,
                    collateralAmount: collateralAmountFungible,
                    ...scenarioConfigs.rentals[0].rentalConfig,
                },
            },
            ownerKey,
        );

        await pollTx(createRentalHash, {
            execFileSync,
            delay: sleep,
            rpcAddrs: [rpc],
        });

        const { rentalHandle } = await getRental(`rental${turn}`);

        const { txhash: borrowTxHash } = offerSender.sendBuyOutOffer(
            {
                id: buyoutRentalId,
                instance: 'Crabble',
                rentalHandle,
                proposal: {
                    give: {
                        Collateral: collateralAmountFungible,
                        RentalFee: rentalFeeAmount,
                    },
                    want: {
                        Utility: utilityAmount,
                    },
                },
                rentingDuration: 1n,
            },
            borrowerKey,
        );

        await pollTx(borrowTxHash, {
            execFileSync,
            delay: sleep,
            rpcAddrs: [rpc],
        });

        await sleep(60 * 1000); // ms

        // Return
        const { txhash: returnTxHash } = offerSender.sendReturnUtilityOffer(
            {
                id: returnRentalId,
                previousOffer: buyoutRentalId,
                proposal: {
                    give: {
                        Utility: utilityAmount,
                    },
                    want: {
                        Collateral: collateralAmountFungible,
                    },
                },
            },
            borrowerKey,
        );

        await pollTx(returnTxHash, {
            execFileSync,
            delay: sleep,
            rpcAddrs: [rpc],
        });

        // Withdraw rental fee, id, previousOffer, proposal
        const { txhash } = offerSender.sendWithdrawRentalFeeOffer(
            {
                id: withdrawFeeId,
                previousOffer: createRentalId,
                proposal: {
                    want: {
                        RentalFee: rentalFeeAmount,
                    },
                },
            },
            ownerKey,
        );

        await pollTx(txhash, {
            execFileSync,
            delay: sleep,
            rpcAddrs: [rpc],
        });

        // Withdraw Utility - id, previousOffer, proposal
        offerSender.sendWithdrawUtilityOffer(
            {
                id: withdrawUtilId,
                previousOffer: createRentalId,
                proposal: {
                    want: {
                        Utility: utilityAmount,
                    },
                },
            },
            ownerKey,
        );
    };

    return harden({
        runFlow,
    });
};

export { makeAdhocFlow };
