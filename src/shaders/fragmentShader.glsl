uniform sampler2D uTexture;
uniform float uColumns;
uniform float uRows;

varying vec2 vTexCoords;

float circle(vec2 uv, float border) {
    float radius = 0.5;
    float dist = radius - distance(uv, vec2(0.5));
    return smoothstep(0.0, border, dist);
}

void main() {
    vec2 uv = gl_PointCoord;
    uv.y *= -1.0;
    uv /= vec2(uColumns, uRows);
    float texOffsetU = vTexCoords.x / uColumns;
    float texOffsetV = vTexCoords.y / uRows;
    uv += vec2(texOffsetU, texOffsetV);
    uv += vec2(0.5);

    vec4 textureColor = texture2D(uTexture, uv);

    gl_FragColor = textureColor;

    gl_FragColor.a *= circle(gl_PointCoord, 0.2);
}
