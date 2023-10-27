import {ShaderMaterial, Vector2} from "three";
import Experience from "../Experience";

export default class MapMaterial extends ShaderMaterial {
  constructor(params) {
    super({
      ...params,
    });

    this.experience = new Experience();
  }

  onBeforeCompile(shader, renderer) {
    super.onBeforeCompile(shader, renderer);

    const snoise2 = glsl`#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)`;

    const seed = this.experience.seed;

    console.log("Using seed: " + seed)

    this.computeCustomSeed(seed);

    let cameraPosition = new Vector2(0, 0);
    let isDragging = false;
    let startDragPosition = new Vector2(0, 0);
    let lastCameraPosition = new Vector2(0, 0);
    let mousePosition = new Vector2(0, 0);

    window.addEventListener("mousedown", (event) => {
      isDragging = true;
      startDragPosition.set(event.clientX, event.clientY);
      lastCameraPosition.copy(cameraPosition);
    });

    window.addEventListener("mousemove", (event) => {
      if (isDragging) {
        window.document.body.style.cursor = "grabbing";
        let dx = -((event.clientX - startDragPosition.x) / window.innerWidth) * 0.5;
        let dy = ((event.clientY - startDragPosition.y) / window.innerHeight) * 0.5;

        cameraPosition.x = lastCameraPosition.x + dx;
        cameraPosition.y = lastCameraPosition.y + dy;
      }

    });

    window.addEventListener("mouseup", () => {
      isDragging = false;
      window.document.body.style.cursor = "default";
    });

    window.addEventListener("mouseout", () => {
      isDragging = false;
      window.document.body.style.cursor = "default";
    });

    this.zoomLevel = 600.0;
    window.addEventListener("wheel", (event) => {
      const zoomFactor = 0.1;
      const previousZoomLevel = this.zoomLevel;

      // Determine the direction of the zoom
      if (event.deltaY > 0) {
        this.zoomLevel += zoomFactor;
      } else {
        this.zoomLevel -= zoomFactor;
      }
      this.zoomLevel = Math.max(0.1, this.zoomLevel);

      // Compute focal point in normalized device coordinates
      let focalPoint = new Vector2(
          (event.clientX / window.innerWidth) * 2 - 1,
          -(event.clientY / window.innerHeight) * 2 + 1
      );

      // Zoom focal adjustment
      focalPoint.sub(cameraPosition).multiplyScalar((this.zoomLevel - previousZoomLevel) / previousZoomLevel).add(cameraPosition);

      // Update camera position
      cameraPosition.set(focalPoint.x, focalPoint.y);
    });

    shader.uniforms.aspectRatio = {value: window.innerWidth / window.innerHeight};
    shader.uniforms.isStarted = {value: false};
    shader.uniforms.cameraPos = {value: cameraPosition};
    shader.uniforms.mousePos = {value: mousePosition};
    shader.uniforms.seed = {value: this.seed};
    shader.fragmentShader = shader.fragmentShader.replace("void main() {", [
      snoise2,
      'void main() {',
    ].join('\n'));
  }

  computeCustomSeed(customSeed) {
    console.log("Seed type: " + typeof customSeed, customSeed)

    if (typeof customSeed === "string") {
      customSeed = this.hashStringToNumber(customSeed);
      console.log("Converted seed string to hash: " + customSeed);
    }

    // Ensure the seed is within bounds
    this.seed = customSeed % 1000.0;
  }

  hashStringToNumber(str) {
    let hash = 0, i, chr;
    for (i = 0; i < str.length; i++) {
      chr   = str.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  generateRandomSeed() {
    return Math.floor(Math.random() * 1000);
  }

  lerp(a, b, t) {
    return a + (b - a) * t;
  }

  update(time) {
    if (this.uniforms) {
      this.uniforms.zoomLevel = { value: this.zoomLevel }
      this.uniforms.time = { value: time * 0.001 }
    }

    /*if (this.experience.isExperienceStarted && this.zoomLevel < 800) {
      const targetZoomLevel = 800;
      const zoomLevel = this.lerp(this.zoomLevel, targetZoomLevel, 0.01);
      // Floor the zoom level to 2 decimal places
      this.zoomLevel = Math.floor(zoomLevel * 100) / 100;
    }*/
  }
}
