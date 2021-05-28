varying vec2 vUv;
varying vec3 vNormal;
varying float vNoice;
varying vec3 vPosition;

uniform float time;
uniform float progress;

uniform vec4 resolution;

void main() {

    vec3 X = dFdx(vPosition);
    vec3 Y = dFdy(vPosition);
    vec3 n = normalize(cross(X,Y));

    vec2 newUv = (vUv - 0.5) * resolution.zw + vec2(0.5);

    vec3 color = vec3(vNoice);

    //gl_FragColor = vec4(color, 1.);
    //gl_FragColor = vec4(vPosition, 1.);
    gl_FragColor  = vec4(n, 1.);
}