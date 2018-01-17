#ifdef GL_ES
precision highp float;
#endif

varying vec3 vPos;
varying vec3 vNormal;
varying vec3 vLightPosition;
varying mat4 mMatrix;

uniform vec3 planetTrans;
uniform vec4 waterColor;


void main(){

  float Ka = 0.8;   // Ambient reflection coefficient
  float Kd = 0.6;   // Diffuse reflection coefficient
  float Ks = 0.6;   // Specular reflection coefficient
  float shininessVal = 2.0; // Shininess

  //From vshader
  vec3 lightPos = vLightPosition;

  vec3 N = normalize(vNormal);
  // The light vector from the lighposition (the sun) to the planet.
  // planetTrans is the world position for the planet
  vec3 L = normalize(vLightPosition - vec3(vec4(planetTrans, 1.0)*mMatrix) );

  float lambertian = max(dot(N, L), 0.0);

  float specular = 0.0;

  if(lambertian > 0.0) {
    vec3 R = reflect(-L, N);      // Reflected light vector
    vec3 V = normalize(-vPos); // Vector to viewer

    // Compute the specular term
    float specAngle = max(dot(R, V), 0.0);
    specular = pow(specAngle, shininessVal);
  }

  //vec4 waterColor = vec4(0.2, 0.2, 0.4, 1.0);
  vec4 lighterWaterColor = vec4(0.4, 0.4, 0.1, 1.0);

  //TODO: Brighter water in shallower parts

  vec4 ambientColor = waterColor*0.2;
  vec4 diffuseColor = waterColor;
  vec4  specularColor = vec4(1.0, 1.0, 1.0, 1.0);

  vec3 first = vec3(Ka * ambientColor);
  vec3 second = vec3(Kd * lambertian * diffuseColor);
  vec3 third = vec3(Ks * specular * specularColor);

   gl_FragColor = vec4(first + second , 1.0);
  // gl_FragColor 	= waterColor;
}
