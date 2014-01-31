define(function(require){

if (!Detector.webgl) {
	alert('I\'m sorry, you\'re browser doesn\'t support WebGL.');
	return;
}

window.Class = require('Class');

var Game = require('Game');
var Grid = require('Grid');
var KEYS = require('Keys');

window.config = {
	debug: 0,
	autostart: 0,
	postprocess: 1,
	animate: {
		player: 1,
		piece: 1,
		level: 1
	},
	levelsUrl: 'data/levels.json'
};
window.BG_COLOR = 0xcccccc;

var container, stats = { update: function(){} }, gui;

var camera, renderer, composer;

window.scene;

var topCamera;

var target = new THREE.Vector3(0,0,0);

Math.deg2rad = Math.PI/180;
Math.deg2rad_h = Math.deg2rad/2;


var isMouseDown = false;
var onMouseDownTheta;
var onMouseDownPhi;
var onMouseDownPosition = new THREE.Vector2();

var radious = 8000,
	theta = 45, onMouseDownTheta = 45,
	phi = 60, onMouseDownPhi = 60;

var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;


$(_init);

function _init() {
	getData();
}


function init() {
	container = document.createElement('div');
	document.body.appendChild(container);

	camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
	setCameraPosition();

	topCamera = new THREE.OrthographicCamera(
		window.innerWidth / -4,		// Left
		window.innerWidth / 4,		// Right
		window.innerHeight / 4,		// Top
		window.innerHeight / -4,	// Bottom
		-5000,            			// Near 
		10000 );           			// Far -- enough to see the skybox
	topCamera.up = new THREE.Vector3(0,0,-1);
	topCamera.lookAt( new THREE.Vector3(0,-1,0) );

	scene = new THREE.Scene();
	scene.add(topCamera);

	setupLights();

	scene.fog = new THREE.FogExp2( BG_COLOR, 0.0002 );

	renderer = new THREE.WebGLRenderer({
		antialias: true});

	renderer.shadowMapEnabled = true;
	renderer.shadowMapSoft = true;
	renderer.shadowMapWidth = 2048;
	renderer.shadowMapHeight = 2048;
	renderer.shadowMapType = THREE.PCFSoftShadowMap;

	renderer.setClearColor(BG_COLOR, 0);
	//renderer.setClearColor( 0x000000, 0 );

	renderer.setSize(window.innerWidth, window.innerHeight);

	container.appendChild(renderer.domElement);

	if (config.debug) {
		var axes = new THREE.AxisHelper(30);
		scene.add(axes);
	}

	if (config.debug || 1) {
		stats = new Stats();
		container.appendChild(stats.domElement);
	}

	if (config.postprocess)
		setupPostprocessing();

	if (config.debug) {
		gui = new dat.GUI({ autoPlace: false });

		var customContainer = document.getElementById('dat-gui-container');
		if (customContainer) customContainer.appendChild(gui.domElement);

		var Actions = function() {
			this.postprocess = function(){
				config.postprocess = !config.postprocess;
			};
		};

		var actions = new Actions();

		var f1 = gui.addFolder('postprocessing');
		f1.add(actions, 'postprocess');
		f1.open();
	}

	$(document).on('keydown', function(ev){
		if (ev.keyCode === KEYS.ENTER) {
			startGame();
		}
	});

	$(document).on('click', '#start', startGame);

	if (config.autostart)
		startGame();

	animate();

	window.game = new Game();

	$(window).on('resize', _.throttle(onWindowResize, 1000/10));
}


function setupLights() {
	var ambientLight = new THREE.AmbientLight(0x404040);
	scene.add( ambientLight );

	var dl = new THREE.DirectionalLight(0xffffff);
	dl.position.x = 1000;
	dl.position.y = 1000;
	dl.position.z = 750;

	dl.castShadow = true;
	dl.shadowDarkness = 0.2;

	if (config.debug) dl.shadowCameraVisible = true;

	scene.add(dl);

	var directionalLight = new THREE.DirectionalLight(0x808080);
	directionalLight.position.x = - 1;
	directionalLight.position.y = 1;
	directionalLight.position.z = - 0.75;
	directionalLight.position.normalize();

	scene.add(directionalLight);
}

function setupPostprocessing() {
	composer = new THREE.EffectComposer( renderer );
	var rp = new THREE.RenderPass( scene, camera );

	composer.addPass( rp );

	var vignettePass = new THREE.ShaderPass( THREE.VignetteShader );
	vignettePass.uniforms[ "darkness" ].value = 0.9;
	vignettePass.uniforms[ "offset" ].value = 0.5;
	vignettePass.renderToScreen = true;

	composer.addPass( vignettePass );

	return;

	var dpr = 1;

	var fxaa = new THREE.ShaderPass( THREE.FXAAShader );
	fxaa.uniforms['resolution'].value.set(1 / (window.innerWidth * dpr), 1 / (window.innerHeight * dpr));
	fxaa.renderToScreen = true;

	composer.addPass( fxaa );
}

function animate() {
	requestAnimationFrame(animate);

	TWEEN.update();
	render();
	stats.update();
}

function render() {
	camera.lookAt(target);

	//renderer.setViewport( 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT );
	//renderer.render(scene, camera);

	//renderer.setViewport( 1, 200, 200, 200 );
	//renderer.render( scene, topCamera );

	config.postprocess ? composer.render() : renderer.render(scene, camera);
}

function getData() {

	$.getJSON(config.levelsUrl, function(data){
		window.levelData = data;
		init();
	});
}

function startGame() {
	$(document).off('keydown');
	$('#menu').hide();
	$('#start').attr('id','#restart').html('restart');

	var deltaT = 1400;

	//zoom in
	var at = {r: radious};
	var target = {r: 1600};
	var zoomT = new TWEEN.Tween(at)
		.to(target, deltaT)
		.onUpdate(function(){
			radious = this.r;
			setCameraPosition();
		})
		.easing(TWEEN.Easing.Cubic.Out);

	zoomT.start();

	game.startLevel(0);

	setupEvents();
}

function setCameraPosition() {
	var a = Math.deg2rad_h;
	camera.position.x = radious * Math.sin(theta * a) * Math.cos(phi * a);
	camera.position.y = radious * Math.sin(phi * a );
	camera.position.z = radious * Math.cos(theta * a) * Math.cos(phi * a);
}


function setupEvents()
{
	window.keyboard = new INPUT.KeyboardState();

	//$(document).on('keydown', onKeyDown);
	//$(document).on('keyup', onKeyUp);

	setInterval(inputHandler, 1000/30);

	$(document).on('mousemove',  onDocumentMouseMove);
	$(document).on('mousedown',  onDocumentMouseDown);
	$(document).on('mouseup',    onDocumentMouseUp);

	document.addEventListener( 'mousewheel', onDocumentMouseWheel, false );
	//$(document).on('mousewheel', onDocumentMouseWheel); // might need plugin to x-handle

	$('#restart-level').on('click', function(){
		game.resetLevel();
	});
	$('#random-level').on('click', function(){
		game.randomLevel(10);
	});
	$('#next-level').on('click', function(){
		game.gotoNextLevel(true);
	});
}

function onWindowResize(event) {
	renderer.setSize(window.innerWidth, window.innerHeight);

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	composer.reset();
	//setupPostprocessing();
}

function onDocumentMouseDown(event) {
	event.preventDefault();

	isMouseDown = true;

	onMouseDownTheta = theta;
	onMouseDownPhi = phi;
	onMouseDownPosition.x = event.clientX;
	onMouseDownPosition.y = event.clientY;
}

function onDocumentMouseMove(event) {
	event.preventDefault();

	if (isMouseDown) {
		theta = - ( ( event.clientX - onMouseDownPosition.x ) * 0.5 ) + onMouseDownTheta;
		phi = ( ( event.clientY - onMouseDownPosition.y ) * 0.5 ) + onMouseDownPhi;
		phi = Math.min( 180, Math.max( 0, phi ) );

		var a = Math.deg2rad_h;

		setCameraPosition();
		camera.updateMatrix();
	}	
}

function onDocumentMouseUp(event) {
	event.preventDefault();

	isMouseDown = false;

	onMouseDownPosition.x = event.clientX - onMouseDownPosition.x;
	onMouseDownPosition.y = event.clientY - onMouseDownPosition.y;
}

Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};

function onDocumentMouseWheel(event) {
	var MAX_ZOOM = 8000, MIN_ZOOM = 1000;

	radious -= event.wheelDeltaY;

	radious = radious.clamp(MIN_ZOOM, MAX_ZOOM);


	setCameraPosition();
	camera.updateMatrix();

	render();
}

function inputHandler() {

	var pPos = game.player;

	if (keyboard.pressed('left')) {
		pPos.move(Grid.DIRS.LEFT);
	} else if (keyboard.pressed('down')) {
		pPos.move(Grid.DIRS.DOWN);
	} else if (keyboard.pressed('right')) {
		pPos.move(Grid.DIRS.RIGHT);
	} else if (keyboard.pressed('up')) {
		pPos.move(Grid.DIRS.UP);
	}

	if (keyboard.pressed('r'))
		game.resetLevel();

	if (keyboard.pressed('d'))
		config.debug = !config.debug;
}

});