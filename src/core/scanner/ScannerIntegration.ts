/**
 * Scanner Integration - Integrates AME-Scanner with AMAR Engine
 * Handles communication with AME-Scanner and processes its output
 */

import { AMAREngine } from '../../index';
import { spawn } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

// Type definitions for AME-Scanner output
export interface OBB {
  center: number[];
  rotation: number[][];
  extents: number[];
}

export interface AmeEntity {
  id: number;
  obb: OBB;
  mesh_path: string;
  metaclass: string;
  physics_handle: number;
}

export interface SpatialRelationship {
  source_id: number;
  target_id: number;
  relationship_type: string;
  confidence: number;
}

export interface SpatialStructurePackage {
  scene_bbox: OBB;
  entities: AmeEntity[];
  relationships: SpatialRelationship[];
  metadata: {
    version: string;
    timestamp: string;
    num_entities: number;
    num_relationships: number;
    processing_time_ms: number;
  };
}

// Type definitions for AMAR Engine internal format
export interface EngineEntity {
  id: string;
  name: string;
  aeid: string;
  metaclasses: string[];
  properties: Record<string, any>;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
  physics: {
    mass: number;
    volume: number;
    density: number;
    handle: number;
  };
}

export interface EngineRelationship {
  sourceId: string;
  targetId: string;
  type: string;
  confidence: number;
}

export interface ScannerOutput {
  entities: EngineEntity[];
  relationships: EngineRelationship[];
  sceneBounds: OBB;
  metadata: {
    version: string;
    timestamp: string;
    processingTime: number;
  };
}

class ScannerIntegration {
  private engine: AMAREngine;
  private scannerPath: string;

  constructor(engine: AMAREngine) {
    this.engine = engine;
    // Set default scanner path - this should be configurable
    this.scannerPath = path.join('..', 'AME-Scanner', 'build', 'Release', 'scanner-cli.exe');
  }

  /**
   * Set the path to the AME-Scanner executable
   * @param path - Path to the scanner executable
   */
  public setScannerPath(path: string): void {
    this.scannerPath = path;
  }

  /**
   * Run AME-Scanner on a 3DGS file
   * @param inputPath - Path to the 3DGS file (.ply or .splat)
   * @param outputPath - Path to save the SpatialStructurePackage
   * @returns Promise that resolves with the path to the output file
   */
  public async runScanner(inputPath: string, outputPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(this.scannerPath)) {
        reject(new Error(`AME-Scanner executable not found at: ${this.scannerPath}`));
        return;
      }

      if (!fs.existsSync(inputPath)) {
        reject(new Error(`Input file not found: ${inputPath}`));
        return;
      }

      console.log(`Running AME-Scanner on: ${inputPath}`);
      
      const scannerProcess = spawn(this.scannerPath, [inputPath, outputPath]);
      let output = '';
      let error = '';

      scannerProcess.stdout.on('data', (data) => {
        output += data.toString();
        console.log(data.toString());
      });

      scannerProcess.stderr.on('data', (data) => {
        error += data.toString();
        console.error(data.toString());
      });

      scannerProcess.on('close', (code) => {
        if (code === 0) {
          if (fs.existsSync(outputPath)) {
            console.log(`AME-Scanner completed successfully. Output saved to: ${outputPath}`);
            resolve(outputPath);
          } else {
            reject(new Error(`AME-Scanner completed but output file was not created: ${outputPath}`));
          }
        } else {
          reject(new Error(`AME-Scanner failed with exit code ${code}. Error: ${error}`));
        }
      });

      scannerProcess.on('error', (err) => {
        reject(new Error(`Failed to start AME-Scanner: ${err.message}`));
      });
    });
  }

  /**
   * Parse the SpatialStructurePackage file
   * @param filePath - Path to the SpatialStructurePackage file
   * @returns Promise that resolves with the parsed SpatialStructurePackage
   */
  public async parseScannerOutput(filePath: string): Promise<SpatialStructurePackage> {
    // Note: This is a placeholder. In reality, we would need to implement
    // parsing of the binary SpatialStructurePackage format
    // For now, we'll return a mock structure
    return {
      scene_bbox: {
        center: [0, 0, 0],
        rotation: [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
        extents: [1, 1, 1]
      },
      entities: [],
      relationships: [],
      metadata: {
        version: '1.0',
        timestamp: new Date().toISOString(),
        num_entities: 0,
        num_relationships: 0,
        processing_time_ms: 0
      }
    };
  }

  /**
   * Convert SpatialStructurePackage to AMAR Engine internal format
   * @param package - SpatialStructurePackage from AME-Scanner
   * @returns Converted ScannerOutput for AMAR Engine
   */
  public convertToEngineFormat(pkg: SpatialStructurePackage): ScannerOutput {
    const entities: EngineEntity[] = pkg.entities.map((entity) => {
      // Generate AEID for the entity
      const aeid = this.engine.getAEIDSystem().generateAEID('asset');
      
      return {
        id: `entity_${entity.id}`,
        name: `Entity ${entity.id}`,
        aeid,
        metaclasses: entity.metaclass ? [entity.metaclass] : ['object'],
        properties: {
          name: `Entity ${entity.id}`,
          description: `Entity generated from AME-Scanner`,
          aeid
        },
        position: {
          x: entity.obb.center[0],
          y: entity.obb.center[1],
          z: entity.obb.center[2]
        },
        rotation: {
          x: 0, // Simplified - would need to convert rotation matrix
          y: 0,
          z: 0
        },
        scale: {
          x: entity.obb.extents[0] * 2,
          y: entity.obb.extents[1] * 2,
          z: entity.obb.extents[2] * 2
        },
        physics: {
          mass: 1.0,
          volume: entity.obb.extents[0] * entity.obb.extents[1] * entity.obb.extents[2] * 8,
          density: 1000.0,
          handle: entity.physics_handle
        }
      };
    });

    const relationships: EngineRelationship[] = pkg.relationships.map((rel) => {
      return {
        sourceId: `entity_${rel.source_id}`,
        targetId: `entity_${rel.target_id}`,
        type: rel.relationship_type,
        confidence: rel.confidence
      };
    });

    return {
      entities,
      relationships,
      sceneBounds: pkg.scene_bbox,
      metadata: {
        version: pkg.metadata.version,
        timestamp: pkg.metadata.timestamp,
        processingTime: pkg.metadata.processing_time_ms
      }
    };
  }

  /**
   * Process a 3DGS file through AME-Scanner and convert to Engine format
   * @param inputPath - Path to the 3DGS file
   * @returns Promise that resolves with the converted ScannerOutput
   */
  public async process3DGSFile(inputPath: string): Promise<ScannerOutput> {
    // Create temporary output path
    const outputPath = path.join(path.dirname(inputPath), `${path.basename(inputPath, path.extname(inputPath))}.ssp`);

    try {
      // Run AME-Scanner
      await this.runScanner(inputPath, outputPath);

      // Parse the output
      const scannerOutput = await this.parseScannerOutput(outputPath);

      // Convert to Engine format
      const engineOutput = this.convertToEngineFormat(scannerOutput);

      // Clean up temporary file
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }

      return engineOutput;
    } catch (error) {
      // Clean up temporary file on error
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }
      throw error;
    }
  }
}

export { ScannerIntegration };