import '../installSesLockdown.js';
import { makeChainWatcher } from '../chainWatcher.js';
import { makeOfferSender } from '../offers.js';
import { makeAdhocFlow } from './adhocFlow.js';
import { pollTx } from '../_agstate/yarn-links/agoric/src/lib/chain.js';
import { execFileSync } from 'child_process';
import { getAmounts } from './constants.js';
import { AmountMath } from '../_agstate/yarn-links/@agoric/ertp/src/index.js';
import { satisfies } from '../_agstate/yarn-links/@agoric/zoe/src/contractSupport/index.js';
import { sleep } from '../helpers.js';

const loadTest = async () => {
    const ownerKey = process.env.OWNER_KEY;
    const borrowerKey = process.env.BORROWER_KEY;
    const turn = process.env.TURN;

    const rpc = 'https://xnet.rpc.agoric.net:443';
    const chainId = 'agoric-mainfork-1';
    const networkConfig = 'https://xnet.agoric.net/network-config';

    const { watch, getState, marshaller, getRental } = makeChainWatcher(networkConfig);
    const offerSender = makeOfferSender(marshaller);

    watch();
    const { brands: rawBrands } = await getState();
    const brands = Object.fromEntries(rawBrands);

    console.log('Fund account: borrower...');
    const { txhash: borrowerFundHash } = offerSender.fundAppUser(
        {
            keyword: 'CrabbleIST',
            amount: AmountMath.make(brands['CrabbleIST'], 100_000_000_000_000n),
        },
        borrowerKey,
    );

    await pollTx(borrowerFundHash, {
        execFileSync,
        delay: sleep,
        rpcAddrs: [rpc],
    });

    const adhocFlow = makeAdhocFlow({
        offerSender,
        rpc,
        chainId,
        getState,
        getRental,
    });

    const start = Date.now();
    await adhocFlow.runFlow({
        ownerKey,
        borrowerKey,
        sleep: ms => new Promise(resolve => setTimeout(resolve, ms)),
        turn,
    });

    const end = Date.now();
    console.log('Duration', (end - start) / 1000, 'seconds');
};

loadTest().then(() => {
    console.log('Done, exiting...');
    process.exit(0);
});
