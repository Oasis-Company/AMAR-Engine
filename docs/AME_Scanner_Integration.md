# AME Scanner Integration Guide

## Overview

This guide provides instructions on how to use the AME Scanner integration in AMAR Engine. AME Scanner is a tool for analyzing 3D Gaussian Splatting (3DGS) files and generating spatial structure information.

## Prerequisites

- AMAR Engine installed
- AME Scanner built and available in the `scanner/build/Release` directory
- 3DGS files in .ply or .splat format

## Usage

### 1. Using the API

#### Process 3DGS File

**Endpoint:** `POST /api/scanner/process`

**Request Body:**
```json
{
  "inputPath": "path/to/3dgs/file.ply"
}
```

**Response:**
```json
{
  "entities": [
    {
      "id": "entity-1",
      "name": "Spatial Cluster 1",
      "type": "cluster",
      "aeid": "AST-202602101501-87654321-DCBA",
      "metaclass": "Object",
      "properties": {
        "density": "0.85",
        "volume": "1.2 m³",
        "surface_area": "5.6 m²"
      }
    }
  ],
  "metadata": {
    "version": "1.0.0",
    "timestamp": "2026-02-26T10:00:00Z",
    "num_entities": 1,
    "processing_time_ms": 1234
  }
}
```

#### Set Scanner Path

**Endpoint:** `POST /api/scanner/set-path`

**Request Body:**
```json
{
  "scannerPath": "path/to/scanner-cli.exe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Scanner path updated successfully"
}
```

### 2. Using the UI

1. Open the AMAR Engine UI
2. Click on the "AME Scanner" tab in the left panel
3. Upload 3DGS files (.ply or .splat) using the file picker or by dragging and dropping
4. The scanner will process the files and generate spatial structure information
5. The results will be displayed in the scene graph and 3D view

### 3. Using the TypeScript API

```typescript
import AMAREngine from '@/index';

const engine = new AMAREngine();

async function process3DGSFile() {
  try {
    const result = await engine.getScannerIntegration().process3DGSFile('path/to/3dgs/file.ply');
    console.log('Processing result:', result);
  } catch (error) {
    console.error('Error processing 3DGS file:', error);
  }
}

process3DGSFile();
```

## Output Format

The AME Scanner produces a SpatialStructurePackage that contains:

- **Scene Bounding Box:** The bounding box of the entire scene
- **Entities:** Spatial clusters or objects identified in the 3DGS data
- **Spatial Relationships:** Relationships between entities
- **Metadata:** Processing information

## Troubleshooting

### Common Issues

1. **Scanner not found:** Make sure the scanner executable is in the correct location or set the path using the API
2. **File format error:** Ensure you're using .ply or .splat files
3. **Processing error:** Check the scanner logs for more details

### Logs

Scanner logs are available in the console when running AMAR Engine in development mode.

## Example Workflow

1. **Prepare 3DGS files:** Convert your 3D models to 3DGS format
2. **Process files:** Use the API or UI to process the files
3. **Analyze results:** Review the generated spatial structure information
4. **Integrate with AMAR Engine:** Use the results in your AMAR Engine projects

## Performance Considerations

- Processing large 3DGS files may take time
- The scanner uses CPU-intensive algorithms
- For best performance, use files with moderate size and complexity

## Conclusion

The AME Scanner integration provides a powerful tool for analyzing 3DGS data and generating spatial structure information. This information can be used to enhance your AMAR Engine projects with more accurate spatial understanding.