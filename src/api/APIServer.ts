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
    this.app.use((req: Request, res: Response, next: Function) => {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
      next();
    });
  }

  /**
   * Setup API routes
   */
  private setupRoutes(): void {
    // Health check endpoint
    this.app.get('/health', (req: Request, res: Response) => {
      res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
    });
    
    // API version endpoint
    this.app.get('/version', (req: Request, res: Response) => {
      res.status(200).json({ version: '1.0.0', name: 'AMAR Engine API' });
    });
    
    // Engine status endpoint
    this.app.get('/api/status', (req: Request, res: Response) => {
      res.status(200).json({
        status: 'running',
        systems: {
          metaclass: 'initialized',
          aeid: 'initialized',
          skills: 'initialized',
          mesher: 'initialized'
        }
      });
    });
    
    // Metaclass endpoints
    this.setupMetaclassRoutes();
    
    // AEID endpoints
    this.setupAEIDRoutes();
    
    // Skills endpoints
    this.setupSkillsRoutes();
    
    // Mesher endpoints
    this.setupMesherRoutes();
    
    // 404 handler
    this.app.use((req: Request, res: Response) => {
      res.status(404).json({ error: 'Not found', path: req.path });
    });
    
    // Error handler
    this.app.use((err: any, req: Request, res: Response) => {
      console.error('API Error:', err);
      res.status(500).json({ error: 'Internal server error' });
    });
  }

  /**
   * Setup Metaclass routes
   */
  private setupMetaclassRoutes(): void {
    const router = express.Router();
    
    // Get all metaclasses
    router.get('/', (req: Request, res: Response) => {
      const metaclasses = this.engine.getMetaclassSystem().listMetaclasses();
      res.status(200).json(metaclasses);
    });
    
    // Get a specific metaclass
    router.get('/:id', (req: Request, res: Response) => {
      const { id } = req.params;
      const metaclass = this.engine.getMetaclassSystem().getMetaclass(id);
      
      if (!metaclass) {
        return res.status(404).json({ error: `Metaclass ${id} not found` });
      }
      
      res.status(200).json(metaclass);
    });
    
    // Register a new metaclass
    router.post('/', (req: Request, res: Response) => {
      const metaclass = req.body;
      const result = this.engine.getMetaclassSystem().registerMetaclass(metaclass);
      
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }
      
      res.status(201).json({ id: result.id, message: 'Metaclass registered successfully' });
    });
    
    // Compose metaclasses
    router.post('/compose', (req: Request, res: Response) => {
      const { baseMetaclass, extensionMetaclasses } = req.body;
      
      if (!baseMetaclass || !extensionMetaclasses) {
        return res.status(400).json({ error: 'Missing required parameters' });
      }
      
      const result = this.engine.getMetaclassSystem().composeMetaclasses(baseMetaclass, extensionMetaclasses);
      
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }
      
      res.status(200).json(result.metaclass);
    });
    
    this.app.use('/api/metaclasses', router);
  }

  /**
   * Setup AEID routes
   */
  private setupAEIDRoutes(): void {
    const router = express.Router();
    
    // Generate a new AEID
    router.post('/generate', (req: Request, res: Response) => {
      const { type }