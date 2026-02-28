# SpatialLM AME Integration Guide

## Project Overview

SpatialLM is a 3D large language model designed to process 3D point cloud data and generate structured 3D scene understanding outputs. This guide documents the modifications made to SpatialLM1.1-Qwen-0.5B to make its output format natively compatible with AME InformationPool.

## Modification Goals

The primary goals of this modification are:

1. **Forced JSON Output**: Ensure the model outputs only valid JSON without any natural language
2. **AME Semantic Domain Mapping**: Include AME domain definitions in the output
3. **Coordinate System Completion**: Provide complete coordinate system information
4. **Output Structure Standardization**: Include architectural elements, objects, confidence scores, and scene metadata

## Technical Implementation

### 1. Prompt Template Rewrite

A new strongly-constrained JSON output prompt template was created with the following features:

- Clear role definition as a "3D scene structure engine"
- Explicit instructions to output only valid JSON
- Multiple repetitions of "JSON only" to ensure Qwen model compliance
- Inclusion of AME semantic domain mapping
- Detailed JSON output format specification

### 2. inference.py Modifications

The `inference.py` script was extensively modified:

- Removed code_template related functionality
- Updated prompt construction logic
- Removed DSL language prompts
- Changed output file format to JSON
- Added JSON validation and automatic retry mechanism
- Added coordinate system information completion

### 3. Generation Parameters

For deterministic JSON output, the following generation parameters were set:

- `temperature=0.0`
- `top_p=0.9`
- `do_sample=False`

### 4. JSON Validation

Added JSON parsing validation with automatic retry mechanism:

- Validates generated output as JSON
- Retries once with stricter prompt if parsing fails
- Handles parsing errors gracefully

### 5. AME Semantic Domain Mapping

Injected AME semantic domain mapping into the prompt:

- Maps common furniture categories to AME domains
- Ensures output includes `ame_domain` field
- Improves compatibility with AME InformationPool

### 6. Coordinate System Completion

Added coordinate system information completion in the Python layer:

- Calculates and adds `original_min` and `original_max`
- Ensures complete coordinate system information
- Maintains consistency with original point cloud coordinates

## Output Format

SpatialLM now outputs JSON in the following format:

```json
{
  "scene_meta": {
    "model": "SpatialLM1.1-Qwen-0.5B",
    "coordinate_system": {
      "normalized_range": [0, 32],
      "original_min": [x, y, z],
      "original_max": [x, y, z]
    }
  },
  "architectural": [
    {
      "type": "wall",
      "start": [x,y,z],
      "end": [x,y,z],
      "height": h,
      "thickness": t,
      "confidence": c
    }
  ],
  "objects": [
    {
      "class": {
        "raw": "sofa",
        "ame_domain": "Furniture.Seating.Sofa"
      },
      "position": [x,y,z],
      "rotation": rz,
      "scale": [sx,sy,sz],
      "confidence": c
    }
  ]
}
```

## Usage

### Basic Usage

```bash
python inference.py --point_cloud pcd/scene0000_00.ply --output scene0000_00.json --model_path manycore-research/SpatialLM1.1-Qwen-0.5B
```

### Specifying Detection Categories

```bash
python inference.py --point_cloud pcd/scene0000_00.ply --output scene0000_00.json --model_path manycore-research/SpatialLM1.1-Qwen-0.5B --detect_type object --category bed nightstand
```

### Batch Processing

```bash
python inference.py --point_cloud SpatialLM-Testset/pcd --output SpatialLM-Testset/pred --model_path manycore-research/SpatialLM1.1-Qwen-0.5B
```

## Technical Highlights

1. **Strongly Constrained JSON Output**: By repeatedly emphasizing "JSON only" and setting deterministic generation parameters, the model consistently outputs valid JSON

2. **AME Semantic Domain Mapping**: Directly injects AME semantic domain mapping into the prompt, ensuring the output includes the `ame_domain` field

3. **Coordinate System Integrity**: Computes and supplements coordinate system information at the code level, ensuring consistency with original point cloud coordinates

4. **Error Handling**: Implements JSON validation and automatic retry mechanism, improving system robustness

5. **Backward Compatibility**: Preserves the original command-line parameter structure while only changing the output format

## Examples

### Example 1: Basic Inference

```bash
# Download sample point cloud
huggingface-cli download manycore-research/SpatialLM-Testset pcd/scene0000_00.ply --repo-type dataset --local-dir .

# Run inference
python inference.py --point_cloud pcd/scene0000_00.ply --output scene0000_00.json --model_path manycore-research/SpatialLM1.1-Qwen-0.5B
```

### Example 2: Object Detection with Specific Categories

```bash
python inference.py --point_cloud pcd/scene0000_00.ply --output scene0000_00_objects.json --model_path manycore-research/SpatialLM1.1-Qwen-0.5B --detect_type object --category sofa chair coffee_table
```

### Example 3: Architectural Elements Only

```bash
python inference.py --point_cloud pcd/scene0000_00.ply --output scene0000_00_arch.json --model_path manycore-research/SpatialLM1.1-Qwen-0.5B --detect_type arch
```

## Conclusion

The modifications to SpatialLM1.1-Qwen-0.5B enable it to directly integrate with AME InformationPool by providing structured, JSON-formatted output with AME semantic domain mapping and complete coordinate system information. This integration facilitates the use of SpatialLM's 3D scene understanding capabilities within the AME ecosystem, opening up new possibilities for applications in embodied robotics, autonomous navigation, and other complex 3D scene analysis tasks.

The implementation maintains backward compatibility while introducing new features, ensuring a smooth transition for existing users while providing enhanced functionality for AME integration.