precision mediump float;
varying vec2 vUv;
uniform float seed;
uniform sampler2D textureAutumn;
uniform sampler2D textureWinter;
uniform sampler2D textureSpring;
uniform sampler2D textureSummer;
uniform sampler2D textureSeason;
uniform vec2 cameraPos;
uniform float zoomLevel;
uniform float time;
uniform vec2 mousePos;
uniform bool isStarted;

#define PI 3.14159
#define gridSize pow(2.0, 11.0)

// Blocs colors
#define grass0 vec2(2.0, 8.5)
#define grass1 vec2(4.0, 8.5)
#define grass2 vec2(5.5, 8.5)
#define grass3 vec2(7., 8.5)

#define sand0 vec2(0, 7)
#define sand1 vec2(7, 7.5)
#define sand2 vec2(8, 7.5)
#define sand3 vec2(9., 7.5)

#define water0 vec2(0.0, 6.5)
#define water1 vec2(0.6, 6.5)
#define water2 vec2(1.2, 6.5)
#define water3 vec2(2.0, 6.5)

#define stone0 vec2(7.0, 5.5)
#define stone1 vec2(8.0, 5.5)
#define stone2 vec2(8.5, 5.5)
#define stone3 vec2(9., 5.5)

#define stoneTundra0 vec2(7.0, 4.5)
#define stoneTundra1 vec2(8.0, 4.5)
#define stoneTundra2 vec2(8.5, 4.5)
#define stoneTundra3 vec2(9., 4.5)

#define snow0 vec2(2.0, 3.5)
#define snow1 vec2(4.0, 3.5)
#define snow2 vec2(6.0, 3.5)
#define snow3 vec2(9.0, 3.5)

#define jungle0 vec2(2.5, 2.5)
#define jungle1 vec2(4., 2.5)
#define jungle2 vec2(5.5, 2.5)
#define jungle3 vec2(7., 2.5)

#define savanna0 vec2(2.5, 1.5)
#define savanna1 vec2(4., 1.5)
#define savanna2 vec2(5.5, 1.5)
#define savanna3 vec2(7., 1.5)

#define volcano0 vec2(8., 0.5)
#define volcano1 vec2(8.5, 0.5)
#define volcano2 vec2(8.8, 0.5)
#define volcano3 vec2(9., 0.5)

// Biomes
#define isOcean when_lt(elevation, 0.2)
#define isDesert when_gt(temperature, 0.6) * when_lt(humidity, 0.4) * when_lt(elevation, 0.8) * when_gt(elevation, 0.2)
#define isBeach when_gt(elevation, 0.2) * when_lt(elevation, 0.3) * when_lt(humidity, 0.8)
#define isSnow when_lt(temperature, 0.4) * when_gt(humidity, 0.6) * when_gt(elevation, 0.2)
#define isRiver when_eq(peaks, 0.1) * when_eq(isDesert, 0.0)
#define isPlains when_gt(elevation, 0.2) * when_lt(elevation, 0.7) * when_gt(humidity, 0.4) * when_lt(humidity, 0.8) * when_lt(temperature, 0.6) * when_gt(temperature, 0.3)
#define isStonned when_gt(elevation, 0.7) * when_lt(elevation, 0.9) * when_gt(humidity, 0.4) * when_lt(humidity, 0.8) * when_lt(temperature, 0.6) * when_gt(temperature, 0.3)
#define isTundra when_gt(elevation, 0.7) * when_lt(elevation, 0.9) * when_gt(humidity, 0.4) * when_lt(humidity, 0.8) * when_lt(temperature, 0.3)
#define isJungle when_gt(elevation, 0.2) * when_lt(elevation, 0.7) * when_gt(humidity, 0.8) * when_lt(temperature, 0.6) * when_gt(temperature, 0.3)
#define isSavanna when_gt(elevation, 0.2) * when_lt(elevation, 0.7) * when_gt(humidity, 0.4) * when_lt(humidity, 0.8) * when_gt(temperature, 0.6)
#define isVolcano when_gt(elevation, 0.9) * when_lt(humidity, 0.4) * when_gt(temperature, 0.6)

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

/*float smoothstep_new(float edge0, float edge1, float x) {
    float t = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
    return t * t * (3.0 - 2.0 * t);
}

float when_gt(float x, float y) {
    const float epsilon = 0.01;
    return smoothstep_new(y, y + epsilon, x);
}

float when_lt(float x, float y) {
    const float epsilon = 0.01;
    return 1.0 - smoothstep_new(y - epsilon, y, x);
}

float when_eq(float x, float y) {
    const float epsilon = 0.01;
    return (1.0 - smoothstep_new(y - epsilon, y, x)) * smoothstep_new(y, y + epsilon, x);
}*/


