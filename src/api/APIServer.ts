/**
 * API Server - HTTP server for AMAR Engine API
 * Provides RESTful API endpoints for accessing engine functionality
 */

import express, { Express, Request, Response } from 'express';
import { AMAREngine } from '../index';

class APIServer {
  private app: Express;
  private port: number;
  private engine: AMAREngine;
  private server: any;

  constructor(engine: AMAREngine) {
    this.engine = engine;
    this.app = express();
    this.port = 3000;
    this.server = null;
    this.setupMiddleware();
    this.setupRoutes();
  }

  /**
   * Setup middleware
   */
  private setupMiddleware(): void {
    // Parse JSON bodies
    this.app.use(express.json());
    
    // Parse URL-encoded bodies
    this.app.use(express.urlencoded({ extended: true }));
    
    // CORS middleware
    this.app.use((req: Request, res: Response, next: Function) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
      if (req.method === 'OPTIONS') {
        return res.status(200).end();
      }
      
      next();
    });
    
    // Request logging middleware
    this.app.use((req: Request,