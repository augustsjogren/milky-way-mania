function init(){
  document.getElementById("amp-slider").value = 0.0;
  document.getElementById("amp-small-slider").value = 0.0;
  document.getElementById("radius-slider").value = 1.0;
  document.getElementById("valley-slider").value = 0.0;
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



var orbitControls = new THREE.OrbitControls( camera, renderer.domElement );
orbitControls.addEventListener( 'change', render ); // remove when using animation loop
// enable animation loop when using damping or autorotation
//controls.enableDamping = true;
//controls.dampingFactor = 0.25;
orbitControls.enableZoom = false;

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

var pointLight = new THREE.PointLight( 0xffffff, 1.0, 0 );
pointLight.position.set(100, 0, 100);
scene.add( pointLight );
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

uniforms.valleys = {
  type: 'f', // a float
  value: 1
};

uniforms.planetRadius = {
  type: 'f', // a float
  value: 1
};

var wateruniforms = THREE.UniformsUtils.merge( [

  THREE.UniformsLib[ "lights" ]

] );

wateruniforms.waterLevel = {
  type: 'f', // a float
  value: 1
}

wateruniforms.planetRadiusWater = {
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

var waterShaderMaterial = new THREE.ShaderMaterial({
  uniforms:       wateruniforms,
  vertexShader:   $('#watervertexshader').text(),
  fragmentShader: $('#waterfragmentshader').text(),
  lights:         true
});

// Set up the sphere vars
var RADIUS = 50;
var SEGMENTS = 512;
var RINGS = 512;

uniforms.radius = {
  type: 'f',
  value: RADIUS
}

var geometry = new THREE.SphereBufferGeometry( RADIUS, SEGMENTS, RINGS );
displacement = new Float32Array( geometry.attributes.position.count );

var waterGeometry = new THREE.SphereBufferGeometry( RADIUS, SEGMENTS, RINGS );

geometry.addAttribute( 'displacement', new THREE.BufferAttribute( displacement, 1 ) );

sphere = new THREE.Mesh( geometry, shaderMaterial );
waterSphere = new THREE.Mesh( waterGeometry, waterShaderMaterial );

// Add  to the scene.
scene.add(sphere);
scene.add(waterSphere);
scene.add(camera);

function update () {

  var time = Date.now() * 0.01;

  // Radius
  uniforms.planetRadius.value = document.getElementById("radius-slider").value;


  // Refresh noise values from the sliders
  uniforms.amplitude.value = document.getElementById("amp-slider").value;
  uniforms.valleys.value = document.getElementById("valley-slider").value;

  uniforms.smallAmplitude.value = document.getElementById('amp-small-slider').value;

  // Water
  wateruniforms.waterLevel.value = document.getElementById('water-slider').value;
  wateruniforms.planetRadiusWater.value = document.getElementById("radius-slider").value;

  // Navigation
  controls.update();
  //orbitControls.update();

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
