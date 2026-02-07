/**
 * AMAR Engine Skill Commands
 * Manages skills in AMAR Engine
 */

import chalk from 'chalk';
import inquirer from 'inquirer';
import { AMAREngine } from '../../index';

export const skillCommand = {
  async register(): Promise<void> {
    console.log(chalk.blue('Registering a new skill...'));
    
    try {
      const engine = new AMAREngine();
      await engine.initialize();
      
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'id',
          message: 'Enter skill ID:',
          validate: (input: string) => input.length > 0
        },
        {
          type: 'input',
          name: 'name',
          message: 'Enter skill name:',
          validate: (input: string) => input.length > 0
        },
        {
          type: 'input',
          name: 'description',
          message: 'Enter skill description:'
        },
        {
          type: 'input',
          name: 'version',
          message: 'Enter skill version:',
          default: '1.0.0'
        },
        {
          type: 'list',
          name: 'type',
          message: 'Select skill type:',
          choices: ['create', 'modify', 'query', 'delete']
        },
        {
          type: 'input',
          name: 'parameters',
          message: 'Enter skill parameters (JSON):',
          default: '{}'
        },
        {
          type: 'input',
          name: 'schema',
          message: 'Enter skill schema (JSON):',
          default: '{"type": "object", "properties": {}}'
        }
      ]);
      
      const skill = {
        id: answers.id,
        name: answers.name,
        description: answers.description,
        version: answers.version,
        type: answers.type,
        parameters: JSON.parse(answers.parameters),
        schema: JSON.parse(answers.schema)
      };
      
      const result = await engine.getSkillsSystem().registerSkill(skill);
      
      if (result.success) {
        console.log(chalk.green(`✅ Skill registered successfully! ID: ${result.id}`));
      } else {
        console.error(chalk.red(`❌ Failed to register skill: ${result.error}`));
        process.exit(1);
      }
    } catch (error) {
      console.error(chalk.red(`❌ Failed to register skill: ${(error as Error).message}`));
      process.exit(1);
    }
  },
  
  async execute(skillId: string): Promise<void> {
    console.log(chalk.blue(`Executing skill: ${skillId}`));
    
    try {
      const engine = new AMAREngine();
      await engine.initialize();
      
      const skill = engine.getSkillsSystem().getSkill(skillId);
      
      if (!skill) {
        console.error(chalk.red(`❌ Skill not found: ${skillId}`));
        process.exit(1);
      }
      
      console.log(chalk.blue(`Skill details:`));
      console.log(chalk.gray(`  Name: ${skill.name}`));
      console.log(chalk.gray(`  Type: ${skill.type}`));
      console.log(chalk.gray(`  Description: ${skill.description}`));
      
      // Get parameters from user
      const parameters: Record<string, any> = {};
      
      if (skill.schema.required) {
        for (const param of skill.schema.required) {
          const paramSchema = skill.schema.properties[param];
          const answer = await inquirer.prompt([
            {
              type: 'input',
              name: param,
              message: `Enter parameter ${param}:`,
              validate: (input: string) => input.length > 0
            }
          ]);
          parameters[param] = answer[param];
        }
      }
      
      const result = await engine.getSkillsSystem().executeSkill(skillId, parameters);
      
      if (result.success) {
        console.log(chalk.green('✅ Skill executed successfully!'));
        console.log(chalk.blue('  Result:'));
        console.log(JSON.stringify(result.result, null, 2));
      } else {
        console.error(chalk.red(`❌ Failed to execute skill: ${result.error}`));
        process.exit(1);
      }
    } catch (error) {
      console.error(chalk.red(`❌ Failed to execute skill: ${(error as Error).message}`));
      process.exit(1);
    }
  },
  
  async list(): Promise<void> {
    console.log(chalk.blue('Listing all registered skills...'));
    
    try {
      const engine = new AMAREngine();
      await engine.initialize();
      
      const skills = engine.getSkillsSystem().listSkills();
      
      if (skills.length === 0) {
        console.log(chalk.yellow('No skills registered yet.'));
        return;
      }
      
      console.log(chalk.green(`Found ${skills.length} skills:`));
      skills.forEach((skill, index) => {
        console.log(chalk.blue(`  ${index + 1}. ${skill.name} (${skill.id})`));
        console.log(chalk.gray(`    Version: ${skill.version}`));
        console.log(chalk.gray(`    Type: ${skill.type}`));
        console.log(chalk.gray(`    Description: ${skill.description}`));
        console.log('');
      });
    } catch (error) {
      console.error(chalk.red(`❌ Failed to list skills: ${(error as Error).message}`));
      process.exit(1);
    }
  }
};