float and(float a, float b) {
    return a * b;
}

float or(float a, float b) {
    return min(a + b, 1.0);
}


void main() {
    vec2 offsetUv = vUv + cameraPos;
    vec2 pixelatedUv = floor(offsetUv * gridSize) / gridSize;

    // Elevations
    float elevation = 0.0;

    float seasonProgress = mod(time * .06, 1.0);
    float seasonIndex = mod(time * .06, 4.0);

    // Properties
    const int octaves2 = 6;
    float lacunarity = 3.0;
    float gain = .6;

    // Initial values
    float amplitude = 1.2;
    float frequency = .01;

    vec2 pixelatedCenteredUv = pixelatedUv;
    pixelatedCenteredUv *= zoomLevel;

    // Loop of octaves
    for (int i = 0; i < octaves2; i++) {
        elevation += amplitude * snoise(frequency * pixelatedCenteredUv + seed);
        frequency *= lacunarity;
        amplitude *= gain;
    }

//    elevation = floor(elevation * 5.0) / 5.0;

    // Remap elevation from [-1, 1] to [0, 1]
    elevation = (elevation + 1.0) * 0.5;

    // Animate elevation
    float elevationOffset = mix(-2.2, 0.0, clamp(time * .1, 0.0, 1.0));
    elevation += elevationOffset;

    // Wider oceans
//    elevation = pow(elevation, 2.);

    // Generate temperature and humidity
    float temperature = floor(snoise(0.05 * pixelatedCenteredUv * .08 + seed) * 10.) / 10.;
//    float temperature = snoise(0.05 * pixelatedCenteredUv * .08 + seed);
    temperature = (temperature + 1.0) * 0.5;
    float humidity = floor(snoise(0.05 * pixelatedCenteredUv * .09 + seed) * 10.) / 10.;
//    float humidity = snoise(0.05 * pixelatedCenteredUv * .09 + seed);
    humidity = (humidity + 1.0) * 0.5;

    // After elevation is animated, we can start animate temperature and humidity
//    temperature += mix(-0.2, 0.0, clamp(time * .1, 0.0, 1.0));
//    humidity += mix(-0.2, 0.0, clamp(time * .1, 0.0, 1.0));


    // Peaks and valleys noise
    float peaks = floor(snoise(.8 * pixelatedCenteredUv * .04 + seed) * 10.) / 10.;

    vec2 colorPosition;
    float colorCount = 9.0;

    vec4 color;

    // Base grass
    colorPosition = mix(colorPosition, grass0, when_gt(elevation, 0.2) );
    colorPosition = mix(colorPosition, grass1, elevation);
    colorPosition = mix(colorPosition, grass2, elevation);
    colorPosition = mix(colorPosition, grass3, elevation);

    /* BIOMES */

    // Plains
    colorPosition = mix(colorPosition, grass3, isPlains);
    colorPosition = mix(colorPosition, grass3, elevation * isPlains);
    colorPosition = mix(colorPosition, grass2, elevation * isPlains);
    colorPosition = mix(colorPosition, grass1, elevation * isPlains);
    colorPosition = mix(colorPosition, grass0, elevation * isPlains);

    // Mountains
    colorPosition = mix(colorPosition, stone3, isStonned);
    colorPosition = mix(colorPosition, stone3, elevation * isStonned);
    colorPosition = mix(colorPosition, stone2, elevation * isStonned);
    colorPosition = mix(colorPosition, stone1, elevation * isStonned);
    colorPosition = mix(colorPosition, stone0, elevation * isStonned);

    // Tundra
    colorPosition = mix(colorPosition, stoneTundra3, isTundra);
    colorPosition = mix(colorPosition, stoneTundra3, elevation * isTundra);
    colorPosition = mix(colorPosition, stoneTundra2, elevation * isTundra);
    colorPosition = mix(colorPosition, stoneTundra1, elevation * isTundra);
    colorPosition = mix(colorPosition, stoneTundra0, elevation *isTundra);

    // Beach
    colorPosition = mix(colorPosition, sand0, isBeach);
    colorPosition = mix(colorPosition, sand1, elevation * isBeach);
    colorPosition = mix(colorPosition, sand2, elevation * isBeach);
    colorPosition = mix(colorPosition, sand3, elevation * isBeach);

    // Desert
    colorPosition = mix(colorPosition, sand3, isDesert);
    colorPosition = mix(colorPosition, sand3, elevation * isDesert);
    colorPosition = mix(colorPosition, sand2, elevation * isDesert);
    colorPosition = mix(colorPosition, sand1, elevation * isDesert);
    colorPosition = mix(colorPosition, sand0, elevation * isDesert);

    // Jungle
    colorPosition = mix(colorPosition, jungle3, isJungle);
    colorPosition = mix(colorPosition, jungle3, elevation * isJungle);
    colorPosition = mix(colorPosition, jungle2, elevation * isJungle);
    colorPosition = mix(colorPosition, jungle1, elevation * isJungle);
    colorPosition = mix(colorPosition, jungle0, elevation * isJungle);

    // Savanna
    colorPosition = mix(colorPosition, savanna3, isSavanna);
    colorPosition = mix(colorPosition, savanna3, elevation * isSavanna);
    colorPosition = mix(colorPosition, savanna2, elevation * isSavanna);
    colorPosition = mix(colorPosition, savanna1, elevation * isSavanna);
    colorPosition = mix(colorPosition, savanna0, elevation * isSavanna);

    // Volcano
    colorPosition = mix(colorPosition, volcano3, isVolcano);
    colorPosition = mix(colorPosition, volcano3, elevation * isVolcano);
    colorPosition = mix(colorPosition, volcano2, elevation * isVolcano);
    colorPosition = mix(colorPosition, volcano1, elevation * isVolcano);
    colorPosition = mix(colorPosition, volcano0, elevation * isVolcano);

    // Snow Mountains
    colorPosition = mix(colorPosition, snow3, isSnow);
    colorPosition = mix(colorPosition, snow3, elevation * isSnow);
    colorPosition = mix(colorPosition, snow2, elevation * isSnow);
    colorPosition = mix(colorPosition, snow1, elevation * isSnow);
    colorPosition = mix(colorPosition, snow0, elevation * isSnow);

    // Ocean
    colorPosition = mix(colorPosition, water3, isOcean);
    colorPosition = mix(colorPosition, water3, elevation * isOcean);
    colorPosition = mix(colorPosition, water2, elevation * isOcean);
    colorPosition = mix(colorPosition, water1, elevation * isOcean);
    colorPosition = mix(colorPosition, water0, elevation * isOcean);


    // Rivers (folllow the same logic as ocean)
    colorPosition = mix(colorPosition, water3, isRiver);
    colorPosition = mix(colorPosition, water3, elevation * isRiver);
    colorPosition = mix(colorPosition, water2, elevation * isRiver);
    colorPosition = mix(colorPosition, water1, elevation * isRiver);
    colorPosition = mix(colorPosition, water0, elevation * isRiver);


//    colorPosition = vec2(0.0);

    vec2 coord = floor(vUv / colorCount) + (colorPosition / colorCount);

    // Seasonal textures
    vec4 autumn = texture2D(textureAutumn, coord);
    vec4 winter = texture2D(textureWinter, coord);
    vec4 spring = texture2D(textureSpring, coord);
    vec4 summer = texture2D(textureSummer, coord);

    float isAutumnToWinter = and(step(0.0, seasonIndex), step(seasonIndex, 1.0));
    float isWinterToSpring = and(step(1.0, seasonIndex), step(seasonIndex, 2.0));
    float isSpringToSummer = and(step(2.0, seasonIndex), step(seasonIndex, 3.0));
    float isSummerToAutumn = and(step(3.0, seasonIndex), step(seasonIndex, 4.0));

    vec4 autumnWinterMix = mix(autumn, winter, seasonProgress);
    vec4 winterSpringMix = mix(winter, spring, seasonProgress);
    vec4 springSummerMix = mix(spring, summer, seasonProgress);
    vec4 summerAutumnMix = mix(summer, autumn, seasonProgress);

    color = isAutumnToWinter * autumnWinterMix
    + isWinterToSpring * winterSpringMix
    + isSpringToSummer * springSummerMix
    + isSummerToAutumn * summerAutumnMix;

//    color = texture2D(textureSeason, coord );

//    color = vec4(vec3(seasonProgress), 1.0);

//    float combined = pow(temperature * humidity, 3.0);

//    color = vec4(vec3(peaks), 1.0);
//    if (peaks == 0.1 ) {
//        color = vec4(0.0, 0.0, 1.0, 1.0);
//    }
//    float biome = mix(biomeDesert,biomeJungle,.5) * continentalness;

//    color = vec4(vec3(biomeDesert,biomeJungle,0.), 1.0);
//    color = vec4(vec3(continentalness * pow(humidity, 2.0)), 1.0);
//    color = vec4(temperature, temperature, temperature, 1.0);
//    if (temperature < 0.4 && humidity > 0.6 && elevation > 0.2) {
//        color = vec4(vec3(0.0, 1.0, 0.0), 1.0);
//    }
//    color = vec4(humidity, humidity, humidity, 1.0);
//    color = vec4(elevation, elevation, elevation, 1.0);
//    color = vec4(combined, combined, combined, 1.0);
//    color = vec4(vec3(peaks), 1.0);
//    color = vec4(vec3(elevation), 1.0);


    gl_FragColor = color;
}

