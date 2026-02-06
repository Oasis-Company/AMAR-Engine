# Metaclass JSON Schema Design

## 1. Metaclass Overview

Metaclasses are the core concept in AMAR Engine that define the nature and behavior of objects. Unlike traditional class inheritance, metaclasses define object properties and behaviors through composition. A metaclass defines what an object is and what it can do (e.g., a "Container" metaclass allows an object to hold liquid).

## 2. Core Design Principles

- **Composition over Inheritance**: Properties are not inherited but composed. A metaclass defines what an object is and what it can do.
- **Modularity**: Each metaclass focuses on a specific function or behavior.
- **Extensibility**: Supports creating new behaviors by combining existing metaclasses.
- **Practicality**: Only includes necessary properties and behaviors, avoiding "decorative" features.
- **Standardization**: Uses JSON Schema for standardized definition.

## 3. Metaclass Basic Structure

### 3.1 Basic Structure

Each metaclass has the following basic structure:

```json
{
  "id": "metaclass_unique_id",
  "name": "metaclass_name",
  "description": "metaclass_description",
  "version": "1.0",
  "properties": {
    "property1": {
      "type": "property_type",
      "default": "default_value",
      "description": "property_description"
    }
  },
  "behaviors": [
    "behavior1",
    "behavior2"
  ],
  "dependencies": [
    "dependency_metaclass_id"
  ]
}
```

### 3.2 Field Description

- **id**: Unique identifier for the metaclass
- **name**: Name of the metaclass
- **description**: Description of the metaclass
- **version**: Version number of the metaclass
- **properties**: Property definitions of the metaclass
- **behaviors**: List of behaviors supported by the metaclass
- **dependencies**: Other metaclasses that this metaclass depends on

## 4. Basic Metaclass Definitions

### 4.1 Solid Metaclass

Defines objects with solid properties.

```json
{
  "id": "solid",
  "name": "Solid",
  "description": "Defines objects with solid properties",
  "version": "1.0",
  "properties": {
    "mass": {
      "type": "number",
      "default": 1.0,
      "description": "Object mass (kilograms)"
    },
    "density": {
      "type": "number",
      "default": 1000.0,
      "description": "Object density (kilograms/cubic meter)"
    },
    "hardness": {
      "type": "number",
      "default": 5.0,
      "description": "Object hardness (Mohs scale)"
    },
    "fragility": {
      "type": "number",
      "default": 0.0,
      "description": "Object fragility (0-1, 0 means not fragile)"
    }
  },
  "behaviors": [
    "collision_detection",
    "static_physics",
    "support_weight"
  ],
  "dependencies": []
}
```

### 4.2 Container Metaclass

Defines objects that can hold other objects.

```json
{
  "id": "container",
  "name": "Container",
  "description": "Defines objects that can hold other objects",
  "version": "1.0",
  "properties": {
    "capacity": {
      "type": "number",
      "default": 1.0,
      "description": "Container capacity (liters)"
    },
    "fill_level": {
      "type": "number",
      "default": 0.0,
      "description": "Container fill level (0-1)"
    },
    "max_temperature": {
      "type": "number",
      "default": 100.0,
      "description": "Container maximum temperature tolerance (degrees Celsius)"
    },
    "min_temperature": {
      "type": "number",
      "default": -20.0,
      "description": "Container minimum temperature tolerance (degrees Celsius)"
    }
  },
  "behaviors": [
    "hold_objects",
    "spill_when_tipped",
    "measure_fill_level"
  ],
  "dependencies": ["solid"]
}
```

### 4.3 Liquid Metaclass

Defines objects with liquid properties.

