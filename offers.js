import { sendWalletAction } from './commands.js';
import { makeOfferFilterPositions } from '@agoric/governance/src/contractGovernance/governFilter.js';

const OfferSpecs = harden({
    exerciseInvitation: ({ id, instance, description }) => ({
        id,
        invitationSpec: {
            source: 'purse',
            instance: instance,
            description,
        },
        proposal: {},
    }),
    pauseOffers: ({ id, filters, prevId, duration }) => ({
        id,
        invitationSpec: {
            source: 'continuing',
            previousOffer: prevId,
            invitationMakerName: 'VoteOnPauseOffers',
            invitationArgs: [filters, BigInt(Math.floor(Date.now() / 1000)) + duration],
        },
        proposal: {},
    }),
    vote: ({ id, prevId, position, questionHandle }) => ({
        id,
        invitationSpec: {
            source: 'continuing',
            previousOffer: prevId,
            invitationMakerName: 'makeVoteInvitation',
            invitationArgs: harden([[position], questionHandle]),
        },
        proposal: {},
    }),
    createRental: ({ id, instance, proposal, rentalConfig }) => ({
        id,
        invitationSpec: {
            source: 'contract',
            instance,
            publicInvitationMaker: 'makeRentalInvitation',
        },
        proposal,
        offerArgs: {
            rentalConfig,
        },
    }),
    buyOut: ({ id, instance, rentalHandle, proposal, rentingDuration }) => ({
        id,
        invitationSpec: {
            source: 'agoricContract',
            instancePath: [instance],
            callPipe: [['getRentalByHandle', [rentalHandle]], ['makeBuyOutInvitation']],
        },
        proposal,
        offerArgs: {
            rentingDuration,
        },
    }),
    bid: ({ id, instance, rentalHandle, bidConfig }) => ({
        id,
        invitationSpec: {
            source: 'agoricContract',
            instance,
            callPipe: [['getRentalByHandle', [rentalHandle]], ['makeBidInvitation']],
        },
        proposal: {},
        offerArgs: {
            bidConfig,
        },
    }),
    acceptBid: ({ id, previousOffer, offerArgs }) => ({
        id,
        invitationSpec: {
            source: 'continuing',
            previousOffer,
            invitationMakerName: 'acceptBid',
        },
        proposal: {},
        offerArgs,
    }),
    borrow: ({ id, previousOffer, proposal }) => ({
        id,
        invitationSpec: {
            source: 'continuing',
            previousOffer,
            invitationMakerName: 'borrowUtility',
        },
        proposal,
    }),
    returnUtility: ({ id, previousOffer, proposal }) => ({
        id,
        invitationSpec: {
            source: 'continuing',
            previousOffer,
            invitationMakerName: 'returnUtility',
        },
        proposal,
    }),
    withdrawUtility: ({ id, previousOffer, proposal }) => ({
        id,
        invitationSpec: {
            source: 'continuing',
            previousOffer,
            invitationMakerName: 'withdrawUtility',
        },
        proposal,
    }),
    withdrawCollateral: ({ id, previousOffer, proposal }) => ({
        id,
        invitationSpec: {
            source: 'continuing',
            previousOffer,
            invitationMakerName: 'withdrawCollateral',
        },
        proposal,
    }),
    withdrawRentalFee: ({ id, previousOffer, proposal }) => ({
        id,
        invitationSpec: {
            source: 'continuing',
            previousOffer,
            invitationMakerName: 'withdrawRentalFee',
        },
        proposal,
    }),
    faucet: ({ keyword, amount }) => ({
        id: `mint-${keyword}-${Date.now()}`,
        invitationSpec: {
            source: 'agoricContract',
            instancePath: [`${keyword}Faucet`],
            callPipe: [['makeMintInvitation']],
        },
        proposal: {
            want: {
                [keyword]: amount,
            },
        },
    }),
});

