// toon-postprocess.js の修正版（テクスチャ対応）
import * as ecs from '@8thwall/ecs'

let isInitialized = false

ecs.registerComponent({
  name: 'toon-postprocess',
  schema: {
    intensity: ecs.f32,
    steps: ecs.f32
  },
  schemaDefaults: {
    intensity: 0.8,
    steps: 4.0
  },
  
  add: (world, component) => {
    console.log('Toon postprocess component added!')
    
    setTimeout(() => {
      if (!isInitialized) {
        setupToonEffectWithTextures(world, component)
        isInitialized = true
      }
    }, 2000)
  }
})

function setupToonEffectWithTextures(world, component) {
  console.log('Setting up toon effect with texture support...')
  
  const intensity = component.schema.intensity
  const steps = component.schema.steps
  
  const scene = world.scene
  
  if (scene) {
    scene.traverse((child) => {
      if (child.isMesh && child.material && child.name) {
        if (child.name.includes('Camera') || 
            child.name.includes('Light') || 
            child.name.includes('Helper') ||
            child.name.includes('Gizmo')) {
          return
        }
        
        console.log('Applying texture-aware toon shader to:', child.name)
        
        try {
          const originalMaterial = child.material
          
          // テクスチャ対応のカスタムシェーダー
          const toonShader = new THREE.ShaderMaterial({
            uniforms: {
              baseColor: { value: originalMaterial.color || new THREE.Color(0x888888) },
              colorMap: { value: originalMaterial.map || null },
              lightDirection: { value: new THREE.Vector3(1, 1, 1).normalize() },
              intensity: { value: intensity },
              steps: { value: steps },
              hasTexture: { value: originalMaterial.map ? 1.0 : 0.0 }
            },
            vertexShader: `
              varying vec3 vNormal;
              varying vec2 vUv;
              
              void main() {
                vNormal = normalize(normalMatrix * normal);
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `,
            fragmentShader: `
              uniform vec3 baseColor;
              uniform sampler2D colorMap;
              uniform vec3 lightDirection;
              uniform float intensity;
              uniform float steps;
              uniform float hasTexture;
              varying vec3 vNormal;
              varying vec2 vUv;
              
              void main() {
                // テクスチャ色を取得
                vec3 textureColor = baseColor;
                if (hasTexture > 0.5) {
                  vec4 texColor = texture2D(colorMap, vUv);
                  textureColor = texColor.rgb * baseColor;
                }
                
                // ライティング計算
                float lightIntensity = dot(vNormal, lightDirection);
                lightIntensity = (lightIntensity + 1.0) * 0.5; // -1〜1 を 0〜1 に変換
                
                // ステップ化
                float stepSize = 1.0 / steps;
                float steppedIntensity = ceil(lightIntensity / stepSize) * stepSize;
                
                // intensityで効果の強さを調整
                float finalIntensity = mix(lightIntensity, steppedIntensity, intensity);
                finalIntensity = max(finalIntensity, 0.3); // 最低限の明るさ
                
                // 最終色 = テクスチャ色 × ライティング
                vec3 finalColor = textureColor * finalIntensity;
                
                gl_FragColor = vec4(finalColor, 1.0);
              }
            `,
            transparent: originalMaterial.transparent,
            side: originalMaterial.side || THREE.FrontSide
          })
          
          child.material = toonShader
          console.log('Applied texture-aware toon shader to:', child.name)
          
        } catch (error) {
          console.error('Failed to apply shader to:', child.name, error)
        }
      }
    })
    
    console.log('Texture-aware toon effect setup completed!')
  }
}
