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

// get the DOM element to attach to
// - assume we've got jQuery to hand
var $container = $('#container');
var $performance = $('#performance');

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
controls.staticMoving = false;
controls.dynamicDampingFactor = 0.1;
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
camera.position.z = 1000;

// Start the renderer.
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

uniforms.snowLevel = {
  type: 'f', // a float
  value: 1
};

uniforms.vegetation = {
  type: 'f', // a float
  value: 1
};

uniforms.planetRadius = {
  type: 'f', // a float
  value: 1
};

uniforms.waterLevel = {
  type: 'f', // a float
  value: 1
};


//------------------------------------------------------------------------
var uniforms2 = THREE.UniformsUtils.merge( [

  THREE.UniformsLib[ "lights" ]

] );

uniforms2.smallAmplitude = {
  type:'f', // a float
  value:1
};

// Add the amplitude uniform
uniforms2.amplitude = {
  type: 'f', // a float
  value: 1
};

uniforms2.valleys = {
  type: 'f', // a float
  value: 1
};

uniforms2.snowLevel = {
  type: 'f', // a float
  value: 1
};

uniforms2.vegetation = {
  type: 'f', // a float
  value: 1
};

uniforms2.planetRadius = {
  type: 'f', // a float
  value: 1
};

uniforms2.waterLevel = {
  type: 'f', // a float
  value: 1
};

//----------------------------------------------------

var wateruniforms = THREE.UniformsUtils.merge( [

  THREE.UniformsLib[ "lights" ]

] );

wateruniforms.waterLevel = {
  type: 'f', // a float
  value: 1
};

wateruniforms.planetRadiusWater = {
  type: 'f', // a float
  value: 1
};

wateruniforms.lightPosition = {
  type: 'v3',
  value: new THREE.Vector3(0.0, 0.0, 0.0)
};

function render() {
  // Draw!
  renderer.render(scene, camera);
}

var planet1Trans = new THREE.Vector3(0.0, 0.0, 600);
var planet2Trans = new THREE.Vector3(600.0, 0.0, 0.0);

uniforms.randomSeed = {
  type: 'f',
  value: Math.random() * 1.0 + 0.7
};

uniforms.planetTrans = {
  type: 'v3',
  value: planet1Trans
};

uniforms2.randomSeed = {
  type: 'f',
  value: Math.random() * 1.0 + 0.7
};

uniforms2.planetTrans = {
  type: 'v3',
  value: planet2Trans
};


var sununiforms = THREE.UniformsUtils.merge( [

  THREE.UniformsLib[ "lights" ]

] );

sununiforms.waterLevel = {
  type: 'f', // a float
  value: 1
};

sununiforms.planetRadiusWater = {
  type: 'f', // a float
  value: 1
};

sununiforms.lightPosition = {
  type: 'v3',
  value: new THREE.Vector3(0.0, 0.0, 0.0)
};

sununiforms.time = {
  type: 'f', // a float
  value: 0.0
};

// Load the shaders from files
ShaderLoader("shaders/vertex_planet.vert", "shaders/fragment_planet.frag",

function (vertex, fragment) {

  // create the sphere's material
  var shaderMaterial = new THREE.ShaderMaterial({
    uniforms:       uniforms,
    // vertexShader:   $('#vertexshader').text(),
    vertexShader:   vertex,
    // fragmentShader: $('#fragmentshader').text(),
    fragmentShader: fragment,
    lights:         true,
    wireframe:      false
  });

  // create the sphere's material
  var shaderMaterial2 = new THREE.ShaderMaterial({
    uniforms:       uniforms2,
    // vertexShader:   $('#vertexshader').text(),
    vertexShader:   vertex,
    // fragmentShader: $('#fragmentshader').text(),
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

  var sunShaderMaterial = new THREE.ShaderMaterial({
    uniforms:       sununiforms,
    vertexShader:   $('#sunvertexshader').text(),
    fragmentShader: $('#sunfragmentshader').text(),
    lights:         true
  });

  // Set up the sphere vars
  var RADIUS = 80;
  var SEGMENTS = 512;
  var RINGS = 512;

  uniforms.radius = {
    type: 'f',
    value: RADIUS
  };

  uniforms.lightPosition = {
    type: 'v3',
    value: new THREE.Vector3(10.0, 0.0, 0.0)
  };

  // Create the geometries for the planets and water
  var geometry = new THREE.SphereBufferGeometry( RADIUS, SEGMENTS, RINGS );
  var geometry2 = new THREE.SphereBufferGeometry(80, SEGMENTS, RINGS );

  var sunGeometry = new THREE.SphereBufferGeometry( RADIUS, 128, 128 );

  var waterGeometry = new THREE.SphereBufferGeometry( RADIUS, 128, 128 );
  var waterGeometry2 = new THREE.SphereBufferGeometry( 80, 128, 128 );

  // Add materials and water spheres
  planet1 = new THREE.Mesh( geometry, shaderMaterial );
  waterSphere = new THREE.Mesh( waterGeometry, waterShaderMaterial );
  planet1.add(waterSphere);

  sphere2 = new THREE.Mesh( geometry2, shaderMaterial2 );
  waterSphere2 = new THREE.Mesh( waterGeometry2, waterShaderMaterial );
  sphere2.add(waterSphere2);

  sunSphere = new THREE.Mesh( sunGeometry, sunShaderMaterial );

  planet1.position.set(0.0, 0.0, 0.0);

  // Pivots are used to rotate the planets in orbits
  var parent = new THREE.Object3D();
  var pivot1 = new THREE.Object3D();

  pivot1.rotation.z = 0;
  planet1.position.z = planet1Trans.z;
  sphere2.position.x = planet2Trans.x;
  //parent.rotateZ(0.5);
  pivot1.add(planet1);
  pivot1.add(sphere2);

  parent.add(pivot1);

  // Add  to the scene.
  scene.add(sunSphere);
  scene.add(parent);
  scene.add(camera);

  var clock = new THREE.Clock();

  function update () {

    // Collect performance stats
    stats.begin();
    //var time = Date.now()/10000000;

    var time = clock.getElapsedTime();


    // Pause the animation
    if (!isPaused) {
      // Orbital rotation
      parent.rotation.y += 0.01;
      //planet1.rotation.y -= 0.05;
    }

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


    //------------------Uniforms2-----------------------------------
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

    //--------------------------------------------------------------

    // Water
    wateruniforms.waterLevel.value = document.getElementById('water-slider').value;
    wateruniforms.planetRadiusWater.value = document.getElementById("radius-slider").value;

    // Sun
    sununiforms.time.value = time;

    //console.log(sununiforms.time.value);

    // Navigation
    controls.update();
    //orbitControls.update();

    render();

    stats.end();

    // Schedule the next frame.
    requestAnimationFrame(update);
  }

  // function render() {
  //   // Draw!
  //   renderer.render(scene, camera);
  // }

  init();
  update();

}
)
