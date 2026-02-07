/**
 * AEID Registry - Stores and manages AEID registrations
 * Provides a central storage for AEIDs with metadata
 */

import * as fs from 'fs';
import * as path from 'path';

class AEIDRegistry {
  private registrations: Map<string, Record<string, any>>;
  private storagePath: string;

  constructor() {
    this.registrations = new Map<string, Record<string, any>>();
    this.storagePath = path.join(__dirname, '../../..', 'storage', 'aeids');
  }

  /**
   * Initialize the registry
   */
  public async initialize(): Promise<void> {
    // Create storage directory if it doesn't exist
    if (!fs.existsSync(this.storagePath)) {
      fs.mkdirSync(this.storagePath, { recursive: true });
    }

    // Load registrations from storage
    await this.loadRegistrations();
  }

  /**
   * Register an AEID
   * @param aeid - AEID to register
   * @param metadata - Metadata associated with the AEID
   * @returns Registration result
   */
  public async register(aeid: string, metadata: Record<string, any>): Promise<{ success: boolean; error?: string }> {
    try {
      // Check if AEID already exists
      if (this.registrations.has(aeid)) {
        return { success: false, error: `AEID ${aeid} is already registered` };
      }

      // Create registration entry
      const registration = {
        aeid,
        metadata,
        registeredAt: new Date().toISOString(),
        status: 'active'
      };

      // Add to registry
      this.registrations.set(aeid, registration);

      // Save to storage
      await this.saveRegistration(registration);

      return { success: true };
    } catch (error) {
      return { success: false, error: `Registration failed: ${(error as Error).message}` };
    }
  }

  /**
   * Query AEID information
   * @param aeid - AEID to query
   * @returns AEID information or null if not found
   */
  public async query(aeid: string): Promise<Record<string, any> | null> {
    return this.registrations.get(aeid) || null;
  }

  /**
   * Revoke an AEID
   * @param aeid - AEID to revoke
   * @returns Revocation result
   */
  public async revoke(aeid: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Check if AEID exists
      if (!this.registrations.has(aeid)) {
        return { success: false, error: `AEID ${aeid} not found` };
      }

      // Update registration status
      const registration = this.registrations.get(aeid)!;
      registration.status = 'revoked';
      registration.revokedAt = new Date().toISOString();

      // Save updated registration
      await this.saveRegistration(registration);

      return { success: true };
    } catch (error) {
      return { success: false, error: `Revocation failed: ${(error as Error).message}` };
    }
  }

  /**
   * List all registered AEIDs
   * @returns List of registered AEIDs
   */
  public list(): Record<string, any>[] {
    return Array.from(this.registrations.values());
  }

  /**
   * Save a registration to storage
   * @param registration - Registration to save
   */
  private async saveRegistration(registration: Record<string, any>): Promise<void> {
    const filePath = path.join(this.storagePath, `${registration.aeid.replace(/-/g, '_')}.json`);
    fs.writeFileSync(filePath, JSON.stringify(registration, null, 2));
  }

  /**
   * Load registrations from storage
   */
  private async loadRegistrations(): Promise<void> {
    try {
      const files = fs.readdirSync(this.storagePath);
      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(this.storagePath, file);
          const content = fs.readFileSync(filePath, 'utf8');
          const registration = JSON.parse(content) as Record<string, any>;
          this.registrations.set(registration.aeid, registration);
        }
      }
    } catch (error)