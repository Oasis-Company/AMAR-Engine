/**
 * AEID System - Core component for generating and managing AMAR Engine IDs
 * Provides globally unique identifiers for assets and scenes
 */

import { AEIDGenerator } from './AEIDGenerator';
import { AEIDValidator } from './AEIDValidator';
import { AEIDRegistry } from './AEIDRegistry';

class AEIDSystem {
  private generator: AEIDGenerator;
  private validator: AEIDValidator;
  private registry: AEIDRegistry;

  constructor() {
    this.generator = new AEIDGenerator();
    this.validator = new AEIDValidator();
    this.registry = new AEIDRegistry();
  }

  /**
   * Initialize the AEID System
   */
  public async initialize(): Promise<void> {
    console.log('Initializing AEID System...');
    await this.registry.initialize();
    console.log('AEID System initialized successfully!');
  }

  /**
   * Generate a new AEID
   * @param assetType - Asset type
   * @returns Generated AEID
   */
  public generateAEID(assetType: string): string {
    return this.generator.generate(assetType);
  }

  /**
   * Validate an AEID
   * @param aeid - AEID to validate
   * @returns Validation result
   */
  public validateAEID(aeid: string): { valid: boolean; error?: string; typePrefix?: string; timestamp?: string; random?: string; checksum?: string } {
    return this.validator.validate(aeid);
  }

  /**
   * Register an AEID
   * @param aeid - AEID to register
   * @param metadata - Metadata associated with the AEID
   * @returns Registration result
   */
  public async registerAEID(aeid: string, metadata: Record<string, any>): Promise<{ success: boolean; error?: string }> {
    // Validate AEID
    const validationResult = this.validator.validate(aeid);
    if (!validationResult.valid) {
      return { success: false, error: validationResult.error };
    }

    // Register AEID
    return this.registry.register(aeid, metadata);
  }

  /**
   * Query AEID information
   * @param aeid - AEID to query
   * @returns AEID information or null if not found
   */
  public async queryAEID(aeid: string): Promise<Record<string, any> | null> {
    return this.registry.query(aeid);
  }

  /**
   * Revoke an AEID
   * @param aeid - AEID to revoke
   * @returns Revocation result
   */
  public async revokeAEID(aeid: string): Promise<{ success: boolean; error?: string }> {
    return this.registry.revoke(aeid);
  }

  /**
   * Get AEID information
   * @param aeid - AEID to get information for
   * @returns AEID information including validation result and metadata
   */
  public async getAEIDInfo(aeid: string): Promise<{ valid: boolean; error?: string; typePrefix?: string; timestamp?: string; random?: string; checksum?: string; metadata?: Record<string, any> }> {
    // Validate AEID
    const validationResult = this.validator.validate(aeid);
    
    if (!validationResult.valid) {
      return validationResult;
    }
    
    // Query metadata
    const metadata = await this.registry.query(aeid);
    
    return {
      ...validationResult,
      metadata
    };
  }

  /**
   * Shutdown the AEID System
   */
  public async shutdown(): Promise<void> {
    console.log('Shutting down AEID System...');
    await this.registry.shutdown();
    console.log('AEID System shutdown successfully!');
  }
}

export { AEIDSystem };
