/**
 * AEID Generator - Generates globally unique AMAR Engine IDs
 * Uses a combination of type prefix, timestamp, random number, and checksum
 */

import * as crypto from 'crypto';
import { DateTime } from 'luxon';

class AEIDGenerator {
  private typePrefixMapping: Record<string, string>;

  constructor() {
    this.typePrefixMapping = {
      'asset': 'AST',
      'scene': 'SCN',
      'material': 'MAT',
      'metaclass': 'MCL',
      'skill': 'SKL',
      'component': 'CPT',
      'library': 'LIB',
      'template': 'TPL',
      'project': 'PRJ',
      'texture': 'TEX',
      'model': 'MDL',
      'animation': 'ANI',
      'sound': 'SD',
      'light': 'LGT',
      'camera': 'CAM',
      'physics': 'PHY',
      'particle': 'PRT',
      'ui': 'UI',
      'script': 'SCR',
      'shader': 'SHD',
      'environment': 'ENV',
      'terrain': 'TRN',
      'character': 'CHR',
      'weapon': 'WP',
      'vehicle': 'VEH',
      'building': 'BLD',
      'prop': 'PROP',
      'effect': 'EFX',
      'save': 'SAV'
    };
  }

  /**
   * Generate a new AEID
   * @param assetType - Asset type
   * @returns Generated AEID
   */
  public generate(assetType: string): string {
    // Determine type prefix
    const typePrefix = this.typePrefixMapping[assetType.toLowerCase()] || 'AST';

    // Generate timestamp (YYYYMMDDHHmm)
    const timestamp = DateTime.utc().toFormat('yyyyMMddHHmm');

    // Generate random number (8 digits)
    const random = this.generateRandomNumber(8);

    // Calculate checksum
    const checksum = this.calculateChecksum(typePrefix, timestamp, random);

    // Concatenate parts
    return `${typePrefix}-${timestamp}-${random}-${checksum}`;
  }

  /**
   * Generate a batch of AEIDs
   * @param assetType - Asset type
   * @param count - Number of AEIDs to generate
   * @returns Array of generated AEIDs
   */
  public generateBatch(assetType: string, count: number): string[] {
    const aeids: string[] = [];
    for (let i = 0; i < count; i++) {
      aeids.push(this.generate(assetType));
    }
    return aeids;
  }

  /**
   * Generate a random number with specified length
   * @param length - Length of random number
   * @returns Random number as string
   */
  private generateRandomNumber(length: number): string {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
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
   * Get type prefix mapping
   * @returns Type prefix mapping
   */
  public getTypePrefixMapping(): Record<string, string> {
    return { ...this.typePrefixMapping };
  }

  /**
   * Add custom type prefix
   * @param assetType - Asset type
   * @param prefix - Type prefix (2-4 uppercase letters)
   * @returns Success status
   */
  public addCustomTypePrefix(assetType: string, prefix: string): boolean {
    if (!/^[A-Z]{2,4}$/.test(prefix)) {
      return false;
    }
    this.typePrefixMapping[assetType.toLowerCase()] = prefix;
    return true;
  }
}

export { AEIDGenerator };
