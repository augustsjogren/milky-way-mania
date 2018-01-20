#ifdef GL_ES
precision highp float;
#endif

uniform float time;

varying vec3 vPos;
varying vec3 vNormal;
varying vec3 vLightPosition;
varying float sunNoise;

void main(){

  float Ka = 1.0;   // Ambient reflection coefficient
  float Kd = 1.0;   // Diffuse reflection coefficient
  float Ks = 0.6;   // Specular reflection coefficient
  float shininessVal = 2.0; // Shininess

  //From vshader
  vec3 lightPos = vLightPosition;

  vec3 N = normalize(vNormal);
  vec3 L = normalize(lightPos);
  // vec3 L = normalize(lightPos - vPos);

  float lambertian = max(dot(N, L), 0.0);

  float specular = 0.0;

  if(lambertian > 0.0) {
    vec3 R = reflect(-L, N);      // Reflected light vector
    vec3 V = normalize(-vPos); // Vector to viewer

    // Compute the specular term
    float specAngle = max(dot(R, V), 0.0);
    specular = pow(specAngle, shininessVal);
  }

  vec4 sunColor = mix( vec4(1.0, 0.5, 0.0, 1.0), vec4(0.8, 0.3, 0.0, 0.4), sunNoise );
   //vec4 sunColor = vec4(1.0, 0.5, 0.0, 1.0);

  // vec4 sunColor = vec4(1.0, 1.0, 1.0, 1.0);
  vec4 lighterWaterColor = vec4(0.4, 0.4, 0.1, 1.0);

  vec4 ambientColor = sunColor*2.5;
  vec4 diffuseColor = sunColor;
  vec4  specularColor = vec4(1.0, 1.0, 1.0, 1.0);

  vec3 first = vec3(Ka * ambientColor);
  vec3 second = vec3(Kd * lambertian * diffuseColor);
  vec3 third = vec3(Ks * specular * specularColor);

   gl_FragColor = vec4(first + second , 1.0);
  // gl_FragColor 	= waterColor;
}
