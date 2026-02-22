# Skills Specification (Draft v1.0)

## 1. Overview

Skills are the "Virtual World API" of AMAR Engine. They provide a standardized way for AI to communicate construction intent to AME. Skills adopt a RESTful-style descriptive command set, enabling local AME to request "construction plans" from cloud-based LLMs.

## 2. Core Design Principles

- **Standardization**: Allows AI to understand how to describe virtual world scenes
- **Stateless**: Focuses on the "what" and "how" of object properties rather than temporal data
- **Modularity**: Each Skill focuses on a specific construction task
- **Extensibility**: Supports creating new construction capabilities by combining existing Skills
- **Practicality**: Only includes necessary functionality, avoiding "花瓶" (decorative) features

## 3. API Interface Specification

### 3.1 Basic URL Structure

```
/skills/{skill_type}/{action}
```

- `skill_type`: Skill type (e.g., `construction`, `modification`, `inspection`)
- `action`: Specific operation (e.g., `build_asset`, `modify_scene`, `validate_metaclass`)

### 3.2 Request Methods

- **GET**: Get Skill information or validate parameters
- **POST**: Execute construction operations
- **PUT**: Update existing assets or scenes
- **DELETE**: Delete assets or scene elements

### 3.3 Request Format

All requests use JSON format, containing the following fields:

```json
{
  "instruction": "Detailed construction instruction",
  "parameters": {
    "param1": "value1",
    "param2": "value2"
  },
  "context": {
    "aeid": "Optional AEID",
    "metaclasses": ["Related metaclasses"]
  }
}
```

### 3.4 Response Format

```json
{
  "status": "success" || "error",
  "message": "Operation result description",
  "data": {
    "result": "Operation result",
    "aeid": "Generated AEID",
    "skills_used": ["Used Skills list"]
  },
  "error": {
    "code": "Error code",
    "details": "Error details"
  }
}
```

## 4. Core Command Types

### 4.1 Construction Commands

#### 4.1.1 build_asset

**Function**: Build a single asset

**Parameters**:
- `name`: Asset name
- `description`: Asset description
- `metaclasses`: Metaclass list
- `geometry`: Geometry information (optional)
- `materials`: Material information (optional)

**Example**:

```json
{
  "instruction": "Create a red teacup",
  "parameters": {
    "name": "red_teacup",
    "description": "A red ceramic teacup",
    "metaclasses": ["Container", "Solid"],
    "materials": {
      "type": "ceramic",
      "color": "#FF0000"
    }
  }
}
```

#### 4.1.2 build_scene

**Function**: Build a complete scene

**Parameters**:
- `name`: Scene name
- `description`: Scene description
- `assets`: Asset list
- `environment`: Environment information (optional)

**Example**:

```json
{
  "instruction": "Create a simple kitchen scene",
  "parameters": {
    "name": "simple_kitchen",
    "description": "A scene containing basic kitchen items",
    "assets": [
      {
        "name": "countertop",
        "metaclasses": ["Solid", "Surface"]
      },
      {
        "name": "sink",
        "metaclasses": ["Container", "Solid"]
      }
    ]
  }
}
```

### 4.2 Modification Commands

#### 4.2.1 modify_asset

**Function**: Modify an existing asset

**Parameters**:
- `aeid`: Asset AEID
- `properties`: Properties to modify
- `metaclasses`: Metaclasses to add or remove

#### 4.2.2 modify_scene

**Function**: Modify an existing scene

**Parameters**:
- `aeid`: Scene AEID
- `add_assets`: Assets to add
- `remove_assets`: Assets to remove
- `reposition_assets`: Assets to reposition

### 4.3 Inspection Commands

#### 4.3.1 validate_metaclass

**Function**: Validate metaclass configuration

**Parameters**:
- `metaclass`: Metaclass definition
- `properties`: Metaclass properties

#### 4.3.2 inspect_asset

**Function**: Inspect asset information

