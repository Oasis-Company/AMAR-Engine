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
    
    // Register built-in metaclasses
    await this.registerBuiltinMetaclasses();
    
    console.log('Metaclass System initialized successfully!');
  }

  /**
   * Register built-in metaclasses
   */
  private async registerBuiltinMetaclasses(): Promise<void> {
    const builtinMetaclasses: Metaclass[] = [
      {
        id: 'object',
        name: 'Object',
        description: 'Base object type',
        version: '1.0.0',
        properties: {
          name: {
            type: 'string',
            description: 'Name of the object',
            default: ''
          },
          description: {
            type: 'string',
            description: 'Description of the object',
            default: ''
          },
          aeid: {
            type: 'string',
            description: 'AMAR Engine ID',
            default: ''
          }
        },
        behaviors: [],
        dependencies: []
      },
      {
        id: 'container',
        name: 'Container',
        description: 'An object that can hold other objects or substances',
        version: '1.0.0',
        properties: {
          capacity: {
            type: 'number',
            description: 'Maximum capacity of the container',
            default: 1.0
          },
          is_full: {
            type: 'boolean',
            description: 'Whether the container is full',
            default: false
          }
        },
        behaviors: ['hold_objects', 'hold_substances'],
        dependencies: ['object']
      },
      {
        id: 'physical',
        name: 'Physical',
        description: 'An object with physical properties',
        version: '1.0.0',
        properties: {
          mass: {
            type: 'number',
            description: 'Mass of the object in kilograms',
            default: 1.0
          },
          volume: {
            type: 'number',
            description: 'Volume of the object in cubic meters',
            default: 1.0
          },
          density: {
            type: 'number',
            description: 'Density of the object in kg/m³',
            default: 1000.0
          }
        },
        behaviors: ['physical_interaction'],
        dependencies: ['object']
      },
      {
        id: 'interactive',
        name: 'Interactive',
        description: 'An object that can be interacted with',
        version: '1.0.0',
        properties: {
          is_interactive: {
            type: 'boolean',
            description: 'Whether the object is interactive',
            default: true
          },
          interaction_points: {
            type: 'array',
            description: 'Points where the object can be interacted with',
            default: []
          }
        },
        behaviors: ['interact'],
        dependencies: ['object']
      },
      {
        id: 'movable',
        name: 'Movable',
        description: 'An object that can be moved',
        version: '1.0.0',
        properties: {
          is_movable: {
            type: 'boolean',
            description: 'Whether the object is movable',
            default: true
          },
          position: {
            type: 'object',
            description: 'Position of the object',
            default: { x: 0, y: 0, z: 0 }
          },
          rotation: {
            type: 'object',
            description: 'Rotation of the object',
            default: { x: 0, y: 0, z: 0 }
          }
        },
        behaviors: ['move', 'rotate'],
        dependencies: ['object', 'physical']
      },
      {
        id: 'light',
        name: 'Light',
        description: 'An object that emits light',
        version: '1.0.0',
        properties: {
          intensity: {
            type: 'number',
            description: 'Intensity of the light',
            default: 1.0
          },
          color: {
            type: 'object',
            description: 'Color of the light',
            default: { r: 1, g: 1, b: 1 }
          },
          range: {
            type: 'number',
            description: 'Range of the light',
            default: 10.0
          }
        },
        behaviors: ['emit_light'],
        dependencies: ['object']
      },
      {
        id: 'sound',
        name: 'Sound',
        description: 'An object that produces sound',
        version: '1.0.0',
        properties: {
          volume: {
            type: 'number',
            description: 'Volume of the sound',
            default: 1.0
          },
          pitch: {
            type: 'number',
            description: 'Pitch of the sound',
            default: 1.0
          },
          loop: {
            type: 'boolean',
            description: 'Whether the sound loops',
            default: false
          }
        },
        behaviors: ['produce_sound'],
        dependencies: ['object']
      },
      {
        id: 'sensor',
        name: 'Sensor',
        description: 'An object that can sense the environment',
        version: '1.0.0',
        properties: {
          sensitivity: {
            type: 'number',
            description: 'Sensitivity of the sensor',
            default: 1.0
          },
          range: {
            type: 'number',
            description: 'Range of the sensor',
            default: 10.0
          },
          is_active: {
            type: 'boolean',
            description: 'Whether the sensor is active',
            default: true
          }
        },
        behaviors: ['sense_environment'],
        dependencies: ['object']
      }
    ];

    for (const metaclass of builtinMetaclasses) {
      const result = await this.registerMetaclass(metaclass);
      if (result.success) {
        console.log(`Registered built-in metaclass: ${metaclass.name}`);
      } else {
        console.warn(`Failed to register built-in metaclass ${metaclass.name}: ${result.error}`);
      }
    }
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
