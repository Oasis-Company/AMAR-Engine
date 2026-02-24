# AMAR Engine Core Concepts

This document details the core concepts of the AMAR Engine (AME) system, including the metaclass system, AEID system, Skills system, and more.

## 1. The Metaclass Protocol

Metaclasses are the genetic code of the AME system, defining the physical properties and behavioral rules of entities.

### 1.1 Evolution Logic of Metaclasses

**Evolution Trend**: Concrete → Abstract → Self-consistent

- **Concrete**: Extract features and rules from specific objects in the real world
- **Abstract**: Abstract concrete features into universal rules and properties
- **Self-consistent**: Form a system with consistent internal logic and self-evolution capabilities

### 1.2 Classification of Metaclasses

#### 1.2.1 Root Metaclass

- **Definition**: Axioms and basic rules of the physical world
- **Examples**: Space, time steps, smoothness
- **Characteristics**:
  - Non-instantiable, no specific objects
  - Only serve as underlying weights and constraints for standard metaclasses
  - Form the basic framework of the physical world

#### 1.2.2 Standard Metaclass

- **Definition**: Entity templates with interactive potential
- **Examples**: Container, wheel, liquid, solid
- **Characteristics**:
  - Have specific objects
  - When the Scanner scans a volume and the Admin determines it belongs to a certain standard metaclass, the volume immediately inherits the physical interaction interface of that metaclass
  - Contain specific physical parameters such as density, friction coefficient, etc.

### 1.3 Manifestations of Metaclasses

#### Room (Representation Space)

- **Definition**: The existence state of entities under different coordinate systems
- **Examples**:
  - Representation in Cartesian coordinate system
  - Representation in relative sensory coordinate system
- **Function**: Provide entity descriptions from different perspectives, ensuring the consistency of entities under different observation frameworks

### 1.4 Core Properties of Metaclasses

#### 1.4.1 Physical Parameters

- **Basic Properties**: Density (ρ), mass (m), volume (V)
- **Interaction Properties**: Friction coefficient (f), elastic modulus (E), Poisson's ratio (ν)
- **Dynamic Properties**: Damping coefficient, inertia tensor

#### 1.4.2 Semantic Parameters

- **Functional Description**: The purpose and function of the entity
- **Behavioral Rules**: The behavioral patterns of the entity in different situations
- **Interaction Logic**: The way the entity interacts with other entities

### 1.5 Working Mechanism of Metaclasses

#### 1.5.1 Metaclass Binding Process

1. **Data Input**: Admin receives heterogeneous data from three paths
2. **Feature Extraction**: Extract geometric, material, and semantic features of the entity from the data
3. **Metaclass Matching**: Match the extracted features with standard metaclasses in the metaclass library
4. **Parameter Optimization**: Optimize metaclass parameters based on specific scenarios and contexts
5. **Binding Confirmation**: Finally determine the metaclass and specific parameters of the entity

#### 1.5.2 Metaclass Inheritance and Composition

- **Single Inheritance**: An entity usually inherits from one main standard metaclass
- **Multiple Composition**: An entity can simultaneously possess features of multiple metaclasses through composition
- **Parameter Override**: Parameters in specific scenarios can override the default parameters of the metaclass

### 1.6 Implementation of Metaclasses

#### 1.6.1 JSON Schema Definition

Basic metaclass definition example:

```json
{
  "$id": "https://example.org/metaverse/schema/metaclass.base.v0.1.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Metaclass Base v0.1",
  "type": "object",
  "required": ["meta"],
  "properties": {
    "meta": {
      "type": "object",
      "required": ["type", "version"],
      "properties": {
        "type": {
          "type": "string",
          "description": "Metaclass identifier, e.g., 'grass', 'water'"
        },
        "version": {
          "type": "string",
          "description": "Schema version for this metaclass instance, e.g., '0.1'"
        },
        "tags": {
          "type": "array",
          "items": { "type": "string" }
        }
      },
      "additionalProperties": false
    },
    "interaction": {
      "type": "object",
      "properties": {
        "affordances": {
          "type": "array",
          "items": { "type": "string" },
          "description": "What can be done to/with this object"
        }
      },
      "additionalProperties": false
    }
  },
  "additionalProperties": true
}
```

Specific metaclass definition example (grass metaclass):

