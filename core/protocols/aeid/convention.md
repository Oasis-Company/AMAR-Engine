# AEID Naming Convention

## 1. AEID Overview

AEID (AMAR Engine ID) is a globally unique identifier used in AMAR Engine to identify and track assets and scenes. Each scene and asset is assigned a worldwide unique AEID for registration and tracking in a global database.

## 2. Design Principles

- **Global Uniqueness**: Ensure each AEID is unique worldwide
- **Information Embedding**: Embed asset type and other information in AEID for quick identification
- **Compactness**: AEID should be as compact as possible for easy storage and transmission
- **Verifiability**: Support validation of AEID effectiveness to prevent forgery
- **Extensibility**: Support future extensions and changes
- **Practicality**: Include only necessary information, avoid "花瓶" (decorative but useless) features

## 3. AEID Format

### 3.1 Basic Structure

AEID adopts the following basic structure:

```
[type_prefix]-[timestamp]-[random]-[checksum]
```

- **Type Prefix**: 2-4 character prefix identifying the asset type
- **Timestamp**: UTC-based timestamp to ensure uniqueness
- **Random Number**: Randomly generated number to further ensure uniqueness
- **Checksum**: Checksum calculated based on other parts to validate AEID effectiveness

### 3.2 Specific Format

```
{type_prefix}-{timestamp}-{random}-{checksum}
```

- **type_prefix**: 2-4 uppercase letters, such as `AST` (Asset), `SCN` (Scene), `MAT` (Material)
- **timestamp**: 12-digit number, based on the last 12 digits of Unix timestamp (seconds)
- **random**: 8-digit random number
- **checksum**: 4-digit checksum

### 3.3 Examples

```
AST-202602061234-56789012-ABCD
SCN-202602061235-12345678-EFGH
```

## 4. Type Prefix Definitions

### 4.1 Core Types

- **AST**: Asset
- **SCN**: Scene
- **MAT**: Material
- **MCL**: Metaclass
- **SKL**: Skill

### 4.2 Extended Types

- **CPT**: Component
- **LIB**: Library
- **TPL**: Template
- **PRJ**: Project

## 5. Timestamp Format

Timestamp adopts the following format:

- **Format**: `YYYYMMDDHHmm`
- **Length**: 12 digits
- **Timezone**: UTC
- **Precision**: Minute-level precision

### 5.1 Example

```
202602061234  # February 6, 2026, 12:34 UTC
```

## 6. Random Number Generation

Random numbers are generated using a cryptographically secure random number generator:

- **Length**: 8 digits
- **Range**: 00000000-99999999
- **Generation Algorithm**: Based on cryptographically secure random number generator

## 7. Checksum Calculation

Checksum is calculated using the following algorithm:

### 7.1 Calculation Steps

1. **Concatenation**: Concatenate type prefix, timestamp, and random number into a single string
2. **Hashing**: Hash the concatenated string using SHA-256 algorithm
3. **Truncation**: Take the first 4 characters of the hash result
4. **Conversion**: Convert the truncated hash result to uppercase letters

### 7.2 Example

```python
def calculate_checksum(type_prefix, timestamp, random):
    """
    Calculate AEID checksum
    
    Parameters:
        type_prefix: Type prefix
        timestamp: Timestamp
        random: Random number
    
    Returns:
        str: 4-digit checksum
    """
    # 1. Concatenate string
    data = f"{type_prefix}{timestamp}{random}"
    
    # 2. Calculate SHA-256 hash
    import hashlib
    hash_obj = hashlib.sha256(data.encode())
    hash_hex = hash_obj.hexdigest()
    
    # 3. Truncate first 4 characters and convert to uppercase
    checksum = hash_hex[:4].upper()
    
    return checksum
```

## 8. AEID Generation Algorithm

### 8.1 Generation Steps

1. **Determine Type Prefix**: Select appropriate type prefix based on asset type
2. **Generate Timestamp**: Get current UTC time and format it as specified
3. **Generate Random Number**: Generate 8-digit random number using cryptographically secure random number generator
4. **Calculate Checksum**: Calculate checksum based on type prefix, timestamp, and random number
5. **Concatenate**: Concatenate all parts into complete AEID

### 8.2 Implementation Example

```python
def generate_aeid(asset_type):
    """
    Generate AEID
    
    Parameters:
        asset_type: Asset type
    
    Returns:
        str: Generated AEID
    """
    # 1. Determine type prefix
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
    
    # 2. Generate timestamp
    from datetime import datetime
    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M")
    
    # 3. Generate random number
    import secrets
    random = f"{secrets.randbelow(100000000):08d}"
    
    # 4. Calculate checksum
    checksum = calculate_checksum(type_prefix, timestamp, random)
    
    # 5. Concatenate AEID
    aeid = f"{type_prefix}-{timestamp}-{random}-{checksum}"
    
    return aeid
```

## 9. AEID Validation Algorithm

### 9.1 Validation Steps

1. **Parsing**: Parse each part of AEID
2. **Format Validation**: Validate that AEID format is correct
3. **Type Prefix Validation**: Validate that type prefix is valid
4. **Timestamp Validation**: Validate that timestamp format is correct
5. **Checksum Validation**: Recalculate checksum and compare with provided checksum

### 9.2 Implementation Example

