varying vec2 vUv;
uniform float time;
uniform float progress;

uniform vec4 resolution;

void main() {

    vec2 newUv = (vUv - 0.5) * resolution.zw + vec2(0.5);

    gl_FragColor = vec4(vUv, 0., 1.);
}