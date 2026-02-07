/**
 * Metaclass Validator - Validates metaclass definitions
 * Ensures that metaclasses conform to schema specifications
 */

import { Metaclass } from './MetaclassSystem';

class MetaclassValidator {
  /**
   * Validate a metaclass definition
   * @param metaclass - Metaclass to validate
   * @returns Validation result
   */
  public validate(metaclass: Metaclass): { valid: boolean; error?: string } {
    // Check required fields
    const requiredFields = ['id', 'name', 'description', 'version', 'properties', 'behaviors', 'dependencies'];
    for (const field of requiredFields) {
      if (!(field in metaclass)) {
        return { valid: false, error: `Missing required field: ${field}` };
      }
    }

    // Validate ID format
    if (!/^[a-z0-9_]+$/.test(metaclass.id)) {
      return { valid: false, error: 'Invalid metaclass ID: must contain only lowercase letters, numbers, and underscores' };
    }

    // Validate version format (semantic versioning)
    if (!/^\d+\.\d+\.\d+$/.test(metaclass.version)) {
      return { valid: false, error: 'Invalid version format: must follow semantic versioning (e.g., 1.0.0)' };
    }

    // Validate properties
    if (typeof metaclass.properties !== 'object' || metaclass.properties === null) {
      return { valid: false, error: 'Invalid properties: must be an object' };
    }

    // Validate behaviors
    if (!Array.isArray(metaclass.behaviors)) {
      return { valid: false, error: 'Invalid behaviors: must be an array' };
    }

    // Validate dependencies
    if (!Array.isArray(metaclass.dependencies)) {
      return { valid: false, error: 'Invalid dependencies: must be an array' };
    }

    // Validate each property
    for (const [propName, propValue] of Object.entries(metaclass.properties)) {
      if (typeof propValue !== 'object' || propValue === null) {
        return { valid: false, error: `Invalid property ${propName}: must be an object` };
      }
      
      if (!('type' in propValue)) {
        return { valid: false, error: `Invalid property ${propName}: missing type field` };
      }
      
      if (!('description' in propValue)) {
        return { valid: false, error: `Invalid property ${propName}: missing description field` };
      }
    }

    return { valid: true };
  }

  /**
   * Validate metaclass composition
   * @param baseMetaclass - Base metaclass
   * @param extensionMetaclasses - Extension metaclasses
   * @returns Validation result
   */
  public validateComposition(baseMetaclass: Metaclass, extensionMetaclasses: Metaclass[]): { valid: boolean; error?: string } {
    // Validate base metaclass
    const baseValidation = this.validate(baseMetaclass);
    if (!baseValidation.valid) {
      return baseValidation;
    }

    // Validate each extension metaclass
    for (const extension of extensionMetaclasses) {
      const extensionValidation = this.validate(extension);
      if (!extensionValidation.valid) {
        return extensionValidation;
      }
    }

    // Check for circular dependencies
    const dependencyGraph = new Map<string, string[]>();
    dependencyGraph.set(baseMetaclass.id, baseMetaclass.dependencies);
    
    for (const extension of extensionMetaclasses) {
      dependencyGraph.set(extension.id, extension.dependencies);
    }

    // Check circular dependencies
    for (const [id, dependencies] of dependencyGraph) {
      if (this.hasCircularDependency(id, dependencies, dependencyGraph, new Set())) {
        return { valid: false, error: `Circular dependency detected for metaclass ${id}` };
      }
    }

    return { valid: true };
  }

  /**
   * Check for circular dependencies
   * @param currentId - Current metaclass ID
   * @param dependencies - Current metaclass dependencies
   * @param dependencyGraph - Full dependency graph
   * @param visited - Visited metaclasses
   * @returns True if circular dependency exists
   */
  private hasCircularDependency(
    currentId: string,
    dependencies: string[],
    dependencyGraph: Map<string, string[]>,
    visited: Set<string>
  ): boolean {
    if (visited.has(currentId)) {
      return true;
    }

    visited.add(currentId);

    for (const depId of dependencies) {
      const depDependencies = dependencyGraph.get(depId);
      if (depDependencies && this.hasCircularDependency(depId, depDependencies, dependencyGraph, new Set(visited))) {
        return true;
      }
    }

    visited.delete(currentId);
    return false;
  }
}

export { MetaclassValidator };
