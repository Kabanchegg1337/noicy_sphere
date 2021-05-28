varying vec2 vUv;
varying vec3 vNormal;
varying float vNoice;
varying vec3 vPosition;

uniform float time;
uniform float progress;

uniform vec4 resolution;

void main() {

    float dist = length(gl_PointCoord - vec2(0.5));
    float disc = 1. - smoothstep(0.45, 0.5, dist);
    if (disc < 0.001) discard;

    float opacity = abs(vNoice) - 0.5;

    gl_FragColor = vec4(0.826, 0.999, 0.999, opacity);
}