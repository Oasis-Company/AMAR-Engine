# Metaclass JSON Schema Design

## 1. 元类概述

元类是AMAR Engine中定义对象本质和行为的核心概念。与传统的类继承不同，元类采用组合的方式定义对象的属性和行为。一个元类定义了一个对象是什么以及它能做什么（例如，"容器"元类允许对象容纳液体）。

## 2. 核心设计原则

- **组合而非继承**: 属性不是继承而来，而是通过组合元类来实现
- **模块化**: 每个元类专注于一个特定的功能或行为
- **可扩展性**: 支持通过组合现有元类创建新的行为
- **实用性**: 只包含必要的属性和行为，避免"花瓶"功能
- **标准化**: 采用JSON Schema进行标准化定义

## 3. 元类基础结构

### 3.1 基本结构

每个元类都有以下基本结构：

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

### 3.2 字段说明

- **id**: 元类的唯一标识符
- **name**: 元类的名称
- **description**: 元类的描述
- **version**: 元类的版本号
- **properties**: 元类的属性定义
- **behaviors**: 元类支持的行为列表
- **dependencies**: 元类依赖的其他元类

## 4. 基本元类定义

### 4.1 固体元类 (Solid)

定义具有固体特性的对象。

```json
{
  "id": "solid",
  "name": "Solid",
  "description": "定义具有固体特性的对象",
  "version": "1.0",
  "properties": {
    "mass": {
      "type": "number",
      "default": 1.0,
      "description": "物体质量（千克）"
    },
    "density": {
      "type": "number",
      "default": 1000.0,
      "description": "物体密度（千克/立方米）"
    },
    "hardness": {
      "type": "number",
      "default": 5.0,
      "description": "物体硬度（莫氏硬度）"
    },
    "fragility": {
      "type": "number",
      "default": 0.0,
      "description": "物体易碎性（0-1，0表示不易碎）"
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

### 4.2 容器元类 (Container)

定义可以容纳其他物体的对象。

```json
{
  "id": "container",
  "name": "Container",
  "description": "定义可以容纳其他物体的对象",
  "version": "1.0",
  "properties": {
    "capacity": {
      "type": "number",
      "default": 1.0,
      "description": "容器容量（升）"
    },
    "fill_level": {
      "type": "number",
      "default": 0.0,
      "description": "容器填充水平（0-1）"
    },
    "max_temperature": {
      "type": "number",
      "default": 100.0,
      "description": "容器最大耐受温度（摄氏度）"
    },
    "min_temperature": {
      "type": "number",
      "default": -20.0,
      "description": "容器最小耐受温度（摄氏度）"
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

### 4.3 液体元类 (Liquid)

定义具有液体特性的对象。

```json
{
  "id": "liquid",
  "name": "Liquid",
  "description": "定义具有液体特性的对象",
  "version": "1.0",
  "properties": {
    "volume": {
      "type": "number",
      "default": 1.0,
      "description": "液体体积（升）"
    },
    "density": {
      "type": "number",
      "default": 1000.0,
      "description": "液体密度（千克/立方米）"
    },
    "viscosity": {
      "type": "number",
      "default": 1.0,
      "description": "液体粘度（帕·秒）"
    },
    "temperature": {
      "type": "number",
      "default": 25.0,
      "description": "液体温度（摄氏度）"
    },
    "boiling_point": {
      "type": "number",
      "default": 100.0,
      "description": "液体沸点（摄氏度）"
    },
    "freezing_point": {
      "type": "number",
      "default": 0.0,
      "description": "液体冰点（摄氏度）"
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

### 4.4 表面元类 (Surface)

定义具有表面特性的对象。

```json
{
  "id": "surface",
  "name": "Surface",
  "description": "定义具有表面特性的对象",
  "version": "1.0",
  "properties": {
    "area": {
      "type": "number",
      "default": 1.0,
      "description": "表面积（平方米）"
    },
    "friction": {
      "type": "number",
      "default": 0.5,
      "description": "表面摩擦系数"
    },
    "roughness": {
      "type": "number",
      "default": 0.0,
      "description": "表面粗糙度（0-1，0表示光滑）"
    },
    "reflectivity": {
      "type": "number",
      "default": 0.1,
      "description": "表面反射率（0-1）"
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

### 4.5 可移动元类 (Movable)

定义可以移动的对象。

```json
{
  "id": "movable",
  "name": "Movable",
  "description": "定义可以移动的对象",
  "version": "1.0",
  "properties": {
    "max_velocity": {
      "type": "number",
      "default": 10.0,
      "description": "最大速度（米/秒）"
    },
    "acceleration": {
      "type": "number",
      "default": 1.0,
      "description": "加速度（米/秒²）"
    },
    "deceleration": {
      "type": "number",
      "default": 1.0,
      "description": "减速度（米/秒²）"
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

## 5. 复合元类示例

### 5.1 茶杯元类 (Teacup)

通过组合容器、固体和表面元类创建茶杯元类。

```json
{
  "id": "teacup",
  "name": "Teacup",
  "description": "定义茶杯对象",
  "version": "1.0",
  "properties": {
    "capacity": {
      "type": "number",
      "default": 0.25,
      "description": "茶杯容量（升）"
    },
    "mass": {
      "type": "number",
      "default": 0.3,
      "description": "茶杯质量（千克）"
    },
    "material": {
      "type": "string",
      "default": "ceramic",
      "description": "茶杯材质"
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

### 5.2 桌子元类 (Table)

通过组合固体和表面元类创建桌子元类。

```json
{
  "id": "table",
  "name": "Table",
  "description": "定义桌子对象",
  "version": "1.0",
  "properties": {
    "mass": {
      "type": "number",
      "default": 10.0,
      "description": "桌子质量（千克）"
    },
    "height": {
      "type": "number",
      "default": 0.75,
      "description": "桌子高度（米）"
    },
    "surface_area": {
      "type": "number",
      "default": 1.0,
      "description": "桌面面积（平方米）"
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

## 6. 元类属性类型

### 6.1 基本类型

- **string**: 字符串类型
- **number**: 数值类型（整数或浮点数）
- **boolean**: 布尔类型（true或false）
- **array**: 数组类型
- **object**: 对象类型

### 6.2 复合类型

- **range**: 范围类型，包含最小值和最大值
  ```json
  {
    "type": "range",
    "min": 0,
    "max": 100,
    "default": 50
  }
  ```

- **enum**: 枚举类型，包含可选值列表
  ```json
  {
    "type": "enum",
    "values": ["ceramic", "plastic", "glass", "metal"],
    "default": "ceramic"
  }
  ```

- **vector**: 向量类型，包含多个数值
  ```json
  {
    "type": "vector",
    "dimension": 3,
    "default": [0, 0, 0]
  }
  ```

## 7. 元类验证规则

### 7.1 基本验证

- **required**: 是否必需
- **min**: 最小值（数值类型）
- **max**: 最大值（数值类型）
- **minLength**: 最小长度（字符串类型）
- **maxLength**: 最大长度（字符串类型）
- **pattern**: 正则表达式模式（字符串类型）

### 7.2 依赖验证

- **dependsOn**: 依赖的其他属性
- **dependencyCondition**: 依赖条件

## 8. 元类组合机制

### 8.1 组合规则

1. **属性继承**: 组合元类时，子元类可以继承父元类的属性
2. **属性覆盖**: 子元类可以覆盖父元类的属性默认值
3. **行为组合**: 子元类继承所有父元类的行为
4. **依赖传递**: 子元类继承父元类的所有依赖

### 8.2 组合示例

```json
{
  "id": "advanced_container",
  "name": "Advanced Container",
  "description": "高级容器元类",
  "version": "1.0",
  "properties": {
    "capacity": {
      "type": "number",
      "default": 2.0,
      "description": "容器容量（升）"
    },
    "material": {
      "type": "string",
      "default": "metal",
      "description": "容器材质"
    }
  },
  "behaviors": [
    "temperature_regulation"
  ],
  "dependencies": ["container", "movable"]
}
```

## 9. 元类注册和管理

### 9.1 元类注册

每个元类都需要在元类注册表中注册，以便AME能够识别和使用它。

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

### 9.2 版本控制

元类采用语义化版本控制：

- **主版本**: 当元类结构发生不兼容的变化时增加
- **次版本**: 当添加新属性或行为但保持兼容性时增加
- **补丁版本**: 当修复错误但不影响结构时增加

## 10. 实现注意事项

- **保持简单**: 每个元类应专注于一个特定的功能或行为
- **避免冗余**: 避免在多个元类中重复定义相同的属性或行为
- **优先组合**: 优先通过组合现有元类创建新元类，而不是重新定义
- **验证属性**: 确保所有属性都有合理的默认值和验证规则
- **文档化**: 为每个元类提供详细的文档和使用示例

## 11. 未来扩展

以下功能留待社区贡献：

- **高级物理元类**: 支持更复杂的物理行为
- **智能元类**: 支持AI驱动的行为
- **生物元类**: 支持生物相关的行为和属性
- **能量元类**: 支持能量转换和存储
- **多语言支持**: 支持多语言的元类描述

## 12. 结论

Metaclass JSON Schema Design 提供了一个标准化的方式来定义对象的本质和行为。通过采用组合而非继承的方式，元类系统使得对象的属性和行为更加灵活和可扩展。

元类的设计遵循实用性原则，只包含必要的属性和行为，避免"花瓶"功能。对于复杂的功能，可以通过组合简单元类来实现，或者留给社区贡献。