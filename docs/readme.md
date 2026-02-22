AMAR Engine (AME)
AMAR Engine is a next-generation 3D tool designed to generate virtual worlds from both natural language descriptions and real-world captures. It serves as a decentralized operating system for virtual reality where the physical behavior of objects is governed by a unique Metaclass system.

Core Philosophy
Real Mesher, Not Just Models: Unlike NeRF or 3DGS, AME generates true geometric meshes. This ensures that every asset is a "solid" entity compatible with standard 3D environments.

Metaclass Logic: Properties are not inherited but composed. A Metaclass defines what an object is and what it can do (e.g., a "Container" Metaclass allows an object to hold liquid).

Decentralized Collaboration: AME is a local tool. It uses Cloud-based LLMs to guide the generation process via the Skills Library, overcoming local hardware limitations.

Global Identity (AEID): Every scene and asset is assigned a worldwide unique ID (AEID) for registration and tracking in a global database.

Technical Architecture
1. The Asset vs. The World
Assets: Individual entities (like a teacup) with specific Metaclass attributes.

Scenes: Entire worlds composed of multiple assets. All scenes are fully compatible and can be combined like meshes in Unreal Engine.

2. Generation Pipeline
Instruction (Skills Library): A RESTful-style specification that allows an AI to guide AME on how to build a scene or asset.

Reconstruction: Local AME processes camera footage (photos/videos) or generative prompts to output high-quality Meshes.

Attribution: Metaclass schemas are injected into the Mesh to define physical interactions without traditional class inheritance.

The Skills Specification (Core Protocol)
Skills are the "API of the Virtual World." Instead of rigid code, they provide a standardized way for AI to communicate construction intent to AME.

Standardization: Allows AI to understand how to describe virtual world scenes.

Stateless: Focuses on the "what" and "how" of an object's properties rather than temporal data.

Roadmap
[ ] Foundation: Define the Metaclass JSON Schema and the Skills RESTful specification.

[ ] Local Engine: Develop the core Mesher for image-to-mesh reconstruction.

[ ] Global Registry: Launch the AEID database website for asset indexing and sharing.

[ ] Ecosystem: Enable seamless scene composition where separate AEIDs function as a unified Metaverse.

Vision
"Pick the right direction, create miracles; it is not as difficult as reaching the heavens." — ceaserzhao

Repositories
Engine: Oasis-Company/AMAR-Engine

Metaclass: Oasis-Company/metaclass-prototype

License
This project is licensed under the GNU General Public License v3.0. See the LICENSE file for details.

Command Line Interface (ame)
AMAR Engine provides a command line interface (CLI) tool called `ame` for interacting with the engine.

### Installation
```bash
# Install dependencies
npm install

# Link the CLI tool (optional)
npm link
```

### Basic Usage
```bash
# Initialize AMAR Engine
ame init

# Check engine status
ame status

# Generate a new AEID
ame aeid generate --type asset

# List all registered metaclasses
ame metaclass list

# Register a new skill
ame skill register
```

### Available Commands

#### System Commands
- `ame init`: Initialize AMAR Engine
- `ame status`: Check AMAR Engine status

#### Metaclass Commands
- `ame metaclass register`: Register a new metaclass
- `ame metaclass list`: List all registered metaclasses
- `ame metaclass compose`: Compose multiple metaclasses

#### AEID Commands
- `ame aeid generate`: Generate a new AEID
- `ame aeid validate <aeid>`: Validate an AEID
- `ame aeid register <aeid>`: Register an AEID
- `ame aeid query <aeid>`: Query an AEID

#### Skill Commands
- `ame skill register`: Register a new skill
- `ame skill execute <skillId>`: Execute a skill
- `ame skill list`: List all registered skills

### Examples

#### Generate and Register an AEID
```bash
# Generate a new AEID for an asset
ame aeid generate --type asset

# Validate an AEID
ame aeid validate AST-202602070753-25224137-1EF6

# Register an AEID
ame aeid register AST-202602070753-25224137-1EF6
```

#### Register and Execute a Skill
```bash
# Register a new skill
ame skill register

# Execute a skill
ame skill execute create_asset

# List all skills
ame skill list
```

