import { execFileSync } from 'child_process';
import { readFileSync } from 'fs';
import { pollTx } from './_agstate/yarn-links/agoric/src/lib/chain.js';
import { sleep } from './helpers.js';

const agdBin = 'agd';

const GLOBAL_OPTIONS = ['--keyring-backend=test', '--output=json'];

const SIGN_BROADCAST_OPTS = (rpc, chainID) => [
    '--keyring-backend=test',
    '--chain-id',
    chainID,
    '--gas=auto',
    '--fees=80000ubld',
    '--gas-adjustment=1.2',
    '--yes',
    '--node',
    rpc,
    '--output',
    'json',
];

const agd = {
    keys: {
        add: name => [agdBin, 'keys', 'add', name, '--recover', ...GLOBAL_OPTIONS].join(' '),
    },
    query: {
        gov: {
            proposals: rpc => [agdBin, 'query', 'gov', 'proposals', '--node', rpc, ...GLOBAL_OPTIONS].join(' '),
        },
    },
    tx: {
        swingset: {
            // Offer = cap data
            walletAction: (offer, from, rpc, chainID) => [
                'tx',
                'swingset',
                'wallet-action',
                offer,
                `--from=${from}`,
                '--allow-spend',
                ...SIGN_BROADCAST_OPTS(rpc, chainID),
            ],
        },
    },
};

const execute = (args, options = {}) => {
    console.log('Executing: ', args);
    return execFileSync(agdBin, args, { stdio: 'pipe', encoding: 'utf-8', ...options });
};

const recoverFromMnemonic = name => {
    console.log(`Recovering account ${name}...`);
    const mnemonic = readFileSync(`./mnemonics/${name}-mnemonic`, { encoding: 'utf-8' });
    console.log({ mnemonic });
    execute(agd.keys.add(name), { input: mnemonic });
    console.log(`Account recovered: ${name}`);
};

const queryProposals = rpc => {
    const proposalsRaw = execute(agd.query.gov.proposals(rpc));
    const proposalsParse = JSON.parse(proposalsRaw);
    console.log('Last Proposal', proposalsParse.proposals.slice(-1));
};

const sendWalletAction = (offer, from, rpc, chainID) => {
    const tx = execute(agd.tx.swingset.walletAction(offer, from, rpc, chainID));
    const { txhash } = JSON.parse(tx);
    return pollTx(txhash, {
        execFileSync,
        delay: sleep,
        rpcAddrs: [rpc],
    });
};

export { recoverFromMnemonic, queryProposals, sendWalletAction };
