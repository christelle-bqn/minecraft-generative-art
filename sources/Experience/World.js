import * as THREE from "three";
import Experience from "./Experience.js";
import MapMaterial from "./Materials/MapMaterial";
import fragmentShader from "./Shaders/2d.frag";
import vertexShader from "./Shaders/2d.vert";

export default class World {
  constructor(_options) {
    this.experience = new Experience();
    this.config = this.experience.config;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.resources.on("groupEnd", (_group) => {
      if (_group.name === "base") {
        this.setScene();
      }
    });
  }

  setScene() {
    // Map instanciation
    this.mapMaterial = new MapMaterial({
      fragmentShader,
      vertexShader,
    });

    const map = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), this.mapMaterial);

    this.scene.add(map);
  }

  resize() {}

  update() {
    if (this.mapMaterial) {
      this.mapMaterial.update(this.experience.time.elapsed);
    }
  }

  destroy() {}
}
