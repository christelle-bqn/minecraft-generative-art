import { ShaderMaterial } from "three";

export default class MapMaterial extends ShaderMaterial {
  constructor(params) {
    super({
      ...params,
    });
  }

  onBeforeCompile(shader, renderer) {
    super.onBeforeCompile(shader, renderer);

    const snoise2 = glsl`#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)`;

    // Ask the user to provide a seed
    const seed = window.prompt("Please enter a seed (text or number)", this.generateRandomSeed().toString());

    console.log("Using seed: " + seed)

    this.computeCustomSeed(seed);

    // Add the seed to the shader
    shader.uniforms.seed = { value: this.seed };

    shader.fragmentShader = shader.fragmentShader.replace("void main() {", [
      snoise2,
      'void main() {',
    ].join('\n'));

    console.log(shader.fragmentShader);
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

  update(time) {}
}
