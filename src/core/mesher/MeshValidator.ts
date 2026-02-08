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
    for (let i = 0; i < normals.length