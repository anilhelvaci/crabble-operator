import './installSesLockdown.js';
import { makeChainWatcher } from "./chainWatcher.js";
import { makeOfferSender } from "./offers.js";

const exerciseGovInvitations = async () => {
  const { watch, getState, marshaller } = makeChainWatcher('https://xnet.agoric.net/network-config');
  const offerSender = makeOfferSender(marshaller);

  watch();
  const { instances: rawInstances } = await getState();
  const instances = Object.fromEntries(rawInstances);

  console.log('Exercise governor invitations...');
  offerSender.sendExerciseInvOffer({
    id: 'gov-mem-1',
    instance: instances["CrabbleGovernor"],
    description: 'Crabble Governance Invitation Handler',
  }, 'mem1');

  offerSender.sendExerciseInvOffer({
    id: 'gov-mem-2',
    instance: instances["CrabbleGovernor"],
    description: 'Crabble Governance Invitation Handler',
  }, 'mem2');

  offerSender.sendExerciseInvOffer({
    id: 'gov-mem-3',
    instance: instances["CrabbleGovernor"],
    description: 'Crabble Governance Invitation Handler',
  }, 'mem3');

  console.log('Exercise committee invitations...');
  offerSender.sendExerciseInvOffer({
    id: 'mem-1',
    instance: instances["CrabbleCommittee"],
    description: 'Voter0',
  }, 'mem1');

  offerSender.sendExerciseInvOffer({
    id: 'mem-2',
    instance: instances["CrabbleCommittee"],
    description: 'Voter1',
  }, 'mem2');

  offerSender.sendExerciseInvOffer({
    id: 'mem-3',
    instance: instances["CrabbleCommittee"],
    description: 'Voter2',
  }, 'mem3');
};

exerciseGovInvitations().then(() => process.exit(0));