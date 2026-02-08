#!/usr/bin/env node

/**
 * AMAR Engine (AME) - Main Entry Point
 * A next-generation 3D tool for generating virtual worlds from natural language and real-world captures
 */

import { MetaclassSystem } from './core/metaclass/MetaclassSystem';
import { AEIDSystem } from './core/aeid/AEIDSystem';
import { SkillsSystem } from './core/skills/SkillsSystem';
import { MesherSystem } from './core/mesher/MesherSystem';
import { APISystem } from './api';
import { version } from './version';

class AMAREngine {
  private metaclassSystem: MetaclassSystem;
  private aeidSystem: AEIDSystem;
  private skillsSystem: SkillsSystem;
  private mesherSystem: MesherSystem;
  private apiSystem: APISystem;

  constructor() {
    this.metaclassSystem = new MetaclassSystem();
    this.aeidSystem = new AEIDSystem();
    this.skillsSystem = new SkillsSystem();
    this.mesherSystem = new MesherSystem();
    this.apiSystem = new APISystem(this);
  }

  /**
   * Initialize the AMAR Engine
   */
  public async initialize(): Promise<void> {
    console.log('Initializing AMAR Engine...');
    
    // Initialize core systems
    await this.metaclassSystem.initialize();
    await this.aeidSystem.initialize();
    await this.skillsSystem.initialize();
    await this.mesherSystem.initialize();
    await this.apiSystem.initialize();
    
    console.log('AMAR Engine initialized successfully!');
  }

  /**
   * Start the API server
   */
  public async startAPIServer(): Promise<void> {
    await this.apiSystem.start();
  }

  /**
   * Stop the API server
   */
  public async stopAPIServer(): Promise<void> {
    await this.apiSystem.stop();
  }

  /**
   * Get the Metaclass System
   */
  public getMetaclassSystem(): MetaclassSystem {
    return this.metaclassSystem;
  }

  /**
   * Get the AEID System
   */
  public getAEIDSystem(): AEIDSystem {
    return this.aeidSystem;
  }

  /**
   * Get the Skills System
   */
  public getSkillsSystem(): SkillsSystem {
    return this.skillsSystem;
  }

  /**
   * Get the Mesher System
   */
  public getMesherSystem(): MesherSystem {
    return this.mesherSystem;
  }

  /**
   * Get the API System
   */
  public getAPISystem(): APISystem {
    return this.apiSystem;
  }

  /**
   * Shutdown the AMAR Engine
   */
  public async shutdown(): Promise<void> {
    console.log('Shutting down AMAR Engine...');
    
    // Shutdown core systems
    await this.apiSystem.shutdown();
    await this.skillsSystem.shutdown();
    await this.mesherSystem.shutdown();
    await this.aeidSystem.shutdown();
    await this.metaclassSystem.shutdown();
    
    console.log('AMAR Engine shutdown successfully!');
  }
}

// Export the AMAR Engine class
export { AMAREngine };

// If run directly, initialize the engine
if (require.main === module) {
  const engine = new AMAREngine();
  engine.initialize()
    .then(() => {
      // Start API server
      return engine.startAPIServer();
    })
    .catch((error) => {
      console.error('Failed to initialize AMAR Engine