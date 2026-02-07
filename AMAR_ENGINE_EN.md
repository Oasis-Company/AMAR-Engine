# AMAR Engine (AME)

## Overview
AMAR Engine is a next-generation 3D tool designed to generate virtual worlds from both natural language descriptions and real-world captures. It serves as a decentralized operating system for virtual reality where the physical behavior of objects is governed by a unique Metaclass system.

## Core Features

### Real Mesher, Not Just Models
Unlike NeRF or 3DGS, AME generates true geometric meshes. This ensures that every asset is a "solid" entity compatible with standard 3D environments.

### Metaclass Logic
Properties are not inherited but composed. A Metaclass defines what an object is and what it can do (e.g., a "Container" Metaclass allows an object to hold liquid).

### Decentralized Collaboration
AME is a local tool. It uses Cloud-based LLMs to guide the generation process via the Skills Library, overcoming local hardware limitations.

### Global Identity (AEID)
Every scene and asset is assigned a worldwide unique ID (AEID) for registration and tracking in a global database.

## Technical Architecture

### 1. The Asset vs. The World
- **Assets**: Individual entities (like a teacup) with specific Metaclass attributes.
- **Scenes**: Entire worlds composed of multiple assets. All scenes are fully compatible and can be combined like meshes in Unreal Engine.

### 2. Generation Pipeline
- **Instruction (Skills Library)**: A RESTful-style specification that allows an AI to guide AME on how to build a scene or asset.
- **Reconstruction**: Local AME processes camera footage (photos/videos) or generative prompts to output high-quality Meshes.
- **Attribution**: Metaclass schemas are injected into the Mesh to define physical interactions without traditional class inheritance.

### 3. Core Systems
- **Metaclass System**: Defines object properties and behaviors through composition.
- **AEID System**: Generates and manages globally unique identifiers for assets and scenes.
- **Skills System**: Provides a standardized way for AI to communicate construction intent.

## Quick Start

### Installation
```bash
# Clone the repository
git clone https://github.com/Oasis-Company/AMAR-Engine.git
cd AMAR-Engine

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

# Register a new metaclass
ame metaclass register

# Execute a skill
ame skill execute create_asset
```

## Command Line Interface

AMAR Engine provides a command line interface (CLI) tool called `ame` for interacting with the engine.

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

## Core Systems Guide

### Metaclass System
The Metaclass system is a fundamental component of AMAR Engine. It allows you to define what objects are and what they can do through composition rather than inheritance.

#### Creating a Metaclass
```javascript
const metaclass = {
  id: "container",
  name: "Container",
  description: "An object that can hold other objects or substances",
  version: "1.0.0",
  properties: {
    capacity: {
      type: "number",
      description: "Maximum capacity of the container",
      default: 1.0
    }
  },
  behaviors: ["hold_objects"],
  dependencies: []
};
```

### AEID System
The AEID (AMAR Engine ID) system generates globally unique identifiers for assets and scenes. These IDs are used for registration and tracking in a global database.

#### Generating an AEID
```javascript
const aeid = engine.getAEIDSystem().generateAEID("asset");
console.log(aeid); // Output: AST-202602070753-25224137-1EF6
```

### Skills System
The Skills system provides a standardized way for AI to communicate construction intent to AMAR Engine. It uses a RESTful-style specification.

#### Creating a Skill
```javascript
const skill = {
  id: "create_asset",
  name: "Create Asset",
  description: "Creates a new asset",
  version: "1.0.0",
  type: "create",
  parameters: {},
  schema: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Name of the asset"
      }
    },
    required: ["name"]
  }
};
```

## Development Guide

### Project Structure
```
AMAR-Engine/
├── src/
│   ├── core/            # Core systems
│   │   ├── metaclass/    # Metaclass system
│   │   ├── aeid/         # AEID system
│   │   ├── skills/       # Skills system
│   │   └── mesher/        # Mesher system (future)
│   ├── cli/             # Command line interface
│   ├── api/              # API interface (future)
│   ├── utils/            # Utility functions
│   └── index.ts          # Main entry point
├── public/               # Public assets
├── package.json          # Project configuration
└── README.md             # Project documentation
```

### Building the Project
```bash
# Build the project
npm run build

# Run type checking
npm run typecheck

# Run tests
npm test
```

## Contribution Guide

We welcome contributions to AMAR Engine! Please follow these guidelines:

1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Make your changes
4. Run the tests to ensure everything works correctly
5. Submit a pull request

### Code Style
- Follow TypeScript best practices
- Use descriptive variable and function names
- Add comments for complex logic
- Ensure your code passes type checking

## License

This project is licensed under the GNU General Public License v3.0. See the LICENSE file for details.

## Vision

"Pick the right direction, create miracles; it is not as difficult as reaching the heavens." — ceaserzhao

AMAR Engine aims to revolutionize the way we create and interact with virtual worlds. By combining natural language processing, computer vision