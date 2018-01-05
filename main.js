//Set some of the sliders to initial values
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
var FAR = 100000;

// get the DOM element to attach to using jQuery
var $container = $('#container');
var $performance = $('#performance');

// Create a WebGL renderer, camera and a scene
var renderer = new THREE.WebGLRenderer();
var camera = new THREE.PerspectiveCamera(
  VIEW_ANGLE,
  ASPECT,
  NEAR,
  FAR
);

// This is just to supress a lot of warnings, some kind of bug
var ctx = renderer.context;
// shut firefox up
ctx.getShaderInfoLog = function () { return '' };

// Controls to navigate the scene
var controls = new THREE.TrackballControls( camera );
controls.rotateSpeed = 1.5;
controls.zoomSpeed = 1.2;
controls.panSpeed = 1.0;
controls.noZoom = false;
controls.noPan = false;
controls.staticMoving = false;
controls.dynamicDampingFactor = 0.1;
controls.keys = [ 65, 83, 68 ];
controls.addEventListener( 'change', render );

var orbitControls = new THREE.OrbitControls( camera, renderer.domElement );
orbitControls.addEventListener( 'change', render ); // remove when using animation loop
orbitControls.enableZoom = false;

// Create the scene
var scene = new THREE.Scene();

// Move the camera back towards the viewer
camera.position.z = 1000;

// Setup the renderer.
renderer.setSize(WIDTH, HEIGHT);

// Attach the renderer-supplied DOM element.
$container.append(renderer.domElement);

var isPaused = false;

// Listen for spacebar keypress
document.addEventListener("keydown", function(event) {
  //console.log(event.which);
  if(event.which == 32){
    // Disable scrolling and pause the animation
    event.preventDefault();
    isPaused = !isPaused;
  }
  else if (event.which == 37 || event.which == 38 ||
            event.which == 39 || event.which == 40) {
    // Disable scrolling for arrow keys
    event.preventDefault();
  }
})

// For monitoring performance
var stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
$performance.append( stats.dom );

// Unused for now
//var light = new THREE.AmbientLight( 0xff00ff, 1.0 ); // soft white light
var pointLight = new THREE.PointLight( 0xffffff, 1.0, 0 );
pointLight.position.set(100, 0, 100);
scene.add( pointLight );
//scene.add( light );

// The planet offset for sending to shaders
var planet1Trans = new THREE.Vector3(600.0, 0.0, 0.0);
var planet2Trans = new THREE.Vector3(900.0, 0.0, 0.0);

var worldPosition = new THREE.Vector3();
var worldPosition2 = new THREE.Vector3();

// Set up the sphere vars
var RADIUS = 80;
var SEGMENTS = 512;
var RINGS = 256;

// Planet 1 uniforms
var uniforms = THREE.UniformsUtils.merge( [ THREE.UniformsLib[ "lights" ] ] );
uniforms.smallAmplitude = { type: 'f', value: 1 };
uniforms.amplitude      = { type: 'f', value: 1 };
uniforms.valleys        = { type: 'f', value: 1 };
uniforms.snowLevel      = { type: 'f', value: 1 };
uniforms.vegetation     = { type: 'f', value: 1 };
uniforms.planetRadius   = { type: 'f', value: 1 };
uniforms.waterLevel     = { type: 'f', value: 1 };
uniforms.randomSeed     = { type: 'f', value: Math.random() * 1.0 + 0.7 };
uniforms.planetTrans    = { type: 'v3',value: planet1Trans };
uniforms.radius         = { type: 'f', value: RADIUS };
uniforms.lightPosition  = { type: 'v3',value: new THREE.Vector3(10.0, 0.0, 0.0) };

