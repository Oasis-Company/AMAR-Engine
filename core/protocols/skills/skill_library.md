# Skills Library Documentation

## 1. 技能库概述

技能库是AMAR Engine中预定义的构建指令集合，它提供了标准化的方式来描述虚拟世界的构建任务。技能库中的每个技能都专注于一个特定的构建任务，通过组合这些技能，可以实现复杂的场景构建。

## 2. 技能分类

### 2.1 构建类技能 (Construction Skills)

用于创建新的资产或场景。

- **基础资产构建**
  - `build_primitive`: 创建基本几何体（立方体、球体、圆柱体等）
  - `build_container`: 创建容器类资产（杯子、碗、盒子等）
  - `build_furniture`: 创建家具类资产（桌子、椅子、沙发等）

- **场景构建**
  - `build_room`: 创建房间场景
  - `build_outdoor`: 创建户外场景
  - `build_urban`: 创建城市场景

### 2.2 修改类技能 (Modification Skills)

用于修改现有资产或场景。

- **资产修改**
  - `modify_shape`: 修改资产形状
  - `modify_material`: 修改资产材质
  - `modify_size`: 修改资产大小

- **场景修改**
  - `add_asset`: 向场景添加资产
  - `remove_asset`: 从场景移除资产
  - `reposition_asset`: 重新定位场景中的资产

### 2.3 检查类技能 (Inspection Skills)

用于验证和检查资产或场景。

- `validate_asset`: 验证资产是否符合规范
- `validate_scene`: 验证场景是否符合规范
- `inspect_metaclass`: 检查元类配置

## 3. 技能定义格式

每个技能都有以下定义格式：

```json
{
  "id": "skill_unique_id",
  "name": "技能名称",
  "description": "技能描述",
  "type": "技能类型",
  "version": "版本号",
  "parameters": {
    "required": ["必需参数1", "必需参数2"],
    "optional": ["可选参数1", "可选参数2"]
  },
  "schema": {
    "type": "object",
    "properties": {
      "参数名": {
        "type": "参数类型",
        "default": "默认值",
        "enum": ["可选值1", "可选值2"]
      }
    },
    "required": ["必需参数1", "必需参数2"]
  },
  "examples": [
    {
      "instruction": "示例指令",
      "parameters": {
        "参数1": "值1",
        "参数2": "值2"
      },
      "expected_result": "预期结果"
    }
  ]
}
```

## 4. 示例技能定义

### 4.1 构建基本几何体技能

```json
{
  "id": "build_primitive",
  "name": "Build Primitive",
  "description": "创建基本几何体资产",
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
        "description": "几何体形状"
      },
      "size": {
        "type": "object",
        "properties": {
          "x": { "type": "number", "default": 1.0 },
          "y": { "type": "number", "default": 1.0 },
          "z": { "type": "number", "default": 1.0 }
        },
        "description": "几何体尺寸"
      },
      "position": {
        "type": "array",
        "items": { "type": "number" },
        "minItems": 3,
        "maxItems": 3,
        "default": [0, 0, 0],
        "description": "几何体位置"
      },
      "rotation": {
        "type": "array",
        "items": { "type": "number" },
        "minItems": 3,
        "maxItems": 3,
        "default": [0, 0, 0],
        "description": "几何体旋转"
      },
      "material": {
        "type": "object",
        "properties": {
          "type": { "type": "string", "default": "plastic" },
          "color": { "type": "string", "default": "#FFFFFF" }
        },
        "description": "几何体材质"
      }
    },
    "required": ["shape", "size"]
  },
  "examples": [
    {
      "instruction": "创建一个红色的立方体",
      "parameters": {
        "shape": "cube",
        "size": { "x": 1, "y": 1, "z": 1 },
        "material": { "color": "#FF0000" }
      },
      "expected_result": "创建一个边长为1的红色立方体"
    },
    {
      "instruction": "创建一个蓝色的球体",
      "parameters": {
        "shape": "sphere",
        "size": { "x": 0.5, "y": 0.5, "z": 0.5 },
        "material": { "color": "#0000FF" }
      },
      "expected_result": "创建一个半径为0.5的蓝色球体"
    }
  ]
}
```

### 4.2 构建容器技能

