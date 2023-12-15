import { sendWalletAction } from "./commands.js";
import { makeOfferFilterPositions } from '@agoric/governance/src/contractGovernance/governFilter.js';

const OfferSpecs = harden({
    exerciseInvitation: ({id, instance, description}) => ({
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
            invitationArgs: harden([
                [position],
                questionHandle,
            ]),
        },
        proposal: {},
    })
});

const logger = (tag, message) => {
  console.log('[OFFER_SENDER]', tag, message);
};

const makeOfferSender = (marshaller) => {
  const sendExerciseInvOffer = (options, from) => {
      const spendAction = {
          method: 'executeOffer',
          offer: OfferSpecs.exerciseInvitation(options),
      };

      const offer = JSON.stringify(marshaller.toCapData(harden(spendAction)));
      return sendWalletAction(offer, from);
  };

  const askPauseOffersQuestion = (options, from) => {
      const spendAction = {
          method: 'executeOffer',
          offer: OfferSpecs.pauseOffers(options),
      };

      const offer = JSON.stringify(marshaller.toCapData(harden(spendAction)));
      return sendWalletAction(offer, from);
  };

  const votePositive = (options, from) => {
      const { positive } = makeOfferFilterPositions(options.filters);

      const spendAction = {
          method: 'executeOffer',
          offer: OfferSpecs.vote({ ...options, position: positive }),
      };

      const offer = JSON.stringify(marshaller.toCapData(harden(spendAction)));
      return sendWalletAction(offer, from);
  };

  return harden({
      sendExerciseInvOffer,
      askPauseOffersQuestion,
      votePositive,
  });
};
harden(makeOfferSender);

export {
    makeOfferSender,
}