// Planet 2 uniforms
var uniforms2 = THREE.UniformsUtils.merge( [ THREE.UniformsLib[ "lights" ] ] );
uniforms2.smallAmplitude = {  type:'f', value:1 };
uniforms2.amplitude      = { type: 'f', value: 1 };
uniforms2.valleys        = { type: 'f', value: 1 };
uniforms2.snowLevel      = { type: 'f', value: 1 };
uniforms2.vegetation     = { type: 'f', value: 1 };
uniforms2.planetRadius   = { type: 'f', value: 1 };
uniforms2.waterLevel     = { type: 'f', value: 1 };
uniforms2.randomSeed     = { type: 'f', value: Math.random() * 1.0 + 0.7 };
uniforms2.planetTrans    = { type: 'v3', value: planet2Trans };

// Water uniforms
var wateruniforms = THREE.UniformsUtils.merge( [ THREE.UniformsLib[ "lights" ] ] );
wateruniforms.waterLevel        = { type: 'f', value: 1 };
wateruniforms.planetRadiusWater = { type: 'f',  value: 1 };
wateruniforms.lightPosition     = { type: 'v3', value: new THREE.Vector3(0.0, 0.0, 0.0) };
wateruniforms.planetTrans       = { type: 'v3', value: planet2Trans };

// Water uniforms
var wateruniforms2 = THREE.UniformsUtils.merge( [ THREE.UniformsLib[ "lights" ] ] );
wateruniforms2.waterLevel        = { type: 'f', value: 1 };
wateruniforms2.planetRadiusWater = { type: 'f',  value: 1 };
wateruniforms2.lightPosition     = { type: 'v3', value: new THREE.Vector3(0.0, 0.0, 0.0) };
wateruniforms2.planetTrans       = { type: 'v3', value: planet2Trans };

// Sun uniforms
var sununiforms = THREE.UniformsUtils.merge( [ THREE.UniformsLib[ "lights" ] ] );
sununiforms.waterLevel        = { type: 'f', value: 1 };
sununiforms.planetRadiusWater = { type: 'f', value: 1 };
sununiforms.lightPosition     = { type: 'v3', value: new THREE.Vector3(0.0, 0.0, 0.0) };
sununiforms.time              = { type: 'f', value: 0.0 };

function render() {
  renderer.render(scene, camera);
}

