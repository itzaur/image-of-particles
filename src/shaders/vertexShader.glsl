uniform float uPointSize;
uniform float scale;

varying vec2 vTexCoords;

void main() {

	// #include <color_vertex>
	// #include <morphcolor_vertex>
	#include <begin_vertex>
	// #include <morphtarget_vertex>
	#include <project_vertex>

    gl_PointSize = uPointSize;
    vTexCoords = position.xy;
}