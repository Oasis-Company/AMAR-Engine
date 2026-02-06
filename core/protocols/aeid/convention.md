# AEID Naming Convention

## 1. AEID概述

AEID (AMAR Engine ID) 是AMAR Engine中用于标识和跟踪资产与场景的全球唯一标识符。每个场景和资产都被分配一个世界范围内唯一的AEID，用于在全球数据库中注册和跟踪。

## 2. 设计原则

- **全球唯一性**: 确保每个AEID在全球范围内都是唯一的
- **信息嵌入**: 在AEID中嵌入资产类型等信息，便于快速识别
- **紧凑性**: AEID应尽可能紧凑，便于存储和传输
- **可验证性**: 支持AEID的有效性验证，防止伪造
- **可扩展性**: 支持未来的扩展和变化
- **实用性**: 只包含必要的信息，避免"花瓶"功能

## 3. AEID格式

### 3.1 基本结构

AEID采用以下基本结构：

```
[类型前缀]-[时间戳]-[随机数]-[校验码]
```

- **类型前缀**: 标识资产类型的2-4字符前缀
- **时间戳**: 基于UTC时间的时间戳，确保唯一性
- **随机数**: 随机生成的数字，进一步确保唯一性
- **校验码**: 基于其他部分计算的校验码，用于验证AEID的有效性

### 3.2 具体格式

```
{type_prefix}-{timestamp}-{random}-{checksum}
```

- **type_prefix**: 2-4个大写字母，如 `AST` (Asset)、`SCN` (Scene)、`MAT` (Material)
- **timestamp**: 12位数字，基于Unix时间戳（秒）的后12位
- **random**: 8位随机数字
- **checksum**: 4位校验码

### 3.3 示例

```
AST-202602061234-56789012-ABCD
SCN-202602061235-12345678-EFGH
```

## 4. 类型前缀定义

### 4.1 核心类型

- **AST**: Asset (资产)
- **SCN**: Scene (场景)
- **MAT**: Material (材质)
- **MCL**: Metaclass (元类)
- **SKL**: Skill (技能)

### 4.2 扩展类型

- **CPT**: Component (组件)
- **LIB**: Library (库)
- **TPL**: Template (模板)
- **PRJ**: Project (项目)

## 5. 时间戳格式

时间戳采用以下格式：

- **格式**: `YYYYMMDDHHmm`
- **长度**: 12位数字
- **时区**: UTC
- **精度**: 分钟级精度

### 5.1 示例

```
202602061234  # 2026年2月6日12时34分
```

## 6. 随机数生成

随机数采用密码学安全的随机数生成器生成：

- **长度**: 8位数字
- **范围**: 00000000-99999999
- **生成算法**: 基于密码学安全的随机数生成器

## 7. 校验码计算

校验码采用以下算法计算：

### 7.1 计算步骤

1. **拼接**: 将类型前缀、时间戳和随机数拼接成一个字符串
2. **哈希**: 使用SHA-256算法对拼接后的字符串进行哈希
3. **截取**: 取哈希结果的前4个字符
4. **转换**: 将截取的哈希结果转换为大写字母

### 7.2 示例

```python
def calculate_checksum(type_prefix, timestamp, random):
    """
    计算AEID校验码
    
    参数:
        type_prefix: 类型前缀
        timestamp: 时间戳
        random: 随机数
    
    返回:
        str: 4位校验码
    """
    # 1. 拼接字符串
    data = f"{type_prefix}{timestamp}{random}"
    
    # 2. 计算SHA-256哈希
    import hashlib
    hash_obj = hashlib.sha256(data.encode())
    hash_hex = hash_obj.hexdigest()
    
    # 3. 截取前4个字符并转换为大写
    checksum = hash_hex[:4].upper()
    
    return checksum
```

## 8. AEID生成算法

### 8.1 生成步骤

