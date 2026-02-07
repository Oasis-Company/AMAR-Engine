/**
 * AMAR Engine Status Command
 * Checks the status of the AMAR Engine
 */

import chalk from 'chalk';
import { AMAREngine } from '../../index';

export async function statusCommand(): Promise<void> {
  console.log(chalk.blue('Checking AMAR Engine status...'));
  
  try {
    const engine = new AMAREngine();
    
    // Check metaclass system status
    const metaclassSystem = engine.getMetaclassSystem();
    const metaclasses = metaclassSystem.listMetaclasses();
    
    // Check AEID system status
    const aeidSystem = engine.getAEIDSystem();
    
    // Check skills system status
    const skillsSystem = engine.getSkillsSystem();
    const skills = skillsSystem.listSkills();
    
    console.log(chalk.green('✅ AMAR Engine status:'));
    console.log(chalk.blue('  Metaclass System:'));
    console.log(chalk.gray(`    Registered metaclasses: ${metaclasses.length}`));
    
    console.log(chalk.blue('  AEID System:'));
    console.log(chalk.gray('    Status: Ready'));
    
    console.log(chalk.blue('  Skills System:'));
    console.log(chalk.gray(`    Registered skills: ${skills.length}`));
    
    console.log(chalk.green('✅ AMAR Engine is ready for use!'));
  } catch (error) {
    console.error(chalk.red(`❌ Failed to check AMAR Engine status: ${(error as Error).message}`));
    process.exit(1);
  }
}
