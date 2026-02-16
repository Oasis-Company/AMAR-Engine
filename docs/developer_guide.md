# AMAR Engine 开发团队指南

本文档旨在帮助开发团队无缝衔接 AMAR Engine (AME) 系统的开发工作，提供系统架构、组件说明、开发流程和接口规范等详细信息。

## 目录

1. [系统架构](#系统架构)
2. [核心组件](#核心组件)
3. [开发流程](#开发流程)
4. [接口规范](#接口规范)
5. [部署指南](#部署指南)
6. [团队协作](#团队协作)

## 1. 系统架构

AME 系统采用三路递归架构，以 Admin (归一中心) 为中枢，将三条异构路径的数据坍缩为唯一的物理实体：

### 1.1 三条路径

1. **3DGS 路径 [AME Scanner]**
   - 职能：空间骨架捕获
   - 核心技术：密度塌陷处理、OBB拟合
   - 输出：提供实体的几何约束

2. **媒体输入路径 [Media Loader]**
   - 职能：多模态属性溯源
   - 输入：跨频谱图像、时序视频、声纹数据
   - 输出：确定物体的表面材质流与声学阻抗

3. **LLM API 路径 [Semantic Coder]**
   - 职能：元类定义与逻辑赋予
   - 核心逻辑：将自然语言转化为Metaclass描述，注入物理常量
   - 输出：提供实体的因果律

### 1.2 组件关系

- **AME Scanner**：3DGS路径的执行者，生成几何约束
- **AMAR ENGINE**：包含Admin (归一中心)，负责数据归一化、元类管理和实体实例化
- **AMAR GENIS**：底层物理引擎，负责物理模拟和实体行为
- **metaclass-prototype**：元类概念的原型实现

## 2. 核心组件

### 2.1 AME Scanner

**目录**：`AME-Scanner/`

**核心文件**：
- `include/FieldLoader.h`：3DGS数据加载
- `include/ScanProbe.h`：扫描探针逻辑
- `include/SpatialGrid.h`：空间网格管理
- `src/main.cpp`：主入口

**开发重点**：
- 密度塌陷处理算法优化
- OBB拟合精度提升
- 与Admin的数据接口规范

### 2.2 AMAR ENGINE

**目录**：`AMAR-Engine/`

**核心模块**：

#### 2.2.1 AEID 系统
- `src/core/aeid/AEIDGenerator.ts`：生成唯一标识符
- `src/core/aeid/AEIDRegistry.ts`：管理标识符注册表
- `src/core/aeid/AEIDSystem.ts`：核心逻辑
- `src/core/aeid/AEIDValidator.ts`：验证有效性

#### 2.2.2 Metaclass 系统
- `src/core/metaclass/MetaclassComposer.ts`：组合多个元类
- `src/core/metaclass/MetaclassRegistry.ts`：管理元类注册表
- `src/core/metaclass/MetaclassSystem.ts`：核心逻辑
- `src/core/metaclass/MetaclassValidator.ts`：验证有效性

#### 2.2.3 Skills 系统
- `src/core/skills/SkillExecutor.ts`：执行技能
- `src/core/skills/SkillRegistry.ts`：管理技能注册表
- `src/core/skills/SkillValidator.ts`：验证有效性
- `src/core/skills/SkillsSystem.ts`：核心逻辑

#### 2.2.4 Mesher 系统
- `src/core/mesher/MeshGenerator.ts`：生成网格
- `src/core/mesher/MeshOptimizer.ts`：优化网格
- `src/core/mesher/MeshValidator.ts`：验证有效性
- `src/core/mesher/MesherSystem.ts`：核心逻辑

### 2.3 AMAR GENIS

**目录**：`AMAR-GENIS/`

**核心模块**：

#### 2.3.1 引擎核心
- `genesis/engine/simulator.py`：场景级模拟管理器
- `genesis/engine/scene.py`：场景管理
- `genesis/engine/entities/base_entity.py`：实体基类
- `genesis/engine/mesh.py`：网格管理

#### 2.3.2 求解器
- `genesis/engine/solvers/rigid_solver.py`：刚体求解器
- `genesis/engine/solvers/mpm_solver.py`：材料点法求解器
- `genesis/engine/solvers/sph_solver.py`：光滑粒子流体动力学求解器
- `genesis/engine/solvers/pbd_solver.py`：基于位置的动力学求解器
- `genesis/engine/solvers/fem_solver.py`：有限元法求解器
- `genesis/engine/solvers/sf_solver.py`：烟雾流体求解器
- `genesis/engine/solvers/tool_solver.py`：工具求解器

#### 2.3.3 耦合器
- `genesis/engine/couplers/ipc_coupler.py`：基于增量势能接触的耦合器
- `genesis/engine/couplers/legacy_coupler.py`：传统耦合器
- `genesis/engine/couplers/sap_coupler.py`：空间哈希耦合器

### 2.4 metaclass-prototype

**目录**：`metaclass-prototype/`

**核心文件**：
- `schema/metaclass.base.v0.1.json`：基础元类定义
- `schema/grass.v0.1.json`：草元类定义
- `schema/water.v0.1.json`：水元类定义
- 多语言实现：C++、Python、Rust、TypeScript

## 3. 开发流程

### 3.1 功能开发流程

1. **需求分析**：明确功能需求和技术目标
2. **设计阶段**：设计模块结构和接口
3. **实现阶段**：编写代码实现功能
4. **测试阶段**：单元测试和集成测试
5. **文档更新**：更新相关文档
6. **代码审查**：团队代码审查
7. **合并部署**：合并到主分支并部署

### 3.2 分支管理

- **main**：主分支，稳定版本
- **develop**：开发分支，集成新功能
- **feature/xxx**：特性分支，开发具体功能
- **bugfix/xxx**：修复分支，修复bug
- **hotfix/xxx**：紧急修复分支

### 3.3 代码规范

- **TypeScript**：遵循 ESLint 和 Prettier 规范
- **Python**：遵循 PEP 8 规范
- **C++**：遵循 Google C++ Style Guide
- **提交信息**：使用语义化提交信息

## 4. 接口规范

### 4.1 AME Scanner 接口

**输入**：
- 3DGS 点云数据

**输出**：
```typescript
interface GSOutput {
  points: number[][];      // 处理后的点云数据
  obb: {
    center: number[];       // OBB 中心点
    rotation: number[][];   // 旋转矩阵
    extents: number[];      // 尺度
  };
  density: number;          // 密度信息
  featureHash: string;      // 特征哈希
}
```

### 4.2 Admin 接口

**输入**：
- GSOutput：来自AME Scanner的几何约束
- MediaData：来自Media Loader的多模态数据
- SemanticData：来自Semantic Coder的元类描述

**输出**：
```typescript
interface AdminOutput {
  entityId: string;         // 实体ID
  metaclass: string;        // 元类类型
  properties: Record<string, any>; // 实体属性
  behaviors: string[];      // 行为列表
}
```

### 4.3 GENIS 接口

**输入**：
- AdminOutput：来自Admin的实体描述

**输出**：
```python
class EntityState:
    def __init__(self):
        self.position = [0.0, 0.0, 0.0]
        self.rotation = [0.0, 0.0, 0.0]
        self.velocity = [0.0, 0.0, 0.0]
        self.angular_velocity = [0.0, 0.0, 0.0]
        self.forces = [0.0, 0.0, 0.0]
```

## 5. 部署指南

### 5.1 本地开发环境

#### AME-Scanner
- **依赖**：CMake, C++17
- **构建**：
  ```bash
  cd AME-Scanner
  mkdir build
  cd build
  cmake ..
  cmake --build .
  ```

#### AMAR-Engine
- **依赖**：Node.js 18+, npm
- **构建**：
  ```bash
  cd AMAR-Engine
  npm install
  npm run build
  ```

#### AMAR-GENIS
- **依赖**：Python 3.8+, pip
- **构建**：
  ```bash
  cd AMAR-GENIS
  pip install -e .
  ```

### 5.2 容器化部署

**Dockerfile 示例**：
```dockerfile
FROM node:18 AS engine
WORKDIR /app/AMAR-Engine
COPY AMAR-Engine/ .
RUN npm install && npm run build

FROM python:3.8 AS genis
WORKDIR /app/AMAR-GENIS
COPY AMAR-GENIS/ .
RUN pip install -e .

FROM ubuntu:20.04 AS scanner
WORKDIR /app/AME-Scanner
COPY AME-Scanner/ .
RUN apt-get update && apt-get install -y cmake g++
RUN mkdir build && cd build && cmake .. && cmake --build .

FROM ubuntu:20.04
WORKDIR /app
COPY --from=engine /app/AMAR-Engine /app/AMAR-Engine
COPY --from=genis /app/AMAR-GENIS /app/AMAR-GENIS
COPY --from=scanner /app/AME-Scanner /app/AME-Scanner

CMD ["bash"]
```

## 6. 团队协作

### 6.1 沟通渠道

- **日常沟通**：Slack/Teams
- **代码审查**：GitHub Pull Requests
- **文档协作**：Markdown 文档
- **项目管理**：Jira/ Trello

### 6.2 角色分工

- **前端开发**：负责 AMAR-Engine 的 UI 部分
- **后端开发**：负责 AMAR-Engine 的核心逻辑
- **算法开发**：负责 AME-Scanner 的算法优化
- **物理引擎开发**：负责 AMAR-GENIS 的物理模拟
- **元类系统开发**：负责元类系统的设计和实现

### 6.3 会议安排

- **每日站会**：15分钟，同步进度
- **周会**：1小时，讨论计划和问题
- **月度回顾**：2小时，回顾月度进展

### 6.4 知识共享

- **技术分享**：每周一次技术分享
- **文档更新**：及时更新技术文档
- **代码注释**：详细的代码注释
- **示例代码**：提供完整的示例代码

## 7. 开发资源

### 7.1 工具链

- **代码编辑器**：VS Code, PyCharm, CLion
- **版本控制**：Git, GitHub
- **构建工具**：CMake, npm, pip
- **测试工具**：Jest, pytest, Google Test
- **性能分析**：Chrome DevTools, Py-Spy

### 7.2 学习资源

- **3DGS 相关**：论文和文档
- **物理引擎**：AMAR-GENIS 文档
- **元类系统**：metaclass-prototype 文档
- **TypeScript**：官方文档
- **Python**：官方文档
- **C++**：官方文档

## 8. 常见问题

### 8.1 技术问题

**Q: 3DGS 点云密度塌陷如何处理？**
A: 使用非线性阈值算法剥离视觉幻影，锁定物理质量的"实存"。

**Q: 如何实现元类的实时注入？**
A: 在实体类中添加 `update_metaclass()` 方法，动态更新元类属性，无需重启模拟。

**Q: 如何优化物理模拟性能？**
A: 利用并行计算和缓存机制，优化关键路径。

### 8.2 协作问题

**Q: 跨语言开发如何协作？**
A: 定义清晰的接口规范，使用 JSON 进行数据交换。

**Q: 如何解决依赖冲突？**
A: 使用容器化部署，隔离不同组件的依赖。

**Q: 如何保证代码质量？**
A: 严格的代码审查和测试流程。

## 9. 未来规划

### 9.1 短期目标

- 完成 MVP 版本，打通"上传 -> 识别 -> 结构化描述"的链路
- 实现基本的元类系统
- 优化 AME-Scanner 的密度塌陷处理

### 9.2 中期目标

- 实现完整的三路递归架构
- 优化物理引擎集成
- 提供丰富的元类库

### 9.3 长期目标

- 随时随地元宇宙
- 实现实时物理实例化
- 支持大规模场景
- 提供云服务

---

本文档将持续更新，如有任何问题或建议，请联系开发团队。