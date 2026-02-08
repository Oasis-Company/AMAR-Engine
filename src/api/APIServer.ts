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
    this