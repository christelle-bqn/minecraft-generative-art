import { ShaderMaterial } from "three";

export default class MapMaterial extends ShaderMaterial {
  constructor(params) {
    super({
      ...params,
    });
  }

  onBeforeCompile(shader, renderer) {
    super.onBeforeCompile(shader, renderer);

    console.log(shader);
  }

  update(time) {}
}
