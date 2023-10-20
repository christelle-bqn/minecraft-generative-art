precision mediump float;
varying vec2 vUv;
uniform float seed;

#define PI 3.14159
#define gridSize 256.0
#define octaves 5.0

// Blocs colors
#define dirt vec3(0.6, 0.4, 0.2)
#define stone vec3(0.5, 0.5, 0.5)
#define water vec3(0.0, 0.0, 1.0)

float when_gt(float x, float y) {
    return max(sign(x - y), 0.0);
}

float when_lt(float x, float y) {
    return max(sign(y - x), 0.0);
}

void main() {
    vec2 pixelatedUv = floor(vUv * gridSize) / gridSize;

    float elevation = 0.0;
    for (float i = 0.0; i < octaves; i++) {
        float frequency = pow(3.0, i);
        float amplitude = pow(0.5, i);
        elevation += snoise(pixelatedUv * frequency + seed) * amplitude;
    }

    vec3 color;
    color = mix(dirt, water, when_lt(elevation, 0.05));
    color = mix(color, stone, when_gt(elevation, 0.6));

    gl_FragColor = vec4(color, 1.0);
}