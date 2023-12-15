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
    
    const getState = async () => {
        await Promise.all([
            promiseKits.brands.promise,
            promiseKits.instances.promise,
        ]);

        return harden({ ...state });
    };

    const watch = () => {
        watchBrand();
        watchInstance()
    };

    return harden({
        watch,
        getState,
        marshaller,
    });
};
harden(makeChainWatcher);

export { makeChainWatcher };