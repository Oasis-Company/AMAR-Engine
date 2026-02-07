/**
 * AMAR Engine Init Command
 * Initializes the AMAR Engine
 */

import chalk from 'chalk';
import { AMAREngine } from '../../index';

export async function initCommand(): Promise<void> {
  console.log(chalk.blue('Initializing AMAR Engine...'));
  
  try {
    const engine = new AMAREngine();
    await engine.initialize();
    
    console.log(chalk.green('✅ AMAR Engine initialized successfully!'));
    console.log(chalk.blue('Engine ready for use.'));
  } catch (error) {
    console.error(chalk.red(`❌ Failed to initialize AMAR Engine: ${(error as Error).message}`));
    process.exit(1);
  }
}
