import './style.scss';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'lil-gui';
import fragmentShader from './shaders/fragmentShader.glsl';
import vertexShader from './shaders/vertexShader.glsl';
import cover from '/1.jpg';

export default class Experience {
  constructor(container) {
    this.container = document.querySelector(container);

    // Sizes
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Parameters
    this.parameters = {
      columns: 16,
      rows: 9,
      multiplier: 18,
    };

    this.resize = () => this.onResize();
  }

  init() {
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.createControls();
    this.addTextures();
    this.createMesh();
    this.createClock();

    this.addListeners();

    this.renderer.setAnimationLoop(() => {
      this.render();
      this.update();
    });
  }

  createScene() {
    this.scene = new THREE.Scene();
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.width / this.height,
      0.1,
      10000
    );
    this.camera.position.set(0, 0, 150);
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.renderer.setClearColor(0xeffffff);

    this.container.appendChild(this.renderer.domElement);
  }

  createControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
  }

  addTextures() {
    this.textureLoader = new THREE.TextureLoader();
    this.texture = this.textureLoader.load(cover);
  }

  createMesh() {
    const vertices = [];

    for (
      let i = 0;
      i < this.parameters.columns * this.parameters.multiplier;
      i++
    ) {
      for (
        let j = 0;
        j < this.parameters.rows * this.parameters.multiplier;
        j++
      ) {
        const point = [i, j, 0];

        vertices.push(...point);
      }
    }

    this.geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(vertices);

    this.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );

    this.geometry.center();

    this.material = new THREE.ShaderMaterial({
      transparent: true,

      vertexShader,
      fragmentShader,
      uniforms: {
        uPointSize: { value: 8 },
        uTexture: { value: this.texture },
        uColumns: {
          value: this.parameters.columns * this.parameters.multiplier,
        },
        uRows: {
          value: this.parameters.rows * this.parameters.multiplier,
        },
      },
    });
    this.mesh = new THREE.Points(this.geometry, this.material);

    this.scene.add(this.mesh);
  }

  createClock() {
    this.clock = new THREE.Clock();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  update() {
    this.controls.update();
  }

  addListeners() {
    window.addEventListener('resize', this.resize, { passive: true });
  }

  onResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
}

const experience = new Experience('#app').init();
