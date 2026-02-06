# Skills Library Documentation

## 1. 技能库概述

Skills Library是AMAR Engine的核心组件之一，它提供了一系列标准化的构建指令，使AI能够指导AME创建和修改虚拟世界资产与场景。本文档详细介绍了技能库的结构、使用方法和示例定义。

## 2. 技能库结构

技能库采用层级结构组织，按照功能类型和操作类别进行分类：

### 2.1 技能类型分类

- **construction**: 构建类技能，用于创建新的资产和场景
- **modification**: 修改类技能，用于修改现有资产和场景
- **inspection**: 检查类技能，用于验证和检查资产与场景
- **utility**: 工具类技能，提供辅助功能

### 2.2 技能文件结构

```
skills/
├── construction/
│   ├── build_asset.json
│   ├── build_scene.json
│   └── ...
├── modification/
│   ├── modify_asset.json
│   ├── modify_scene.json
│   └── ...
├── inspection/
│   ├── validate_metaclass.json
│   ├── inspect_asset.json
│   └── ...
└── utility/
    ├── convert_format.json
    ├── calculate_property.json
    └── ...
```

## 3. 技能定义格式

每个技能定义为一个JSON文件，包含以下字段：

### 3.1 核心字段

```json
{
  "id": "唯一技能ID",
  "name": "技能名称",
  "description": "技能描述",
  "type": "技能类型",
  "version": "技能版本",
  "parameters": {
    "required": ["必需参数列表"],
    "optional": ["可选参数列表"]
  },
  "schema": {
    "type": "object",
    "properties": {
      "参数名": { "type