```json
{
  "id": "build_container",
  "name": "Build Container",
  "description": "创建容器类资产",
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
        "description": "容器类型"
      },
      "capacity": {
        "type": "number",
        "description": "容器容量（升）"
      },
      "material": {
        "type": "string",
        "enum": ["ceramic", "plastic", "glass", "metal"],
        "default": "ceramic",
        "description": "容器材质"
      },
      "color": {
        "type": "string",
        "default": "#FFFFFF",
        "description": "容器颜色"
      },
      "size": {
        "type": "object",
        "properties": {
          "height": { "type": "number", "default": 0.1 },
          "diameter": { "type": "number", "default": 0.08 }
        },
        "description": "容器尺寸"
      }
    },
    "required": ["type", "capacity"]
  },
  "examples": [
    {
      "instruction": "创建一个红色的陶瓷茶杯",
      "parameters": {
        "type": "cup",
        "capacity": 0.25,
        "material": "ceramic",
        "color": "#FF0000"
      },
      "expected_result": "创建一个容量为0.25升的红色陶瓷茶杯"
    },
    {
      "instruction": "创建一个透明的玻璃花瓶",
      "parameters": {
        "type": "bottle",
        "capacity": 1.0,
        "material": "glass",
        "color": "#FFFFFF",
        "size": { "height": 0.3, "diameter": 0.1 }
      },
      "expected_result": "创建一个容量为1升的透明玻璃花瓶"
    }
  ]
}
```

### 4.3 构建房间场景技能

```json
{
  "id": "build_room",
  "name": "Build Room",
  "description": "创建房间场景",
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
        "description": "房间尺寸"
      },
      "purpose": {
        "type": "string",
        "enum": ["living", "bedroom", "kitchen", "office", "bathroom"],
        "description": "房间用途"
      },
      "style": {
        "type": "string",
        "enum": ["modern", "traditional", "minimalist", "industrial", "scandinavian"],
        "default": "modern",
        "description": "房间风格"
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
        "description": "房间家具"
      }
    },
    "required": ["size", "purpose"]
  },
  "examples": [
    {
      "instruction": "创建一个现代风格的客厅",
      "parameters": {
        "size": { "length": 5, "width": 4, "height": 2.8 },
        "purpose": "living",
        "style": "modern",
        "furniture": [
          {
            "name": "沙发",
            "type": "sofa",
            "position": [0, 0, 0]
          },
          {
            "name": "茶几",
            "type": "table",
            "position": [0, 0, 1.5]
          }
        ]
      },
      "expected_result": "创建一个5x4米的现代风格客厅，包含沙发和茶几"
    },
    {
      "instruction": "创建一个简约风格的卧室",
      "parameters": {
        "size": { "length": 4, "width": 3.5, "height": 2.8 },
        "purpose": "bedroom",
        "style": "minimalist"
      },
      "expected_result": "创建一个4x3.5米的简约风格卧室"
    }
  ]
}
```

## 3. 技能使用指南

### 3.1 基本使用流程

1. **选择技能**：从技能库中选择适合的技能
2. **设置参数**：根据构建需求设置技能参数
3. **执行技能**：通过API接口执行技能
4. **验证结果**：检查构建结果是否符合预期

### 3.2 技能组合示例

通过组合多个技能，可以实现复杂的场景构建：

```json
{
  "instruction": "创建一个带家具的现代风格客厅",
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

## 4. 技能库扩展

技能库是可扩展的，开发者可以通过以下方式扩展技能库：

1. **创建自定义技能**：根据特定需求创建新的技能
2. **修改现有技能**：根据实际使用情况修改现有技能
3. **贡献社区技能**：将自定义技能贡献到社区技能库

### 4.1 自定义技能创建指南

1. **确定技能类型**：选择适合的技能类型（构建、修改、检查）
2. **定义技能参数**：确定技能所需的必需参数和可选参数
3. **编写技能实现**：实现技能的核心逻辑
4. **测试技能**：验证技能是否正常工作
5. **文档化技能**：编写技能的详细文档

## 5. 技能库管理

### 5.1 版本控制

技能库采用语义化版本控制：

- **主版本**：当技能API发生不兼容的变化时增加
- **次版本**：当添加新功能但保持API兼容时增加
- **补丁版本**：当修复错误但不影响API时增加

### 5.2 技能库更新

技能库应定期更新，以适应新的构建需求和技术发展。更新时应注意保持向后兼容性，避免破坏现有技能的使用。

## 6. 最佳实践

- **专注于核心功能**：每个技能应专注于一个特定的构建任务
- **保持简单**：技能参数应尽可能简单，避免过度复杂的配置
- **提供默认值**：为可选参数提供合理的默认值，简化使用
- **添加示例**：为每个技能添加详细的使用示例，帮助用户理解
- **验证参数**：在执行技能前验证参数的有效性，避免错误
- **错误处理**：提供清晰的错误信息，帮助用户诊断问题

## 7. 结论

技能库是AMAR Engine的核心组件之一，它提供了标准化的方式来描述虚拟世界的构建任务。通过使用技能库，AI可以更有效地指导AME构建复杂的虚拟世界，同时保持构建过程的标准化和可重复性。

技能库的设计遵循实用性原则，只包含必要的功能，避免"花瓶"功能。对于复杂的功能，可以通过组合简单技能来实现，或者留给社区贡献。