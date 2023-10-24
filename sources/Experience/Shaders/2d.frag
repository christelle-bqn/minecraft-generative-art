precision mediump float;
varying vec2 vUv;
uniform float seed;
uniform vec2 cameraPos;
uniform float zoomLevel;
uniform float time;

#define PI 3.14159
#define gridSize 128.0

// Blocs colors
#define dirt vec3(0.6, 0.4, 0.2)
#define grass vec3(0.25, 0.5, 0.1)
#define stone vec3(0.5, 0.5, 0.5)
#define snow vec3(1.0, 1.0, 1.0)
#define water vec3(0.0, 0.0, 1.0)
#define sand vec3(1.0, 1.0, 0.0)

float when_gt(float x, float y) {
    return max(sign(x - y), 0.0);
}

float when_lt(float x, float y) {
    return max(sign(y - x), 0.0);
}

float when_eq(float x, float y) {
    return 1.0 - abs(sign(x - y));
}

void main() {
//    vec2 pixelatedUv = floor(vUv * gridSize) / gridSize;
    vec2 offsetUv = vUv + cameraPos;
    vec2 pixelatedUv = floor(offsetUv * gridSize) / gridSize;
//    vec2 pixelatedUv = floor(offsetUv * gridSize * zoomFactor) / (gridSize * zoomFactor);

    // Elevations
    float elevation = 0.0;

    // Properties
    const int octaves2 = 6;
    float lacunarity = 3.0;
    float gain = .6;

    // Initial values
    float amplitude = 0.8;
//    float amplitude = zoomFactor;
    float frequency = .3;

    vec2 pixelatedCenteredUv = pixelatedUv - vec2(0.5, 0.5);
    pixelatedCenteredUv *= zoomLevel;
    pixelatedCenteredUv += vec2(0.5, 0.5);


    // Loop of octaves
    for (int i = 0; i < octaves2; i++) {
        elevation += amplitude * snoise(frequency * pixelatedCenteredUv + seed);
//        elevation += amplitude * snoise(frequency * pixelatedUv + seed);
        frequency *= lacunarity;
        amplitude *= gain;
    }


    // Remap elevation from [-1, 1] to [0, 1]
    elevation = (elevation + 1.0) * 0.5;

    // Generate temperature and humidity
    float temperature = floor(snoise(.5 * pixelatedCenteredUv * .8 + seed) * 5.0) / 5.0;
    temperature = (temperature + 1.0) * 0.5;
    float humidity = floor(snoise((pixelatedCenteredUv + .4) * .8 + seed) * 5.0) / 5.0;
    humidity = (humidity + 1.0) * 0.5;

    vec3 color;


    // Test when elevation is 0
//    color = vec3(elevation, elevation, elevation);
//    color = vec3(snoise(frequency* pixelatedUv + seed), snoise(frequency * pixelatedUv + seed), snoise(frequency * pixelatedUv + seed));
//    color = vec3(temperature, temperature, temperature);
    color = vec3(humidity, humidity, humidity);
//

//    if (temperature < 0.3 && humidity > 0.8 || elevation < 0.3) {
//        color = vec3(0.0, 0.0, 1.0);
//    }
    if (humidity == 0.4) {
        color = vec3(0.0, 0.0, 1.0);
    }
//    color = mix(color, vec3(0.0, 0.0, 1.0), when_gt(humidity, .8));
//    color = mix(color, vec3(1.0, 1.0, 0.0), when_lt(elevation, 0.000000000001));

    gl_FragColor = vec4(color, 1.0);
}

