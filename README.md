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