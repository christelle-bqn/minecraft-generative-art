import * as THREE from "three";
import Experience from "./Experience.js";
import MapMaterial from "./Materials/MapMaterial";
import SkyMaterial from "./Materials/SkyMaterial.js";
import fragmentShader from "./Shaders/2d.frag";
import vertexShader from "./Shaders/2d.vert";
import skyFragmentShader from './Shaders/sky.frag';
import skyVertexShader from './Shaders/sky.vert';

export default class World {
  constructor(_options) {
    this.experience = new Experience();
    this.config = this.experience.config;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.camera = this.experience.camera;
    this.mixer = new THREE.AnimationMixer();

    this.resources.on("groupEnd", (_group) => {
      if (_group.name === "base") {
        this.setScene();
        this.clickEvent();
        this.setBirdModel();
      }
    });
  }

  setScene() {

    const textureAutumnImg = this.resources.items.textureAutumn;
    textureAutumnImg.anisotropy = 16;
    textureAutumnImg.magFilter = THREE.NearestFilter;

    const textureWinterImg = this.resources.items.textureWinter;
    textureWinterImg.anisotropy = 16;
    textureWinterImg.magFilter = THREE.NearestFilter;

    const textureSpringImg = this.resources.items.textureSpring;
    textureSpringImg.anisotropy = 16;
    textureSpringImg.magFilter = THREE.NearestFilter;

    const textureSummerImg = this.resources.items.textureSummer;
    textureSummerImg.anisotropy = 16;
    textureSummerImg.magFilter = THREE.NearestFilter;
    console.log('set scene');

    // Map instanciation
    this.mapMaterial = new MapMaterial({
      fragmentShader,
      vertexShader,
      uniforms: {
        textureAutumn: {
          value: textureAutumnImg,
        },
        textureWinter: {
          value: textureWinterImg,
        },
        textureSpring: {
          value: textureSpringImg,
        },
        textureSummer: {
          value: textureSummerImg,
        },
        textureSeason: {
          value: textureSpringImg,
        },
      }
    });

    this.skyMaterial = new SkyMaterial({
      transparent: true,
      opacity: 0.2,
      fragmentShader: skyFragmentShader,
      vertexShader: skyVertexShader,
      uniforms: {
        u_resolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
      }
    });

    this.map = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), this.mapMaterial);

    const sky = new THREE.Mesh(new THREE.PlaneGeometry(0.67, 0.669), this.skyMaterial);

    this.buttonMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});

    const springButton = new THREE.Mesh(new THREE.PlaneGeometry(0.08, 0.08), this.buttonMaterial);
    const summerButton = new THREE.Mesh(new THREE.PlaneGeometry(0.08, 0.08), this.buttonMaterial);
    const autumnButton = new THREE.Mesh(new THREE.PlaneGeometry(0.08, 0.08), this.buttonMaterial);
    const winterButton = new THREE.Mesh(new THREE.PlaneGeometry(0.08, 0.08), this.buttonMaterial);

    springButton.name = 'springButton';
    summerButton.name = 'summerButton';
    autumnButton.name = 'autumnButton';
    winterButton.name = 'winterButton';

    this.map.position.set(0, -0.02);

    sky.position.set(0, -0.014, 1.0);

    springButton.position.set(-0.45, 0.55);
    summerButton.position.set(-0.35, 0.55);
    autumnButton.position.set(-0.25, 0.55);
    winterButton.position.set(-0.15, 0.55);

    // this.scene.add(map, springButton, summerButton, autumnButton, winterButton);
  }

  clickEvent() {
    const textureAutumnImg = this.resources.items.textureAutumn;
    const textureWinterImg = this.resources.items.textureWinter;
    const textureSpringImg = this.resources.items.textureSpring;
    const textureSummerImg = this.resources.items.textureSummer;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    window.addEventListener('click', (e) => {
      // Normalize mouse position to -1 to +1 range
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;


      // Update the picking ray with the camera and mouse position
      raycaster.setFromCamera(mouse, this.camera.instance);

      // Find intersected objects
      const intersects = raycaster.intersectObjects(this.scene.children);

      if (intersects.length > 0) {
        const firstIntersected = intersects[0].object;

        switch(firstIntersected.name) {
          case 'springButton':
            this.mapMaterial.uniforms.textureSeason.value = textureSpringImg;
          break;

          case 'summerButton':
            this.mapMaterial.uniforms.textureSeason.value = textureSummerImg;
          break;

          case 'autumnButton':
            this.mapMaterial.uniforms.textureSeason.value = textureAutumnImg;
          break;

          case 'winterButton':
            this.mapMaterial.uniforms.textureSeason.value = textureWinterImg;
          break;
        }
      }
    });
  }

  setBirdModel() {
    const bird = this.resources.items.bird;
    const mesh = bird.scene;

    this.mixer = new THREE.AnimationMixer(mesh);

    for (let i = 0; i < bird.animations.length; i++) {
      const animation = bird.animations[i];

      const action = this.mixer.clipAction(animation);
      action.play();
    }

    mesh.position.set(0, 0, 0.5);
    mesh.scale.set(0.12, 0.12, 0.12);
    mesh.rotation.x = Math.PI * 0.5;
    mesh.rotation.y = Math.PI * 0.25;

    this.scene.add(mesh);
  }

  resize() {}

  update() {
    if (this.mapMaterial) {
      this.mapMaterial.update(this.experience.time.elapsed);
    }

    if (this.skyMaterial) {
      this.skyMaterial.update(this.experience.time.elapsed);
    }

    if (this.setBirdModel) {
      this.mixer.update(this.experience.time.delta * 0.0005);
    }
  }

  destroy() {}
}
