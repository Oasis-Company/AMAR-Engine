# Skills Library Documentation

## 1. Skills Library Overview

The Skills Library is a collection of predefined construction instructions in AMAR Engine. It provides a standardized way to describe virtual world construction tasks. Each skill in the library focuses on a specific construction task, and by combining these skills, complex scene construction can be achieved.

## 2. Skill Categories

### 2.1 Construction Skills

Used to create new assets or scenes.

- **Basic Asset Construction**
  - `build_primitive`: Create basic geometric shapes (cubes, spheres, cylinders, etc.)
  - `build_container`: Create container assets (cups, bowls, boxes, etc.)
  - `build_furniture`: Create furniture assets (tables, chairs, sofas, etc.)

- **Scene Construction**
  - `build_room`: Create room scenes
  - `build_outdoor`: Create outdoor scenes
  - `build_urban`: Create urban scenes

### 2.2 Modification Skills

Used to modify existing assets or scenes.

- **Asset Modification**
  - `modify_shape`: Modify asset shape
  - `modify_material`: Modify asset material
  - `modify_size`: Modify asset size

- **Scene Modification**
  - `add_asset`: Add assets to a scene
  - `remove_asset`: Remove assets from a scene
  - `reposition_asset`: Reposition assets in a scene

### 2.3 Inspection Skills

Used to validate and inspect assets or scenes.

- `validate_asset`: Validate if an asset conforms to specifications
- `validate_scene`: Validate if a scene conforms to specifications
- `inspect_metaclass`: Inspect metaclass configuration

## 3. Skill Definition Format

Each skill has the following definition format:

```json
{
  "id": "skill_unique_id",
  "name": "skill_name",
  "description": "skill_description",
  "type": "skill_type",
  "version": "1.0",
  "parameters": {
    "required": ["required_param1", "required_param2"],
    "optional": ["optional_param1", "optional_param2"]
  },
  "schema": {
    "type": "object",
    "properties": {
      "param_name": {
        "type": "param_type",
        "default": "default_value",
        "enum": ["option1", "option2"]
      }
    },
    "required": ["required_param1", "required_param2"]
  },
  "examples": [
    {
      "instruction": "example_instruction",
      "parameters": {
        "param1": "value1",
        "param2": "value2"
      },
      "expected_result": "expected_result"
    }
  ]
}
```

## 4. Example Skill Definitions

### 4.1 Build Primitive Skill

```json
{
  "id": "build_primitive",
  "name": "Build Primitive",
  "description": "Create basic geometric shape assets",
  "type": "construction",
  "version": "1.0",
  "parameters": {
    "required": ["shape", "size"],
    "optional": ["position", "rotation", "material"]
  },
  "schema": {
    "type": "object",
    "properties": {
      "shape": {
        "type": "string",
        "enum": ["cube", "sphere", "cylinder", "cone", "torus"],
        "description": "Geometry shape"
      },
      "size": {
        "type": "object",
        "properties": {
          "x": { "type": "number", "default": 1.0 },
          "y": { "type": "number", "default": 1.0 },
          "z": { "type": "number", "default": 1.0 }
        },
        "description": "Geometry size"
      },
      "position": {
        "type": "array",
        "items": { "type": "number" },
        "minItems": 3,
        "maxItems": 3,
        "default": [0, 0, 0],
        "description": "Geometry position"
      },
      "rotation": {
        "type": "array",
        "items": { "type": "number" },
        "minItems": 3,
        "maxItems": 3,
        "default": [0, 0, 0],
        "description": "Geometry rotation"
      },
      "material": {
        "type": "object",
        "properties": {
          "type": { "type": "string", "default": "plastic" },
          "color": { "type": "string", "default": "#FFFFFF" }
        },
        "description": "Geometry material"
      }
    },
    "required": ["shape", "size"]
  },
  "examples": [
    {
      "instruction": "Create a red cube",
      "parameters": {
        "shape": "cube",
        "size": { "x": 1, "y": 1, "z": 1 },
        "material": { "color": "#FF0000" }
      },
      "expected_result": "Create a red cube with side length 1"
    },
    {
      "instruction": "Create a blue sphere",
      "parameters": {
        "shape": "sphere",
        "size": { "x": 0.5, "y": 0.5, "z": 0.5 },
        "material": { "color": "#0000FF" }
      },
      "expected_result": "Create a blue sphere with radius 0.5"
    }
  ]
}
```

### 4.2 Build Container Skill

```json
{
  "id": "build_container",
  "name": "Build Container",
  "description": "Create container assets",
  "type": "construction",
  "version": "1.0",
  "parameters": {
    "required": ["type", "capacity"],
    "optional": ["material", "color", "size"]
  },
  "schema": {
    "type": "object",
    "properties": {
      "type": {
        "type": "string",
        "enum": ["cup", "bowl", "box", "bottle", "bucket"],
        "description": "Container type"
      },
      "capacity": {
        "type": "number",
        "description": "Container capacity (liters)"
      },
      "material": {
        "type": "string",
        "enum": ["ceramic", "plastic", "glass", "metal"],
        "default": "ceramic",
        "description": "Container material"
      },
      "color": {
        "type": "string",
        "default": "#FFFFFF",
        "description": "Container color"
      },
      "size": {
        "type": "object",
        "properties": {
          "height": { "type": "number", "default": 0.1 },
          "diameter": { "type": "number", "default": 0.08 }
        },
        "description": "Container size"
      }
    },
    "required": ["type", "capacity"]
  },
  "examples": [
    {
      "instruction": "Create a red ceramic teacup",
      "parameters": {
        "type": "cup",
        "capacity": 0.25,
        "material": "ceramic",
        "color": "#FF0000"
      },
      "expected_result": "Create a red ceramic teacup with capacity 0.25 liters"
    },
    {
      "instruction": "Create a transparent glass vase",
      "parameters": {
        "type": "bottle",
        "capacity": 1.0,
        "material": "glass",
        "color": "#FFFFFF",
        "size": { "height": 0.3, "diameter": 0.1 }
      },
      "expected_result": "Create a transparent glass vase with capacity 1 liter"
    }
  ]
}
```

