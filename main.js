function init(){
  document.getElementById("amp-slider").value = 0.0;
  document.getElementById("amp-small-slider").value = 0.0;
  document.getElementById("radius-slider").value = 1.0;
}

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

var ctx = renderer.context;
// shut firefox up
ctx.getShaderInfoLog = function () { return '' };

var controls = new THREE.TrackballControls( camera );
controls.rotateSpeed = 1.5;
controls.zoomSpeed = 1.2;
controls.panSpeed = 1.0;
controls.noZoom = false;
controls.noPan = false;
controls.staticMoving = true;
controls.dynamicDampingFactor = 0.3;
controls.keys = [ 65, 83, 68 ];
controls.addEventListener( 'change', render );

var scene = new THREE.Scene();

// the camera starts at 0,0,0 so pull it back
camera.position.z = 600;

// Start the renderer.
renderer.setSize(WIDTH, HEIGHT);

// Attach the renderer-supplied
// DOM element.
$container.append(renderer.domElement);

// Unused for now
var light = new THREE.AmbientLight( 0xff00ff, 1.0 ); // soft white light
var pointLight = new THREE.PointLight( 0xff0000, 1.0, 0 );
pointLight.position.set(250, 0, 100);
//scene.add( pointLight );
//scene.add( light );

// Light stuff
var uniforms = THREE.UniformsUtils.merge( [

  THREE.UniformsLib[ "lights" ]

] );

uniforms.smallAmplitude = {
  type:'f', // a float
  value:1
};

// Add the amplitude uniform
uniforms.amplitude = {
  type: 'f', // a float
  value: 1
};

// create the sphere's material
var shaderMaterial = new THREE.ShaderMaterial({
  uniforms:       uniforms,
  vertexShader:   $('#vertexshader').text(),
  fragmentShader: $('#fragmentshader').text(),
  lights:         true
});

// Set up the sphere vars
var RADIUS = 50;
var SEGMENTS = 128;
var RINGS = 128;

var geometry = new THREE.SphereBufferGeometry( RADIUS, SEGMENTS, RINGS );
displacement = new Float32Array( geometry.attributes.position.count );

geometry.addAttribute( 'displacement', new THREE.BufferAttribute( displacement, 1 ) );
sphere = new THREE.Mesh( geometry, shaderMaterial );


// Add  to the scene.
scene.add(sphere);
scene.add(camera);

function update () {

  var time = Date.now() * 0.01;

  var scaling = document.getElementById("radius-slider").value;

  sphere.scale.set(scaling, scaling, scaling);

  // Refresh noise value from the slider
  uniforms.amplitude.value = document.getElementById("amp-slider").value;
  uniforms.smallAmplitude.value = document.getElementById('amp-small-slider').value;

  controls.update();

  render();

  // Schedule the next frame.
  requestAnimationFrame(update);
}

function render() {
  // Draw!
  renderer.render(scene, camera);
}

init();
update();
