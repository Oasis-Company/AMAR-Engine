# AMAR Engine 核心概念

本文档详细介绍 AMAR Engine (AME) 系统中的核心概念，包括元类系统、AEID 系统、Skills 系统等。

## 1. 元类系统 (The Metaclass Protocol)

元类是 AME 系统的遗传基因，定义了实体的物理属性和行为规则。

### 1.1 元类的演化逻辑

**演化趋势**：具体 → 抽象 → 自洽

- **具体**：从现实世界的具体物体中提取特征和规则
- **抽象**：将具体特征抽象为通用规则和属性
- **自洽**：形成内部逻辑一致、能自我演化的系统

### 1.2 元类的分类

#### 1.2.1 根元类 (Root Metaclass)

- **定义**：物理世界的公理和基本规则
- **示例**：空间、时间步、光滑度
- **特性**：
  - 不可实例化，没有具体对象
  - 仅作为标准元类的底层权重和约束
  - 构成物理世界的基本框架

#### 1.2.2 标准元类 (Standard Metaclass)

- **定义**：具备交互潜力的实体模板
- **示例**：容器、轮子、液体、固体
- **特性**：
  - 拥有具体对象（Object）
  - 当 Scanner 扫出一个体积，Admin 判定其属于某个标准元类时，该体积立即继承该元类的物理交互接口
  - 包含具体的物理参数，如密度、摩擦系数等

### 1.3 元类的表现形式

#### Room (表现空间)

- **定义**：实体在不同坐标系下的存在状态
- **示例**：
  - 笛卡尔坐标系中的表现
  - 相对感官坐标系中的表现
- **作用**：提供不同视角下的实体描述，确保实体在不同观察框架下的一致性

### 1.4 元类的核心属性

#### 1.4.1 物理参数

- **基础属性**：密度 ($\rho$)、质量 ($m$)、体积 ($V$)
- **交互属性**：摩擦系数 ($f$)、弹性模量 ($E$)、泊松比 ($\nu$)
- **动态属性**：阻尼系数、惯性张量

#### 1.4.2 语义参数

- **功能描述**：实体的用途和功能
- **行为规则**：实体在不同情况下的行为模式
- **交互逻辑**：与其他实体的交互方式

### 1.5 元类的工作机制

#### 1.5.1 元类绑定过程

1. **数据输入**：Admin 接收来自三条路径的异构数据
2. **特征提取**：从数据中提取实体的几何、材质和语义特征
3. **元类匹配**：将提取的特征与元类库中的标准元类进行匹配
4. **参数优化**：根据具体场景和上下文优化元类参数
5. **绑定确认**：最终确定实体的元类和具体参数

#### 1.5.2 元类继承与组合

- **单一继承**：一个实体通常继承自一个主要的标准元类
- **多重组合**：实体可以同时具备多个元类的特征，通过组合方式实现
- **参数覆盖**：具体场景中的参数可以覆盖元类的默认参数

### 1.6 元类的实现

#### 1.6.1 JSON Schema 定义

基础元类定义示例：

```json
{
  "$id": "https://example.org/metaverse/schema/metaclass.base.v0.1.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Metaclass Base v0.1",
  "type": "object",
  "required": ["meta"],
  "properties": {
    "meta": {
      "type": "object",
      "required": ["type", "version"],
      "properties": {
        "type": {
          "type": "string",
          "description": "Metaclass identifier, e.g., 'grass', 'water'"
        },
        "version": {
          "type": "string",
          "description": "Schema version for this metaclass instance, e.g., '0.1'"
        },
        "tags": {
          "type": "array",
          "items": { "type": "string" }
        }
      },
      "additionalProperties": false
    },
    "interaction": {
      "type": "object",
      "properties": {
        "affordances": {
          "type": "array",
          "items": { "type": "string" },
          "description": "What can be done to/with this object"
        }
      },
      "additionalProperties": false
    }
  },
  "additionalProperties": true
}
```

具体元类定义示例（草元类）：

