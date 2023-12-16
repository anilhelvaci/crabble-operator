import { makeLeader, makeCastingSpec, makeFollower, iterateLatest } from '@agoric/casting';
import { makeImportContext } from '@agoric/smart-wallet/src/marshal-contexts.js';
import { makePromiseKit } from "@endo/promise-kit";

const makeChainWatcher = (networkConfigAddr) => {
    const leader = makeLeader(networkConfigAddr);
    const { fromBoard: marshaller } = makeImportContext();
    const options = harden({
        unserializer: marshaller,
    });
    
    const state = {};
    const promiseKits = harden({
        brands: makePromiseKit(),
        issuers: makePromiseKit(),
        instances: makePromiseKit(),
    });

    const brandCastingSpec = makeCastingSpec(':published.agoricNames.brand');
    const brandFollower = makeFollower(brandCastingSpec, leader, options);

    const issuerCastingSpec = makeCastingSpec(':published.agoricNames.issuer');
    const issuerFollower = makeFollower(issuerCastingSpec, leader, options);

    const instanceCastingSpec = makeCastingSpec(':published.agoricNames.instance');
    const instanceFollower = makeFollower(instanceCastingSpec, leader, options);



    const lastQuestionCastingSpec = makeCastingSpec(':published.crabble.committee.latestQuestion');
    const lastQuestionFollower = makeFollower(lastQuestionCastingSpec, leader, options);

    const watchBrand = async () => {
        for await (const { value: brands } of iterateLatest(brandFollower)) {
            state.brands = brands;
            promiseKits.brands.resolve(true);
        }
    };

    const watchIssuer = async () => {
        for await (const { value: issuers } of iterateLatest(issuerFollower)) {
           state.issuers = issuers;
           promiseKits.issuers.resolve(true);
        }
    };

    const watchInstance = async () => {
        for await (const { value: instances } of iterateLatest(instanceFollower)) {
           state.instances = instances;
            promiseKits.instances.resolve(true);
        }
    };

    const watchRentals = async () => {
        for await (const { value: rentals } of iterateLatest(rentalFollower)) {
           state.rentals = rentals;
        }
    };

    const watchLatestQuestion = async () => {
        for await (const { value: latestQuestion } of iterateLatest(lastQuestionFollower)) {
            state.latestQuestion = latestQuestion;
        }
    };
    
    const getState = async () => {
        await Promise.all([
            promiseKits.brands.promise,
            promiseKits.instances.promise,
        ]);

        return harden({ ...state });
    };

    const getLatestQuestionHandle = () => {
        const { latestQuestion } = state;

        if (!latestQuestion) throw new Error('No latest question');

        if (latestQuestion.closingRule.deadline * 1000n > BigInt(Date.now())) {
            return harden({ active: true, questionHandle: latestQuestion.questionHandle});
        }

        return harden({ active: false, questionHandle: latestQuestion.questionHandle});
    };

    const getRental = async (rentalPath) => {
        const rentalCastingSpec = makeCastingSpec(`:published.crabble.rentals.${rentalPath}`);
        const rentalFollower = makeFollower(rentalCastingSpec, leader, options);
        let rental;

        for await (const { value: rentalRemote } of iterateLatest(rentalFollower)) {
            rental = rentalRemote;
            break;
        }

        return rental;
    };

    const watch = () => {
        watchBrand();
        watchIssuer();
        watchInstance();
        watchLatestQuestion();
    };

    return harden({
        watch,
        getState,
        marshaller,
        getLatestQuestionHandle,
        getRental,
    });
};
harden(makeChainWatcher);

export { makeChainWatcher };