```python
def validate_aeid(aeid):
    """
    Validate AEID effectiveness
    
    Parameters:
        aeid: AEID to validate
    
    Returns:
        dict: Validation result, including success/failure status and error messages
    """
    # 1. Parse AEID
    parts = aeid.split("-")
    if len(parts) != 4:
        return {
            "valid": False,
            "error": "Invalid AEID format: must have 4 parts"
        }
    
    type_prefix, timestamp, random, checksum = parts
    
    # 2. Format validation
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
    
    # 3. Type prefix validation
    valid_type_prefixes = ["AST", "SCN", "MAT", "MCL", "SKL", "CPT", "LIB", "TPL", "PRJ"]
    if type_prefix not in valid_type_prefixes:
        return {
            "valid": False,
            "error": f"Invalid type prefix: must be one of {valid_type_prefixes}"
        }
    
    # 4. Timestamp validation
    try:
        from datetime import datetime
        datetime.strptime(timestamp, "%Y%m%d%H%M")
    except ValueError:
        return {
            "valid": False,
            "error": "Invalid timestamp format: must be YYYYMMDDHHmm"
        }
    
    # 5. Checksum validation
    calculated_checksum = calculate_checksum(type_prefix, timestamp, random)
    if calculated_checksum != checksum:
        return {
            "valid": False,
            "error": "Invalid checksum: checksum verification failed"
        }
    
    # Validation successful
    return {
        "valid": True,
        "aeid": aeid,
        "type_prefix": type_prefix,
        "timestamp": timestamp,
        "random": random,
        "checksum": checksum
    }
```

## 10. Asset Type Information Embedding

### 10.1 Type Prefix Mapping

| Asset Type | Type Prefix | Description |
|---------|---------|------|
| Asset | AST | Individual asset |
| Scene | SCN | Scene |
| Material | MAT | Material |
| Metaclass | MCL | Metaclass |
| Skill | SKL | Skill |
| Component | CPT | Component |
| Library | LIB | Library |
| Template | TPL | Template |
| Project | PRJ | Project |

### 10.2 Extension Mechanism

To support future extensions, type prefixes adopt the following extension mechanism:

- **Reserved Prefixes**: Reserve some prefixes for future asset types
- **Custom Prefixes**: Allow using custom prefixes through registration
- **Version Identification**: Include version information in type prefixes

## 11. AEID Registration and Management

### 11.1 Registration Process

1. **Generate AEID**: Generate AEID for asset or scene
2. **Validate AEID**: Validate that generated AEID is valid
3. **Check Uniqueness**: Check if AEID is already registered in global database
4. **Register**: Register AEID and related information in global database
5. **Return**: Return registration result and AEID

### 11.2 Management API

#### 11.2.1 Generate AEID

```python
def register_aeid(asset_type, metadata):
    """
    Register AEID
    
    Parameters:
        asset_type: Asset type
        metadata: Asset metadata
    
    Returns:
        dict: Registration result, including success/failure status and AEID
    """
    # Implement registration logic
    pass
```

#### 11.2.2 Query AEID

```python
def query_aeid(aeid):
    """
    Query AEID information
    
    Parameters:
        aeid: AEID
    
    Returns:
        dict: AEID information
    """
    # Implement query logic
    pass
```

#### 11.2.3 Revoke AEID

```python
def revoke_aeid(aeid):
    """
    Revoke AEID
    
    Parameters:
        aeid: AEID to revoke
    
    Returns:
        dict: Revocation result
    """
    # Implement revocation logic
    pass
```

## 12. Performance Considerations

- **Generation Speed**: AEID generation should be as fast as possible to avoid becoming a performance bottleneck
- **Validation Speed**: AEID validation should be as fast as possible for frequent validation
- **Storage Efficiency**: AEID should be compact for easy storage and indexing
- **Transmission Efficiency**: AEID should be compact for network transmission

## 13. Security Considerations

- **Uniqueness Guarantee**: Ensure AEID generation algorithm can generate globally unique IDs
- **Anti-forgery**: Prevent AEID forgery through checksum
- **Privacy Protection**: Avoid including sensitive information in AEID
- **Secure Random Numbers**: Use cryptographically secure random number generator

## 14. Implementation Considerations

- **Modularity**: Modularize AEID generation and validation functions for easier testing and maintenance
- **Error Handling**: Provide clear error messages to help users diagnose issues
- **Documentation**: Provide detailed documentation and usage examples for each function
- **Testing**: Write comprehensive test cases to ensure correctness of functionality
- **Performance Optimization**: Optimize performance of AEID generation and validation

## 15. Future Extensions

The following features are open for community contributions:

- **Distributed ID Generation**: Support ID generation in distributed environments
- **ID Compression**: Further compress AEID length
- **Advanced Validation**: Support more advanced AEID validation mechanisms
- **ID Analysis Tools**: Tools for analyzing and statistics AEID usage
- **Internationalization Support**: Support internationalized asset type identification

## 16. Conclusion

AEID is an important component of AMAR Engine, providing a globally unique way to identify and track assets and scenes. Through reasonable format design and validation mechanisms, AEID ensures the uniqueness and traceability of assets and scenes, laying the foundation for AMAR Engine's global ecosystem.

Implementation should follow the principle of practicality, including only necessary features and avoiding "花瓶" (decorative but useless) features. For complex functionality, modular design and community contributions can be used.