```json
{
  "$id": "https://example.org/metaverse/schema/grass.v0.1.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Grass Metaclass v0.1",
  "type": "object",
  "allOf": [
    { "$ref": "metaclass.base.v0.1.json" }
  ],
  "required": ["meta", "intrinsic"],
  "properties": {
    "meta": {
      "type": "object",
      "required": ["type", "version"],
      "properties": {
        "type": { "const": "grass" },
        "version": { "const": "0.1" }
      },
      "additionalProperties": true
    },
    "intrinsic": {
      "type": "object",
      "required": ["heightCm", "color", "density"],
      "properties": {
        "heightCm": { "type": "number", "minimum": 0 },
        "color": { "type": "string" },
        "density": { "type": "string", "enum": ["low", "medium", "high"] }
      },
      "additionalProperties": false
    }
  },
  "additionalProperties": true
}
```

## 2. AEID 系统 (AMAR Engine ID)

AEID 系统负责为 AME 系统中的实体生成和管理唯一标识符。

### 2.1 AEID 的结构

- **长度**：固定长度的唯一标识符
- **组成**：前缀 + 时间戳 + 随机数
- **格式**：字符串格式，确保全球唯一性

### 2.2 AEID 的生成

```typescript
class AEIDGenerator {
  generate(): string {
    // 生成前缀
    const prefix = 'AE';
    
    // 生成时间戳
    const timestamp = Date.now().toString(36);
    
    // 生成随机数
    const random = Math.random().toString(36).substring(2, 10);
    
    // 组合生成 AEID
    return `${prefix}_${timestamp}_${random}`;
  }
}
```

### 2.3 AEID 的管理

- **注册表**：维护所有 AEID 的注册表
- **验证**：验证 AEID 的有效性和唯一性
- **解析**：解析 AEID 中的信息，如生成时间

### 2.4 AEID 的应用

- **实体标识**：为每个实体分配唯一的 AEID
- **系统配置**：将实体的配置与 AEID 关联
- **数据存储**：使用 AEID 作为数据存储的键

## 3. Skills 系统

Skills 系统定义了实体可以执行的操作和行为。

### 3.1 Skill 的定义

- **名称**：Skill 的唯一标识符
- **描述**：Skill 的功能描述
- **参数**：Skill 执行所需的参数
- **返回值**：Skill 执行的返回值
- **依赖**：Skill 执行所需的其他 Skill

### 3.2 Skill 的分类

#### 3.2.1 基础 Skill

- **定义**：基本的操作和行为
- **示例**：移动、旋转、缩放
- **特性**：不依赖其他 Skill

#### 3.2.2 复合 Skill

- **定义**：由多个基础 Skill 组合而成的复杂操作
- **示例**：抓取、投掷、打开
- **特性**：依赖其他 Skill

### 3.3 Skill 的执行

```typescript
class SkillExecutor {
  execute(skillName: string, entityId: string, params: any): any {
    // 获取 Skill 定义
    const skill = this.skillRegistry.get(skillName);
    
    // 验证参数
    if (!this.skillValidator.validate(skill, params)) {
      throw new Error('Invalid parameters for skill');
    }
    
    // 执行 Skill
    const result = skill.execute(entityId, params);
    
    // 返回执行结果
    return result;
  }
}
```

### 3.4 Skill 的管理

- **注册表**：维护所有 Skill 的注册表
- **验证**：验证 Skill 的有效性和参数
- **组合**：组合多个 Skill 形成复合 Skill

## 4. Mesher 系统

Mesher 系统负责实体网格的生成、优化和验证。

### 4.1 网格生成

- **从点云生成**：从 3DGS 点云生成网格
- **从参数生成**：根据参数生成程序化网格
- **从文件加载**：从文件加载网格

### 4.2 网格优化

- **简化**：减少网格的复杂度
- **平滑**：平滑网格的表面
- **修复**：修复网格的拓扑问题

### 4.3 网格验证

- **拓扑验证**：验证网格的拓扑结构
- **几何验证**：验证网格的几何属性
- **物理验证**：验证网格的物理属性

## 5. Admin (归一中心)

Admin 是 AME 系统的中枢，负责数据归一化、元类管理和实体实例化。

### 5.1 数据归一化

- **时间一致性**：确保不同数据源的时间同步
- **空间一致性**：确保不同数据源的空间同步
- **语义一致性**：确保不同数据源的语义一致性

### 5.2 元类管理

- **元类注册表**：维护完整的元类体系
- **智能分类**：根据输入数据自动判断实体应属于哪个元类
- **元类参数优化**：根据具体场景调整元类参数

