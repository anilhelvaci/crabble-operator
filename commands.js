import { execSync } from "child_process";
import { readFileSync } from "fs";

const agdBin = 'agd'

const GLOBAL_OPTIONS = [
    // '--keyring-backend=test',
    '--output=json'
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

};

const execute = (cmd, options = {}) => {
    return execSync(cmd, { stdio: "inherit", encoding: "utf-8", ...options });
};

const recoverFromMnemonic = (name) => {
    console.log(`Recovering account ${name}...`);
    const mnemonic = readFileSync(`./mnemonics/${name}-mnemonic`, { encoding: "utf-8"});
    execute(agd.keys.add(name), { input: mnemonic});
    console.log(`Account recovered: ${name}`)
};

const queryProposals = rpc => {
    const proposalsRaw = execute(agd.query.gov.proposals(rpc), { stdio: 'pipe'});
    const proposalsParse = JSON.parse(proposalsRaw);
    console.log('Last Proposal', proposalsParse.proposals.slice(-1))
};

console.log({
    cmd: agd.query.gov.proposals('https://xnet.rpc.agoric.net:443')
})

queryProposals('https://xnet.rpc.agoric.net:443');

export {
    agd,
    execute,
    recoverFromMnemonic,
};