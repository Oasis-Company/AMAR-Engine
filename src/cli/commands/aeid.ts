/**
 * AMAR Engine AEID Commands
 * Manages AEIDs in AMAR Engine
 */

import chalk from 'chalk';
import inquirer from 'inquirer';
import { AMAREngine } from '../../index';

export const aeidCommand = {
  async generate(options: { type?: string }): Promise<void> {
    console.log(chalk.blue('Generating a new AEID...'));
    
    try {
      const engine = new AMAREngine();
      await engine.initialize();
      
      let assetType = options.type || 'asset';
      
      if (!options.type) {
        const answers = await inquirer.prompt([
          {
            type: 'list',
            name: 'assetType',
            message: 'Select asset type:',
            choices: [
              'asset',
              'scene',
              'material',
              'metaclass',
              'skill',
              'component',
              'library',
              'template',
              'project'
            ]
          }
        ]);
        assetType = answers.assetType;
      }
      
      const aeid = engine.getAEIDSystem().generateAEID(assetType);
      
      console.log(chalk.green('✅ AEID generated successfully!'));
      console.log(chalk.blue(`  AEID: ${aeid}`));
      
      // Offer to register the AEID
      const registerAnswer = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'register',
          message: 'Would you like to register this AEID?',
          default: false
        }
      ]);
      
      if (registerAnswer.register) {
        const metadataAnswer = await inquirer.prompt([
          {
            type: 'input',
            name: 'name',
            message: 'Enter asset name:',
            validate: (input: string) => input.length > 0
          },
          {
            type: 'input',
            name: 'description',
            message: 'Enter asset description:'
          }
        ]);
        
        const metadata = {
          name: metadataAnswer.name,
          description: metadataAnswer.description,
          assetType,
          generatedAt: new Date().toISOString()
        };
        
        const registerResult = await engine.getAEIDSystem().registerAEID(aeid, metadata);
        
        if (registerResult.success) {
          console.log(chalk.green('✅ AEID registered successfully!'));
        } else {
          console.error(chalk.red(`❌ Failed to register AEID: ${registerResult.error}`));
        }
      }
    } catch (error) {
      console.error(chalk.red(`❌ Failed to generate AEID: ${(error as Error).message}`));
      process.exit(1);
    }
  },
  
  async validate(aeid: string): Promise<void> {
    console.log(chalk.blue(`Validating AEID: ${aeid}`));
    
    try {
      const engine = new AMAREngine();
      await engine.initialize();
      
      const result = engine.getAEIDSystem().validateAEID(aeid);
      
      if (result.valid) {
        console.log(chalk.green('✅ AEID is valid!'));
        console.log(chalk.blue('  Details:'));
        console.log(chalk.gray(`    Type Prefix: ${result.typePrefix}`));
        console.log(chalk.gray(`    Timestamp: ${result.timestamp}`));
        console.log(chalk.gray(`    Random: ${result.random}`));
        console.log(chalk.gray(`    Checksum: ${result.checksum}`));
      } else {
        console.error(chalk.red(`❌ AEID is invalid: ${result.error}`));
        process.exit(1);
      }
    } catch (error) {
      console.error(chalk.red(`❌ Failed to validate AEID: ${(error as Error).message}`));
      process.exit(1);
    }
  },
  
  async register(aeid: string): Promise<void> {
    console.log(chalk.blue(`Registering AEID: ${aeid}`));
    
    try {
      const engine = new AMAREngine();
      await engine.initialize();
      
      // Validate AEID first
      const validationResult = engine.getAEIDSystem().validateAEID(aeid);
      if (!validationResult.valid) {
        console.error(chalk.red(`❌ Invalid AEID: ${validationResult.error}`));
        process.exit(1);
      }
      
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Enter asset name:',
          validate: (input: string) => input.length > 0
        },
        {
          type: 'input',
          name: 'description',
          message: 'Enter asset description:'
        },
        {
          type: 'input',
          name: 'assetType',
          message: 'Enter asset type:',
          default: 'asset'
        }
      ]);
      
      const metadata = {
        name: answers.name,
        description: answers.description,
        assetType: answers.assetType,
        registeredAt: new Date().toISOString()
      };
      
      const result = await engine.getAEIDSystem().registerAEID(aeid, metadata);
      
      if (result.success) {
        console.log(chalk.green('✅ AEID registered successfully!'));
      } else {
        console.error(chalk.red(`❌ Failed to register AEID: ${result.error}`));
        process.exit(1);
      }
    } catch (error) {
      console.error(chalk.red(`❌ Failed to register AEID: ${(error as Error).message}`));
      process.exit(1);
    }
  },
  
  async query(aeid: string): Promise<void> {
    console.log(chalk.blue(`Querying AEID: ${aeid}`));
    
    try {
      const engine = new AMAREngine();
      await engine.initialize();
      
      const result = await engine.getAEIDSystem().queryAEID(aeid);
      
      if (result) {
        console.log(chalk.green('✅ AEID found!'));
        console.log(chalk.blue('  Details:'));
        console.log(chalk.gray(`    AEID: ${result.aeid}`));
        console.log(chalk.gray(`    Status: ${result.status}`));
        console.log(chalk.gray(`    Registered At: ${result.registeredAt}`));
        
        if (result.metadata) {
          console.log(chalk.blue('  Metadata:'));
          Object.entries(result.metadata).forEach(([key, value]) => {
            console.log(chalk.gray(`    ${key}: ${value}`));
          });
        }
      } else {
        console.error(chalk.red('❌ AEID not found.'));
        process.exit(1);
      }
    } catch (error) {
      console.error(chalk.red(`❌ Failed to query AEID: ${(error as Error).message}`));
      process.exit(1);
    }
  }
};
