import {
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  PlaneGeometry,
  Mesh,
  Clock,
  Vector2,
  RepeatWrapping,
} from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

import { textureLoader } from "./loaders";

import { planeMaterial } from "./materials/PlaneMaterial";

class App {
  #resizeCallback = () => this.#onResize();

  constructor(container) {
    this.container = document.querySelector(container);
    this.screen = new Vector2(
      this.container.clientWidth,
      this.container.clientHeight
    );
  }

  async init() {
    this.#createScene();
    this.#createCamera();
    this.#createRenderer();

    await this.#loadTextures();

    this.#createplane();
    this.#createClock();
    this.#addListeners();
    this.#createControls();
    this.#createPostprocess();

    if (window.location.hash.includes("#debug")) {
      const panel = await import("./Debug.js");
      new panel.Debug(this);
    }

    this.renderer.setAnimationLoop(() => {
      this.#update();
      this.#render();
    });

    console.log(this);
  }

  destroy() {
    this.renderer.dispose();
    this.#removeListeners();
  }

  #update() {
    const elapsed = this.clock.getElapsedTime();

    this.plane.material.uniforms.u_time.value = elapsed;
  }

  #render() {
    this.composer.render();
  }

  #createScene() {
    this.scene = new Scene();
  }

  #createCamera() {
    this.camera = new PerspectiveCamera(
      75,
      this.screen.x / this.screen.y,
      0.1,
      100
    );
    this.camera.position.set(0.0, 0.0, 2);
  }

  #createRenderer() {
    this.renderer = new WebGLRenderer({
      alpha: true,
      antialias: window.devicePixelRatio === 1,
    });

    this.container.appendChild(this.renderer.domElement);

    this.renderer.setSize(this.screen.x, this.screen.y);
    this.renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio));
    this.renderer.setClearColor(0x121212);
    this.renderer.physicallyCorrectLights = true;
  }

  #createPostprocess() {
    const renderPass = new RenderPass(this.scene, this.camera);

    this.bloomPass = new UnrealBloomPass(this.screen, 1.4, 0.4, 0.7);

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(renderPass);
    this.composer.addPass(this.bloomPass);
  }

  async #loadTextures() {
    const [matcap, noise] = await textureLoader.load([
      "/matcap-01.png",
      "/noise.jpg",
    ]);

    noise.wrapS = noise.wrapT = RepeatWrapping;

    this.textures = {
      matcap,
      noise,
    };
  }

  #createplane() {
    const geometry = new PlaneGeometry(2, 2);

    this.plane = new Mesh(geometry, planeMaterial);

    this.plane.material.uniforms.matcap.value = this.textures.matcap;
    this.plane.material.uniforms.t_noise.value = this.textures.noise;

    this.plane.position.set(0.0, 0.0, 0.0);
    this.scene.add(this.plane);
  }

  #createControls() {
    this.orbitControls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );
  }

  #createClock() {
    this.clock = new Clock();
  }

  #addListeners() {
    window.addEventListener("resize", this.#resizeCallback, { passive: true });
  }

  #removeListeners() {
    window.removeEventListener("resize", this.#resizeCallback, {
      passive: true,
    });
  }

  #onResize() {
    this.screen.set(this.container.clientWidth, this.container.clientHeight);

    this.camera.aspect = this.screen.x / this.screen.y;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.screen.x, this.screen.y);
  }
}

const app = new App("#app");
app.init();
