precision mediump float;
varying vec2 vUv;
uniform float seed;

#define PI 3.14159
#define gridSize 128.0
#define octaves 5.0

// Blocs colors
#define dirt vec3(0.6, 0.4, 0.2)
#define stone vec3(0.5, 0.5, 0.5)
#define water vec3(0.0, 0.0, 1.0)

void main() {
    vec2 pixelatedUv = floor(vUv * gridSize) / gridSize;

//    float elevation = snoise(pixelatedUv) * .5 / seed;

    float elevation = 0.0;

    for (float i = 0.0; i < octaves; i++) {
        float frequency = pow(3.0, i);
        float amplitude = pow(0.5, i);
        elevation += snoise(pixelatedUv * frequency + seed) * amplitude;
    }


    vec3 color;
    if (elevation < 0.05) {
        color = water;
    } else if (elevation < 0.6) {
        color = dirt;
    } else {
        color = stone;
    }

    gl_FragColor = vec4(color, 1.0);
}