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
        this.animateBird();
      }
    });
  }

  setBirdModel() {
    this.mesh = this.resources.items.bird;
    this.bird = this.mesh.scene;

    this.mixer = new THREE.AnimationMixer(this.bird);

    for (let i = 0; i < this.mesh.animations.length; i++) {
      const animation = this.mesh.animations[i];
      const action = this.mixer.clipAction(animation);
      action.loop = THREE.LoopRepeat;
      action.play();
    }

    this.bird.originPosition = {x: -0.4, y: -0.4};

    this.bird.position.set(-0.8, -0.6, 0.5);
    this.bird.scale.set(0.12, 0.12, 0.12);

    this.scene.add(this.bird);
  }

  animateBird() {
    let pathPosition = [
      new THREE.Vector3(-0.7, -0.7, 0.5),
      new THREE.Vector3(-0.2, -0.3, 0.5),
      new THREE.Vector3(1.0, 0.8, 0.5),
      new THREE.Vector3(1.0, -0.6, 0.5),
      new THREE.Vector3(-0.8, 0.5, 0.5),
      new THREE.Vector3(-1.3, 0.8, 0.5),
      new THREE.Vector3(-1.1, 0.9, 0.5),
      new THREE.Vector3(-0.4, 0.5, 0.5),
      new THREE.Vector3(1.0, -0.7, 0.5),
      new THREE.Vector3(0.9, 0.7, 0.5),
      new THREE.Vector3(-0.7, -0.6, 0.5),
      new THREE.Vector3(-0.8, -0.6, 0.5),

    ]

    const curve = new THREE.CatmullRomCurve3(pathPosition)

    curve.closed = true
    curve.tension = 0.8
    const points = curve.getPoints(100)

    /* for (let i=0; i < 1 ; i += 0.001) {
      const position = curve.getPointAt(i);

      const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.002, 16, 16), new THREE.MeshBasicMaterial({color: '#ff0000'}))

      mesh.position.copy(position)

      this.scene.add(mesh)
    } */

    this.bird.pathPosition = points.map((current, index) => {
      const next = points[index + 1] || current;
      return next;
    })

    this.curve = curve;
    this.birdSplineProgress = 0;
  }


  setScene() {
    this.setBirdModel();

    const spotLight = new THREE.SpotLight(0xffffff, 5);
    spotLight.position.set(0, 0, 2.7);
    this.scene.add(spotLight);
    spotLight.castShadow = true;

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
        zoomLevel: {
            value: 5.0,
        }
      }
    });

    this.map = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.mapMaterial);

    this.sky = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.skyMaterial);

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

    this.sky.position.set(0, -0.014, 1.0);

    springButton.position.set(-0.45, 0.55);
    summerButton.position.set(-0.35, 0.55);
    autumnButton.position.set(-0.25, 0.55);
    winterButton.position.set(-0.15, 0.55);
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

  resize() {}

  update() {
    if (this.mapMaterial) {
      this.mapMaterial.update(this.experience.time.elapsed);
    }

    if (this.skyMaterial) {
      this.skyMaterial.update(this.experience.time.elapsed);
    }

    if (this.mixer) {
      this.mixer.update(this.experience.time.delta * 0.0008);
    }

    if (this.bird) {
      this.birdSplineProgress += 0.0013;

      this.birdSplineProgress = this.birdSplineProgress % 1.0;

      const position = this.curve.getPointAt(this.birdSplineProgress);

      this.bird.position.copy(position)

      this.targetPosition = this.curve.getPointAt((this.birdSplineProgress + 0.01) % 1.0);

      //this.bird.lookAt(this.targetPosition)

      const dir = new THREE.Vector3().copy(position).sub(this.targetPosition).normalize()
      const angle = Math.atan2(dir.y, dir.x)

      this.bird.rotation.z = angle + Math.PI / 2
    }

  }

  destroy() {}

}
