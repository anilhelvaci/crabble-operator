import { sendWalletAction } from "./commands.js";
import { makeOfferFilterPositions } from "@agoric/governance/src/contractGovernance/governFilter.js";

const OfferSpecs = harden({
  exerciseInvitation: ({ id, instance, description }) => ({
    id,
    invitationSpec: {
      source: "purse",
      instance: instance,
      description,
    },
    proposal: {},
  }),
  pauseOffers: ({ id, filters, prevId, duration }) => ({
    id,
    invitationSpec: {
      source: "continuing",
      previousOffer: prevId,
      invitationMakerName: "VoteOnPauseOffers",
      invitationArgs: [
        filters,
        BigInt(Math.floor(Date.now() / 1000)) + duration,
      ],
    },
    proposal: {},
  }),
  vote: ({ id, prevId, position, questionHandle }) => ({
    id,
    invitationSpec: {
      source: "continuing",
      previousOffer: prevId,
      invitationMakerName: "makeVoteInvitation",
      invitationArgs: harden([[position], questionHandle]),
    },
    proposal: {},
  }),
  createRental: ({ id, instance, proposal, rentalConfig }) => ({
    id,
    invitationSpec: {
      source: "contract",
      instance,
      publicInvitationMaker: "makeRentalInvitation",
    },
    proposal,
    offerArgs: {
      rentalConfig,
    },
  }),
  buyOut: ({ id, instance, rentalHandle, proposal, rentingDuration }) => ({
    id,
    invitationSpec: {
      source: "agoricContract",
      instancePath: [instance],
      callPipe: [
        ["getRentalByHandle", [rentalHandle]],
        ["makeBuyOutInvitation"],
      ],
    },
    proposal,
    offerArgs: {
      rentingDuration,
    },
  }),
  bid: ({ id, instance, rentalHandle, bidConfig }) => ({
    id,
    invitationSpec: {
      source: "agoricContract",
      instance,
      callPipe: [["getRentalByHandle", [rentalHandle]], ["makeBidInvitation"]],
    },
    proposal: {},
    offerArgs: {
      bidConfig,
    },
  }),
  acceptBid: ({ id, previousOffer, offerArgs }) => ({
    id,
    invitationSpec: {
      source: "continuing",
      previousOffer,
      invitationMakerName: "acceptBid",
    },
    proposal: {},
    offerArgs,
  }),
  borrow: ({ id, previousOffer, proposal }) => ({
    id,
    invitationSpec: {
      source: "continuing",
      previousOffer,
      invitationMakerName: "borrowUtility",
    },
    proposal,
  }),
  returnUtility: ({ id, previousOffer, proposal }) => ({
    id,
    invitationSpec: {
      source: "continuing",
      previousOffer,
      invitationMakerName: "returnUtility",
    },
    proposal,
  }),
  withdrawUtility: ({ id, previousOffer, proposal }) => ({
    id,
    invitationSpec: {
      source: "continuing",
      previousOffer,
      invitationMakerName: "withdrawUtility",
    },
    proposal,
  }),
  withdrawCollateral: ({ id, previousOffer, proposal }) => ({
    id,
    invitationSpec: {
      source: "continuing",
      previousOffer,
      invitationMakerName: "withdrawCollateral",
    },
    proposal,
  }),
  withdrawRentalFee: ({ id, previousOffer, proposal }) => ({
    id,
    invitationSpec: {
      source: "continuing",
      previousOffer,
      invitationMakerName: "withdrawRentalFee",
    },
    proposal,
  }),
  faucet: ({keyword, amount}) => ({
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

const logger = (tag, message) => {
  console.log("[OFFER_SENDER]", tag, message);
};

const makeOfferSender = (marshaller) => {
  const sendExerciseInvOffer = (options, from) => {
    const spendAction = {
      method: "executeOffer",
      offer: OfferSpecs.exerciseInvitation(options),
    };

    const offer = JSON.stringify(marshaller.toCapData(harden(spendAction)));
    return sendWalletAction(offer, from);
  };

  const askPauseOffersQuestion = (options, from) => {
    const spendAction = {
      method: "executeOffer",
      offer: OfferSpecs.pauseOffers(options),
    };

    const offer = JSON.stringify(marshaller.toCapData(harden(spendAction)));
    return sendWalletAction(offer, from);
  };

  const votePositive = (options, from) => {
    const { positive } = makeOfferFilterPositions(options.filters);

    const spendAction = {
      method: "executeOffer",
      offer: OfferSpecs.vote({ ...options, position: positive }),
    };

    const offer = JSON.stringify(marshaller.toCapData(harden(spendAction)));
    return sendWalletAction(offer, from);
  };

  const sendCreateRentalOffer = (options, from) => {
    const spendAction = {
      method: "executeOffer",
      offer: OfferSpecs.createRental(options),
    };

    const offer = JSON.stringify(marshaller.toCapData(harden(spendAction)));
    return sendWalletAction(offer, from);
  };

  const sendBuyOutOffer = (options, from) => {
    const spendAction = {
      method: "executeOffer",
      offer: OfferSpecs.buyOut(options),
    };

    const offer = JSON.stringify(marshaller.toCapData(harden(spendAction)));
    return sendWalletAction(offer, from);
  };

  const sendBidOffer = (options, from) => {
    const spendAction = {
      method: "executeOffer",
      offer: OfferSpecs.bid(options),
    };

    const offer = JSON.stringify(marshaller.toCapData(harden(spendAction)));
    return sendWalletAction(offer, from);
  };

  const sendAcceptBidOffer = (options, from) => {
    const spendAction = {
      method: "executeOffer",
      offer: OfferSpecs.acceptBid(options),
    };

    const offer = JSON.stringify(marshaller.toCapData(harden(spendAction)));
    return sendWalletAction(offer, from);
  };

  const sendBorrowOffer = (options, from) => {
    const spendAction = {
      method: "executeOffer",
      offer: OfferSpecs.borrow(options),
    };

    const offer = JSON.stringify(marshaller.toCapData(harden(spendAction)));
    return sendWalletAction(offer, from);
  };

  const sendReturnUtilityOffer = (options, from) => {
    const spendAction = {
      method: "executeOffer",
      offer: OfferSpecs.returnUtility(options),
    };

    const offer = JSON.stringify(marshaller.toCapData(harden(spendAction)));
    return sendWalletAction(offer, from);
  };

  const sendWithdrawUtilityOffer = (options, from) => {
    const spendAction = {
      method: "executeOffer",
      offer: OfferSpecs.withdrawUtility(options),
    };

    const offer = JSON.stringify(marshaller.toCapData(harden(spendAction)));
    return sendWalletAction(offer, from);
  };

  const sendWithdrawCollateralOffer = (options, from) => {
    const spendAction = {
      method: "executeOffer",
      offer: OfferSpecs.withdrawCollateral(options),
    };

    const offer = JSON.stringify(marshaller.toCapData(harden(spendAction)));
    return sendWalletAction(offer, from);
  };

  const sendWithdrawRentalFeeOffer = (options, from) => {
    const spendAction = {
      method: "executeOffer",
      offer: OfferSpecs.withdrawRentalFee(options),
    };

    const offer = JSON.stringify(marshaller.toCapData(harden(spendAction)));
    return sendWalletAction(offer, from);
  };

  const fundAppUser = (options, from) => {
    const spendAction = {
      method: "executeOffer",
      offer: OfferSpecs.faucet(options),
    };

    const offer = JSON.stringify(marshaller.toCapData(harden(spendAction)));
    return sendWalletAction(offer, from);
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
