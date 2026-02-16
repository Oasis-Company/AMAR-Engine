# AMAR Engine API 参考

本文档详细介绍 AMAR Engine (AME) 系统的 API 接口，包括 RESTful API 和内部组件接口。

## 1. RESTful API

### 1.1 实体管理

#### 1.1.1 创建实体

- **端点**：`/api/entities`
- **方法**：`POST`
- **描述**：创建一个新的实体
- **请求体**：
```json
{
  "gsOutput": {
    "points": [[x1, y1, z1], [x2, y2, z2], ...],
    "obb": {
      "center": [x, y, z],
      "rotation": [[r11, r12, r13], [r21, r22, r23], [r31, r32, r33]],
      "extents": [x, y, z]
    },
    "density": 1.0,
    "featureHash": "abc123"
  },
  "mediaData": {
    "images": ["base64_image_data"],
    "videos": ["video_url"],
    "audio": ["audio_url"]
  },
  "semanticData": {
    "metaclass": "container",
    "properties": {
      "capacity": 1.0,
      "is_full": false
    },
    "behaviors": ["hold_objects", "hold_substances"]
  }
}
```
- **响应**：
```json
{
  "success": true,
  "entityId": "AE_12345_abcdef",
  "status": "created"
}
```

#### 1.1.2 获取实体信息

- **端点**：`/api/entities/{id}`
- **方法**：`GET`
- **描述**：获取实体的详细信息
- **路径参数**：
  - `id`：实体的 AEID
- **响应**：
```json
{
  "success": true,
  "entity": {
    "id": "AE_12345_abcdef",
    "metaclass": "container",
    "properties": {
      "capacity": 1.0,
      "is_full": false
    },
    "behaviors": ["hold_objects", "hold_substances"],
    "state": {
      "position": [x, y, z],
      "rotation": [x, y, z],
      "velocity": [x, y, z]
    }
  }
}
```

#### 1.1.3 更新实体属性

- **端点**：`/api/entities/{id}`
- **方法**：`PUT`
- **描述**：更新实体的属性
- **路径参数**：
  - `id`：实体的 AEID
- **请求体**：
```json
{
  "metaclass": "container",
  "properties": {
    "capacity": 2.0,
    "is_full": true
  },
  "behaviors": ["hold_objects", "hold_substances"]
}
```
- **响应**：
```json
{
  "success": true,
  "status": "updated"
}
```

#### 1.1.4 删除实体

- **端点**：`/api/entities/{id}`
- **方法**：`DELETE`
- **描述**：删除实体
- **路径参数**：
  - `id`：实体的 AEID
- **响应**：
```json
{
  "success": true,
  "status": "deleted"
}
```

### 1.2 元类管理

#### 1.2.1 获取元类列表

- **端点**：`/api/metaclasses`
- **方法**：`GET`
- **描述**：获取所有可用的元类
- **响应**：
```json
{
  "success": true,
  "metaclasses": [
    {
      "id": "object",
      "name": "Object",
      "description": "Base object type",
      "version": "1.0.0"
    },
    {
      "id": "container",
      "name": "Container",
      "description": "An object that can hold other objects or substances",
      "version": "1.0.0"
    }
  ]
}
```

#### 1.2.2 获取元类详情

- **端点**：`/api/metaclasses/{id}`
- **方法**：`GET`
- **描述**：获取元类的详细信息
- **路径参数**：
  - `id`：元类的 ID
- **响应**：
```json
{
  "success": true,
  "metaclass": {
    "id": "container",
    "name": "Container",
    "description": "An object that can hold other objects or substances",
    "version": "1.0.0",
    "properties": {
      "capacity": {
        "type": "number",
        "description": "Maximum capacity of the container",
        "default": 1.0
      },
      "is_full": {
        "type": "boolean",
        "description": "Whether the container is full",
        "default": false
      }
    },
    "behaviors": ["hold_objects", "hold_substances"],
    "dependencies": ["object"]
  }
}
```

#### 1.2.3 创建新元类

- **端点**：`/api/metaclasses`
- **方法**：`POST`
- **描述**：创建一个新的元类
- **请求体**：
```json
{
  "id": "furniture",
  "name": "Furniture",
  "description": "An object used for seating, sleeping, or storing items",
  "version": "1.0.0",
  "properties": {
    "material": {
      "type": "string",
      "description": "Material of the furniture",
      "default": "wood"
    },
    "weight": {
      "type": "number",
      "description": "Weight of the furniture in kilograms",
      "default": 10.0
    }
  },
  "behaviors": ["support_weight"],
  "dependencies": ["object", "physical"]
}
```
- **响应**：
```json
{
  "success": true,
  "metaclassId": "furniture",
  "status": "created"
}
```

