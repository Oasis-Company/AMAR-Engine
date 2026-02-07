/**
 * AEID Validator - Validates AMAR Engine IDs
 * Ensures that AEIDs conform to the specified format and are valid
 */

import * as crypto from 'crypto';

class AEIDValidator {
  private validTypePrefixes: string[];

  constructor() {
    this.validTypePrefixes = [
      'AST', 'SCN', 'MAT', 'MCL', 'SKL', 'CPT', 'LIB', 'TPL', 'PRJ'
    ];
  }

  /**
   * Validate an AEID
   * @param aeid - AEID to validate
   * @returns Validation result
   */
  public validate(aeid: string): { valid: boolean; error?: string; typePrefix?: string; timestamp?: string; random?: string; checksum?: string } {
    // Check AEID format
    const parts = aeid.split('-');
    if (parts.length !== 4) {
      return { valid: false, error: 'Invalid AEID format: must have 4 parts' };
    }

    const [typePrefix, timestamp, random, checksum] = parts;

    // Validate type prefix
    if (!/^[A-Z]{2,4}$/.test(typePrefix)) {
      return { valid: false, error: 'Invalid type prefix: must be 2-4 uppercase letters' };
    }

    // Validate timestamp
    if (!/^\d{12}$/.test(timestamp)) {
      return { valid: false, error: 'Invalid timestamp: must be 12 digits' };
    }

    // Validate random part
    if (!/^\d{8}$/.test(random)) {
      return { valid: false, error: 'Invalid random part: must be 8 digits' };
    }

    // Validate checksum
    if (!/^[A-F0-9]{4}$/.test(checksum)) {
      return { valid: false, error: 'Invalid checksum: must be 4 hexadecimal characters' };
    }

    // Validate type prefix is valid
    if (!this.validTypePrefixes.includes(typePrefix)) {
      return { valid: false, error: `Invalid type prefix: must be one of ${this.validTypePrefixes.join(', ')}` };
    }

    // Validate timestamp format (YYYYMMDDHHmm)
    if (!this.isValidTimestamp(timestamp)) {
      return { valid: false, error: 'Invalid timestamp: must be in YYYYMMDDHHmm format' };
    }

    // Validate checksum
    const calculatedChecksum = this.calculateChecksum(typePrefix, timestamp, random);
    if (calculatedChecksum !== checksum) {
      return { valid: false, error: 'Invalid checksum: checksum verification failed' };
    }

    return {
      valid: true,
      typePrefix,
      timestamp,
      random,
      checksum
    };
  }

  /**
   * Validate a batch of AEIDs
   * @param aeids - Array of AEIDs to validate
   * @returns Array of validation results
   */
  public validateBatch(aeids: string[]): Array<{ valid: boolean; error?: string; typePrefix?: string; timestamp?: string; random?: string; checksum?: string }> {
    return aeids.map(aeid => this.validate(aeid));
  }

  /**
   * Calculate checksum for AEID parts
   * @param typePrefix - Type prefix
   * @param timestamp - Timestamp
   * @param random - Random number
   * @returns Checksum (4 characters)
   */
  private calculateChecksum(typePrefix: string, timestamp: string, random: string): string {
    // Concatenate parts
    const data = `${typePrefix}${timestamp}${random}`;

    // Calculate SHA-256 hash
    const hash = crypto.createHash('sha256').update(data).digest('hex');

    // Take first 4 characters and convert to uppercase
    return hash.substring(0, 4).toUpperCase();
  }

  /**
   * Check if timestamp is valid
   * @param timestamp - Timestamp in YYYYMMDDHHmm format
   * @returns True if timestamp is valid
   */
  private isValidTimestamp(timestamp: string): boolean {
    // Check length
    if (timestamp.length !== 12) {
      return false;
    }

    // Extract components
    const year = parseInt(timestamp.substring(0, 4), 10);
    const month = parseInt(timestamp.substring(4, 6), 10);
    const day = parseInt(timestamp.substring(6, 8), 10);
    const hour = parseInt(timestamp.substring(8, 10), 10);
    const minute = parseInt(timestamp.substring(10, 12), 10);

    // Check ranges
    if (year < 2000 || year > 2100) {
      return false;
    }

    if (month < 1 || month > 12) {
      return false;
    }

    if (day < 1 || day > 31) {
      return false;
    }

    if (hour < 0 || hour > 23) {
      return false;
    }

    if (minute < 0 || minute > 59) {
      return false;
    }

    // Check for valid day in month
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day > daysInMonth) {
      return false;
    }

    return true;
  }

  /**
   * Get valid type prefixes
   * @returns Valid type prefixes
   */
  public getValidTypePrefixes(): string[] {
    return [...this.validTypePrefixes];
  }

  /**
   * Add custom type prefix
   * @param prefix - Type prefix (2-4 uppercase letters)
   * @returns Success status
   */
  public addCustomTypePrefix(prefix: string): boolean {
    if (!/^[A-Z]{2,4}$/.test(prefix)) {
      return false;
    }

    if (!this.validTypePrefixes.includes(prefix)) {
      this.validTypePrefixes.push(prefix);
    }

    return true;
  }
}

export { AEIDValidator };
