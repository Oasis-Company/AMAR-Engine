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
   * @returns Mesh with optimized indices
   */
  private optimizeIndices(mesh: Mesh): Mesh {
    // In a real implementation, this would reorder indices to improve vertex cache hit rate
    // For now, we'll just return the original mesh
    return mesh;
  }

  /**
   * Recalculate normals for a mesh
   * @param mesh - Mesh to process
   * @returns Mesh with recalculated normals
   */
  private recalculateNormals(mesh: Mesh): Mesh {
    const vertices = mesh.vertices;
    const indices = mesh.indices;
    const normals = new Array(vertices.length).fill(0);
    
    // Calculate normals for each face
    for (let i = 0; i < indices.length; i += 3) {
      const i0 = indices[i] * 3;
      const i1 = indices[i + 1] * 3;
      const i2 = indices[i + 2] * 3;
      
      // Calculate edge vectors
      const v1x = vertices[i1] - vertices[i0];
      const v1y = vertices[i1 + 1] - vertices[i0 + 1];
      const v1z = vertices[i1 + 2] - vertices[i0 + 2];
      
      const v2x = vertices[i2] - vertices[i0];
      const v2y = vertices[i2 + 1] - vertices[i0 + 1];
      const v2z = vertices[i2 + 2] - vertices[i0 + 2];
      
      // Calculate cross product
      const nx = v1y * v2z - v1z * v2y;
      const ny = v1z * v2x - v1x * v2z;
      const nz = v1x * v2y - v1y * v2x;
      
      // Normalize
      const length = Math.sqrt(nx * nx + ny * ny + nz * nz);
      if (length > 0) {
        const invLength = 1.0 / length;
        const normalizedNx = nx * invLength;
        const normalizedNy = ny * invLength;
        const normalizedNz = nz * invLength;
        
        // Add normal to each vertex in the face
        normals[i0] += normalizedNx;
        normals[i0 + 1] += normalizedNy;
        normals[i0 + 2] += normalizedNz;
        
        normals[i1] += normalizedNx;
        normals[i1 + 1] += normalizedNy;
        normals[i1 + 2] += normalizedNz;
        
        normals[i2] += normalizedNx;
        normals[i2 + 1] += normalizedNy;
        normals[i2 + 2] += normalizedNz;
      }
    }
    
    // Normalize vertex normals
    for (let i = 0; i < normals.length; i += 3) {
      const length = Math.sqrt(normals[i] * normals[i] + normals[i + 1] * normals[i + 1] + normals[i + 2] * normals[i + 2]);
      if (length > 0) {
        const invLength = 1.0 / length;
        normals[i] *= invLength;
        normals[i + 1] *= invLength;
        normals[i + 2] *= invLength;
      }
    }
    
    return {
      ...mesh,
      normals
    };
  }

  /**
   * Quantize mesh data to reduce size
   * @param mesh - Mesh to quantize
   * @param precision - Quantization precision (number of bits)
   * @returns Quantized mesh
   */
  public quantize(mesh: Mesh, precision: number = 16): Mesh {
    // Calculate scale and offset for quantization
    const bbox = this.calculateBoundingBox(mesh.vertices);
    const scale = {
      x: (2 ** precision - 1) / (bbox.max.x - bbox.min.x),
      y: (2 ** precision - 1) / (bbox.max.y - bbox.min.y),
      z: (2 ** precision - 1) / (bbox.max.z - bbox.min.z)
    };
    
    const offset = bbox.min;
    
    // Quantize vertices
    const quantizedVertices: number[] = [];
    for (let i = 0; i < mesh.vertices.length; i += 3) {
      const x = Math.round((mesh.vertices[i] - offset.x) * scale.x) / scale.x + offset.x;