### 1.3 技能管理

#### 1.3.1 获取技能列表

- **端点**：`/api/skills`
- **方法**：`GET`
- **描述**：获取所有可用的技能
- **响应**：
```json
{
  "success": true,
  "skills": [
    {
      "id": "move",
      "name": "Move",
      "description": "Move an object to a new position"
    },
    {
      "id": "rotate",
      "name": "Rotate",
      "description": "Rotate an object"
    }
  ]
}
```

#### 1.3.2 执行技能

- **端点**：`/api/skills/{id}/execute`
- **方法**：`POST`
- **描述**：执行一个技能
- **路径参数**：
  - `id`：技能的 ID
- **请求体**：
```json
{
  "entityId": "AE_12345_abcdef",
  "params": {
    "position": [x, y, z],
    "speed": 1.0
  }
}
```
- **响应**：
```json
{
  "success": true,
  "result": {
    "status": "completed",
    "newPosition": [x, y, z]
  }
}
```

### 1.4 系统管理

#### 1.4.1 获取系统状态

- **端点**：`/api/system/status`
- **方法**：`GET`
- **描述**：获取系统的当前状态
- **响应**：
```json
{
  "success": true,
  "status": {
    "version": "0.1.0",
    "components": {
      "scanner": "online",
      "engine": "online",
      "genis": "online"
    },
    "entities": 10,
    "metaclasses": 8,
    "skills": 12
  }
}
```

#### 1.4.2 重启系统

- **端点**：`/api/system/restart`
- **方法**：`POST`
- **描述**：重启系统
- **响应**：
```json
{
  "success": true,
  "status": "restarting"
}
```

## 2. 内部组件接口

### 2.1 AME Scanner 接口

#### 2.1.1 扫描接口

- **方法**：`scan()`
- **参数**：
  - `gsData`：3DGS 点云数据
- **返回值**：
```typescript
interface ScanResult {
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

#### 2.1.2 密度处理接口

- **方法**：`processDensity()`
- **参数**：
  - `points`：原始点云数据
  - `threshold`：密度阈值
- **返回值**：处理后的点云数据

### 2.2 Admin 接口

#### 2.2.1 数据归一化接口

- **方法**：`normalizeData()`
- **参数**：
  - `gsOutput`：来自 AME Scanner 的几何约束
  - `mediaData`：来自 Media Loader 的多模态数据
  - `semanticData`：来自 Semantic Coder 的元类描述
- **返回值**：归一化后的数据

#### 2.2.2 元类绑定接口

- **方法**：`bindMetaclass()`
- **参数**：
  - `data`：归一化后的数据
- **返回值**：绑定元类后的实体描述

### 2.3 AMAR GENIS 接口

#### 2.3.1 实体创建接口

- **方法**：`createEntity()`
- **参数**：
  - `entityDesc`：实体描述
- **返回值**：实体 ID

#### 2.3.2 物理模拟接口

- **方法**：`simulate()`
- **参数**：
  - `steps`：模拟步数
- **返回值**：模拟结果

### 2.4 元类系统接口

#### 2.4.1 元类注册接口

- **方法**：`registerMetaclass()`
- **参数**：
  - `metaclass`：元类定义
- **返回值**：注册结果

#### 2.4.2 元类组合接口

- **方法**：`composeMetaclasses()`
- **参数**：
  - `baseMetaclass`：基础元类
  - `extensionMetaclasses`：扩展元类列表
- **返回值**：组合后的元类

## 3. WebSocket 接口

### 3.1 实时更新

- **端点**：`/ws/updates`
- **描述**：接收系统的实时更新
- **消息类型**：
  - `entity_created`：新实体创建
  - `entity_updated`：实体更新
  - `entity_deleted`：实体删除
  - `simulation_step`：模拟步骤完成

### 3.2 实时控制

- **端点**：`/ws/control`
- **描述**：发送实时控制命令
- **命令类型**：
  - `move_entity`：移动实体
  - `rotate_entity`：旋转实体
  - `apply_force`：应用力
  - `set_property`：设置属性

## 4. 客户端 SDK

### 4.1 JavaScript SDK

```javascript
// 初始化 SDK
const ame = new AMESDK({
  endpoint: 'http://localhost:3000'
});

// 创建实体
const entityId = await ame.entities.create({
  gsOutput: {...},
  mediaData: {...},
  semanticData: {...}
});

// 获取实体信息
const entity = await ame.entities.get(entityId);

// 执行技能
const result = await ame.skills.execute('move', {
  entityId: entityId,
  params: {
    position: [x, y, z]
  }
});
```

### 4.2 Python SDK

```python
# 初始化 SDK
import ame_sdk

