/**
 * Metaclass Registry - Stores and manages all metaclass definitions
 * Provides a central storage for metaclasses with quick lookup capabilities
 */

import { Metaclass } from './MetaclassSystem';
import * as fs from 'fs';
import * as path from 'path';

class MetaclassRegistry {
  private metaclasses: Map<string, Metaclass>;
  private storagePath: string;

  constructor() {
    this.metaclasses = new Map<string, Metaclass>();
    this.storagePath = path.join(__dirname, '../../..', 'storage', 'metaclasses');
  }

  /**
   * Initialize the registry
   */
  public async initialize(): Promise<void> {
    // Create storage directory if it doesn't exist
    if (!fs.existsSync(this.storagePath)) {
      fs.mkdirSync(this.storagePath, { recursive: true });
    }

    // Load metaclasses from storage
    await this.loadMetaclasses();
  }

  /**
   * Register a metaclass
   * @param metaclass - Metaclass to register
   * @returns Registration result
   */
  public async register(metaclass: Metaclass): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      // Check if metaclass already exists
      if (this.metaclasses.has(metaclass.id)) {
        return { success: false, error: `Metaclass with ID ${metaclass.id} already exists` };
      }

      // Add metaclass to registry
      this.metaclasses.set(metaclass.id, metaclass);

      // Save metaclass to storage
      await this.saveMetaclass(metaclass);

      return { success: true, id: metaclass.id };
    } catch (error) {
      return { success: false, error: `Registration failed: ${(error as Error).message}` };
    }
  }

  /**
   * Get a metaclass by ID
   * @param id - Metaclass ID
   * @returns Metaclass or null if not found
   */
  public get(id: string): Metaclass | null {
    return this.metaclasses.get(id) || null;
  }

  /**
   * List all registered metaclasses
   * @returns List of metaclasses
   */
  public list(): Metaclass[] {
    return Array.from(this.metaclasses.values());
  }

  /**
   * Remove a metaclass
   * @param id - Metaclass ID
   * @returns Removal result
   */
  public async remove(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Check if metaclass exists
      if (!this.metaclasses.has(id)) {
        return { success: false, error: `Metaclass with ID ${id} not found` };
      }

      // Remove from registry
      this.metaclasses.delete(id);

      // Remove from storage
      await this.deleteMetaclass(id);

      return { success: true };
    } catch (error) {
      return { success: false, error: `Removal failed: ${(error as Error).message}` };
    }
  }

  /**
   * Save a metaclass to storage
   * @param metaclass - Metaclass to save
   */
  private async saveMetaclass(metaclass: Metaclass): Promise<void> {
    const filePath = path.join(this.storagePath, `${metaclass.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(metaclass, null, 2));
  }

  /**
   * Load metaclasses from storage
   */
  private async loadMetaclasses(): Promise<void> {
    try {
      const files = fs.readdirSync(this.storagePath);
      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(this.storagePath, file);
          const content = fs.readFileSync(filePath, 'utf8');
          const metaclass = JSON.parse(content) as Metaclass;
          this.metaclasses.set(metaclass.id, metaclass);
        }
      }
    } catch (error) {
      console.warn(`Failed to load metaclasses from storage: ${(error as Error).message}`);
    }
  }

  /**
   * Delete a metaclass from storage
   * @param id - Metaclass ID
   */
  private async deleteMetaclass(id: string): Promise<void> {
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
    console.log('Metaclass Registry shutdown successfully!');
  }
}

export { MetaclassRegistry };
