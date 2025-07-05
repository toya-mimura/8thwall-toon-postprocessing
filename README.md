# Niantic Studio Toon Shader
[日本語はこちら]()
[Read this detail]()

A custom toon/cel-shading effect component for Niantic Studio (formerly 8th Wall Studio) that transforms your 3D models into a stylized, cartoon-like appearance.

## Features

- **Cel-shading/Toon lighting effect** with customizable parameters
- **Texture preservation** - maintains original colors and textures
- **Adjustable intensity** - blend between realistic and toon lighting
- **Configurable steps** - control the number of lighting gradations
- **Safe implementation** - avoids conflicts with system components

## Demo

Transform your realistic 3D models into stylized, anime-inspired visuals:

- Before: Standard PBR lighting
- After: Stepped toon lighting with preserved textures

## Installation

1. **Download the shader file**
   ```
   wget https://raw.githubusercontent.com/[your-username]/niantic-studio-toon-shader/main/toon-postprocess.js
   ```

2. **Upload to Niantic Studio**
   - Open your Niantic Studio project
   - Drag and drop `toon-postprocess.js` into the **Assets** section

3. **Apply to your scene**
   - Select the **Camera** entity in the Hierarchy
   - Click **Add Component** in the Inspector
   - Choose **Custom Component** → **toon-postprocess**

## Parameters

| Parameter | Type | Range | Default | Description |
|-----------|------|-------|---------|-------------|
| `intensity` | Float | 0.0 - 1.0 | 0.8 | Strength of the toon effect (0.0 = realistic, 1.0 = full toon) |
| `steps` | Float | 2.0 - 8.0 | 4.0 | Number of lighting steps (2.0 = sharp contrast, 8.0 = smooth gradations) |

## Usage Examples

### Basic Setup
```javascript
// The component is automatically applied when added to the Camera entity
// Adjust parameters in the Inspector panel
```

### Recommended Settings

**Anime/Manga Style:**
- Intensity: `0.9`
- Steps: `3.0`

**Soft Toon Look:**
- Intensity: `0.6`
- Steps: `6.0`

**High Contrast:**
- Intensity: `1.0`
- Steps: `2.0`

## Technical Details

### How it Works

The shader applies a custom **fragment shader** to all mesh objects in the scene:

1. **Texture Sampling**: Preserves original diffuse textures and base colors
2. **Lighting Calculation**: Computes dot product between surface normal and light direction
3. **Step Quantization**: Divides lighting into discrete steps based on the `steps` parameter
4. **Intensity Blending**: Mixes original and stepped lighting based on `intensity` parameter

### Shader Features

- **Vertex Shader**: Passes through normals and UV coordinates
- **Fragment Shader**: 
  - Texture-aware color sampling
  - Stepped lighting calculation
  - Configurable parameters via uniforms
  - Minimum brightness clamping

### Compatibility

- ✅ **Niantic Studio** (latest version)
- ✅ **Three.js r128+**
- ✅ **WebGL 1.0/2.0**
- ✅ **GLB/GLTF models**
- ✅ **Textured and untextured materials**
