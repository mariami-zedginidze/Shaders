import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import neptuneVertexShader from './shaders/neptune/vertex.glsl'
import neptuneFragmentShader from './shaders/neptune/fragment.glsl'
import atmosphereVertexShader from './shaders/atmosphere/vertex.glsl'
import atmosphereFragmentShader from './shaders/atmosphere/fragment.glsl'

/**
 * Base
 */

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Loaders
const textureLoader = new THREE.TextureLoader()

/**
 * neptune
 */

// Textures
const neptuneDayTexture = textureLoader.load('./neptune/neptune.jpg')
neptuneDayTexture.colorSpace = THREE.SRGBColorSpace
neptuneDayTexture.anisotropy = 8

// Colors
const nightColor = new THREE.Vector4(0.0, 0.0, 0.0, 0.9);

// Mesh
const neptuneGeometry = new THREE.SphereGeometry(2, 64, 64)
const neptuneMaterial = new THREE.ShaderMaterial({
    vertexShader: neptuneVertexShader,
    fragmentShader: neptuneFragmentShader,
    uniforms:
    {
        uDayTexture: new THREE.Uniform(neptuneDayTexture),
        uNightColor: { value: nightColor },
        uSunDirection: new THREE.Uniform(new THREE.Vector3(0, 0, 1)),
        uAtmosphereDayColor: { value: new THREE.Color('#3a0ca3') },
        uAtmosphereTwilightColor: { value: new THREE.Color('#7209b7') }
    }
})
const neptune = new THREE.Mesh(neptuneGeometry, neptuneMaterial)
scene.add(neptune)

// Atmosphere
const atmosphereMaterial = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    transparent: true,
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    uniforms:
    {
        uSunDirection: new THREE.Uniform(new THREE.Vector3(0, 0, 1)),
        uAtmosphereDayColor: { value: new THREE.Color('#3a0ca3') },
        uAtmosphereTwilightColor: { value: new THREE.Color('#7209b7') }
    },
})

const atmosphere = new THREE.Mesh(neptuneGeometry, atmosphereMaterial)
atmosphere.scale.set(1.04, 1.04, 1.04)
scene.add(atmosphere)

/**
 * Sun
 */
// Coordinates
const sunSpherical = new THREE.Spherical(1, Math.PI * 0.5, 0.0)
const sunDirection = new THREE.Vector3()

// Update
const updateSun = () => {
    // Sun direction
    sunDirection.setFromSpherical(sunSpherical)

    // Uniforms
    neptuneMaterial.uniforms.uSunDirection.value.copy(sunDirection)
    atmosphereMaterial.uniforms.uSunDirection.value.copy(sunDirection)
}

updateSun()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    sizes.pixelRatio = Math.min(window.devicePixelRatio, 2)

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(sizes.pixelRatio)
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 12
camera.position.y = -2
camera.position.z = -4
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(sizes.pixelRatio)
renderer.setClearColor('#000011')

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()