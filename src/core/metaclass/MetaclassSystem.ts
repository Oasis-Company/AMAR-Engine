/**
 * Metaclass System - Core component of AMAR Engine
 * Defines what objects are and what they can do through composition rather than inheritance
 */

import { MetaclassValidator } from './MetaclassValidator';
import { MetaclassComposer } from './MetaclassComposer';
import { MetaclassRegistry } from './MetaclassRegistry';

interface Metaclass {
  id: string;
  name: string;
  description: string;
  version: string;
  properties: Record<string, any>;
  behaviors: string[];
  dependencies: string[];
}

class MetaclassSystem {
  private validator: MetaclassValidator;
  private composer: MetaclassComposer;
  private registry: MetaclassRegistry;

  constructor() {
    this.validator = new MetaclassValidator();
    this.composer = new MetaclassComposer();
    this.registry = new MetaclassRegistry();
  }

  /**
   * Initialize the Metaclass System
   */
  public async initialize(): Promise<void> {
    console.log('Initializing Metaclass System...');
    await this.registry.initialize();
    console.log('Metaclass System initialized successfully!');
  }

  /**
   * Register a new metaclass
   * @param metaclass - Metaclass definition
   * @returns Registration result
   */
  public async registerMetaclass(metaclass: Metaclass): Promise<{ success: boolean; id?: string; error?: string }> {
    // Validate metaclass
    const validationResult = this.validator.validate(metaclass);
    if (!validationResult.valid) {
      return { success: false, error: validationResult.error };
    }

    // Register metaclass
    return this.registry.register(metaclass);
  }

  /**
   * Get a metaclass by ID
   * @param id - Metaclass ID
   * @returns Metaclass definition or null if not found
   */
  public getMetaclass(id: string): Metaclass | null {
    return this.registry.get(id);
  }

  /**
   * List all registered metaclasses
   * @returns List of metaclasses
   */
  public listMetaclasses(): Metaclass[] {
    return this.registry.list();
  }

  /**
   * Compose multiple metaclasses into a new one
   * @param baseMetaclass - Base metaclass
   * @param extensionMetaclasses - Extension metaclasses
   * @returns Composed metaclass or error
   */
  public composeMetaclasses(baseMetaclass: Metaclass, extensionMetaclasses: Metaclass[]): { success: boolean; metaclass?: Metaclass; error?: string } {
    return this.composer.compose(baseMetaclass, extensionMetaclasses);
  }

  /**
   * Shutdown the Metaclass System
   */
  public async shutdown(): Promise<void> {
    console.log('Shutting down Metaclass System...');
    await this.registry.shutdown();
    console.log('Metaclass System shutdown successfully!');
  }
}

export { MetaclassSystem, Metaclass };
