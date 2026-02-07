/**
 * Skill Registry - Stores and manages skill definitions
 * Provides a central storage for skills with quick lookup capabilities
 */

import * as fs from 'fs';
import * as path from 'path';
import { Skill } from './SkillsSystem';

class SkillRegistry {
  private skills: Map<string, Skill>;
  private storagePath: string;

  constructor() {
    this.skills = new Map<string, Skill>();
    this.storagePath = path.join(__dirname, '../../..', 'storage', 'skills');
  }

  /**
   * Initialize the registry
   */
  public async initialize(): Promise<void> {
    // Create storage directory if it doesn't exist
    if (!fs.existsSync(this.storagePath)) {
      fs.mkdirSync(this.storagePath, { recursive: true });
    }

    // Load skills from storage
    await this.loadSkills();
  }

  /**
   * Register a skill
   * @param skill - Skill to register
   * @returns Registration result
   */
  public async register(skill: Skill): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      // Check if skill already exists
      if (this.skills.has(skill.id)) {
        return { success: false, error: `Skill with ID ${skill.id} already exists` };
      }

      // Add skill to registry
      this.skills.set(skill.id, skill);

      // Save skill to storage
      await this.saveSkill(skill);

      return { success: true, id: skill.id };
    } catch (error) {
      return { success: false, error: `Registration failed: ${(error as Error).message}` };
    }
  }

  /**
   * Get a skill by ID
   * @param id - Skill ID
   * @returns Skill or null if not found
   */
  public get(id: string): Skill | null {
    return this.skills.get(id) || null;
  }

  /**
   * List all registered skills
   * @returns List of skills
   */
  public list(): Skill[] {
    return Array.from(this.skills.values());
  }

  /**
   * Remove a skill
   * @param id - Skill ID
   * @returns Removal result
   */
  public async remove(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Check if skill exists
      if (!this.skills.has(id)) {
        return { success: false, error: `Skill with ID ${id} not found` };
      }

      // Remove from registry
      this.skills.delete(id);

      // Remove from storage
      await this.deleteSkill(id);

      return { success: true };
    } catch (error) {
      return { success: false, error: `Removal failed: ${(error as Error).message}` };
    }
  }

  /**
   * Save a skill to storage
   * @param skill - Skill to save
   */
  private async saveSkill(skill: Skill): Promise<void> {
    const filePath = path.join(this.storagePath, `${skill.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(skill, null, 2));
  }

  /**
   * Load skills from storage
   */
  private async loadSkills(): Promise<void> {
    try {
      const files = fs.readdirSync(this.storagePath);
      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(this.storagePath, file);
          const content = fs.readFileSync(filePath, 'utf8');
          const skill = JSON.parse(content) as Skill;
          this.skills.set(skill.id, skill);
        }
      }
    } catch (error) {
      console.warn(`Failed to load skills from storage: ${(error as Error).message}`);
    }
  }

  /**
   * Delete a skill from storage
   * @param id - Skill ID
   */
  private async deleteSkill(id: string): Promise<void> {
    const filePath = path.join(this.storagePath, `${id}.json`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  /**
   * Shutdown the registry
   */
  public async shutdown(): Promise<void> {
    // No specific shutdown operations needed
    console.log('Skill Registry shutdown successfully!');
  }
}

export { SkillRegistry };
