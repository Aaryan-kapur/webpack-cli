const webpackCli = require('./webpack-cli');
const { core, commands } = require('./utils/cli-flags');
const cmdArgs = require('command-line-args');

require('./utils/process-log');

const isHelpFlagPresent = args => args.find(arg => ['help', '--help'].indexOf(arg) !== -1);
const isVersionFlagPresent =  args => args.find(arg => ['version', '--version'].indexOf(arg) !== -1);

const normalizeFlags = (args, command) => args.slice(2).filter(arg => arg.indexOf('--') < 0 && arg !== command.name && arg !== command.alias);

const isCommandUsed = commands =>
    commands.find(cmd => {
        return process.argv.includes(cmd.name) || process.argv.includes(cmd.alias);
    });

async function runCLI(cli, commandIsUsed) {
    let args;
    const helpFlagExists = isHelpFlagPresent(process.argv);
    const versionFlagExists = isVersionFlagPresent(process.argv);

    if (helpFlagExists) {
        await cli.runHelp();
        return;
    }

    else if(isVersionFlagPresent) {
        await cli.runVersion();
        return;
    }

    if (commandIsUsed) {
        commandIsUsed.defaultOption = true;
        args = normalizeFlags(process.argv, commandIsUsed);
        return await cli.runCommand(commandIsUsed, ...args);
    } else {
        args = cmdArgs(core, { stopAtFirstUnknown: false });
        try {
            const result = await cli.run(args, core);
            if (!result) {
                return;
            }
        } catch (err) {
            process.cliLogger.error(err);
            process.exit(1);
        }
    }
}

// eslint-disable-next-line space-before-function-paren
(async () => {
    const commandIsUsed = isCommandUsed(commands);
    const cli = new webpackCli();
    runCLI(cli, commandIsUsed);
})();