1. **确定类型前缀**: 根据资产类型选择适当的类型前缀
2. **生成时间戳**: 获取当前UTC时间并格式化为指定格式
3. **生成随机数**: 使用密码学安全的随机数生成器生成8位随机数
4. **计算校验码**: 基于类型前缀、时间戳和随机数计算校验码
5. **拼接**: 将各部分拼接成完整的AEID

### 8.2 实现示例

```python
def generate_aeid(asset_type):
    """
    生成AEID
    
    参数:
        asset_type: 资产类型
    
    返回:
        str: 生成的AEID
    """
    # 1. 确定类型前缀
    type_prefix_mapping = {
        "asset": "AST",
        "scene": "SCN",
        "material": "MAT",
        "metaclass": "MCL",
        "skill": "SKL",
        "component": "CPT",
        "library": "LIB",
        "template": "TPL",
        "project": "PRJ"
    }
    
    type_prefix = type_prefix_mapping.get(asset_type.lower(), "AST")
    
    # 2. 生成时间戳
    from datetime import datetime
    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M")
    
    # 3. 生成随机数
    import secrets
    random = f"{secrets.randbelow(100000000):08d}"
    
    # 4. 计算校验码
    checksum = calculate_checksum(type_prefix, timestamp, random)
    
    # 5. 拼接AEID
    aeid = f"{type_prefix}-{timestamp}-{random}-{checksum}"
    
    return aeid
```

## 9. AEID验证算法

### 9.1 验证步骤

1. **解析**: 解析AEID的各个部分
2. **格式验证**: 验证AEID的格式是否正确
3. **类型前缀验证**: 验证类型前缀是否有效
4. **时间戳验证**: 验证时间戳格式是否正确
5. **校验码验证**: 重新计算校验码并与提供的校验码比较

### 9.2 实现示例

```python
def validate_aeid(aeid):
    """
    验证AEID的有效性
    
    参数:
        aeid: 要验证的AEID
    
    返回:
        dict: 验证结果，包含成功/失败状态和错误信息
    """
    # 1. 解析AEID
    parts = aeid.split("-")
    if len(parts) != 4:
        return {
            "valid": False,
            "error": "Invalid AEID format: must have 4 parts"
        }
    
    type_prefix, timestamp, random, checksum = parts
    
    # 2. 格式验证
    import re
    if not re.match(r"^[A-Z]{2,4}$", type_prefix):
        return {
            "valid": False,
            "error": "Invalid type prefix: must be 2-4 uppercase letters"
        }
    
    if not re.match(r"^[0-9]{12}$", timestamp):
        return {
            "valid": False,
            "error": "Invalid timestamp: must be 12 digits"
        }
    
    if not re.match(r"^[0-9]{8}$", random):
        return {
            "valid": False,
            "error": "Invalid random part: must be 8 digits"
        }
    
    if not re.match(r"^[A-F0-9]{4}$", checksum):
        return {
            "valid": False,
            "error": "Invalid checksum: must be 4 hexadecimal characters"
        }
    
    # 3. 类型前缀验证
    valid_type_prefixes = ["AST", "SCN", "MAT", "MCL", "SKL", "CPT", "LIB", "TPL", "PRJ"]
    if type_prefix not in valid_type_prefixes:
        return {
            "valid": False,
            "error": f"Invalid type prefix: must be one of {valid_type_prefixes}"
        }
    
    # 4. 时间戳验证
    try:
        from datetime import datetime
        datetime.strptime(timestamp, "%Y%m%d%H%M")
    except ValueError:
        return {
            "valid": False,
            "error": "Invalid timestamp format: must be YYYYMMDDHHmm"
        }
    
    # 5. 校验码验证
    calculated_checksum = calculate_checksum(type_prefix, timestamp, random)
    if calculated_checksum != checksum:
        return {
            "valid": False,
            "error": "Invalid checksum: checksum verification failed"
        }
    
    # 验证成功
    return {
        "valid": True,
        "aeid": aeid,
        "type_prefix": type_prefix,
        "timestamp": timestamp,
        "random": random,
        "checksum": checksum
    }
```