```json
{
  "id": "liquid",
  "name": "Liquid",
  "description": "Defines objects with liquid properties",
  "version": "1.0",
  "properties": {
    "volume": {
      "type": "number",
      "default": 1.0,
      "description": "Liquid volume (liters)"
    },
    "density": {
      "type": "number",
      "default": 1000.0,
      "description": "Liquid density (kilograms/cubic meter)"
    },
    "viscosity": {
      "type": "number",
      "default": 1.0,
      "description": "Liquid viscosity (Pascal-seconds)"
    },
    "temperature": {
      "type": "number",
      "default": 25.0,
      "description": "Liquid temperature (degrees Celsius)"
    },
    "boiling_point": {
      "type": "number",
      "default": 100.0,
      "description": "Liquid boiling point (degrees Celsius)"
    },
    "freezing_point": {
      "type": "number",
      "default": 0.0,
      "description": "Liquid freezing point (degrees Celsius)"
    }
  },
  "behaviors": [
    "flow",
    "take_container_shape",
    "evaporate",
    "freeze"
  ],
  "dependencies": []
}
```

### 4.4 Surface Metaclass

Defines objects with surface properties.

```json
{
  "id": "surface",
  "name": "Surface",
  "description": "Defines objects with surface properties",
  "version": "1.0",
  "properties": {
    "area": {
      "type": "number",
      "default": 1.0,
      "description": "Surface area (square meters)"
    },
    "friction": {
      "type": "number",
      "default": 0.5,
      "description": "Surface friction coefficient"
    },
    "roughness": {
      "type": "number",
      "default": 0.0,
      "description": "Surface roughness (0-1, 0 means smooth)"
    },
    "reflectivity": {
      "type": "number",
      "default": 0.1,
      "description": "Surface reflectivity (0-1)"
    }
  },
  "behaviors": [
    "support_objects",
    "reflect_light",
    "generate_friction"
  ],
  "dependencies": ["solid"]
}
```

### 4.5 Movable Metaclass

Defines objects that can move.

```json
{
  "id": "movable",
  "name": "Movable",
  "description": "Defines objects that can move",
  "version": "1.0",
  "properties": {
    "max_velocity": {
      "type": "number",
      "default": 10.0,
      "description": "Maximum velocity (meters/second)"
    },
    "acceleration": {
      "type": "number",
      "default": 1.0,
      "description": "Acceleration (meters/second²)"
    },
    "deceleration": {
      "type": "number",
      "default": 1.0,
      "description": "Deceleration (meters/second²)"
    }
  },
  "behaviors": [
    "move",
    "accelerate",
    "decelerate",
    "collide"
  ],
  "dependencies": ["solid"]
}
```

## 5. Composite Metaclass Examples

### 5.1 Teacup Metaclass

Create a teacup metaclass by combining container, solid, and surface metaclasses.

```json
{
  "id": "teacup",
  "name": "Teacup",
  "description": "Defines teacup objects",
  "version": "1.0",
  "properties": {
    "capacity": {
      "type": "number",
      "default": 0.25,
      "description": "Teacup capacity (liters)"
    },
    "mass": {
      "type": "number",
      "default": 0.3,
      "description": "Teacup mass (kilograms)"
    },
    "material": {
      "type": "string",
      "default": "ceramic",
      "description": "Teacup material"
    }
  },
  "behaviors": [
    "hold_liquid",
    "support_weight",
    "spill_when_tipped"
  ],
  "dependencies": ["container", "solid", "surface"]
}
```

### 5.2 Table Metaclass

Create a table metaclass by combining solid and surface metaclasses.

```json
{
  "id": "table",
  "name": "Table",
  "description": "Defines table objects",
  "version": "1.0",
  "properties": {
    "mass": {
      "type": "number",
      "default": 10.0,
      "description": "Table mass (kilograms)"
    },
    "height": {
      "type": "number",
      "default": 0.75,
      "description": "Table height (meters)"
    },
    "surface_area": {
      "type": "number",
      "default": 1.0,
      "description": "Table surface area (square meters)"
    }
  },
  "behaviors": [
    "support_weight",
    "hold_objects",
    "generate_friction"
  ],
  "dependencies": ["solid", "surface"]
}
```

## 6. Metaclass Property Types

### 6.1 Basic Types

- **string**: String type
- **number**: Numeric type (integer or floating-point)
- **boolean**: Boolean type (true or false)
- **array**: Array type
- **object**: Object type

