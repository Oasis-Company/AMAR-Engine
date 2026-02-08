/**
 * API System - Core component for providing HTTP API interfaces
 * Exposes AMAR Engine functionality through RESTful API endpoints
 */

import { APIServer } from './APIServer';
import { AMAREngine } from '../index';

class APISystem {
  private server: APIServer;
  private engine: AMAREngine;

  constructor(engine: AMAREngine) {
    this.engine = engine;
    this.server = new APIServer(engine);
  }

  /**
   * Initialize the API System
   * @param port - Port to listen on
   */
  public async initialize(port: number = 3000): Promise<void> {
    console.log('Initializing API System...');
    await this.server.initialize(port);
    console.log('API System initialized successfully!');
  }

  /**
   * Start the API server
   */
  public async start(): Promise<void> {
    console.log('Starting API server...');
    await this.server.start();
    console.log('API server started successfully!');
  }

  /**
   * Stop the API server
   */
  public async stop(): Promise<void> {
    console.log('Stopping API server...');
    await this.server.stop();
    console.log('API server stopped successfully!');
  }

  /**
   * Get the API server
   * @returns API server instance
   */
  public getServer(): APIServer {
    return this.server;
  }

  /**
   * Shutdown the API System
   */
  public async shutdown(): Promise<void> {
    console.log('Shutting down API System...');
    await this.server.stop();
    console.log('API System shutdown successfully!');
  }
}

export { APISystem };