```json
{
  "$id": "https://example.org/metaverse/schema/grass.v0.1.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Grass Metaclass v0.1",
  "type": "object",
  "allOf": [
    { "$ref": "metaclass.base.v0.1.json" }
  ],
  "required": ["meta", "intrinsic"],
  "properties": {
    "meta": {
      "type": "object",
      "required": ["type", "version"],
      "properties": {
        "type": { "const": "grass" },
        "version": { "const": "0.1" }
      },
      "additionalProperties": true
    },
    "intrinsic": {
      "type": "object",
      "required": ["heightCm", "color", "density"],
      "properties": {
        "heightCm": { "type": "number", "minimum": 0 },
        "color": { "type": "string" },
        "density": { "type": "string", "enum": ["low", "medium", "high"] }
      },
      "additionalProperties": false
    }
  },
  "additionalProperties": true
}
```

## 2. AEID System (AMAR Engine ID)

The AEID system is responsible for generating and managing unique identifiers for entities in the AME system.

### 2.1 Structure of AEID

- **Length**: Fixed-length unique identifier
- **Composition**: Prefix + timestamp + random number
- **Format**: String format to ensure global uniqueness

### 2.2 Generation of AEID

```typescript
class AEIDGenerator {
  generate(): string {
    // Generate prefix
    const prefix = 'AE';
    
    // Generate timestamp
    const timestamp = Date.now().toString(36);
    
    // Generate random number
    const random = Math.random().toString(36).substring(2, 10);
    
    // Combine to generate AEID
    return `${prefix}_${timestamp}_${random}`;
  }
}
```

### 2.3 Management of AEID

- **Registry**: Maintain a registry of all AEIDs
- **Verification**: Verify the validity and uniqueness of AEIDs
- **Parsing**: Parse information in AEIDs, such as generation time

### 2.4 Application of AEID

- **Entity Identification**: Assign a unique AEID to each entity
- **System Configuration**: Associate entity configurations with AEIDs
- **Data Storage**: Use AEIDs as keys for data storage

## 3. Skills System

The Skills system defines the operations and behaviors that entities can perform.

### 3.1 Definition of Skill

- **Name**: Unique identifier of the Skill
- **Description**: Functional description of the Skill
- **Parameters**: Parameters required for Skill execution
- **Return Value**: Return value of Skill execution
- **Dependencies**: Other Skills required for Skill execution

### 3.2 Classification of Skills

#### 3.2.1 Basic Skills

- **Definition**: Basic operations and behaviors
- **Examples**: Move, rotate, scale
- **Characteristics**: Do not depend on other Skills

#### 3.2.2 Composite Skills

- **Definition**: Complex operations composed of multiple basic Skills
- **Examples**: Grab, throw, open
- **Characteristics**: Depend on other Skills

### 3.3 Execution of Skills

```typescript
class SkillExecutor {
  execute(skillName: string, entityId: string, params: any): any {
    // Get Skill definition
    const skill = this.skillRegistry.get(skillName);
    
    // Validate parameters
    if (!this.skillValidator.validate(skill, params)) {
      throw new Error('Invalid parameters for skill');
    }
    
    // Execute Skill
    const result = skill.execute(entityId, params);
    
    // Return execution result
    return result;
  }
}
```

### 3.4 Management of Skills

- **Registry**: Maintain a registry of all Skills
- **Verification**: Verify the validity and parameters of Skills
- **Composition**: Combine multiple Skills to form composite Skills

## 4. Mesher System

The Mesher system is responsible for the generation, optimization, and verification of entity meshes.

### 4.1 Mesh Generation

- **From Point Cloud**: Generate meshes from 3DGS point clouds
- **From Parameters**: Generate procedural meshes based on parameters
- **From File**: Load meshes from files

### 4.2 Mesh Optimization

- **Simplification**: Reduce the complexity of meshes
- **Smoothing**: Smooth the surface of meshes
- **Repair**: Repair topological issues of meshes

### 4.3 Mesh Verification

- **Topological Verification**: Verify the topological structure of meshes
- **Geometric Verification**: Verify the geometric properties of meshes
- **Physical Verification**: Verify the physical properties of meshes

## 5. Admin (Normalization Center)

Admin is the hub of the AME system, responsible for data normalization, metaclass management, and entity instantiation.

### 5.1 Data Normalization

- **Temporal Consistency**: Ensure time synchronization of different data sources
- **Spatial Consistency**: Ensure spatial synchronization of different data sources
- **Semantic Consistency**: Ensure semantic consistency of different data sources

### 5.2 Metaclass Management

- **Metaclass Registry**: Maintain a complete metaclass system
- **Intelligent Classification**: Automatically determine which metaclass an entity should belong to based on input data
- **Metaclass Parameter Optimization**: Adjust metaclass parameters based on specific scenarios

### 5.3 Entity Instantiation

