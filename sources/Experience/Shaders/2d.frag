precision mediump float;
varying vec2 vUv;
uniform float seed;

#define PI 3.14159
#define gridSize 128.0
#define mapDezoom 5.0
#define octaves 5.0

// Blocs colors
#define dirt vec3(0.6, 0.4, 0.2)
#define grass vec3(0.25, 0.5, 0.1)
#define stone vec3(0.5, 0.5, 0.5)
#define snow vec3(1.0, 1.0, 1.0)
#define water vec3(0.0, 0.0, 1.0)

float when_gt(float x, float y) {
    return max(sign(x - y), 0.0);
}

float when_lt(float x, float y) {
    return max(sign(y - x), 0.0);
}

vec4 when_eq(vec4 x, vec4 y) {
    return 1.0 - abs(sign(x - y));
}

void main() {
    vec2 pixelatedUv = floor(vUv * gridSize) / gridSize;

    float elevation = 0.0;
    for (float i = 0.0; i < octaves; i++) {
        float frequency = pow(mapDezoom, i);
        float amplitude = pow(0.5, i);
        elevation += snoise(pixelatedUv * frequency + seed) * amplitude;
    }

    vec3 color;
    color = mix(dirt, water, when_lt(elevation, 0.01));
    color = mix(color, grass, when_gt(elevation, 0.01) * when_lt(elevation, 0.3));
    color = mix(color, stone, when_gt(elevation, 0.6));
    color = mix(color, snow, when_gt(elevation, 0.9));

    gl_FragColor = vec4(color, 1.0);
}
