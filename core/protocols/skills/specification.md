# Skills Specification (Draft v1.0)

## 1. 概述

Skills是AMAR Engine的"虚拟世界API"，它提供了一种标准化的方式，让AI能够向AME传达构建意图。Skills采用RESTful风格的描述性命令集，使本地AME能够从云LLM请求"构建计划"。

## 2. 核心设计原则

- **标准化**: 允许AI理解如何描述虚拟世界场景
- **无状态**: 关注对象属性的"是什么"和"如何做"，而不是时间数据
- **模块化**: 每个Skill专注于一个特定的构建任务
- **可扩展性**: 支持通过组合现有Skill创建新的构建能力
- **实用性**: 只包含必要的功能，避免"花瓶"功能

## 3. API接口规范

### 3.1 基础URL结构

```
/skills/{skill_type}/{action}
```

- `skill_type`: Skill类型（如`construction`、`modification`、`inspection`）
- `action`: 具体操作（如`build_asset`、`modify_scene`、`validate_metaclass`）

### 3.2 请求方法

- **GET**: 获取Skill信息或验证参数
- **POST**: 执行构建操作
- **PUT**: 更新现有资产或场景
- **DELETE**: 删除资产或场景元素

### 3.3 请求格式

所有请求使用JSON格式，包含以下字段：

```json
{
  "instruction": "详细的构建指令",
  "parameters": {
    "param1": "值1",
    "param2": "值2"
  },
  "context": {
    "aeid": "可选的AEID",
    "metaclasses": ["相关元类"]
  }
}
```

### 3.4 响应格式

```json
{
  "status": "success" || "error",
  "message": "操作结果描述",
  "data": {
    "result": "操作结果",
    "aeid": "生成的AEID",
    "skills_used": ["使用的Skill列表"]
  },
  "error": {
    "code": "错误代码",
    "details": "错误详情"
  }
}
```

## 4. 核心命令类型

### 4.1 构建命令 (Construction)

#### 4.1.1 build_asset

**功能**: 构建单个资产

**参数**:
- `name`: 资产名称
- `description`: 资产描述
- `metaclasses`: 元类列表
- `geometry`: 几何信息（可选）
- `materials`: 材质信息（可选）

**示例**:

```json
{
  "instruction": "创建一个红色的茶杯",
  "parameters": {
    "name": "red_teacup",
    "description": "一个红色的陶瓷茶杯",
    "metaclasses": ["Container", "Solid"],
    "materials": {
      "type": "ceramic",
      "color": "#FF0000"
    }
  }
}
```

#### 4.1.2 build_scene

**功能**: 构建完整场景

**参数**:
- `name`: 场景名称
- `description`: 场景描述
- `assets`: 资产列表
- `environment`: 环境信息（可选）

**示例**:

```json
{
  "instruction": "创建一个简单的厨房场景",
  "parameters": {
    "name": "simple_kitchen",
    "description": "一个包含基本厨房用品的场景",
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

### 4.2 修改命令 (Modification)

#### 4.2.1 modify_asset

**功能**: 修改现有资产

**参数**:
- `aeid`: 资产AEID
- `properties`: 要修改的属性
- `metaclasses`: 要添加或移除的元类

#### 4.2.2 modify_scene

**功能**: 修改现有场景

**参数**:
- `aeid`: 场景AEID
- `add_assets`: 要添加的资产
- `remove_assets`: 要移除的资产
- `reposition_assets`: 要重新定位的资产

### 4.3 检查命令 (Inspection)

#### 4.3.1 validate_metaclass

**功能**: 验证元类配置

**参数**:
- `metaclass`: 元类定义
- `properties`: 元类属性

#### 4.3.2 inspect_asset

**功能**: 检查资产信息

**参数**:
- `aeid`: 资产AEID

## 5. 数据结构定义

### 5.1 Skill定义

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

### 5.2 资产定义

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

### 5.3 场景定义

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

## 6. 示例Skill定义

### 6.1 构建茶杯Skill

```json
{
  "id": "build_teacup",
  "name": "Build Teacup",
  "description": "创建一个茶杯资产",
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

### 6.2 构建厨房场景Skill

```json
{
  "id": "build_kitchen_scene",
  "name": "Build Kitchen Scene",
  "description": "创建一个基本的厨房场景",
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

## 7. 实现注意事项

- **保持简单**: 只实现必要的核心功能，避免过度设计
- **模块化**: 每个Skill应该是独立的，可以单独使用
- **容错性**: 处理AI可能产生的不完整或模糊指令
- **性能考虑**: 本地AME资源有限，避免过于复杂的计算
- **可扩展性**: 设计时考虑未来功能扩展，但不预先实现未使用的功能

## 8. 未来扩展

以下功能留待社区贡献：

- 高级物理模拟参数
- 复杂动画系统
- 高级材质和光照系统
- 大规模场景优化
- 多语言支持

## 9. 版本控制

- **Draft v1.0**: 初始版本，定义核心API和数据结构
- **Future v1.1**: 基于社区反馈的改进和扩展

## 10. 结论

Skills Specification (Draft v1.0) 提供了一个基础框架，使AI能够与AMAR Engine交互，指导构建虚拟世界。通过标准化的API和数据结构，我们确保了系统的可扩展性和互操作性，同时避免了过度设计和"花瓶"功能。