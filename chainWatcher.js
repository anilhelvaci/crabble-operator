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
        instances: makePromiseKit(),
    });

    const brandCastingSpec = makeCastingSpec(':published.agoricNames.brand');
    const brandFollower = makeFollower(brandCastingSpec, leader, options);

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

    const watchInstance = async () => {
        for await (const { value: instances } of iterateLatest(instanceFollower)) {
           state.instances = instances;
            promiseKits.instances.resolve(true);
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

    const watch = () => {
        watchBrand();
        watchInstance();
        watchLatestQuestion();
    };

    return harden({
        watch,
        getState,
        marshaller,
        getLatestQuestionHandle,
    });
};
harden(makeChainWatcher);

export { makeChainWatcher };