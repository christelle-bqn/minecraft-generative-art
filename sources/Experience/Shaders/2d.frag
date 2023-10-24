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

#define PI 3.14159
#define gridSize 128.0
#define mapDezoom 2.6
#define octaves 5.0

// Blocs colors
#define dirt vec3(0.6, 0.4, 0.2)
#define grass vec3(0.25, 0.5, 0.1)
#define stone vec3(0.5, 0.5, 0.5)
#define snow vec3(1.0, 1.0, 1.0)
#define water vec3(0.0, 0.0, 1.0)

// 0 - 0.25 - 0.50 - 0.75 - 1.0

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
    float frequencyElevation = 0.0;
    for (float i = 0.0; i < octaves; i++) {
        float frequency = pow(mapDezoom, i);
        float amplitude = pow(0.5, i);
        elevation += snoise(pixelatedUv * frequency + seed) * amplitude;
        frequencyElevation += snoise(pixelatedUv * frequency + seed) / (frequency * 2.0);
    }


    //vec3 surfaceColor[4];

    /* color = colorPick(paletteWaterAutumn, paletteDirtAutumn, when_lt(elevation, 0.01));
    color = colorPick(color, paletteSandAutumn, when_gt(elevation, 0.01) * when_lt(elevation, 0.3));
    color = colorPick(color, paletteStone, when_gt(elevation, 0.6)); */
 
   /*  color = mix(surface[0], surface[0], when_lt(frequencyElevation, 0.01));
    color = mix(color, surface[0],when_gt(frequencyElevation, 0.01) * when_lt(frequencyElevation, 0.3));
    color = mix(color, surface[0],  when_gt(frequencyElevation, 0.6));  */

   /*  color = mix(water, dirt, when_lt(elevation, 0.01));
    color = mix(color, grass, when_gt(elevation, 0.01) * when_lt(elevation, 0.3));
    color = mix(color, stone, when_gt(elevation, 0.6));
    color = mix(color, snow, when_gt(elevation, 0.9)); */


    // DIRT : 

    vec2 colorPosition;
    //float colorCount = 4.0;
    float colorCount = 5.0;

    /* if (elevation < 0.01) {
        // WATER
        colorPosition = mix(vec2(3.0, 1.0), vec2(2.0, 1.0), when_lt(frequencyElevation, 0.01));
        colorPosition = mix(colorPosition, vec2(1.0, 1.0), when_gt(frequencyElevation, 0.01) * when_lt(frequencyElevation, 0.3));
        colorPosition = mix(colorPosition, vec2(0.0, 1.0), when_gt(frequencyElevation, 0.06));
    
    } else if (elevation >= 0.01 && elevation <= 0.3) {
        // DIRT
        colorPosition = mix(vec2(3.0, 3.0), vec2(2.0, 3.0), when_lt(frequencyElevation, 0.01));
        colorPosition = mix(colorPosition, vec2(1.0, 3.0), when_gt(frequencyElevation, 0.01) * when_lt(frequencyElevation, 0.3));
        colorPosition = mix(colorPosition, vec2(0.0, 3.0), when_gt(elevation, 0.6));

    } else if (elevation > 0.03 && elevation <= 0.6) {
        // SAND
        colorPosition = mix(vec2(3.0, 2.0), vec2(2.0, 2.0), when_lt(frequencyElevation, 0.02));
        colorPosition = mix(colorPosition, vec2(1.0, 2.0), when_gt(frequencyElevation, 0.01) * when_lt(frequencyElevation, 0.3));
        colorPosition = mix(colorPosition, vec2(0.0, 2.0), when_gt(frequencyElevation, 0.06));
    } else if (elevation > 0.6) {
        // STONE
        colorPosition = mix(vec2(3.0, 0.0), vec2(2.0, 0.0), when_lt(frequencyElevation, 0.01));
        colorPosition = mix(colorPosition, vec2(1.0, 0.0), when_gt(frequencyElevation, 0.01) * when_lt(frequencyElevation, 0.3));
        colorPosition = mix(colorPosition, vec2(0.0, 0.0), when_gt(frequencyElevation, 0.6));
    } */
    

    if (elevation < 0.01) {
        // WATER
        colorPosition = mix(vec2(3.0, 2.0), vec2(2.0, 2.0), when_lt(frequencyElevation, 0.01));
        colorPosition = mix(colorPosition, vec2(1.0, 2.0), when_gt(frequencyElevation, 0.01) * when_lt(frequencyElevation, 0.3));
        colorPosition = mix(colorPosition, vec2(0.0, 2.0), when_gt(frequencyElevation, 0.06));
    
    } else if (elevation >= 0.01 && elevation <= 0.3) {
        // DIRT
        colorPosition = mix(vec2(3.0, 4.0), vec2(2.0, 4.0), when_lt(frequencyElevation, 0.01));
        colorPosition = mix(colorPosition, vec2(1.0, 4.0), when_gt(frequencyElevation, 0.01) * when_lt(frequencyElevation, 0.3));
        colorPosition = mix(colorPosition, vec2(0.0, 4.0), when_gt(elevation, 0.6));

    } else if (elevation > 0.03 && elevation <= 0.6) {
        // SAND
        colorPosition = mix(vec2(3.0, 3.0), vec2(2.0, 3.0), when_lt(frequencyElevation, 0.02));
        colorPosition = mix(colorPosition, vec2(1.0, 3.0), when_gt(frequencyElevation, 0.01) * when_lt(frequencyElevation, 0.3));
        colorPosition = mix(colorPosition, vec2(0.0, 3.0), when_gt(frequencyElevation, 0.06));
    } else if (elevation > 0.6) {
        // STONE
        colorPosition = mix(vec2(3.0, 1.0), vec2(2.0, 1.0), when_lt(frequencyElevation, 0.01));
        colorPosition = mix(colorPosition, vec2(1.0, 1.0), when_gt(frequencyElevation, 0.01) * when_lt(frequencyElevation, 0.3));
        colorPosition = mix(colorPosition, vec2(0.0, 1.0), when_gt(frequencyElevation, 0.6));
    } else if (elevation > 0.8) {
        // SNOW
        colorPosition = mix(vec2(3.0, 0.0), vec2(2.0, 0.0), when_lt(frequencyElevation, 0.01));
        colorPosition = mix(colorPosition, vec2(1.0, 0.0), when_gt(frequencyElevation, 0.01) * when_lt(frequencyElevation, 0.3));
        colorPosition = mix(colorPosition, vec2(0.0, 0.0), when_gt(frequencyElevation, 0.6));
    }

    vec2 coord = (vUv / colorCount) + (colorPosition / colorCount);
    //vec4 color = texture2D(textureAutumn, coord);   
    vec4 color = texture2D(textureSeason, coord);  
    //vec4 color = texture2D(textureSpring, coord);
    //vec4 color = texture2D(textureSummer, coord);

    //gl_FragColor = vec4(color, 1.0);
    gl_FragColor = color;
}
