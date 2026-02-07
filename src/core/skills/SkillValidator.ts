/**
 * Skill Validator - Validates skill definitions
 * Ensures that skills conform to schema specifications
 */

import { Skill } from './SkillsSystem';

class SkillValidator {
  /**
   * Validate a skill definition
   * @param skill - Skill to validate
   * @returns Validation result
   */
  public validate(skill: Skill): { valid: boolean; error?: string } {
    // Check required fields
    const requiredFields = ['id', 'name', 'description', 'version', 'type', 'parameters', 'schema'];
    for (const field of requiredFields) {
      if (!(field in skill)) {
        return { valid: false, error: `Missing required field: ${field}` };
      }
    }

    // Validate ID format
    if (!/^[a-z0-9_]+$/.test(skill.id)) {
      return { valid: false, error: 'Invalid skill ID: must contain only lowercase letters, numbers, and underscores' };
    }

    // Validate version format (semantic versioning)
    if (!/^\d+\.\d+\.\d+$/.test(skill.version)) {
      return { valid: false, error: 'Invalid version format: must follow semantic versioning (e.g., 1.0.0)' };
    }

    // Validate skill type
    const validTypes = ['create', 'modify', 'query', 'delete'];
    if (!validTypes.includes(skill.type)) {
      return { valid: false, error: `Invalid skill type: must be one of ${validTypes.join(', ')}` };
    }

    // Validate parameters
    if (typeof skill.parameters !== 'object' || skill.parameters === null) {
      return { valid: false, error: 'Invalid parameters: must be an object' };
    }

    // Validate schema
    if (typeof skill.schema !== 'object' || skill.schema === null) {
      return { valid: false, error: 'Invalid schema: must be an object' };
    }

    return { valid: true };
  }

  /**
   * Validate skill parameters
   * @param skill - Skill definition
   * @param parameters - Parameters to validate
   * @returns Validation result
   */
  public validateParameters(skill: Skill, parameters: Record<string, any>): { valid: boolean; error?: string } {
    try {
      // Check required parameters
      if (skill.schema.required) {
        for (const param of skill.schema.required) {
          if (!(param in parameters)) {
            return { valid: false, error: `Missing required parameter: ${param}` };
          }
        }
      }

      // Check parameter types
      if (skill.schema.properties) {
        for (const [paramName, paramSchema] of Object.entries(skill.schema.properties)) {
          if (paramName in parameters) {
            const paramValue = parameters[paramName];
            const paramType = (paramSchema as any).type;

            if (paramType && typeof paramValue !== paramType) {
              return { valid: false, error: `Invalid type for parameter ${paramName}: expected ${paramType}, got ${typeof paramValue}` };
            }
          }
        }
      }

      return { valid: true };