ame = ame_sdk.AMESDK(
    endpoint='http://localhost:3000'
)

# 创建实体
entity_id = ame.entities.create({
    'gsOutput': {...},
    'mediaData': {...},
    'semanticData': {...}
})

# 获取实体信息
entity = ame.entities.get(entity_id)

# 执行技能
result = ame.skills.execute('move', {
    'entityId': entity_id,
    'params': {
        'position': [x, y, z]
    }
})
```

## 5. API 版本控制

AME 系统的 API 使用语义化版本控制，版本号格式为 `MAJOR.MINOR.PATCH`：

- **MAJOR**：不兼容的 API 更改
- **MINOR**：向后兼容的功能添加
- **PATCH**：向后兼容的 bug 修复

API 版本通过 URL 路径指定，例如：`/api/v1/entities`。

## 6. 错误处理

### 6.1 错误响应格式

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "details": "Additional error details"
  }
}
```

### 6.2 常见错误代码

| 错误代码 | 描述 | HTTP 状态码 |
|---------|------|------------|
| `INVALID_PARAMS` | 无效的参数 | 400 |
| `ENTITY_NOT_FOUND` | 实体不存在 | 404 |
| `METACLASS_NOT_FOUND` | 元类不存在 | 404 |
| `SKILL_NOT_FOUND` | 技能不存在 | 404 |
| `INTERNAL_ERROR` | 内部错误 | 500 |
| `SERVICE_UNAVAILABLE` | 服务不可用 | 503 |

## 7. 速率限制

AME 系统对 API 请求实施速率限制，以防止滥用：

- **普通用户**：60 次请求/分钟
- **认证用户**：300 次请求/分钟
- **管理员**：无限制

速率限制信息通过响应头返回：

- `X-RateLimit-Limit`：每分钟允许的请求数
- `X-RateLimit-Remaining`：剩余的请求数
- `X-RateLimit-Reset`：速率限制重置的时间戳

## 8. 认证与授权

### 8.1 API 密钥认证

对于服务器到服务器的通信，AME 系统支持 API 密钥认证：

- **请求头**：`Authorization: Bearer API_KEY`
- **API 密钥**：通过管理控制台生成

### 8.2 OAuth 2.0

对于客户端应用，AME 系统支持 OAuth 2.0 认证：

- **授权码流程**：适用于服务器端应用
- **隐式流程**：适用于客户端应用
- **客户端凭证流程**：适用于服务到服务的通信

## 9. 最佳实践

### 9.1 性能优化

- **批量操作**：使用批量 API 减少请求次数
- **缓存**：缓存频繁访问的数据
- **异步操作**：对于长时间运行的操作，使用异步 API

### 9.2 错误处理

- **重试机制**：对于临时错误，实现重试机制
- **错误监控**：监控 API 错误并及时处理
- **优雅降级**：当 API 不可用时，实现优雅降级

### 9.3 安全性

- **HTTPS**：始终使用 HTTPS 进行 API 通信
- **输入验证**：验证所有用户输入
- **权限控制**：实施适当的权限控制

## 10. 示例代码

### 10.1 创建实体示例

```javascript
// 使用 JavaScript SDK 创建实体
const ame = new AMESDK({ endpoint: 'http://localhost:3000' });

async function createEntity() {
  try {
    // 扫描 3DGS 数据
    const scanResult = await scanner.scan(gsData);
    
    // 处理媒体数据
    const mediaData = await mediaLoader.process(images, videos, audio);
    
    // 生成语义数据
    const semanticData = await semanticCoder.generate(description);
    
    // 创建实体
    const entityId = await ame.entities.create({
      gsOutput: scanResult,
      mediaData: mediaData,
      semanticData: semanticData
    });
    
    console.log('Entity created:', entityId);
    return entityId;
  } catch (error) {
    console.error('Error creating entity:', error);
    throw error;
  }
}
```

### 10.2 执行技能示例

```python
# 使用 Python SDK 执行技能
import ame_sdk

ame = ame_sdk.AMESDK(endpoint='http://localhost:3000')

def move_entity(entity_id, position):
    try:
        # 执行移动技能
        result = ame.skills.execute('move', {
            'entityId': entity_id,
            'params': {
                'position': position,
                'speed': 1.0
            }
        })
        
        print('Entity moved to:', result['newPosition'])
        return result
    except Exception as e:
        print('Error moving entity:', e)
        raise
```

---

本文档提供了 AME 系统 API 的详细参考，包括 RESTful API、内部组件接口、WebSocket 接口和客户端 SDK。通过这些接口，开发者可以与 AME 系统进行交互，创建和管理实体，执行技能，以及控制系统的各种功能。