// Load the shaders from files
ShaderLoader("shaders/vertex_planet.vert", "shaders/fragment_planet.frag",

function (vertex, fragment) {

  // create the sphere's material
  var shaderMaterial = new THREE.ShaderMaterial({
    uniforms:       uniforms,
    vertexShader:   vertex,
    fragmentShader: fragment,
    lights:         true,
    wireframe:      false
  });

  // create the sphere's material
  var shaderMaterial2 = new THREE.ShaderMaterial({
    uniforms:       uniforms2,
    vertexShader:   vertex,
    fragmentShader: fragment,
    lights:         true,
    wireframe:      false
  });

  var waterShaderMaterial = new THREE.ShaderMaterial({
    uniforms:       wateruniforms,
    vertexShader:   $('#watervertexshader').text(),
    fragmentShader: $('#waterfragmentshader').text(),
    lights:         true
  });

  var waterShaderMaterial2 = new THREE.ShaderMaterial({
    uniforms:       wateruniforms2,
    vertexShader:   $('#watervertexshader').text(),
    fragmentShader: $('#waterfragmentshader').text(),
    lights:         true
  });

  var sunShaderMaterial = new THREE.ShaderMaterial({
    uniforms:       sununiforms,
    vertexShader:   $('#sunvertexshader').text(),
    fragmentShader: $('#sunfragmentshader').text(),
    lights:         true
  });

  // Create the geometries for the planets
  var planet1Geometry = new THREE.SphereBufferGeometry( RADIUS, SEGMENTS, RINGS );
  var planet2Geometry = new THREE.SphereBufferGeometry(80, SEGMENTS, RINGS );
  var sunGeometry = new THREE.SphereBufferGeometry( 110, 64, 64 );
  // Two spheres used for water
  var waterGeometry = new THREE.SphereBufferGeometry( RADIUS, 128, 128 );
  var waterGeometry2 = new THREE.SphereBufferGeometry( 80, 128, 128 );

  // Add materials and spheres
  planet1 = new THREE.Mesh( planet1Geometry, shaderMaterial );
  waterSphere = new THREE.Mesh( waterGeometry, waterShaderMaterial );
  planet1.add(waterSphere);

  planet2 = new THREE.Mesh( planet2Geometry, shaderMaterial2 );
  waterSphere2 = new THREE.Mesh( waterGeometry2, waterShaderMaterial2 );
  planet2.add(waterSphere2);

  sunSphere = new THREE.Mesh( sunGeometry, sunShaderMaterial );

  // Pivots are used to rotate the planets in orbits
  var parent = new THREE.Object3D();
  var parent2 = new THREE.Object3D();
  var pivot1 = new THREE.Object3D();
  var pivot2 = new THREE.Object3D();

  // Initial planet offset
  planet1.position.x = planet1Trans.x;
  planet2.position.x = planet2Trans.x;

  // Attatch the planets to their pivots and parents
  pivot1.add(planet1);
  pivot2.add(planet2);
  parent.add(pivot1);
  parent2.add(pivot2);

  // Add stuff to the scene
  scene.add(sunSphere);
  scene.add(parent);
  scene.add(parent2);
  scene.add(camera);

  var clock = new THREE.Clock();

  parent.rotation.x += 0.3;
  parent2.rotation.x += 0.5;

  function update () {

    // Collect performance stats
    stats.begin();

    var time = clock.getElapsedTime();

    // Pause the animation
    if (!isPaused) {
      // Orbital rotation
      parent.rotation.y += 0.005;
      parent2.rotation.y += 0.01;

      planet1.rotation.y -= 0.02;
    }

    // scene.updateMatrixWorld();
    worldPosition.setFromMatrixPosition( planet1.matrixWorld );
    worldPosition2.setFromMatrixPosition( planet2.matrixWorld );
    uniforms.planetTrans.value = worldPosition;
    uniforms2.planetTrans.value = worldPosition2;


    //------------------Update uniforms----------------------
    // Radius
    uniforms.planetRadius.value = document.getElementById("radius-slider").value;

    // Refresh noise values from the sliders
    uniforms.amplitude.value = document.getElementById("amp-slider").value;
    uniforms.valleys.value = document.getElementById("valley-slider").value;
    uniforms.smallAmplitude.value = document.getElementById('amp-small-slider').value;

    // Materials
    uniforms.snowLevel.value = document.getElementById('snow-slider').value;
    uniforms.vegetation.value = document.getElementById('vegetation-slider').value;
    uniforms.waterLevel.value = document.getElementById('water-slider').value;

    //------------------Update uniforms2----------------------
    // Radius
    uniforms2.planetRadius.value = document.getElementById("radius-slider").value;

    // Refresh noise values from the sliders
    uniforms2.amplitude.value = document.getElementById("amp-slider").value;
    uniforms2.valleys.value = document.getElementById("valley-slider").value;
    uniforms2.smallAmplitude.value = document.getElementById('amp-small-slider').value;

    // Materials
    uniforms2.snowLevel.value = document.getElementById('snow-slider').value;
    uniforms2.vegetation.value = document.getElementById('vegetation-slider').value;
    uniforms2.waterLevel.value = document.getElementById('water-slider').value;

    //------------Update water and sun uniforms---------------
    // Water
    wateruniforms.waterLevel.value = document.getElementById('water-slider').value;
    wateruniforms.planetRadiusWater.value = document.getElementById("radius-slider").value;
    wateruniforms.planetTrans.value = worldPosition;

    wateruniforms2.waterLevel.value = document.getElementById('water-slider').value;
    wateruniforms2.planetRadiusWater.value = document.getElementById("radius-slider").value;
    wateruniforms2.planetTrans.value = worldPosition2;
    // Sun
    sununiforms.time.value = time;

    // Navigation
    controls.update();
    //orbitControls.update();

    render();

    stats.end();

    // Schedule the next frame.
    requestAnimationFrame(update);
  }

  init();
  update();

}
) // End of shader loader
