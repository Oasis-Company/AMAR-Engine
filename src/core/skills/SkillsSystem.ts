/**
 * Skills System - Core component for managing skills in AMAR Engine
 * Provides a RESTful-style specification for AI to guide AME on how to build scenes or assets
 */

import { SkillRegistry } from './SkillRegistry';
import { SkillExecutor } from './SkillExecutor';
import { SkillValidator } from './SkillValidator';

interface Skill {
  id: string;
  name: string;
  description: string;
  version: string;
  type: string;
  parameters: Record<string, any>;
  schema: Record<string, any>;
}

class SkillsSystem {
  private registry: SkillRegistry;
  private executor: SkillExecutor;
  private validator: SkillValidator;

  constructor() {
    this.registry = new SkillRegistry();
    this.executor = new SkillExecutor();
    this.validator = new SkillValidator();
  }

  /**
   * Initialize the Skills System
   */
  public async initialize(): Promise<void> {
    console.log('Initializing Skills System...');
    await this.registry.initialize();
    console.log('Skills System initialized successfully!');
  }

  /**
   * Register a new skill
   * @param skill - Skill definition
   * @returns Registration result
   */
  public async registerSkill(skill: Skill): Promise<{ success: boolean; id?: string; error?: string }> {
    // Validate skill
    const validationResult = this.validator.validate(skill);
    if (!validationResult.valid) {
      return { success: false, error: validationResult.error };
    }

    // Register skill
    return this.registry.register(skill);
  }

  /**
   * Get a skill by ID
   * @param id - Skill ID
   * @returns Skill definition or null if not found
   */
  public getSkill(id: string): Skill | null {
    return this.registry.get(id);
  }

  /**
   * List all registered skills
   * @returns List of skills
   */
  public listSkills(): Skill[] {
    return this.registry.list();
  }

  /**
   * Execute a skill
   * @param skillId - Skill ID
   * @param parameters - Skill parameters
   * @returns Execution result
   */
  public async executeSkill(skillId: string, parameters: Record<string, any>): Promise<{ success: boolean; result?: any; error?: string }> {
    // Get skill
    const skill = this.registry.get(skillId);
    if (!skill) {
      return { success: false, error: `Skill ${skillId} not found` };
    }

    // Validate parameters
    const validationResult = this.validator.validateParameters(skill, parameters);
    if (!validationResult.valid) {
      return { success: false, error: validationResult.error };
    }

    // Execute skill
    return this.executor.execute(skill, parameters);
  }

  /**
   * Shutdown the Skills System
   */
  public async shutdown(): Promise<void> {
    console.log('Shutting down Skills System...');
    await this.registry.shutdown();
    console.log('Skills System shutdown successfully!');
  }
}

export { SkillsSystem, Skill };