const makeOfferSender = (marshaller, rpc, chainID) => {
    const sendExerciseInvOffer = (options, from) => {
        const spendAction = {
            method: 'executeOffer',
            offer: OfferSpecs.exerciseInvitation(options),
        };

        const offer = JSON.stringify(marshaller.toCapData(harden(spendAction)));
        return sendWalletAction(offer, from, rpc, chainID);
    };

    const askPauseOffersQuestion = (options, from) => {
        const spendAction = {
            method: 'executeOffer',
            offer: OfferSpecs.pauseOffers(options),
        };

        const offer = JSON.stringify(marshaller.toCapData(harden(spendAction)));
        return sendWalletAction(offer, from, rpc, chainID);
    };

    const votePositive = (options, from) => {
        const { positive } = makeOfferFilterPositions(options.filters);

        const spendAction = {
            method: 'executeOffer',
            offer: OfferSpecs.vote({ ...options, position: positive }),
        };

        const offer = JSON.stringify(marshaller.toCapData(harden(spendAction)));
        return sendWalletAction(offer, from, rpc, chainID);
    };

    const sendCreateRentalOffer = (options, from) => {
        const spendAction = {
            method: 'executeOffer',
            offer: OfferSpecs.createRental(options),
        };

        const offer = JSON.stringify(marshaller.toCapData(harden(spendAction)));
        return sendWalletAction(offer, from, rpc, chainID);
    };

    const sendBuyOutOffer = (options, from) => {
        const spendAction = {
            method: 'executeOffer',
            offer: OfferSpecs.buyOut(options),
        };

        const offer = JSON.stringify(marshaller.toCapData(harden(spendAction)));
        return sendWalletAction(offer, from, rpc, chainID);
    };

    const sendBidOffer = (options, from) => {
        const spendAction = {
            method: 'executeOffer',
            offer: OfferSpecs.bid(options),
        };

        const offer = JSON.stringify(marshaller.toCapData(harden(spendAction)));
        return sendWalletAction(offer, from, rpc, chainID);
    };

    const sendAcceptBidOffer = (options, from) => {
        const spendAction = {
            method: 'executeOffer',
            offer: OfferSpecs.acceptBid(options),
        };

        const offer = JSON.stringify(marshaller.toCapData(harden(spendAction)));
        return sendWalletAction(offer, from, rpc, chainID);
    };

    const sendBorrowOffer = (options, from) => {
        const spendAction = {
            method: 'executeOffer',
            offer: OfferSpecs.borrow(options),
        };

        const offer = JSON.stringify(marshaller.toCapData(harden(spendAction)));
        return sendWalletAction(offer, from, rpc, chainID);
    };

    const sendReturnUtilityOffer = (options, from) => {
        const spendAction = {
            method: 'executeOffer',
            offer: OfferSpecs.returnUtility(options),
        };

        const offer = JSON.stringify(marshaller.toCapData(harden(spendAction)));
        return sendWalletAction(offer, from, rpc, chainID);
    };

    const sendWithdrawUtilityOffer = (options, from) => {
        const spendAction = {
            method: 'executeOffer',
            offer: OfferSpecs.withdrawUtility(options),
        };

        const offer = JSON.stringify(marshaller.toCapData(harden(spendAction)));
        return sendWalletAction(offer, from, rpc, chainID);
    };

    const sendWithdrawCollateralOffer = (options, from) => {
        const spendAction = {
            method: 'executeOffer',
            offer: OfferSpecs.withdrawCollateral(options),
        };

        const offer = JSON.stringify(marshaller.toCapData(harden(spendAction)));
        return sendWalletAction(offer, from, rpc, chainID);
    };

    const sendWithdrawRentalFeeOffer = (options, from) => {
        const spendAction = {
            method: 'executeOffer',
            offer: OfferSpecs.withdrawRentalFee(options),
        };

        const offer = JSON.stringify(marshaller.toCapData(harden(spendAction)));
        return sendWalletAction(offer, from, rpc, chainID);
    };

    const fundAppUser = (options, from) => {
        const spendAction = {
            method: 'executeOffer',
            offer: OfferSpecs.faucet(options),
        };

        const offer = JSON.stringify(marshaller.toCapData(harden(spendAction)));
        return sendWalletAction(offer, from, rpc, chainID);
    };

    return harden({
        sendExerciseInvOffer,
        askPauseOffersQuestion,
        votePositive,
        sendCreateRentalOffer,
        sendBuyOutOffer,
        sendBidOffer,
        sendAcceptBidOffer,
        sendBorrowOffer,
        sendReturnUtilityOffer,
        sendWithdrawUtilityOffer,
        sendWithdrawCollateralOffer,
        sendWithdrawRentalFeeOffer,
        fundAppUser,
    });
};
harden(makeOfferSender);

export { makeOfferSender };