## 10. 资产类型信息嵌入

### 10.1 类型前缀映射

| 资产类型 | 类型前缀 | 描述 |
|---------|---------|------|
| Asset | AST | 单个资产 |
| Scene | SCN | 场景 |
| Material | MAT | 材质 |
| Metaclass | MCL | 元类 |
| Skill | SKL | 技能 |
| Component | CPT | 组件 |
| Library | LIB | 库 |
| Template | TPL | 模板 |
| Project | PRJ | 项目 |

### 10.2 扩展机制

为了支持未来的扩展，类型前缀采用以下扩展机制：

- **预留前缀**: 预留一些前缀用于未来的资产类型
- **自定义前缀**: 允许通过注册使用自定义前缀
- **版本标识**: 在类型前缀中可以包含版本信息

## 11. AEID注册和管理

### 11.1 注册流程

1. **生成AEID**: 为资产或场景生成AEID
2. **验证AEID**: 验证生成的AEID是否有效
3. **检查唯一性**: 检查AEID是否已在全球数据库中注册
4. **注册**: 将AEID和相关信息注册到全球数据库
5. **返回**: 返回注册结果和AEID

### 11.2 管理API

#### 11.2.1 生成AEID

```python
def register_aeid(asset_type, metadata):
    """
    注册AEID
    
    参数:
        asset_type: 资产类型
        metadata: 资产元数据
    
    返回:
        dict: 注册结果，包含成功/失败状态和AEID
    """
    # 实现注册逻辑
    pass
```

#### 11.2.2 查询AEID

```python
def query_aeid(aeid):
    """
    查询AEID信息
    
    参数:
        aeid: AEID
    
    返回:
        dict: AEID信息
    """
    # 实现查询逻辑
    pass
```

#### 11.2.3 注销AEID

```python
def revoke_aeid(aeid):
    """
    注销AEID
    
    参数:
        aeid: 要注销的AEID
    
    返回:
        dict: 注销结果
    """
    # 实现注销逻辑
    pass
```

## 12. 性能考虑

- **生成速度**: AEID生成应尽可能快速，避免成为性能瓶颈
- **验证速度**: AEID验证应尽可能快速，便于频繁验证
- **存储效率**: AEID应紧凑，便于存储和索引
- **传输效率**: AEID应紧凑，便于网络传输

## 13. 安全考虑

- **唯一性保证**: 确保AEID生成算法能够生成全球唯一的ID
- **防伪造**: 通过校验码防止AEID伪造
- **隐私保护**: 避免在AEID中包含敏感信息
- **安全随机数**: 使用密码学安全的随机数生成器

## 14. 实现注意事项

- **模块化**: 将AEID生成和验证功能模块化，便于测试和维护
- **错误处理**: 提供清晰的错误信息，帮助用户诊断问题
- **文档化**: 为每个功能提供详细的文档和使用示例
- **测试**: 编写全面的测试用例，确保功能的正确性
- **性能优化**: 优化AEID生成和验证的性能

## 15. 未来扩展

以下功能留待社区贡献：

- **分布式ID生成**: 支持分布式环境下的ID生成
- **ID压缩**: 进一步压缩AEID的长度
- **高级验证**: 支持更高级的AEID验证机制
- **ID分析工具**: 分析和统计AEID使用情况的工具
- **国际化支持**: 支持国际化的资产类型标识

## 16. 结论

AEID是AMAR Engine中重要的组成部分，它提供了一种全球唯一的方式来标识和跟踪资产与场景。通过合理的格式设计和验证机制，AEID确保了资产和场景的唯一性和可追溯性，为AMAR Engine的全球生态系统奠定了基础。

实现时应遵循实用性原则，只包含必要的功能，避免"花瓶"功能。对于复杂的功能，可以通过模块化设计和社区贡献来实现。