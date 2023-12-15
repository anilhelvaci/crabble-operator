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
    "-b block",
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
    return execSync(cmd, { stdio: "inherit", encoding: "utf-8", ...options });
};

const recoverFromMnemonic = (name) => {
    console.log(`Recovering account ${name}...`);
    const mnemonic = readFileSync(`./mnemonics/${name}-mnemonic`, { encoding: "utf-8"});
    console.log({ mnemonic })
    execute(agd.keys.add(name), { input: mnemonic, stdio: "pipe" });
    console.log(`Account recovered: ${name}`)
};

const queryProposals = rpc => {
    const proposalsRaw = execute(agd.query.gov.proposals(rpc), { stdio: 'pipe'});
    const proposalsParse = JSON.parse(proposalsRaw);
    console.log('Last Proposal', proposalsParse.proposals.slice(-1))
};

const sendWalletAction = (offer, from) => {
    execute(agd.tx.swingset.walletAction(offer, from));
};

export {
    recoverFromMnemonic,
    queryProposals,
    sendWalletAction
};