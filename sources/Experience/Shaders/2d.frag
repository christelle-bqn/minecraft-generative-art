uniform sampler2D uImage;
uniform float uTime;
uniform vec2 uSize;
varying vec2 vUv;

#define PI 3.14159

void main(){
    vec2 uv=vUv;
    vec4 col=texture2D(uImage,uv);
    
    gl_FragColor=col;
}