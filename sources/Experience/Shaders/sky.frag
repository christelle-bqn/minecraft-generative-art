precision mediump float;
varying vec2 vUv;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 cameraPos;
uniform float zoomLevel;

#define PI 3.14159
#define gridSize 2048.0
#define OCTAVES 6


float fbm(in vec2 st) {
    // Initial values
    float value = 0.0;
    float amplitude = 0.7;
    float frequency = 0.25;
    float lacunarity = 2.0;
    float gain = 0.5;

    // Loop of octaves
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * snoise(st * frequency);
        frequency *= lacunarity;
        amplitude *= gain;
    }

    return value;
}

void main() { 
    vec4 color = vec4(0.969,0.965,0.965, 0.0);

    vec2 offsetUv = vUv + cameraPos;
    vec2 pixelatedUv = floor(offsetUv * gridSize) / gridSize;

    vec2 pixelatedCenteredUv = pixelatedUv - vec2(0.5);
    pixelatedCenteredUv *= zoomLevel;
    pixelatedCenteredUv += vec2(0.5);

    //vec2 st = gl_FragCoord.xy/u_resolution.xy;
    //st.x *= u_resolution.x/u_resolution.y;


    /* vec2 q = vec2(0.);
    q.x = fbm( pixelatedCenteredUv - vec2(0.1) + 0.0016 * u_time);
    q.y = fbm( pixelatedCenteredUv + vec2(0.1) + 0.0016 * u_time);

    float f = fbm(pixelatedCenteredUv + 0.016 * u_time);

    // vec3(0.969,0.965,0.965)

    color = mix(vec4(1.0, 1.0, 1.0, 0),
                vec4(0.937,0.898,0.898, 1.0),
                clamp((f*f) * 0.0,0.0,0.0));

    color += fbm(pixelatedCenteredUv + q+ 0.016 * u_time); */


    float f = fbm(pixelatedCenteredUv + 0.016 * u_time);

    color = mix(vec4(1.0, 1.0, 1.0, 0),
                vec4(0.937,0.898,0.898, 1.0),
                clamp((f*f) * 0.0,0.0,0.0));

    color += fbm(pixelatedCenteredUv + 0.014 * u_time);
    
    gl_FragColor = vec4(color);
}