# 🛠️ AMAR Engine Foundation Plan

## 1. Core Protocol Definition Phase

### Skills Specification (Draft v1.0)
Define a RESTful-like descriptive command set that enables local AME (AMAR Engine) to request "construction plans" from cloud-based LLMs.

### Metaclass JSON Schema Design
Establish standard descriptions for object instincts. For example, define a "container metaclass" with fields for `volume` and `liquid_type` (fluid restrictions).

### AEID Naming Convention
Determine ID generation algorithm to ensure global uniqueness while embedding asset type information.

## 2. Local Toolkit Development

### Mesher Core Prototype
Implement the most basic generation path from multi-angle images to proper Mesh (non-point cloud/3DGS).

### Metaclass Injection Engine
Develop a lightweight parser capable of mounting metaclass properties onto local Meshes, enabling physical feedback in the AME preview environment.

### Local Storage System
Establish local asset library with support for exporting scenes as standard packages containing metaclass information.

## 3. Cloud & Database Prototype

### AEID Global Database Website
Create basic ID index page supporting simple asset upload, download, and ID query functionality.

### LLM Adapter
Develop cloud API forwarding layer that transforms user natural language descriptions into Skills specification format for return to local instances.