- **Final Decision**: Decide when and how to instantiate a physical entity
- **Physical Parameter Allocation**: Allocate specific physical parameters to entities
- **Behavioral Rule Setting**: Set behavioral rules for entities in different situations

## 6. AMAR GENIS (Physics Engine)

AMAR GENIS is the underlying physics engine of the AME system, responsible for physical simulation and entity behavior.

### 6.1 Solvers

- **RigidSolver**: Rigid body solver
- **MPMSolver**: Material point method solver
- **SPHSolver**: Smoothed particle hydrodynamics solver
- **PBDSolver**: Position-based dynamics solver
- **FEMSolver**: Finite element method solver
- **SFSolver**: Smoke fluid solver
- **ToolSolver**: Tool solver

### 6.2 Couplers

- **IPCCoupler**: Incremental potential contact based coupler
- **LegacyCoupler**: Traditional coupler
- **SAPCoupler**: Spatial hashing coupler

### 6.3 Sensors

- **Camera**: Camera sensor
- **IMU**: Inertial measurement unit sensor
- **Raycaster**: Ray casting sensor
- **ContactForce**: Contact force sensor
- **DepthCamera**: Depth camera sensor

### 6.4 Physical Handle Binding

- **Visual-Physical Layer Coupling**: Implement asynchronous coupling between 3DGS visual layer and physical collision layer
- **Topological Mutation Support**: Design real-time collision body reconstruction algorithm for 3DGS dynamic flow
- **Bidirectional Feedback**: Physical simulation results feed back to visual rendering

## 7. AME Scanner

AME Scanner is the 3DGS path executor of the AME system, responsible for spatial skeleton capture.

### 7.1 Density Collapse Processing

- **Non-linear Threshold Algorithm**: Strip visual phantoms and lock the "actual existence" of physical mass
- **Density Clustering**: Cluster point clouds into different density regions
- **Feature Extraction**: Extract features from density regions

### 7.2 OBB Fitting

- **PCA Analysis**: Perform principal component analysis on point clouds
- **Covariance Matrix Decomposition**: Extract the original rotation phase and scale of entities
- **Bounding Box Generation**: Generate oriented bounding boxes

### 7.3 Spatial Skeleton Capture

- **Density Weighted Sampling**: Sample space based on density
- **Skeleton Extraction**: Extract the spatial skeleton of entities
- **Geometric Constraint Generation**: Generate geometric constraints for entities

## 8. Media Input Path

The media input path is responsible for multimodal attribute tracing, providing sensory consistency for entities.

### 8.1 Image Processing

- **Image Analysis**: Analyze objects and scenes in images
- **Material Recognition**: Recognize surface materials of objects
- **Color Extraction**: Extract color information of objects

### 8.2 Video Processing

- **Motion Analysis**: Analyze motion in videos
- **Behavior Recognition**: Recognize behaviors of objects
- **Temporal Analysis**: Analyze temporal changes of objects

### 8.3 Audio Processing

- **Acoustic Signature Recognition**: Recognize acoustic features of objects
- **Environmental Audio Analysis**: Analyze audio features of the environment
- **Acoustic Impedance Calculation**: Calculate acoustic impedance of objects

## 9. LLM API Path

The LLM API path is responsible for metaclass definition and logic assignment, providing causality for entities.

### 9.1 Natural Language Processing

- **Semantic Understanding**: Understand semantics in natural language
- **Intent Recognition**: Recognize user intentions
- **Entity Extraction**: Extract entities from natural language

### 9.2 Metaclass Generation

- **Metaclass Definition**: Generate metaclass definitions based on natural language
- **Attribute Extraction**: Extract metaclass attributes from natural language
- **Behavioral Rule Generation**: Generate behavioral rules for metaclasses

### 9.3 Physical Constant Injection

- **Physical Parameter Extraction**: Extract physical parameters from natural language
- **Parameter Optimization**: Optimize physical parameters
- **Constant Injection**: Inject physical constants into metaclasses

## 10. Export Protocols

The AME system supports multiple export protocols for different application scenarios.

### 10.1 Oasis Domain (osdm)

- **Nature**: Folder structure specification
- **Core Purpose**: Distributed storage and distribution of interactive worlds
- **Features**: Supports complex scenes and entities

### 10.2 EME World (emewd)

- **Nature**: Binary single file
- **Core Purpose**: Specifically for logic training of EME projects (AI baby evolution project)
- **Features**: Can strip human display interfaces, focusing on logic training

---

These core concepts form the basic framework of the AME system. Through their collaborative work, the AME system can achieve realistic physical instantiation and create a digital ecosystem highly consistent with the real world.