/**
 * Mesh Validator - Validates 3D mesh data for correctness and integrity
 * Ensures meshes meet quality standards and are suitable for rendering
 */

import { Mesh } from './MesherSystem';

class MeshValidator {
  /**
   * Validate a mesh
   * @param mesh - Mesh to validate
   * @returns Validation result
   */
  public validate(mesh: Mesh): { valid: boolean; error?: string } {
    // Check if mesh is defined
    if (!mesh) {
      return { valid: false, error: 'Mesh is undefined' };
    }

    // Check required properties
    const requiredProperties = ['id', 'vertices', 'indices', 'normals', 'uvs', 'metadata'];
    for (const prop of requiredProperties) {
      if (!(prop in mesh)) {
        return { valid: false, error: `Missing required property: ${prop}` };
      }
    }

    // Validate vertices
    const vertexResult = this.validateVertices(mesh.vertices);
    if (!vertexResult.valid) {
      return vertexResult;
    }

    // Validate indices
    const indexResult = this.validateIndices(mesh.indices, mesh.vertices.length / 3);
    if (!indexResult.valid) {
      return indexResult;
    }

    // Validate normals
    const normalResult = this.validateNormals(mesh.normals, mesh.vertices.length / 3);
    if (!normalResult.valid) {
      return normalResult;
    }

    // Validate UVs
    const uvResult = this.validateUVs(mesh.uvs, mesh.vertices.length / 3);
    if (!uvResult.valid) {
      return uvResult;
    }

    // Validate metadata
    const metadataResult = this.validateMetadata(mesh.metadata);
    if (!metadataResult.valid) {
      return metadataResult;
    }

    // Check for degenerate faces
    const degenerateResult = this.checkDegenerateFaces(mesh.vertices, mesh.indices);
    if (!degenerateResult.valid) {
      return degenerateResult;
    }

    // Check for non-manifold edges
    const manifoldResult = this.checkManifoldEdges(mesh.indices);
    if (!manifoldResult.valid) {
      return manifoldResult;
    }

    // All checks passed
    return { valid: true };
  }

  /**
   * Validate vertices
   * @param vertices - Vertex positions
   * @returns Validation result
   */
  private validateVertices(vertices: number[]): { valid: boolean; error?: string } {
    if (!Array.isArray(vertices)) {
      return { valid: false, error: 'Vertices must be an array' };
    }

    if (vertices.length % 3 !== 0) {
      return { valid: false, error: 'Vertices array length must be a multiple of 3' };
    }

    if (vertices.length === 0) {
      return { valid: false, error: 'Vertices array cannot be empty' };
    }

    // Check for NaN or infinite values
    for (let i = 0; i < vertices.length; i++) {
      if (isNaN(vertices[i]) || !isFinite(vertices[i])) {
        return { valid: false, error: `Invalid vertex value at index ${i}` };
      }
    }

    return { valid: true };
  }

  /**
   * Validate indices
   * @param indices - Face indices
   * @param vertexCount - Number of vertices
   * @returns Validation result
   */
  private validateIndices(indices: number[], vertexCount: number): { valid: boolean; error?: string } {
    if (!Array.isArray(indices)) {
      return { valid: false, error: 'Indices must be an array' };
    }

    if (indices.length % 3 !== 0) {
      return { valid: false, error: 'Indices array length must be a multiple of 3' };
    }

    if (indices.length === 0) {
      return { valid: false, error: 'Indices array cannot be empty' };
    }

    // Check for valid index values
    for (let i = 0; i < indices.length; i++) {
      const index = indices[i];
      if (!Number.isInteger(index)) {
        return { valid: false, error: `Index must be an integer at index ${i}` };
      }
      if (index < 0 || index >= vertexCount) {
        return { valid: false, error: `Index out of bounds at index ${i}: ${index} (vertex count: ${vertexCount})` };
      }
    }

    return { valid: true };
  }

  /**
   * Validate normals
   * @param normals - Normal vectors
   * @param vertexCount - Number of vertices
   * @returns Validation result
   */
  private validateNormals(normals: number[], vertexCount: number): { valid: boolean; error?: string } {
    if (!Array.isArray(normals)) {
      return { valid: false, error: 'Normals must be an array' };
    }

    if (normals.length !== vertexCount * 3) {
      return { valid: false, error: `Normals array length must match vertex count (expected ${vertexCount * 3}, got ${normals.length})` };
    }

    // Check for valid normal values
    for (let i = 0; i < normals.length; i += 3) {
      const nx = normals[i];
      const ny = normals[i + 1];
      const nz = normals[i + 2];

      if (isNaN(nx) || !isFinite(nx) ||
          isNaN(ny) || !isFinite(ny) ||
          isNaN(nz) || !isFinite(nz)) {
        return { valid: false, error: `Invalid normal value at index ${i}` };
      }

      // Check if normal is normalized (length close to 1)
      const length = Math.sqrt(nx * nx + ny * ny + nz * nz);
      if (Math.abs(length - 1.0) > 0.1) {
        return { valid: false, error: `Normal not normalized at index ${i} (length: ${length})` };
      }
    }

    return { valid: true };
  }

  /**
   * Validate UVs
   * @param uvs - UV coordinates
   * @param vertexCount - Number of vertices
   * @returns Validation result
   */
  private validateUVs(uvs: number[], vertexCount: number): { valid: boolean; error?: string } {
    if (!Array.isArray(uvs)) {
      return { valid: false, error: 'UVs must be an array' };
    }

    if (uvs.length !== vertexCount * 2) {
      return { valid: false, error: `UVs array length must match vertex count (expected ${vertexCount * 2}, got ${uvs.length})` };
    }

    // Check for valid UV values
    for (let i = 0; i < uvs.length; i++) {
      if (isNaN(uvs[i]) || !isFinite(uvs[i])) {
        return { valid: false, error: `Invalid UV value at index ${i}` };
      }
    }

    return { valid: true };
  }

  /**
   * Validate metadata
   * @param metadata - Mesh metadata
   * @returns Validation result
   */
  private validateMetadata(metadata: Record<string, any>): { valid: boolean; error?: string } {
    if (!metadata || typeof metadata !== 'object') {
      return { valid: false, error: 'Metadata must be an object' };
    }

    // Check for required metadata properties
    if (!metadata.source) {
      return { valid: false, error: 'Missing metadata.source' };
    }

    if (!metadata.generatedAt) {
      return { valid: false, error: 'Missing metadata.generatedAt' };
    }

    return { valid: true };
  }

  /**
   * Check for degenerate faces (faces with zero area)
   * @param vertices - Vertex positions
   * @param indices - Face indices
   * @returns Validation result
   */
  private checkDegenerateFaces(vertices: number[], indices: number[]): { valid: boolean; error?: string } {
    for (let i = 0; i < indices.length; i += 3) {
      const i0 = indices[i] * 3;
      const i1 = indices[i + 1] * 3;
      const i2 = indices[i + 2] * 3;

      // Calculate edge vectors
      const v1x = vertices[i1] - vertices[i0];
      const v1y = vertices[i1 + 1] - vertices[i0 + 1];
      const v1z = vertices[i1 + 2] - vertices[i0 + 2];

      const v2x = vertices[i2] - vertices[i0];
      const