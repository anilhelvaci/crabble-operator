import { execSync } from "child_process";
import { readFileSync } from "fs";

const agdBin = 'agd'

const GLOBAL_OPTIONS = [
    '--keyring-backend=test',
    '--output=json'
];

const SIGN_BROADCAST_OPTS = (rpc, chainID) => [
    "--keyring-backend=test",
    "--chain-id",
    chainID,
    "--gas=auto",
	"--gas-adjustment=1.2",
    "--yes",
    "--node",
    rpc,
	"--output json",
];

const agd = {
    keys: {
        add: name => [agdBin, 'keys', 'add', name, '--recover', ...GLOBAL_OPTIONS].join(' '),
    },
    query: {
        gov: {
            proposals: (rpc) => [agdBin, 'query', 'gov', 'proposals', '--node', rpc, ...GLOBAL_OPTIONS].join(' '),
        }
    },
    tx: {
        swingset: {
            // Offer = cap data
            walletAction: (offer, from) => [agdBin, 'tx', 'swingset', 'wallet-action', `'${offer}'`, `--from=${from}`,
                '--allow-spend', ...SIGN_BROADCAST_OPTS('http://localhost:26657', 'agoriclocal')].join(' '),
        }
    }
};

const execute = (cmd, options = {}) => {
    console.log('Executing: ', cmd)
    return execSync(cmd, { stdio: "pipe", encoding: "utf-8", ...options });
};

const recoverFromMnemonic = (name) => {
    console.log(`Recovering account ${name}...`);
    const mnemonic = readFileSync(`./mnemonics/${name}-mnemonic`, { encoding: "utf-8"});
    console.log({ mnemonic })
    execute(agd.keys.add(name), { input: mnemonic});
    console.log(`Account recovered: ${name}`)
};

const queryProposals = rpc => {
    const proposalsRaw = execute(agd.query.gov.proposals(rpc));
    const proposalsParse = JSON.parse(proposalsRaw);
    console.log('Last Proposal', proposalsParse.proposals.slice(-1))
};

const sendWalletAction = (offer, from) => {
    const tx = execute(agd.tx.swingset.walletAction(offer, from));
    return JSON.parse(tx);
};

export {
    recoverFromMnemonic,
    queryProposals,
    sendWalletAction
};