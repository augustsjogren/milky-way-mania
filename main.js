// Set the scene size.
// const WIDTH = 400;
// const HEIGHT = 300;

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

// attach the render-supplied DOM element
//$container.append(renderer.domElement);

// create the sphere's material
var shaderMaterial = new THREE.ShaderMaterial({
  vertexShader:   $('#vertexshader').text(),
  fragmentShader: $('#fragmentshader').text()
});

// create the sphere's material
// const sphereMaterial =
// new THREE.MeshLambertMaterial(
//   {
//     color: 0xCC0000
//   });

// Set up the sphere vars
var RADIUS = 50;
var SEGMENTS = 16;
var RINGS = 16;

// Create a new mesh with
// sphere geometry - we will cover
// the sphereMaterial next!
var sphere = new THREE.Mesh(

  new THREE.SphereGeometry(
    RADIUS,
    SEGMENTS,
    RINGS),
    shaderMaterial);

    // Add  to the scene.
    scene.add(sphere);
    scene.add(camera);

    function update () {

      sphere.rotateZ(0.01);

      // Draw!
      renderer.render(scene, camera);

      // Schedule the next frame.
      requestAnimationFrame(update);
    }

    update();
