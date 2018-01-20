#ifdef GL_ES
precision highp float;
#endif

varying vec3 vPos;
varying vec3 vNormal;
varying vec3 vLightPosition;
varying mat4 mMatrix;
varying float lavaNoise;

uniform vec3 planetTrans;
uniform float isLava;


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
    vec3 R = reflect(-L, N);   // Reflected light vector
    vec3 V = normalize(-vPos); // Vector to viewer

    // Compute the specular term
    float specAngle = max(dot(R, V), 0.0);
    specular = pow(specAngle, shininessVal);
  }

  vec4 waterColor = vec4(0.2, 0.2, 0.4, 1.0);

  // Choose between lava or water
  vec4 mixCol = waterColor;
  if(isLava == 1.0){
       mixCol = 2.0 * mix( vec4(1.0, 0.5, 0.0, 1.0), vec4(0.8, 0.3, 0.0, 0.4), lavaNoise );
     }

  vec4 ambientColor = mixCol*0.2;
  vec4 diffuseColor = mixCol;
  vec4  specularColor = vec4(1.0, 1.0, 1.0, 1.0);

  vec3 first = vec3(Ka * ambientColor);
  vec3 second = vec3(Kd * lambertian * diffuseColor);
  vec3 third = vec3(Ks * specular * specularColor);

   gl_FragColor = vec4(first + second , 1.0);
}