### 5.3 实体实例化

- **最终决策**：决定何时以及如何实例化一个物理实体
- **物理参数分配**：为实体分配具体的物理参数
- **行为规则设定**：设定实体在不同情况下的行为规则

## 6. AMAR GENIS (物理引擎)

AMAR GENIS 是 AME 系统的底层物理引擎，负责物理模拟和实体行为。

### 6.1 求解器

- **RigidSolver**：刚体求解器
- **MPMSolver**：材料点法求解器
- **SPHSolver**：光滑粒子流体动力学求解器
- **PBDSolver**：基于位置的动力学求解器
- **FEMSolver**：有限元法求解器
- **SFSolver**：烟雾流体求解器
- **ToolSolver**：工具求解器

### 6.2 耦合器

- **IPCCoupler**：基于增量势能接触的耦合器
- **LegacyCoupler**：传统耦合器
- **SAPCoupler**：空间哈希耦合器

### 6.3 传感器

- **Camera**：相机传感器
- **IMU**：惯性测量单元传感器
- **Raycaster**：射线投射传感器
- **ContactForce**：接触力传感器
- **DepthCamera**：深度相机传感器

### 6.4 物理句柄绑定

- **视觉-物理层耦合**：实现 3DGS 视觉层与物理碰撞层的非同步耦合
- **拓扑突变支持**：针对 3DGS 动态流设计实时碰撞体重构算法
- **双向反馈**：物理模拟结果反哺视觉渲染

## 7. AME Scanner

AME Scanner 是 AME 系统的 3DGS 路径执行者，负责空间骨架捕获。

### 7.1 密度塌陷处理

- **非线性阈值算法**：剥离视觉幻影，锁定物理质量的"实存"
- **密度聚类**：将点云聚类为不同的密度区域
- **特征提取**：从密度区域提取特征

### 7.2 OBB 拟合

- **PCA 分析**：对点云进行主成分分析
- **协方差矩阵分解**：提取实体的原始旋转相位与尺度
- **边界框生成**：生成定向边界框

### 7.3 空间骨架捕获

- **密度加权采样**：根据密度对空间进行采样
- **骨架提取**：提取实体的空间骨架
- **几何约束生成**：生成实体的几何约束

## 8. 媒体输入路径

媒体输入路径负责多模态属性溯源，提供实体的感官一致性。

### 8.1 图像处理

- **图像分析**：分析图像中的物体和场景
- **材质识别**：识别物体的表面材质
- **颜色提取**：提取物体的颜色信息

### 8.2 视频处理

- **运动分析**：分析视频中的运动
- **行为识别**：识别物体的行为
- **时序分析**：分析物体的时序变化

### 8.3 音频处理

- **声纹识别**：识别物体的声学特征
- **环境音频分析**：分析环境的音频特征
- **声学阻抗计算**：计算物体的声学阻抗

## 9. LLM API 路径

LLM API 路径负责元类定义与逻辑赋予，提供实体的因果律。

### 9.1 自然语言处理

- **语义理解**：理解自然语言中的语义
- **意图识别**：识别用户的意图
- **实体提取**：提取自然语言中的实体

### 9.2 元类生成

- **元类定义**：根据自然语言生成元类定义
- **属性提取**：从自然语言中提取元类属性
- **行为规则生成**：生成元类的行为规则

### 9.3 物理常量注入

- **物理参数提取**：从自然语言中提取物理参数
- **参数优化**：优化物理参数
- **常量注入**：将物理常量注入到元类中

## 10. 导出协议

AME 系统支持多种导出协议，用于不同的应用场景。

### 10.1 Oasis Domain (osdm)

- **性质**：文件夹结构规范
- **核心用途**：可交互世界的分布式存储与分发
- **特点**：支持复杂的场景和实体

### 10.2 EME World (emewd)

- **性质**：二进制单文件
- **核心用途**：专供 EME 项目（AI 婴儿进化项目）的逻辑训练
- **特点**：可剥离人类显示界面，专注于逻辑训练

---

这些核心概念构成了 AME 系统的基础框架，通过它们的协同工作，AME 系统能够实现现实的物理实例化，创建一个与现实世界高度一致的数字生态系统。