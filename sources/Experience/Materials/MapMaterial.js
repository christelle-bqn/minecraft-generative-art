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

    // Ask the user to provide a seed
    const seed = window.prompt("Please enter a seed par pitié (text or number)", this.generateRandomSeed().toString());

    console.log("Using seed: " + seed)

    this.computeCustomSeed(seed);

    let cameraPosition = new Vector2(0, 0);
    let isDragging = false;
    let startDragPosition = new Vector2(0, 0);
    let lastCameraPosition = new Vector2(0, 0);

    window.addEventListener("mousedown", (event) => {
      isDragging = true;
      startDragPosition.set(event.clientX, event.clientY);
      lastCameraPosition.copy(cameraPosition);
    });

    window.addEventListener("mousemove", (event) => {
      if (isDragging) {
        window.document.body.style.cursor = "grabbing";
        let dx = -((event.clientX - startDragPosition.x) / window.innerWidth) * 1.4;
        let dy = ((event.clientY - startDragPosition.y) / window.innerHeight) * 1.4;

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

    this.zoomLevel = 1.0;
    window.addEventListener("wheel", (event) => {
      const zoomFactor = 0.1; // This value can be adjusted to change the zoom speed
      if (event.deltaY > 0) {
        this.zoomLevel += zoomFactor;
      } else {
        this.zoomLevel -= zoomFactor;
      }
      this.zoomLevel = Math.max(0.1, this.zoomLevel); // Ensure it doesn't go too small
    });

    shader.uniforms.cameraPos = {value: cameraPosition};
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

  update(time) {
    if (this.uniforms) {
      this.uniforms.zoomLevel = { value: this.zoomLevel }
      this.uniforms.time = { value: time * 0.001 }
    }
  }
}
