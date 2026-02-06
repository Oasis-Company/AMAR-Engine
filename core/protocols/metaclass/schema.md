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
