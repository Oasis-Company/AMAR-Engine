/**
 * Mesh Optimizer - Optimizes 3D mesh data for better performance and smaller size
 * Reduces vertex count, removes redundant data, and improves mesh quality
 */

import { Mesh, MesherOptions } from './MesherSystem';

class MeshOptimizer {
  private options: MesherOptions;

  constructor(options: MesherOptions) {
    this.options = options;
  }

  /**
   * Set optimizer options
   * @param options - New options
   */
  public setOptions(options: MesherOptions): void {
    this.options = options;
  }

  /**
   * Optimize a mesh
   * @param mesh - Mesh to optimize
   * @param options - Optimization options
   * @returns Optimized mesh
   */
  public optimize(mesh: Mesh, options: MesherOptions = {}): Mesh {
    const mergedOptions = { ...this.options, ...options };
    
    console.log(`Optimizing mesh ${mesh.id} with quality ${mergedOptions.quality}...`);
    
    // Apply optimization steps
    let optimizedMesh = { ...mesh };
    
    // 1. Remove duplicate vertices
    optimizedMesh = this.removeDuplicateVertices(optimizedMesh);
    
    // 2. Simplify mesh based on quality setting
    optimizedMesh = this.simplifyMesh(optimizedMesh, mergedOptions.quality);
    
    // 3. Optimize indices (reorder for better cache performance)
    optimizedMesh = this.optimizeIndices(optimizedMesh);
    
    // 4. Recalculate normals (to ensure they're still valid after optimization)
    optimizedMesh = this.recalculateNormals(optimizedMesh);
    
    // 5. Update metadata
    optimizedMesh.metadata = {
      ...optimizedMesh.metadata,
      optimized: true,
      optimizationTime: new Date().toISOString(),
      optimizationOptions: mergedOptions,
      originalVertexCount: mesh.vertices.length / 3,
      originalFaceCount: mesh.indices.length / 3,
      optimizedVertexCount: optimizedMesh.vertices.length / 3,
      optimizedFaceCount: optimizedMesh.indices.length / 3,
      compressionRatio: (mesh.vertices.length + mesh.indices.length) / 
                        (optimizedMesh