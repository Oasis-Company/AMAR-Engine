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
      const { type } = req.body;
      const aeid = this.engine.getAEIDSystem().generateAEID(type || 'asset');
      res.status(200).json({ aeid });
    });
    
    // Validate an AEID
    router.post('/validate', (req: Request, res: Response) => {
      const { aeid } = req.body;
      
      if (!aeid) {
        return res.status(400).json({ error: 'Missing AEID parameter' });
      }
      
      const result = this.engine.getAEIDSystem().validateAEID(aeid);
      res.status(200).json({ valid: result.valid, error: result.error });
    });
    
    // Get AEID info
    router.get('/info/:aeid', (req: Request, res: Response) => {
      const { aeid } = req.params;
      const info = this.engine.getAEIDSystem().getAEIDInfo(aeid);
      
      if (!info.valid) {
        return res.status(400).json({ error: info.error });
      }
      
      res.status(200).json(info);
    });
    
    this.app.use('/api/aeid', router);
  }

  /**
   * Setup Skills routes
   */
  private setupSkillsRoutes(): void {
    const router = express.Router();
    
    // Get all skills
    router.get('/', (req: Request, res: Response) => {
      const skills = this.engine.getSkillsSystem().listSkills();
      res.status(200).json(skills);
    });
    
    // Get a specific skill
    router.get('/:id', (req: Request, res: Response) => {
      const { id } = req.params;
      const skill = this.engine.getSkillsSystem().getSkill(id);
      
      if (!skill) {
        return res.status(404).json({ error: `Skill ${id} not found` });
      }
      
      res.status(200).json(skill);
    });
    
    // Register a new skill
    router.post('/', (req: Request, res: Response) => {
      const skill = req.body;
      const result = this.engine.getSkillsSystem().registerSkill(skill);
      
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }
      
      res.status(201).json({ id: result.id, message: 'Skill registered successfully' });
    });
    
    // Execute a skill
    router.post('/execute/:id', (req: Request, res: Response) => {
      const { id } = req.params;
      const parameters = req.body;
      
      this.engine.getSkillsSystem().executeSkill(id, parameters)
        .then(result => {
          if (!result.success) {
            return res.status(400).json({ error: result.error });
          }
          res.status(200).json({ result: result.result });
        })
        .catch(error => {
          res.status(500).json({ error: error.message });
        });
    });
    
    this.app.use('/api/skills', router);
  }

  /**
   * Setup Mesher routes
   */
  private setupMesherRoutes(): void {
    const router = express.Router();
    
    // Generate mesh from images
    router.post('/from-images', (req: Request, res: Response) => {
      const { images, options } = req.body;
      
      if (!images || !Array.isArray(images)) {
        return res.status(400).json({ error: 'Missing or invalid images parameter' });
      }
      
      this.engine.getMesherSystem().generateFromImages(images, options)
        .then(result => {
          if (!result.success) {
            return res.status(400).json({ error: result.error });
          }
          res.status(200).json({ mesh: result.mesh });
        })
        .catch(error => {
          res.status(500).json({ error: error.message });
        });
    });
    
    // Generate mesh from point cloud
    router.post('/from-pointcloud', (req: Request, res: Response) => {
      const { pointCloud, options } = req.body;
      
      if (!pointCloud || !pointCloud.points) {
        return res.status(400).json({ error: 'Missing or invalid pointCloud parameter' });
      }
      
      this.engine.getMesherSystem().generateFromPointCloud(pointCloud, options)
        .then(result => {
          if (!result.success) {
            return res.status(400).json({ error: result.error });
          }
          res.status(200).json({ mesh: result.mesh });
        })
        .catch(error => {
          res.status(500).json({ error: error.message });
        });
    });
    
    // Generate mesh from text
    router.post('/from-text', (req: Request, res: Response) => {
      const { description, options } = req.body;
      
      if (!description) {
        return res.status(400).json({ error: 'Missing description parameter' });
      }
      
      this.engine.getMesherSystem().generateFromText(description, options)
        .then(result => {
          if (!result.success) {
            return res.status(400).json({ error: result.error });
          }
          res.status(200).json({ mesh: result.mesh });
        })
        .catch(error => {
          res.status(500).json({ error: error.message });
        });
    });
    
    // Optimize a mesh
    router.post('/optimize', (req: Request, res: Response) => {
      const { mesh, options } = req.body;
      
      if (!mesh) {
        return res.status(400).json({ error: 'Missing mesh parameter' });
      }
      
      const optimizedMesh = this.engine.getMesherSystem().optimizeMesh(mesh, options);
      res.status(200).json({ mesh: optimizedMesh });
    });
    
    // Validate a mesh
    router.post('/validate', (req: Request, res: Response) => {
      const { mesh } = req.body;
      
      if (!mesh) {
        return res.status(400).json({ error: 'Missing mesh parameter' });
      }
      
      const result = this.engine.getMesherSystem().validateMesh(mesh);
      res.status(200).json({ valid: result.valid, error: result.error });
    });
    
    this.app.use('/api/mesher', router);
  }

  /**
   * Initialize the server
   * @param port - Port to listen on
   */
  public async initialize(port: number = 3000): Promise<void> {
    this.port = port;
    console.log(`API Server initialized on port ${this.port}`);
  }

  /**
   * Start the server
   */
  public async start(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server = this.app.listen(this.port, () => {
        console.log(`API Server running at http://localhost:${this.port}`);
        resolve();
      }).on('error', (error: any) => {
        console.error('Failed to start API server:', error);
        reject(error);
      });
    });
  }

  /**
   * Stop the