import { sendWalletAction } from "./commands.js";

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
      sendWalletAction(offer, from);
  }

  return harden({
      sendExerciseInvOffer,
  });
};
harden(makeOfferSender);

export {
    makeOfferSender,
}