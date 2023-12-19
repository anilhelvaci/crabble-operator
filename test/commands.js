import { execSync } from 'child_process';
import { readFileSync } from 'fs';

const agdBin = 'agd';

const agd = {
    core_eval: {
        publish: (bundle, rpc, chain_id, key) => [
            agdBin,
            'tx',
            'swingset',
            'install-bundle',
            bundle,
            '--node',
            rpc,
            '--from',
            key,
            '--chain-id=',
            chain_id,
            '--keyring-backend=test',
            '--gas=auto',
            '-b block',
            '--yes',
        ],

        submit: (permit, core_eval, deposit, chain_id, key) => [
            agdBin,
            'tx',
            'gov',
            'submit-proposal',
            permit,
            core_eval,
            'swingset-core-eval',
            '--title="Crabble-rc1"',
            '--description="Crabble core-eval for source contract"',
            '--deposit=',
            deposit,
            '--from',
            key,
            '--chain-id=',
            chain_id,
            '--keyring-backend=test',
            '--gas-adjustment=1.2',
            '--gas=auto',
            '-b block',
            '--yes',
        ],

        vote: (proposal, option, chain_id, key) => [
            agdBin,
            'tx',
            'gov',
            'vote',
            proposal,
            option,
            '--from',
            key,
            '--chain-id=',
            chain_id,
            '--keyring-backend=test',
            '--gas-adjustment=1.2',
            '--gas=auto',
            '-b block',
            '--yes',
        ],
    },
};

const execute = (cmd, options = {}) => {
    return execSync(cmd, { studio: 'inherit', encoding: 'utf-8', ...options });
};

const publish = (bundle, rpc, chain_id, key) => {
    console.log('Publish Crabble');
    execute(agd.core_eval.publish(bundle, rpc, chain_id, key), {
        stdio: 'pipe',
    });
    console.log('Success');
};

const submitCoreEval = (permit, core_eval, deposit, chain_id, key) => {
    console.log('Submitting Crabble core eval');
    execute(agd.core_eval.submit(permit, core_eval, deposit, chain_id, key), {
        stdio: 'pipe',
    });
    console.log('Success');
};

const vote = (proposal, option, chain_id, key) => {
    console.log('Vote on proposal');
    execute(agd.core_eval.vote(proposal, option, chain_id, key), {
        stdio: 'pipe',
    });
    console.log('Success');
};

export { agd, execute, publish, submitCoreEval, vote };