### 4.3 Build Room Scene Skill

```json
{
  "id": "build_room",
  "name": "Build Room",
  "description": "Create room scenes",
  "type": "construction",
  "version": "1.0",
  "parameters": {
    "required": ["size", "purpose"],
    "optional": ["style", "furniture"]
  },
  "schema": {
    "type": "object",
    "properties": {
      "size": {
        "type": "object",
        "properties": {
          "length": { "type": "number" },
          "width": { "type": "number" },
          "height": { "type": "number", "default": 2.8 }
        },
        "description": "Room size"
      },
      "purpose": {
        "type": "string",
        "enum": ["living", "bedroom", "kitchen", "office", "bathroom"],
        "description": "Room purpose"
      },
      "style": {
        "type": "string",
        "enum": ["modern", "traditional", "minimalist", "industrial", "scandinavian"],
        "default": "modern",
        "description": "Room style"
      },
      "furniture": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "name": { "type": "string" },
            "type": { "type": "string" },
            "position": {
              "type": "array",
              "items": { "type": "number" },
              "minItems": 3,
              "maxItems": 3
            }
          }
        },
        "description": "Room furniture"
      }
    },
    "required": ["size", "purpose"]
  },
  "examples": [
    {
      "instruction": "Create a modern style living room",
      "parameters": {
        "size": { "length": 5, "width": 4, "height": 2.8 },
        "purpose": "living",
        "style": "modern",
        "furniture": [
          {
            "name": "sofa",
            "type": "sofa",
            "position": [0, 0, 0]
          },
          {
            "name": "coffee table",
            "type": "table",
            "position": [0, 0, 1.5]
          }
        ]
      },
      "expected_result": "Create a 5x4 meter modern style living room with sofa and coffee table"
    },
    {
      "instruction": "Create a minimalist style bedroom",
      "parameters": {
        "size": { "length": 4, "width": 3.5, "height": 2.8 },
        "purpose": "bedroom",
        "style": "minimalist"
      },
      "expected_result": "Create a 4x3.5 meter minimalist style bedroom"
    }
  ]
}
```

## 3. Skills Usage Guide

### 3.1 Basic Usage Flow

1. **Select Skill**: Choose the appropriate skill from the skills library
2. **Set Parameters**: Set skill parameters according to construction needs
3. **Execute Skill**: Execute the skill through the API interface
4. **Validate Result**: Check if the construction result meets expectations

### 3.2 Skill Combination Example

By combining multiple skills, complex scene construction can be achieved:

```json
{
  "instruction": "Create a modern style living room with furniture",
  "skills": [
    {
      "id": "build_room",
      "parameters": {
        "size": { "length": 5, "width": 4, "height": 2.8 },
        "purpose": "living",
        "style": "modern"
      }
    },
    {
      "id": "build_furniture",
      "parameters": {
        "type": "sofa",
        "style": "modern",
        "position": [0, 0, 0]
      }
    },
    {
      "id": "build_furniture",
      "parameters": {
        "type": "table",
        "style": "modern",
        "position": [0, 0, 1.5]
      }
    },
    {
      "id": "build_furniture",
      "parameters": {
        "type": "tv_stand",
        "style": "modern",
        "position": [0, 0, -2]
      }
    }
  ]
}
```

## 4. Skills Library Extension

The skills library is extensible, and developers can extend it through the following methods:

1. **Create Custom Skills**: Create new skills according to specific needs
2. **Modify Existing Skills**: Modify existing skills according to actual usage
3. **Contribute Community Skills**: Contribute custom skills to the community skills library

### 4.1 Custom Skill Creation Guide

1. **Determine Skill Type**: Choose the appropriate skill type (construction, modification, inspection)
2. **Define Skill Parameters**: Determine the required and optional parameters for the skill
3. **Implement Skill Logic**: Implement the core logic of the skill
4. **Test Skill**: Verify if the skill works correctly
5. **Document Skill**: Write detailed documentation for the skill

## 5. Skills Library Management

### 5.1 Version Control

The skills library uses semantic versioning:

- **Major Version**: Increased when incompatible changes are made to the skill API
- **Minor Version**: Increased when new features are added while maintaining API compatibility
- **Patch Version**: Increased when errors are fixed without affecting the API

### 5.2 Skills Library Updates

The skills library should be updated regularly to adapt to new construction needs and technological developments. When updating, attention should be paid to maintaining backward compatibility to avoid breaking existing skill usage.

## 6. Best Practices

- **Focus on Core Functionality**: Each skill should focus on a specific construction task
- **Keep it Simple**: Skill parameters should be as simple as possible, avoiding overly complex configurations
- **Provide Default Values**: Provide reasonable default values for optional parameters to simplify usage
- **Add Examples**: Add detailed usage examples for each skill to help users understand
- **Validate Parameters**: Validate parameter validity before executing skills to avoid errors
- **Error Handling**: Provide clear error messages to help users diagnose problems

## 7. Conclusion

The Skills Library is one of the core components of AMAR Engine, providing a standardized way to describe virtual world construction tasks. By using the Skills Library, AI can more effectively guide AME to build complex virtual worlds while maintaining the standardization and reproducibility of the construction process.

The design of the Skills Library follows the principle of practicality, only including necessary functionality and avoiding "decorative" features. For complex functionality, it can be achieved by combining simple skills or left to community contributions.