**Parameters**:
- `aeid`: Asset AEID

## 5. Data Structure Definitions

### 5.1 Skill Definition

```json
{
  "id": "skill_unique_id",
  "name": "skill_name",
  "description": "skill_description",
  "type": "skill_type",
  "version": "1.0",
  "parameters": {
    "required": ["param1", "param2"],
    "optional": ["param3", "param4"]
  },
  "schema": {
    "type": "object",
    "properties": {
      "param1": { "type": "string" },
      "param2": { "type": "number" }
    },
    "required": ["param1", "param2"]
  }
}
```

### 5.2 Asset Definition

```json
{
  "aeid": "asset_aeid",
  "name": "asset_name",
  "description": "asset_description",
  "metaclasses": ["metaclass1", "metaclass2"],
  "geometry": {
    "type": "mesh",
    "source": "file_path_or_generation_method"
  },
  "materials": [
    {
      "type": "material_type",
      "properties": {
        "color": "#RRGGBB",
        "texture": "texture_path"
      }
    }
  ],
  "transform": {
    "position": [0, 0, 0],
    "rotation": [0, 0, 0],
    "scale": [1, 1, 1]
  }
}
```

### 5.3 Scene Definition

```json
{
  "aeid": "scene_aeid",
  "name": "scene_name",
  "description": "scene_description",
  "assets": ["asset_aeid1", "asset_aeid2"],
  "environment": {
    "lighting": {
      "type": "environment_light",
      "intensity": 1.0
    },
    "background": {
      "type": "skybox",
      "source": "skybox_path"
    }
  },
  "metadata": {
    "created_at": "timestamp",
    "version": "1.0"
  }
}
```

## 6. Example Skill Definitions

### 6.1 Build Teacup Skill

```json
{
  "id": "build_teacup",
  "name": "Build Teacup",
  "description": "Create a teacup asset",
  "type": "construction",
  "version": "1.0",
  "parameters": {
    "required": ["color"],
    "optional": ["material", "size"]
  },
  "schema": {
    "type": "object",
    "properties": {
      "color": { "type": "string" },
      "material": { "type": "string", "default": "ceramic" },
      "size": { "type": "string", "enum": ["small", "medium", "large"], "default": "medium" }
    },
    "required": ["color"]
  }
}
```

### 6.2 Build Kitchen Scene Skill

```json
{
  "id": "build_kitchen_scene",
  "name": "Build Kitchen Scene",
  "description": "Create a basic kitchen scene",
  "type": "construction",
  "version": "1.0",
  "parameters": {
    "required": [],
    "optional": ["style", "size"]
  },
  "schema": {
    "type": "object",
    "properties": {
      "style": { "type": "string", "enum": ["modern", "traditional", "minimalist"], "default": "modern" },
      "size": { "type": "string", "enum": ["small", "medium", "large"], "default": "medium" }
    }
  }
}
```

## 7. Implementation Notes

- **Keep it Simple**: Only implement necessary core functionality, avoid over-design
- **Modularity**: Each Skill should be independent and usable separately
- **Fault Tolerance**: Handle incomplete or ambiguous instructions from AI
- **Performance Considerations**: Local AME has limited resources, avoid overly complex calculations
- **Extensibility**: Design for future functionality expansion, but don't pre-implement unused features

## 8. Future Extensions

The following features are left for community contribution:

- Advanced physics simulation parameters
- Complex animation systems
- Advanced material and lighting systems
- Large-scale scene optimization
- Multi-language support

## 9. Version Control

- **Draft v1.0**: Initial version, defining core API and data structures
- **Future v1.1**: Improvements and extensions based on community feedback

## 10. Conclusion

Skills Specification (Draft v1.0) provides a basic framework for AI to interact with AMAR Engine, guiding the construction of virtual worlds. Through standardized APIs and data structures, we ensure the system's extensibility and interoperability while avoiding over-design and "decorative" features.