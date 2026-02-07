/**
 * AMAR Engine Metaclass Commands
 * Manages metaclasses in AMAR Engine
 */

import chalk from 'chalk';
import inquirer from 'inquirer';
import { AMAREngine } from '../../index';

export const metaclassCommand = {
  async register(): Promise<void> {
    console.log(chalk.blue('Registering a new metaclass...'));
    
    try {
      const engine = new AMAREngine();
      await engine.initialize();
      
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'id',
          message: 'Enter metaclass ID:',
          validate: (input: string) => input.length > 0
        },
        {
          type: 'input',
          name: 'name',
          message: 'Enter metaclass name:',
          validate: (input: string) => input.length > 0
        },
        {
          type: 'input',
          name: 'description',
          message: 'Enter metaclass description:'
        },
        {
          type: 'input',
          name: 'version',
          message: 'Enter metaclass version:',
          default: '1.0.0'
        },
        {
          type: 'input',
          name: 'properties',
          message: 'Enter metaclass properties (JSON):',
          default: '{}'
        },
        {
          type: 'input',
          name: 'behaviors',
          message: 'Enter metaclass behaviors (comma-separated):',
          default: ''
        },
        {
          type: 'input',
          name: 'dependencies',
          message: 'Enter metaclass dependencies (comma-separated):',
          default: ''
        }
      ]);
      
      const metaclass = {
        id: answers.id,
        name: answers.name,
        description: answers.description,
        version: answers.version,
        properties: JSON.parse(answers.properties),
        behaviors: answers.behaviors.split(',').map((b: string) => b.trim()).filter((b: string) => b.length > 0),
        dependencies: answers.dependencies.split(',').map((d: string) => d.trim()).filter((d: string) => d.length > 0)
      };
      
      const result = await engine.getMetaclassSystem().registerMetaclass(metaclass);
      
      if (result.success) {
        console.log(chalk.green(`✅ Metaclass registered successfully! ID: ${result.id}`));
      } else {
        console.error(chalk.red(`❌ Failed to register metaclass: ${result.error}`));
        process.exit(1);
      }
    } catch (error) {
      console.error(chalk.red(`❌ Failed to register metaclass: ${(error as Error).message}`));
      process.exit(1);
    }
  },
  
  async list(): Promise<void> {
    console.log(chalk.blue('Listing all registered metaclasses...'));
    
    try {
      const engine = new AMAREngine();
      await engine.initialize();
      
      const metaclasses = engine.getMetaclassSystem().listMetaclasses();
      
      if (metaclasses.length === 0) {
        console.log(chalk.yellow('No metaclasses registered yet.'));
        return;
      }
      
      console.log(chalk.green(`Found ${metaclasses.length} metaclasses:`));
      metaclasses.forEach((metaclass, index) => {
        console.log(chalk.blue(`  ${index + 1}. ${metaclass.name} (${metaclass.id})`));
        console.log(chalk.gray(`    Version: ${metaclass.version}`));
        console.log(chalk.gray(`    Description: ${metaclass.description}`));
        console.log(chalk.gray(`    Behaviors: ${metaclass.behaviors.join(', ')}`));
        console.log(chalk.gray(`    Dependencies: ${metaclass.dependencies.join(', ')}`));
        console.log('');
      });
    } catch (error) {
      console.error(chalk.red(`❌ Failed to list metaclasses: ${(error as Error).message}`));
      process.exit(1);
    }
  },
  
  async compose(): Promise<void> {
    console.log(chalk.blue('Composing multiple metaclasses...'));
    
    try {
      const engine = new AMAREngine();
      await engine.initialize();
      
      const metaclasses = engine.getMetaclassSystem().listMetaclasses();
      
      if (metaclasses.length < 2) {
        console.error(chalk.red('Need at least 2 metaclasses to compose.'));
        process.exit(1);
      }
      
      const answers = await inquirer.prompt([
        {
          type: 'list',
          name: 'baseMetaclassId',
          message: 'Select base metaclass:',
          choices: metaclasses.map(m => ({ name: `${m.name} (${m.id})`, value: m.id }))
        },
        {
          type: 'checkbox',
          name: 'extensionMetaclassIds',
          message: 'Select extension metaclasses:',
          choices: metaclasses.map(m => ({ name: `${m.name} (${m.id})`, value: m.id }))
        }
      ]);
      
      const baseMetaclass = metaclasses.find(m => m.id === answers.baseMetaclassId);
      const extensionMetaclasses = metaclasses.filter(m => answers.extensionMetaclassIds.includes(m.id));
      
      if (!baseMetaclass) {
        console.error(chalk.red('Base metaclass not found.'));
        process.exit(1);
      }
      
      if (extensionMetaclasses.length === 0) {
        console.error(chalk.red('No extension metaclasses selected.'));
        process.exit(1);
      }
      
      const result = engine.getMetaclassSystem().composeMetaclasses(baseMetaclass, extensionMetaclasses);
      
      if (result.success) {
        console.log(chalk.green('✅ Metaclasses composed successfully!'));
        console.log(chalk.blue('Composed metaclass:'));
        console.log(JSON.stringify(result.metaclass, null, 2));
      } else {
        console.error(chalk.red(`❌ Failed to compose metaclasses: ${result.error}`));
        process.exit(1);
      }
    } catch (error) {
      console.error(chalk.red(`❌ Failed to compose metaclasses: ${(error as Error).message}`));
      process.exit(1);
    }
  }
};
