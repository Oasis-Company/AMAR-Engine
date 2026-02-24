# AMAR Engine API Reference

This document provides detailed information about the API interfaces of the AMAR Engine (AME) system, including RESTful API and internal component interfaces.

## 1. RESTful API

### 1.1 Entity Management

#### 1.1.1 Create Entity

- **Endpoint**: `/api/entities`
- **Method**: `POST`
- **Description**: Create a new entity
- **Request Body**:
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
- **Response**:
```json
{
  "success": true,
  "entityId": "AE_12345_abcdef",
  "status": "created"
}
```

#### 1.1.2 Get Entity Information

- **Endpoint**: `/api/entities/{id}`
- **Method**: `GET`
- **Description**: Get detailed information about an entity
- **Path Parameters**:
  - `id`: Entity's AEID
- **Response**:
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

#### 1.1.3 Update Entity Properties

- **Endpoint**: `/api/entities/{id}`
- **Method**: `PUT`
- **Description**: Update entity properties
- **Path Parameters**:
  - `id`: Entity's AEID
- **Request Body**:
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
- **Response**:
```json
{
  "success": true,
  "status": "updated"
}
```

#### 1.1.4 Delete Entity

- **Endpoint**: `/api/entities/{id}`
- **Method**: `DELETE`
- **Description**: Delete an entity
- **Path Parameters**:
  - `id`: Entity's AEID
- **Response**:
```json
{
  "success": true,
  "status": "deleted"
}
```

### 1.2 Metaclass Management

#### 1.2.1 Get Metaclass List

- **Endpoint**: `/api/metaclasses`
- **Method**: `GET`
- **Description**: Get all available metaclasses
- **Response**:
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

#### 1.2.2 Get Metaclass Details

- **Endpoint**: `/api/metaclasses/{id}`
- **Method**: `GET`
- **Description**: Get detailed information about a metaclass
- **Path Parameters**:
  - `id`: Metaclass ID
- **Response**:
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

#### 1.2.3 Create New Metaclass

- **Endpoint**: `/api/metaclasses`
- **Method**: `POST`
- **Description**: Create a new metaclass
- **Request Body**:
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
- **Response**:
```json
{
  "success": true,
  "metaclassId": "furniture",
  "status": "created"
}
```

### 1.3 Skill Management

#### 1.3.1 Get Skill List

- **Endpoint**: `/api/skills`
- **Method**: `GET`
- **Description**: Get all available skills
- **Response**:
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

#### 1.3.2 Execute Skill

- **Endpoint**: `/api/skills/{id}/execute`
- **Method**: `POST`
- **Description**: Execute a skill
- **Path Parameters**:
  - `id`: Skill ID
- **Request Body**:
```json
{
  "entityId": "AE_12345_abcdef",
  "params": {
    "position": [x, y, z],
    "speed": 1.0
  }
}
```
- **Response**:
```json
{
  "success": true,
  "result": {
    "status": "completed",
    "newPosition": [x, y, z]
  }
}
```

### 1.4 System Management

#### 1.4.1 Get System Status

- **Endpoint**: `/api/system/status`
- **Method**: `GET`
- **Description**: Get the current status of the system
- **Response**:
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

#### 1.4.2 Restart System

- **Endpoint**: `/api/system/restart`
- **Method**: `POST`
- **Description**: Restart the system
- **Response**:
```json
{
  "success": true,
  "status": "restarting"
}
```

## 2. Internal Component Interfaces

### 2.1 AME Scanner Interface

#### 2.1.1 Scan Interface

- **Method**: `scan()`
- **Parameters**:
  - `gsData`: 3DGS point cloud data
- **Return Value**:
```typescript
interface ScanResult {
  points: number[][];      // Processed point cloud data
  obb: {
    center: number[];       // OBB center point
    rotation: number[][];   // Rotation matrix
    extents: number[];      // Extents
  };
  density: number;          // Density information
  featureHash: string;      // Feature hash
}
```

#### 2.1.2 Density Processing Interface

- **Method**: `processDensity()`
- **Parameters**:
  - `points`: Original point cloud data
  - `threshold`: Density threshold
- **Return Value**: Processed point cloud data

### 2.2 Admin Interface

#### 2.2.1 Data Normalization Interface

- **Method**: `normalizeData()`
- **Parameters**:
  - `gsOutput`: Geometric constraints from AME Scanner
  - `mediaData`: Multimodal data from Media Loader
  - `semanticData`: Metaclass description from Semantic Coder
- **Return Value**: Normalized data

#### 2.2.2 Metaclass Binding Interface

- **Method**: `bindMetaclass()`
- **Parameters**:
  - `data`: Normalized data
- **Return Value**: Entity description with bound metaclass

### 2.3 AMAR GENIS Interface

#### 2.3.1 Entity Creation Interface

- **Method**: `createEntity()`
- **Parameters**:
  - `entityDesc`: Entity description
- **Return Value**: Entity ID

#### 2.3.2 Physics Simulation Interface

- **Method**: `simulate()`
- **Parameters**:
  - `steps`: Simulation steps
- **Return Value**: Simulation results

### 2.4 Metaclass System Interface

#### 2.4.1 Metaclass Registration Interface

- **Method**: `registerMetaclass()`
- **Parameters**:
  - `metaclass`: Metaclass definition
- **Return Value**: Registration result

#### 2.4.2 Metaclass Composition Interface

