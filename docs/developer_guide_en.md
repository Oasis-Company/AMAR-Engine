# AMAR Engine Development Team Guide

This document aims to help the development team seamlessly integrate into the development work of the AMAR Engine (AME) system, providing detailed information on system architecture, component descriptions, development processes, and interface specifications.

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Core Components](#core-components)
3. [Development Process](#development-process)
4. [Interface Specifications](#interface-specifications)
5. [Deployment Guide](#deployment-guide)
6. [Team Collaboration](#team-collaboration)

## 1. System Architecture

The AME system adopts a triple-path recursive architecture, with Admin (Normalization Center) as the hub, collapsing data from three heterogeneous paths into a single physical entity:

### 1.1 Three Paths

1. **3DGS Path [AME Scanner]**
   - Function: Spatial skeleton capture
   - Core Technologies: Density collapse processing, OBB fitting
   - Output: Provides geometric constraints for entities

2. **Media Input Path [Media Loader]**
   - Function: Multimodal attribute tracing
   - Input: Cross-spectrum images, temporal videos, acoustic data
   - Output: Determines object surface material flow and acoustic impedance

3. **LLM API Path [Semantic Coder]**
   - Function: Metaclass definition and logic assignment
   - Core Logic: Converts natural language into Metaclass descriptions, injects physical constants
   - Output: Provides causality for entities

### 1.2 Component Relationships

- **AME Scanner**: Executor of the 3DGS path, generates geometric constraints
- **AMAR ENGINE**: Contains Admin (Normalization Center), responsible for data normalization, metaclass management, and entity instantiation
- **AMAR GENIS**: Underlying physics engine, responsible for physical simulation and entity behavior
- **metaclass-prototype**: Prototype implementation of the metaclass concept

## 2. Core Components

### 2.1 AME Scanner

**Directory**: `AME-Scanner/`

**Core Files**:
- `include/FieldLoader.h`: 3DGS data loading
- `include/ScanProbe.h`: Scan probe logic
- `include/SpatialGrid.h`: Spatial grid management
- `src/main.cpp`: Main entry point

**Development Focus**:
- Optimization of density collapse processing algorithms
- Improvement of OBB fitting accuracy
- Data interface specification with Admin

### 2.2 AMAR ENGINE

**Directory**: `AMAR-Engine/`

**Core Modules**:

#### 2.2.1 AEID System
- `src/core/aeid/AEIDGenerator.ts`: Generates unique identifiers
- `src/core/aeid/AEIDRegistry.ts`: Manages identifier registry
- `src/core/aeid/AEIDSystem.ts`: Core logic
- `src/core/aeid/AEIDValidator.ts`: Validates effectiveness

#### 2.2.2 Metaclass System
- `src/core/metaclass/MetaclassComposer.ts`: Composes multiple metaclasses
- `src/core/metaclass/MetaclassRegistry.ts`: Manages metaclass registry
- `src/core/metaclass/MetaclassSystem.ts`: Core logic
- `src/core/metaclass/MetaclassValidator.ts`: Validates effectiveness

#### 2.2.3 Skills System
- `src/core/skills/SkillExecutor.ts`: Executes skills
- `src/core/skills/SkillRegistry.ts`: Manages skill registry
- `src/core/skills/SkillValidator.ts`: Validates effectiveness
- `src/core/skills/SkillsSystem.ts`: Core logic

#### 2.2.4 Mesher System
- `src/core/mesher/MeshGenerator.ts`: Generates meshes
- `src/core/mesher/MeshOptimizer.ts`: Optimizes meshes
- `src/core/mesher/MeshValidator.ts`: Validates effectiveness
- `src/core/mesher/MesherSystem.ts`: Core logic

### 2.3 AMAR GENIS

**Directory**: `AMAR-GENIS/`

**Core Modules**:

#### 2.3.1 Engine Core
- `genesis/engine/simulator.py`: Scene-level simulation manager
- `genesis/engine/scene.py`: Scene management
- `genesis/engine/entities/base_entity.py`: Base entity class
- `genesis/engine/mesh.py`: Mesh management

#### 2.3.2 Solvers
- `genesis/engine/solvers/rigid_solver.py`: Rigid body solver
- `genesis/engine/solvers/mpm_solver.py`: Material point method solver
- `genesis/engine/solvers/sph_solver.py`: Smoothed particle hydrodynamics solver
- `genesis/engine/solvers/pbd_solver.py`: Position-based dynamics solver
- `genesis/engine/solvers/fem_solver.py`: Finite element method solver
- `genesis/engine/solvers/sf_solver.py`: Smoke fluid solver
- `genesis/engine/solvers/tool_solver.py`: Tool solver

#### 2.3.3 Couplers
- `genesis/engine/couplers/ipc_coupler.py`: Incremental potential contact-based coupler
- `genesis/engine/couplers/legacy_coupler.py`: Traditional coupler
- `genesis/engine/couplers/sap_coupler.py`: Spatial hashing coupler

### 2.4 metaclass-prototype

**Directory**: `metaclass-prototype/`

**Core Files**:
- `schema/metaclass.base.v0.1.json`: Basic metaclass definition
- `schema/grass.v0.1.json`: Grass metaclass definition
- `schema/water.v0.1.json`: Water metaclass definition
- Multi-language implementations: C++, Python, Rust, TypeScript

## 3. Development Process

### 3.1 Feature Development Process

1. **Requirement Analysis**: Clarify feature requirements and technical goals
2. **Design Phase**: Design module structure and interfaces
3. **Implementation Phase**: Write code to implement features
4. **Testing Phase**: Unit tests and integration tests
5. **Documentation Update**: Update related documentation
6. **Code Review**: Team code review
7. **Merge and Deployment**: Merge to main branch and deploy

### 3.2 Branch Management

- **main**: Main branch, stable version
- **develop**: Development branch, integrates new features
- **feature/xxx**: Feature branches, develop specific features
- **bugfix/xxx**: Fix branches, fix bugs
- **hotfix/xxx**: Emergency fix branches

### 3.3 Code Standards

- **TypeScript**: Follow ESLint and Prettier standards
- **Python**: Follow PEP 8 standard
- **C++**: Follow Google C++ Style Guide
- **Commit Messages**: Use semantic commit messages

## 4. Interface Specifications

### 4.1 AME Scanner Interface

**Input**:
- 3DGS point cloud data

**Output**:
```typescript
interface GSOutput {
  points: number[][];      // Processed point cloud data
  obb: {
    center: number[];       // OBB center point
    rotation: number[][];   // Rotation matrix
    extents: number[];      // Extents
  };
  density: number;          // Density information
  featureHash: string;      // Feature hash
}
```

### 4.2 Admin Interface

**Input**:
- GSOutput: Geometric constraints from AME Scanner
- MediaData: Multimodal data from Media Loader
- SemanticData: Metaclass description from Semantic Coder

**Output**:
```typescript
interface AdminOutput {
  entityId: string;         // Entity ID
  metaclass: string;        // Metaclass type
  properties: Record<string, any>; // Entity properties
  behaviors: string[];      // Behavior list
}
```

### 4.3 GENIS Interface

**Input**:
- AdminOutput: Entity description from Admin

**Output**:
```python
class EntityState:
    def __init__(self):
        self.position = [0.0, 0.0, 0.0]
        self.rotation = [0.0, 0.0, 0.0]
        self.velocity = [0.0, 0.0, 0.0]
        self.angular_velocity = [0.0, 0.0, 0.0]
        self.forces = [0.0, 0.0, 0.0]
```

## 5. Deployment Guide

### 5.1 Local Development Environment

#### AME-Scanner
- **Dependencies**: CMake, C++17
- **Build**:
  ```bash
  cd AME-Scanner
  mkdir build
  cd build
  cmake ..
  cmake --build .
  ```

#### AMAR-Engine
- **Dependencies**: Node.js 18+, npm
- **Build**:
  ```bash
  cd AMAR-Engine
  npm install
  npm run build
  ```

#### AMAR-GENIS
- **Dependencies**: Python 3.8+, pip
- **Build**:
  ```bash
  cd AMAR-GENIS
  pip install -e .
  ```

### 5.2 Containerized Deployment

**Dockerfile Example**:
```dockerfile
FROM node:18 AS engine
WORKDIR /app/AMAR-Engine
COPY AMAR-Engine/ .
RUN npm install && npm run build

FROM python:3.8 AS genis
WORKDIR /app/AMAR-GENIS
COPY AMAR-GENIS/ .
RUN pip install -e .

FROM ubuntu:20.04 AS scanner
WORKDIR /app/AME-Scanner
COPY AME-Scanner/ .
RUN apt-get update && apt-get install -y cmake g++
RUN mkdir build && cd build && cmake .. && cmake --build .

FROM ubuntu:20.04
WORKDIR /app
COPY --from=engine /app/AMAR-Engine /app/AMAR-Engine
COPY --from=genis /app/AMAR-GENIS /app/AMAR-GENIS
COPY --from=scanner /app/AME-Scanner /app/AME-Scanner

CMD ["bash"]
```

## 6. Team Collaboration

### 6.1 Communication Channels

- **Daily Communication**: Slack/Teams
- **Code Review**: GitHub Pull Requests
- **Document Collaboration**: Markdown documents
- **Project Management**: Jira/ Trello

### 6.2 Role Division

- **Frontend Development**: Responsible for the UI part of AMAR-Engine
- **Backend Development**: Responsible for the core logic of AMAR-Engine
- **Algorithm Development**: Responsible for algorithm optimization of AME-Scanner
- **Physics Engine Development**: Responsible for physical simulation of AMAR-GENIS
- **Metaclass System Development**: Responsible for the design and implementation of the metaclass system

### 6.3 Meeting Schedule

- **Daily Standup**: 15 minutes, sync progress
- **Weekly Meeting**: 1 hour, discuss plans and issues
- **Monthly Review**: 2 hours, review monthly progress

### 6.4 Knowledge Sharing

- **Technical Sharing**: Weekly technical sharing
- **Document Updates**: Timely update technical documentation
- **Code Comments**: Detailed code comments
- **Example Code**: Provide complete example code

## 7. Development Resources

### 7.1 Toolchain

- **Code Editors**: VS Code, PyCharm, CLion
- **Version Control**: Git, GitHub
- **Build Tools**: CMake, npm, pip
- **Testing Tools**: Jest, pytest, Google Test
- **Performance Analysis**: Chrome DevTools, Py-Spy

### 7.2 Learning Resources

- **3DGS Related**: Papers and documents
- **Physics Engine**: AMAR-GENIS documentation
- **Metaclass System**: metaclass-prototype documentation
- **TypeScript**: Official documentation
- **Python**: Official documentation
- **C++**: Official documentation

## 8. Common Issues

### 8.1 Technical Issues

**Q: How to handle 3DGS point cloud density collapse?**
A: Use non-linear threshold algorithm to strip visual phantoms and lock the "actual existence" of physical mass.

**Q: How to implement real-time metaclass injection?**
A: Add `update_metaclass()` method in entity class to dynamically update metaclass properties without restarting simulation.

**Q: How to optimize physical simulation performance?**
A: Utilize parallel computing and caching mechanisms to optimize critical paths.

### 8.2 Collaboration Issues

**Q: How to collaborate in cross-language development?**
A: Define clear interface specifications and use JSON for data exchange.

**Q: How to resolve dependency conflicts?**
A: Use containerized deployment to isolate dependencies of different components.

**Q: How to ensure code quality?**
A: Strict code review and testing processes.

## 9. Future Planning

### 9.1 Short-term Goals

- Complete MVP version, implementing the "upload -> recognition -> structured description" link
- Implement basic metaclass system
- Optimize density collapse processing of AME-Scanner

### 9.2 Medium-term Goals

- Implement complete triple-path recursive architecture
- Optimize physics engine integration
- Provide rich metaclass library

### 9.3 Long-term Goals

- Anytime, anywhere metaverse
- Implement real-time physical instantiation
- Support large-scale scenes
- Provide cloud services

---

This document will be continuously updated. For any questions or suggestions, please contact the development team.