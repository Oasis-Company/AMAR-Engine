#!/usr/bin/env node

/**
 * AMAR Engine Command Line Interface (ame)
 * A command line tool for interacting with AMAR Engine
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { AMAR_ENGINE_VERSION } from '../version';
import { initCommand } from './commands/init';
import { statusCommand } from './commands/status';
import { metaclassCommand } from './commands/metaclass';
import { aeidCommand } from './commands/aeid';
import { skillCommand } from './commands/skill';

// Create commander instance
const program = new Command();

// Set program info
program
  .name('ame')
  .version(AMAR_ENGINE_VERSION)
  .description('AMAR Engine Command Line Interface')
  .usage('<command> [options]');

// Add commands
program
  .command('init')
  .description('Initialize AMAR Engine')
  .action(initCommand);

program
  .command('status')
  .description('Check AMAR Engine status')
  .action(statusCommand);

// Metaclass commands
const metaclass = program.command('metaclass')
  .description('Manage metaclasses');

metaclass
  .command('register')
  .description('Register a new metaclass')
  .action(metaclassCommand.register);

metaclass
  .command('list')
  .description('List all registered metaclasses')
  .action(metaclassCommand.list);

metaclass
  .command('compose')
  .description('Compose multiple metaclasses')
  .action(metaclassCommand.compose);

// AEID commands
const aeid = program.command('aeid')
  .description('Manage AEIDs');

aeid
  .command('generate')
  .description('Generate a new AEID')
  .option('-t, --type <type>', 'Asset type')
  .action(aeidCommand.generate);

aeid
  .command('validate')
  .description('Validate an AEID')
  .argument('<aeid>', 'AEID to validate')
  .action(aeidCommand.validate);

aeid
  .command('register')
  .description('Register an AEID')
  .argument('<aeid>', 'AEID to register')
  .action(aeidCommand.register);

aeid
  .command('query')
  .description('Query an AEID')
  .argument('<aeid>', 'AEID to query')
  .action(aeidCommand.query);

// Skill commands
const skill = program.command('skill')
  .description('Manage skills');

skill
  .command('register')
  .description('Register a new skill')
  .action(skillCommand.register);

skill
  .command('execute')
  .description('Execute a skill')
  .argument('<skillId>', 'Skill ID to execute')
  .action(skillCommand.execute);

skill
  .command('list')
  .description('List all registered skills')
  .action(skillCommand.list);

// Handle help
program.on('--help', () => {
  console.log('');
  console.log(chalk.yellow('Examples:'));
  console.log(chalk.gray('  $ ame init'));
  console.log(chalk.gray('  $ ame metaclass register'));
  console.log(chalk.gray('  $ ame aeid generate --type asset'));
  console.log(chalk.gray('  $ ame skill execute create_asset'));
  console.log('');
});

// Handle unknown commands
program.on('command:*', (args) => {
  console.error(chalk.red(`\nError: Unknown command: ${args[0]}`));
  console.error(chalk.yellow('\nUse --help to see available commands.'));
  process.exit(1);
});

// Parse command line arguments
program.parse(process.argv);

// If no command is provided, show help
if (!program.args.length) {
  program.help();
}