- **Method**: `composeMetaclasses()`
- **Parameters**:
  - `baseMetaclass`: Base metaclass
  - `extensionMetaclasses`: List of extension metaclasses
- **Return Value**: Composed metaclass

## 3. WebSocket Interface

### 3.1 Real-time Updates

- **Endpoint**: `/ws/updates`
- **Description**: Receive real-time system updates
- **Message Types**:
  - `entity_created`: New entity created
  - `entity_updated`: Entity updated
  - `entity_deleted`: Entity deleted
  - `simulation_step`: Simulation step completed

### 3.2 Real-time Control

- **Endpoint**: `/ws/control`
- **Description**: Send real-time control commands
- **Command Types**:
  - `move_entity`: Move entity
  - `rotate_entity`: Rotate entity
  - `apply_force`: Apply force
  - `set_property`: Set property

## 4. Client SDK

### 4.1 JavaScript SDK

```javascript
// Initialize SDK
const ame = new AMESDK({
  endpoint: 'http://localhost:3000'
});

// Create entity
const entityId = await ame.entities.create({
  gsOutput: {...},
  mediaData: {...},
  semanticData: {...}
});

// Get entity information
const entity = await ame.entities.get(entityId);

// Execute skill
const result = await ame.skills.execute('move', {
  entityId: entityId,
  params: {
    position: [x, y, z]
  }
});
```

### 4.2 Python SDK

```python
# Initialize SDK
import ame_sdk

ame = ame_sdk.AMESDK(
    endpoint='http://localhost:3000'
)

# Create entity
entity_id = ame.entities.create({
    'gsOutput': {...},
    'mediaData': {...},
    'semanticData': {...}
})

# Get entity information
entity = ame.entities.get(entity_id)

# Execute skill
result = ame.skills.execute('move', {
    'entityId': entity_id,
    'params': {
        'position': [x, y, z]
    }
})
```

## 5. API Version Control

The AME system API uses semantic versioning with the format `MAJOR.MINOR.PATCH`:

- **MAJOR**: Incompatible API changes
- **MINOR**: Backward-compatible feature additions
- **PATCH**: Backward-compatible bug fixes

API version is specified through the URL path, for example: `/api/v1/entities`.

## 6. Error Handling

### 6.1 Error Response Format

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

### 6.2 Common Error Codes

| Error Code | Description | HTTP Status Code |
|---------|------|------------|
| `INVALID_PARAMS` | Invalid parameters | 400 |
| `ENTITY_NOT_FOUND` | Entity not found | 404 |
| `METACLASS_NOT_FOUND` | Metaclass not found | 404 |
| `SKILL_NOT_FOUND` | Skill not found | 404 |
| `INTERNAL_ERROR` | Internal error | 500 |
| `SERVICE_UNAVAILABLE` | Service unavailable | 503 |

## 7. Rate Limiting

The AME system implements rate limiting for API requests to prevent abuse:

- **Regular Users**: 60 requests/minute
- **Authenticated Users**: 300 requests/minute
- **Administrators**: No limit

Rate limit information is returned through response headers:

- `X-RateLimit-Limit`: Number of requests allowed per minute
- `X-RateLimit-Remaining`: Remaining number of requests
- `X-RateLimit-Reset`: Timestamp when rate limit resets

## 8. Authentication and Authorization

### 8.1 API Key Authentication

For server-to-server communication, the AME system supports API key authentication:

- **Request Header**: `Authorization: Bearer API_KEY`
- **API Key**: Generated through the management console

### 8.2 OAuth 2.0

For client applications, the AME system supports OAuth 2.0 authentication:

- **Authorization Code Flow**: Suitable for server-side applications
- **Implicit Flow**: Suitable for client-side applications
- **Client Credentials Flow**: Suitable for service-to-service communication

## 9. Best Practices

### 9.1 Performance Optimization

- **Batch Operations**: Use batch APIs to reduce the number of requests
- **Caching**: Cache frequently accessed data
- **Asynchronous Operations**: Use asynchronous APIs for long-running operations

### 9.2 Error Handling

- **Retry Mechanism**: Implement retry mechanism for temporary errors
- **Error Monitoring**: Monitor API errors and handle them promptly
- **Graceful Degradation**: Implement graceful degradation when API is unavailable

### 9.3 Security

- **HTTPS**: Always use HTTPS for API communication
- **Input Validation**: Validate all user inputs
- **Permission Control**: Implement appropriate permission controls

## 10. Example Code

### 10.1 Entity Creation Example

```javascript
// Create entity using JavaScript SDK
const ame = new AMESDK({ endpoint: 'http://localhost:3000' });

async function createEntity() {
  try {
    // Scan 3DGS data
    const scanResult = await scanner.scan(gsData);
    
    // Process media data
    const mediaData = await mediaLoader.process(images, videos, audio);
    
    // Generate semantic data
    const semanticData = await semanticCoder.generate(description);
    
    // Create entity
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

### 10.2 Skill Execution Example

```python
# Execute skill using Python SDK
import ame_sdk

ame = ame_sdk.AMESDK(endpoint='http://localhost:3000')

def move_entity(entity_id, position):
    try:
        # Execute move skill
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

This document provides a detailed reference for the AME system API, including RESTful API, internal component interfaces, WebSocket interfaces, and client SDKs. Through these interfaces, developers can interact with the AME system, create and manage entities, execute skills, and control various system functions.