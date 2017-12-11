// Set the scene size.
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

// Set some camera attributes.
var VIEW_ANGLE = 45;
var ASPECT = WIDTH / HEIGHT;
var NEAR = 1;
var FAR = 1000;

// get the DOM element to attach to
// - assume we've got jQuery to hand
var $container = $('#container');

// Create a WebGL renderer, camera
// and a scene
var renderer = new THREE.WebGLRenderer();
var camera = new THREE.PerspectiveCamera(
  VIEW_ANGLE,
  ASPECT,
  NEAR,
  FAR
);

var scene = new THREE.Scene();

// the camera starts at 0,0,0 so pull it back
camera.position.z = 300;

// Add the camera to the scene.
//scene.add(camera);

// Start the renderer.
renderer.setSize(WIDTH, HEIGHT);

// Attach the renderer-supplied
// DOM element.
$container.append(renderer.domElement);

// // create a point light
// const pointLight =
// new THREE.PointLight(0xFFFFFF);
//
// // set its position
// pointLight.position.x = 10;
// pointLight.position.y = 50;
// pointLight.position.z = 130;
//
// // add to the scene
// scene.add(pointLight);

// add a uniform for the amplitude
var uniforms = {
  amplitude: {
    type: 'f', // a float
    value: 1
  }
};

// create the sphere's material
var shaderMaterial = new THREE.ShaderMaterial({
  uniforms:       uniforms,
  vertexShader:   $('#vertexshader').text(),
  fragmentShader: $('#fragmentshader').text()
});


// Set up the sphere vars
var RADIUS = 50;
var SEGMENTS = 16;
var RINGS = 16;

var geometry = new THREE.SphereBufferGeometry( RADIUS, SEGMENTS, RINGS );
displacement = new Float32Array( geometry.attributes.position.count );

for (var i = 0; i < displacement.length; i++){
  displacement[i] = Math.random()*10;
}

geometry.addAttribute( 'displacement', new THREE.BufferAttribute( displacement, 1 ) );
sphere = new THREE.Mesh( geometry, shaderMaterial );

// Add  to the scene.
scene.add(sphere);
scene.add(camera);

function update () {

  var time = Date.now() * 0.01;

  //uniforms.amplitude.value = Math.sin(time);

  //sphere.rotateZ(0.01);

  // for ( var i = 0; i < displacement.length; i ++ ) {
  // 	displacement[ i ] = Math.sin( 0.1 * i + time );
  // }
  //
  // // sphere.geometry.attributes.displacement.needsUpdate = true;
  //
  // sphere.geometry.getAttribute('displacement').needsUpdate = true;

  // Draw!
  renderer.render(scene, camera);

  // Schedule the next frame.
  requestAnimationFrame(update);
}

update();