### 6.2 Composite Types

- **range**: Range type, including minimum and maximum values
  ```json
  {
    "type": "range",
    "min": 0,
    "max": 100,
    "default": 50
  }
  ```

- **enum**: Enum type, including optional value list
  ```json
  {
    "type": "enum",
    "values": ["ceramic", "plastic", "glass", "metal"],
    "default": "ceramic"
  }
  ```

- **vector**: Vector type, including multiple numeric values
  ```json
  {
    "type": "vector",
    "dimension": 3,
    "default": [0, 0, 0]
  }
  ```

## 7. Metaclass Validation Rules

### 7.1 Basic Validation

- **required**: Whether it is required
- **min**: Minimum value (numeric type)
- **max**: Maximum value (numeric type)
- **minLength**: Minimum length (string type)
- **maxLength**: Maximum length (string type)
- **pattern**: Regular expression pattern (string type)

### 7.2 Dependency Validation

- **dependsOn**: Other properties it depends on
- **dependencyCondition**: Dependency condition

## 8. Metaclass Composition Mechanism

### 8.1 Composition Rules

1. **Property Inheritance**: When composing metaclasses, child metaclasses can inherit properties from parent metaclasses
2. **Property Override**: Child metaclasses can override default values of parent metaclass properties
3. **Behavior Composition**: Child metaclasses inherit all behaviors from parent metaclasses
4. **Dependency Transmission**: Child metaclasses inherit all dependencies from parent metaclasses

### 8.2 Composition Example

```json
{
  "id": "advanced_container",
  "name": "Advanced Container",
  "description": "Advanced container metaclass",
  "version": "1.0",
  "properties": {
    "capacity": {
      "type": "number",
      "default": 2.0,
      "description": "Container capacity (liters)"
    },
    "material": {
      "type": "string",
      "default": "metal",
      "description": "Container material"
    }
  },
  "behaviors": [
    "temperature_regulation"
  ],
  "dependencies": ["container", "movable"]
}
```

## 9. Metaclass Registration and Management

### 9.1 Metaclass Registration

Each metaclass needs to be registered in the metaclass registry so that AME can recognize and use it.

```json
{
  "metaclasses": [
    {
      "id": "solid",
      "name": "Solid",
      "version": "1.0",
      "path": "metaclasses/solid.json"
    },
    {
      "id": "container",
      "name": "Container",
      "version": "1.0",
      "path": "metaclasses/container.json"
    }
  ]
}
```

### 9.2 Version Control

Metaclasses use semantic versioning:

- **Major Version**: Increased when incompatible changes are made to the metaclass structure
- **Minor Version**: Increased when new properties or behaviors are added while maintaining compatibility
- **Patch Version**: Increased when errors are fixed without affecting the structure

## 10. Implementation Notes

- **Keep it Simple**: Each metaclass should focus on a specific function or behavior
- **Avoid Redundancy**: Avoid repeating the same properties or behaviors in multiple metaclasses
- **Prioritize Composition**: Prioritize creating new metaclasses by composing existing ones rather than redefining
- **Validate Properties**: Ensure all properties have reasonable default values and validation rules
- **Document**: Provide detailed documentation and usage examples for each metaclass

## 11. Future Extensions

The following features are left for community contribution:

- **Advanced Physics Metaclasses**: Support more complex physical behaviors
- **Intelligent Metaclasses**: Support AI-driven behaviors
- **Biological Metaclasses**: Support biology-related behaviors and properties
- **Energy Metaclasses**: Support energy conversion and storage
- **Multi-language Support**: Support multi-language metaclass descriptions

## 12. Conclusion

Metaclass JSON Schema Design provides a standardized way to define the nature and behavior of objects. By adopting composition over inheritance, the metaclass system makes object properties and behaviors more flexible and extensible.

The design of metaclasses follows the principle of practicality, only including necessary properties and behaviors and avoiding "decorative" features. For complex functionality, it can be achieved by composing simple metaclasses or left to community contributions.