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

    const snoise2 = glsl`#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)`;
 
    shader.fragmentShader = shader.fragmentShader.replace("float fbm(in vec2 st) {", [
      snoise2,
      'float fbm(in vec2 st) {',
    ].join('\n'));

    console.log(shader.fragmentShader)
  }

  update(time) {
    if (this.uniforms) {
      this.uniforms.zoomLevel = { value: this.zoomLevel }
      this.uniforms.u_time = { value: time * 0.001 }
    }
  }
}