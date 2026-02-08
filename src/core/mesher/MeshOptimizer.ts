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
                        (optimizedMesh.vertices.length + optimizedMesh.indices.length)
    };
    
    console.log(`Mesh optimization completed: ${mesh.vertices.length / 3} → ${optimizedMesh.vertices.length / 3} vertices, ${mesh.indices.length / 3} → ${optimizedMesh.indices.length / 3} faces`);
    
    return optimizedMesh;
  }

  /**
   * Remove duplicate vertices
   * @param mesh - Mesh to process
   * @returns Mesh with duplicate vertices removed
   */
  private removeDuplicateVertices(mesh: Mesh): Mesh {
    const vertexMap = new Map<string, number>();
    const newVertices: number[] = [];
    const newNormals: number[] = [];
    const newUvs: number[] = [];
    const newIndices: number[] = [];
    
    // Threshold for considering vertices as duplicates
    const epsilon = 1e-6;
    
    // Process each vertex
    for (let i = 0; i < mesh.vertices.length; i += 3) {
      const x = mesh.vertices[i];
      const y = mesh.vertices[i + 1];
      const z = mesh.vertices[i + 2];
      
      // Create a key for the vertex (rounded to epsilon)
      const key = `${Math.round(x / epsilon) * epsilon},${Math.round(y / epsilon) * epsilon},${Math.round(z / epsilon) * epsilon}`;
      
      if (!vertexMap.has(key)) {
        // Add new vertex
        vertexMap.set(key, newVertices.length / 3);
        newVertices.push(x, y, z);
        
        // Add corresponding normal and UV
        if (mesh.normals) {
          newNormals.push(mesh.normals[i], mesh.normals[i + 1], mesh.normals[i + 2]);
        }
        if (mesh.uvs) {
          const uvIndex = (i / 3) * 2;
          newUvs.push(mesh.uvs[uvIndex], mesh.uvs[uvIndex + 1]);
        }
      }
    }
    
    // Remap indices
    for (let i = 0; i < mesh.indices.length; i++) {
      const originalIndex = mesh.indices[i];
      const x = mesh.vertices[originalIndex * 3];
      const y = mesh.vertices[originalIndex * 3 + 1];
      const z = mesh.vertices[originalIndex * 3 + 2];
      
      const key = `${Math.round(x / epsilon) * epsilon},${Math.round(y / epsilon) * epsilon},${Math.round(z / epsilon) * epsilon}`;
      const newIndex = vertexMap.get(key);
      
      if (newIndex !== undefined) {
        newIndices.push(newIndex);
      }
    }
    
    return {
      ...mesh,
      vertices: newVertices,
      indices: newIndices,
      normals: newNormals.length > 0 ? newNormals : mesh.normals,
      uvs: newUvs.length > 0 ? newUvs : mesh.uvs
    };
  }

  /**
   * Simplify mesh by reducing vertex count
   * @param mesh - Mesh to simplify
   * @param quality - Simplification quality
   * @returns Simplified mesh
   */
  private simplifyMesh(mesh: Mesh, quality: 'low' | 'medium' | 'high'): Mesh {
    // Determine simplification factor based on quality
    let simplificationFactor: number;
    switch (quality) {
      case 'low':
        simplificationFactor = 0.3; // Keep 30% of vertices
        break;
      case 'medium':
        simplificationFactor = 0.6; // Keep 60% of vertices
        break;
      case 'high':
      default:
        simplificationFactor = 0.9; // Keep 90% of vertices
        break;
    }
    
    // Calculate target vertex count
    const originalVertexCount = mesh.vertices.length / 3;
    const targetVertexCount = Math.max(4, Math.floor(originalVertexCount * simplificationFactor));
    
    // If we don't need to simplify, return the mesh as is
    if (originalVertexCount <= targetVertexCount) {
      return mesh;
    }
    
    console.log(`Simplifying mesh from ${originalVertexCount} to ${targetVertexCount} vertices...`);
    
    // For now, we'll just return the original mesh
    // In a real implementation, this would use quadric error metrics or other mesh simplification algorithms
    return mesh;
  }

  /**
   * Optimize indices for better cache performance
   * @param mesh - Mesh to optimize
   * @returns