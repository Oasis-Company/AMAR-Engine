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
    
    // Register built-in skills
    await this.registerBuiltinSkills();
    
    console.log('Skills System initialized successfully!');
  }

  /**
   * Register built-in skills
   */
  private async registerBuiltinSkills(): Promise<void> {
    const builtinSkills: Skill[] = [
      // Create skills
      {
        id: 'create_asset',
        name: 'Create Asset',
        description: 'Creates a new asset',
        version: '1.0.0',
        type: 'create',
        parameters: {},
        schema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Name of the asset'
            },
            type: {
              type: 'string',
              description: 'Type of the asset'
            },
            properties: {
              type: 'object',
              description: 'Properties of the asset',
              default: {}
            }
          },
          required: ['name', 'type']
        }
      },
      {
        id: 'create_scene',
        name: 'Create Scene',
        description: 'Creates a new scene',
        version: '1.0.0',
        type: 'create',
        parameters: {},
        schema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Name of the scene'
            },
            description: {
              type: 'string',
              description: 'Description of the scene'
            },
            assets: {
              type: 'array',
              description: 'Assets in the scene',
              default: []
            }
          },
          required: ['name']
        }
      },
      {
        id: 'create_metaclass',
        name: 'Create Metaclass',
        description: 'Creates a new metaclass',
        version: '1.0.0',
        type: 'create',
        parameters: {},
        schema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID of the metaclass'
            },
            name: {
              type: 'string',
              description: 'Name of the metaclass'
            },
            description: {
              type: 'string',
              description: 'Description of the metaclass'
            },
            properties: {
              type: 'object',
              description: 'Properties of the metaclass',
              default: {}
            },
            behaviors: {
              type: 'array',
              description: 'Behaviors of the metaclass',
              default: []
            }
          },
          required: ['id', 'name', 'description']
        }
      },
      
      // Read skills
      {
        id: 'get_asset',
        name: 'Get Asset',
        description: 'Gets asset information by ID',
        version: '1.0.0',
        type: 'read',
        parameters: {},
        schema: {
          type: 'object',
          properties: {
            assetId: {
              type: 'string',
              description: 'ID of the asset'
            }
          },
          required: ['assetId']
        }
      },
      {
        id: 'list_assets',
        name: 'List Assets',
        description: 'Lists all assets',
        version: '1.0.0',
        type: 'read',
        parameters: {},
        schema: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              description: 'Type of assets to list'
            },
            limit: {
              type: 'number',
              description: 'Maximum number of assets to return'
            }
          }
        }
      },
      {
        id: 'get_scene',
        name: 'Get Scene',
        description: 'Gets scene information by ID',
        version: '1.0.0',
        type: 'read',
        parameters: {},
        schema: {
          type: 'object',
          properties: {
            sceneId: {
              type: 'string',
              description: 'ID of the scene'
            }
          },
          required: ['sceneId']
        }
      },
      
      // Update skills
      {
        id: 'update_asset',
        name: 'Update Asset',
        description: 'Updates an existing asset',
        version: '1.0.0',
        type: 'update',
        parameters: {},
        schema: {
          type: 'object',
          properties: {
            assetId: {
              type: 'string',
              description: 'ID of the asset'
            },
            properties: {
              type: 'object',
              description: 'New properties of the asset'
            }
          },
          required: ['assetId', 'properties']
        }
      },
      {
        id: 'update_scene',
        name: 'Update Scene',
        description: 'Updates an existing scene',
        version: '1.0.0',
        type: 'update',
        parameters: {},
        schema: {
          type: 'object',
          properties: {
            sceneId: {
              type: 'string',
              description: 'ID of the scene'
            },
            name: {
              type: 'string',
              description: 'New name of the scene'
            },
            assets: {
              type: 'array',
              description: 'New assets in the scene'
            }
          },
          required: ['sceneId']
        }
      },
      
      // Delete skills
      {
        id: 'delete_asset',
        name: 'Delete Asset',
        description: 'Deletes an asset',
        version: '1.0.0',
        type: 'delete',
        parameters: {},
        schema: {
          type: 'object',
          properties: {
            assetId: {
              type: 'string',
              description: 'ID of the asset'
            }
          },
          required: ['assetId']
        }
      },
      {
        id: 'delete_scene',
        name: 'Delete Scene',
        description: 'Deletes a scene',
        version: '1.0.0',
        type: 'delete',
        parameters: {},
        schema: {
          type: 'object',
          properties: {
            sceneId: {
              type: 'string',
              description: 'ID of the scene'
            }
          },
          required: ['sceneId']
        }
      },
      
      // Utility skills
      {
        id: 'generate_aeid',
        name: 'Generate AEID',
        description: 'Generates a new AEID',
        version: '1.0.0',
        type: 'utility',
        parameters: {},
        schema: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              description: 'Type of AEID to generate'
            }
          },
          required: ['type']
        }
      },
      {
        id: 'validate_aeid',
        name: 'Validate AEID',
        description: 'Validates an AEID',
        version: '1.0.0',
        type: 'utility',
        parameters: {},
        schema: {
          type: 'object',
          properties: {
            aeid: {
              type: 'string',
              description: 'AEID to validate'
            }
          },
          required: ['aeid']
        }
      },
      {
        id: 'compose_metaclasses',
        name: 'Compose Metaclasses',
        description: 'Composes multiple metaclasses into a new one',
        version: '1.0.0',
        type: 'utility',
        parameters: {},
        schema: {
          type: 'object',
          properties: {
            baseMetaclassId: {
              type: 'string',
              description: 'ID of the base metaclass'
            },
            extensionMetaclassIds: {
              type: 'array',
              description: 'IDs of extension metaclasses'
            }
          },
          required: ['baseMetaclassId', 'extensionMetaclassIds']
        }
      }
    ];

    for (const skill of builtinSkills) {
      const result = await this.registerSkill(skill);
      if (result.success) {
        console.log(`Registered built-in skill: ${skill.name}`);
      } else {
        console.warn(`Failed to register built-in skill ${skill.name}: ${result.error}`);
      }
    }
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