#### Manage Metaclasses
```bash
# Register a new metaclass
ame metaclass register

# List all metaclasses
ame metaclass list

# Compose multiple metaclasses
ame metaclass compose
```


# Advanced Technical Architecture

## AME Core System: AMAR GENIS

**Status: Prototype v0.1 | Mission: Physical Instantiation of Reality**

### I. Ontology (Existential Logic)
AME (Amar Engine) is not a traditional 3D rendering engine, but a reality mapping and physical reconstruction system. It "forcefully" instantiates entities with physical实权 (real authority) in the digital dimension through resampling of high-dimensional spatial point clouds and integration of multimodal semantic injection.

In AME's worldview, everything can be **Instantiated**, and physical laws are absolutely governed by the underlying AMAR GENIS engine.

### II. Triple-Path Convergence Architecture
AME's central hub is the **Admin** (Normalization Center). It acts like a digital black hole, collapsing data from three heterogeneous paths into a single physical entity:

#### 1. 3DGS Path [AME Scanner]
- **Function**: Spatial skeleton capture
- **Core Challenges**:
  - Density collapse processing: In million-level 3DGS point clouds, strip visual phantoms through non-linear threshold algorithms to lock onto the "actual existence" of physical mass
  - OBB (Oriented Bounding Box) fitting: Use PCA (Principal Component Analysis) to decompose the covariance matrix of point clouds, extracting the entity's original rotation phase $athbf{R}$ and scale $athbf{S}$
- **Output**: Provides geometric constraints for the entity

#### 2. Media Input Path [Media Loader]
- **Function**: Multimodal attribute sourcing
- **Input**: Cross-spectrum images, temporal videos, acoustic data
- **Output**: Determines the object's surface texture flow and acoustic impedance through visual comparison and acoustic inversion
- **Position**: Provides perceptual consistency for the entity

#### 3. LLM API Path [Semantic Coder]
- **Function**: Metaclass definition and logic赋予
- **Core Logic**: Convert natural language fragments into Metaclass descriptions
- **Injects physical constants** (e.g., $f$ friction coefficient, $
ho$ density distribution)
- **Position**: Provides causality for the entity

### III. The Metaclass Protocol
Metaclasses are the genetic genes of the AME system, with the following evolutionary logic:

**Evolutionary Trend**: Concrete → Abstract → Self-consistent

#### Root Metaclass
- **Definition**: Axioms of the physical world (e.g., space, time steps, smoothness)
- **Characteristics**: Non-instantiable, only serving as underlying weights for standard metaclasses

#### Standard Metaclass
- **Definition**: Entity templates with interaction potential (e.g., container, wheel, liquid)
- **Characteristics**: Possess concrete objects. When the Scanner sweeps out a volume and the Admin determines it belongs to "Standard Metaclass: Container", the volume immediately inherits the container's physical interaction interface

#### Manifestation (Room)
- Entity existence states in different coordinate systems (e.g., Cartesian Room, relative sensory Room)

### IV. Underlying Law: AMAR GENIS
AMAR GENIS is a reconstructed version of the Genesis engine after "violent disassembly". It is the physical judge of the AME world:

- **Physical Handle Binding**: Implements asynchronous coupling between the 3DGS visual layer and physical collision layer
- **Real-time Metaclass Injection**: AMAR GENIS directly parses metaclass tags issued by the Admin, enabling real-time changes to an object's physical constants without restarting the simulation
- **Topological Mutation Support**: Real-time collision body reconstruction algorithm designed for 3DGS dynamic flows

### V. Export Protocols
| Protocol Name | Abbreviation | Nature | Core Purpose |
|---------------|---------------|--------|-------------|
| Oasis Domains | osdm | Folder structure specification | Distributed storage and distribution of interactive worlds |
| EME World | emewd | Binary single file |专供 EME project (AI infant evolution project) logic training. Can strip human display interface |

### VI. Current Development Log
- **[Scanner]** Prototype v0.1 closed loop. Implemented high-performance point cloud density filtering based on C++
- **[Admin]** Defining SAP-01 normalization protocol
- **[AMAR GENIS]** Core layer rewriting scheme under discussion

"Reality is just a suggestion; AMAR GENIS is the law."