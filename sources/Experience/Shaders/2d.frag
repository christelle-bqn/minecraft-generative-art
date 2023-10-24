precision mediump float;
varying vec2 vUv;
uniform float seed;
uniform sampler2D textureAutumn;
uniform sampler2D textureWinter;
uniform sampler2D textureSpring;
uniform sampler2D textureSummer;
uniform sampler2D textureSeason;
/* varying vec2 vTexCoordAutumn;
varying vec2 vTexCoordSpring; */
uniform vec2 cameraPos;
uniform float zoomLevel;
uniform float time;

#define PI 3.14159
#define gridSize 128.0

// Blocs colors
#define grass0 vec2(0.0, 3.0)
#define grass1 vec2(1.0, 3.0)
#define grass2 vec2(2.0, 3.0)
#define grass3 vec2(3.0, 3.0)

#define water0 vec2(0.0, 1.0)
#define water1 vec2(1.0, 1.0)
#define water2 vec2(2.0, 1.0)
#define water3 vec2(3.0, 1.0)

#define sand0 vec2(0.0, 2.0)
#define sand1 vec2(1.0, 2.0)
#define sand2 vec2(2.0, 2.0)
#define sand3 vec2(3.0, 2.0)

#define stone0 vec2(0.0, 0.0)
#define stone1 vec2(1.0, 0.0)
#define stone2 vec2(2.0, 0.0)
#define stone3 vec2(3.0, 0.0)

// 0 - 0.25 - 0.50 - 0.75 - 1.0

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
    vec2 offsetUv = vUv + cameraPos;
    vec2 pixelatedUv = floor(offsetUv * gridSize) / gridSize;

    // Elevations
    float elevation = 0.0;

    // Properties
    const int octaves2 = 6;
    float lacunarity = 3.0;
    float gain = .6;

    // Initial values
    float amplitude = 1.2;
    float frequency = .01;

    vec2 pixelatedCenteredUv = pixelatedUv - vec2(0.5);
    pixelatedCenteredUv *= zoomLevel;
    pixelatedCenteredUv += vec2(0.5);


    // Loop of octaves
    for (int i = 0; i < octaves2; i++) {
        elevation += amplitude * snoise(frequency * pixelatedCenteredUv + seed);
        frequency *= lacunarity;
        amplitude *= gain;
    }

    elevation = floor(elevation * 5.0) / 5.0;


    // Remap elevation from [-1, 1] to [0, 1]
    elevation = (elevation + 1.0) * 0.5;

    elevation = when_gt(elevation, 0.2) * elevation;

    // Generate temperature and humidity
    float temperature = floor(snoise(.05 * pixelatedCenteredUv * .8 + seed) * 5.0) / 5.0;
    temperature = (temperature + 1.0) * 0.5;
    float humidity = floor(snoise((.05 * pixelatedCenteredUv + .4) * .8 + seed) * 5.0) / 5.0;
    humidity = (humidity + 1.0) * 0.5;

    vec2 colorPosition;
    float colorCount = 4.0;


    // Test when elevation is 0
    vec4 color;

    // Water
    colorPosition = mix(grass0, water0, when_lt(elevation, 0.2));
    colorPosition = mix(colorPosition, sand0, when_lt(elevation, 0.3) * when_gt(elevation, 0.2));

    // Grass
    colorPosition = mix(colorPosition, grass1, elevation);
    colorPosition = mix(colorPosition, grass2, elevation);
    colorPosition = mix(colorPosition, grass3, elevation);

    // Stone
    colorPosition = mix(colorPosition, stone0, elevation * when_gt(elevation, 0.8));
    colorPosition = mix(colorPosition, stone1, elevation * when_gt(elevation, 0.85));
    colorPosition = mix(colorPosition, stone2, elevation * when_gt(elevation, 0.9));
    colorPosition = mix(colorPosition, stone3, elevation * when_gt(elevation, 0.95));

//        color = vec4(elevation, elevation, elevation, 1.0);
    //    color = vec3(snoise(frequency* pixelatedUv + seed), snoise(frequency * pixelatedUv + seed), snoise(frequency * pixelatedUv + seed));
//        color = vec4(temperature, temperature, temperature, 1.0);
    //

    //    if (temperature < 0.3 && humidity > 0.8 || elevation < 0.3) {
    //        color = vec3(0.0, 0.0, 1.0);
    //    }
    //    if (humidity == 0.8 && temperature > 0.4 && temperature < 0.6) {
    //        color = vec3(0.0, 0.0, 1.0);
    //    }

//    color = mix(color, vec3(0.0, 0.0, 1.0), when_gt(humidity, .8));
//    color = mix(color, vec3(1.0, 1.0, 0.0), when_lt(elevation, 0.000000000001));

    vec2 coord = floor(vUv / colorCount) + (colorPosition / colorCount);
    color = texture2D(textureSeason, coord + 0.01);

//    color = vec4(elevation, elevation, elevation, 1.0);
//    color = vec4(humidity, humidity, humidity, 1.0);
//    color = vec4(temperature, temperature, temperature, 1.0);

    gl_FragColor = color;
}

