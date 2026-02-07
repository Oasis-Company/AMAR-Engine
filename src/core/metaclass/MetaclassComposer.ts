/**
 * Metaclass Composer - Composes multiple metaclasses into new ones
 * Allows creating complex metaclasses by combining properties and behaviors
 */

import { Metaclass } from './MetaclassSystem';
import { MetaclassValidator } from './MetaclassValidator';

class MetaclassComposer {
  private validator: MetaclassValidator;

  constructor() {
    this.validator = new MetaclassValidator();
  }

  /**
   * Compose multiple metaclasses into a new one
   * @param baseMetaclass - Base metaclass
   * @param extensionMetaclasses - Extension metaclasses
   * @returns Composed metaclass or error
   */
  public compose(baseMetaclass: Metaclass, extensionMetaclasses: Metaclass[]): { success: boolean; metaclass?: Metaclass; error?: string } {
    // Validate composition
    const validationResult = this.validator.validateComposition(baseMetaclass, extensionMetaclasses);
    if (!validationResult.valid) {
      return { success: false, error: validationResult.error };
    }

    try {
      // Compose properties
      const composedProperties = this.composeProperties(baseMetaclass, extensionMetaclasses);

      // Compose behaviors
      const composedBehaviors = this.composeBehaviors(baseMetaclass, extensionMetaclasses);

      // Compose dependencies
      const composedDependencies = this.composeDependencies(baseMetaclass, extensionMetaclasses);

      // Create composed metaclass
      const composedMetaclass: Metaclass = {
        id: `composed_${baseMetaclass.id}_${extensionMetaclasses.map(m => m.id).join('_')}`,
        name: `Composed: ${baseMetaclass.name} + ${extensionMetaclasses.map(m => m.name).join(' + ')}`,
        description: `Composed metaclass combining ${baseMetaclass.name} with ${extensionMetaclasses.map(m => m.name).join(' and ')}`,
        version: '1.0.0',
        properties: composedProperties,
        behaviors: composedBehaviors,
        dependencies: composedDependencies
      };

      // Validate composed metaclass
      const composedValidation = this.validator.validate(composedMetaclass);
      if (!composedValidation.valid) {
        return { success: false, error: composedValidation.error };
      }

      return { success: true, metaclass: composedMetaclass };
    } catch (error) {
      return { success: false, error: `Composition failed: ${(error as Error).message}` };
    }
  }

  /**
   * Compose properties from multiple metaclasses
   * @param baseMetaclass - Base metaclass
   * @param extensionMetaclasses - Extension metaclasses
   * @returns Composed properties
   */
  private composeProperties(baseMetaclass: Metaclass, extensionMetaclasses: Metaclass[]): Record<string, any> {
    const properties: Record<string, any> = { ...baseMetaclass.properties };

    // Add properties from extension metaclasses
    for (const extension of extensionMetaclasses) {
      for (const [propName, propValue] of Object.entries(extension.properties)) {
        // If property already exists, extension overrides base
        properties[propName] = propValue;
      }
    }

    return properties;
  }

  /**
   * Compose behaviors from multiple metaclasses
   * @param baseMetaclass - Base metaclass
   * @param extensionMetaclasses - Extension metaclasses
   * @returns Composed behaviors (unique)
   */
  private composeBehaviors(baseMetaclass: Metaclass, extensionMetaclasses: Metaclass[]): string[] {
    const behaviors = new Set<string>(baseMetaclass.behaviors);

    // Add behaviors from extension metaclasses
    for (const extension of extensionMetaclasses) {
      for (const behavior of extension.behaviors) {
        behaviors.add(behavior);
