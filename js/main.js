define(function(require){

if (!Detector.webgl) {
	alert('I\'m sorry, you\'re browser doesn\'t support WebGL.');
	return;
}

window.Class = require('Class');

var Game = require('Game');
var Grid = require('Grid');
//var KEYS = require('Keys');

window.config = {
	debug: 0,
	postprocess: 1,
	mode: 'VR',
	animate: {
		player: 1,
		piece: 1,
		level: 1
	},
	levelsUrl: 'data/levels.json'
};
window.BG_COLOR = 0xcccccc;
window.mode = !!navigator.getVRDevices && config.mode == 'VR' ? 'VR' : 'obsolete';

var clock = new THREE.Clock();

var container, stats, gui;

var camera, renderer, composer;

var vrEffect;
var vrControls;

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

	setupRendering();


	if (config.debug) {
		var axes = new THREE.AxisHelper(30);
		scene.add(axes);
	}

	if (config.debug || 1) {
		stats = new Stats();
		container.appendChild(stats.domElement);
	}

	if (config.postprocess && mode != 'VR')
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
		if (ev.keyCode === 13) {  // enter
			startGame();
		}
	});

	$(document).on('click', '#start', startGame);

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

	dl.shadowCameraLeft = -450;
	dl.shadowCameraRight = 450;
	dl.shadowCameraTop = 600;
	dl.shadowCameraBottom = -256;

	dl.shadowMapHeight = dl.shadowMapWidth = 1024;

	if (config.debug) dl.shadowCameraVisible = true;

	scene.add(dl);

	var directionalLight = new THREE.DirectionalLight(0x808080);
	directionalLight.position.x = - 1;
	directionalLight.position.y = 1;
	directionalLight.position.z = - 0.75;
	directionalLight.position.normalize();

	scene.add(directionalLight);
}

function setupRendering() {
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

	function VREffectLoaded(error) {
		if (error) {
			//fullScreenButton.innerHTML = error;
			//fullScreenButton.classList.add('error');
		}
	}

	if (mode == 'VR') {
		vrEffect = new THREE.VREffect(renderer, VREffectLoaded);
		vrControls = new THREE.VRControls(camera);
	}
}

function setupPostprocessing() {
	composer = new THREE.EffectComposer( renderer );
	var rp = new THREE.RenderPass( scene, camera );

	composer.addPass( rp );

	var effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
	var width = window.innerWidth;
	var height = window.innerHeight;
	effectFXAA.uniforms['resolution'].value.set(1 / width, 1 / height);
	composer.addPass(effectFXAA);

	var vignettePass = new THREE.ShaderPass( THREE.VignetteShader );
	vignettePass.uniforms[ "darkness" ].value = 0.9;
	vignettePass.uniforms[ "offset" ].value = 0.5;
	vignettePass.renderToScreen = true;

	composer.addPass( vignettePass );
}

function animate() {
	requestAnimationFrame(animate);

	var dt = clock.getDelta();

	update(dt);
	render(dt);
}

function update(dt) {
	TWEEN.update();

	if (stats)
		stats.update();
}

function render(dt) {
	if (mode === 'VR') {
		var vrState = vrControls.getVRState();
		var s = 1000;

		// TODO: clean this up: 1) put in update, 2) do like vr-tmpl
		var cPos = {x: 0, y: 700, z: 700};
		var vrPos = (vrState) ? vrState.hmd.position : [0,0,0];
		var pos = vrPos;
		pos[0] = vrPos[0]*s + cPos.x;
		pos[1] = vrPos[1]*s + cPos.y;
		pos[2] = vrPos[2]*s + cPos.z;

		camera.position.fromArray(pos);

		vrControls.update();
		vrEffect.render(scene, camera);
	} else {
		camera.lookAt(target);
		(config.postprocess) ? composer.render() : renderer.render(scene, camera);
	}
}

function getData() {

	$.getJSON(config.levelsUrl, function(data){
		window.levelData = data;
		init();
	});
}

function startGame() {
	if (mode == 'VR') {
		vrEffect.setFullScreen(true);
	}

	$(document).off('keydown');
	//$('#menu').fadeOut();

	$('#menu')
		.removeClass('active')
		.addClass('scale-out');

	$('#menu').hide();

	var deltaT = 1400;

	//zoom in
	var at = {r: radious};
	var target = {r: 1600};
	var zoomT = new TWEEN.Tween(at)
		.to(target, deltaT)
		.easing(TWEEN.Easing.Cubic.Out)
		.onUpdate(function(){
			radious = this.r;
			setCameraPosition();
		})
		.onComplete(function(){
			game.startLevel(0);
			setupEvents();		
		})
		.delay(600);

	zoomT.start();
}

function setCameraPosition() {
	var a = Math.deg2rad_h;
	
	if (mode == 'VR') {
		camera.position.set(0,700,700);
	} else {
		camera.position.x = radious * Math.sin(theta * a) * Math.cos(phi * a);
		camera.position.y = radious * Math.sin(phi * a);
		camera.position.z = radious * Math.cos(theta * a) * Math.cos(phi * a);
	}
}


function setupEvents() {
	key('r', function(){
		game.resetLevel();
	});

	key('n', function(){
		game.gotoNextLevel(true);
	});

	key('z', function(){
		vrEffect && vrControls._vrInput.zeroSensor();
	});

	key('d', function(){
		config.debug = !config.debug;
	});

	var pPos = game.player;
	/*
	NOTE: could wrap in for potential desired behavior
	key('left,a, down,s, right,d, up,w', function(){
		if (key.isPressed('left') || key.isPressed('a')) {
			pPos.move(Grid.DIRS.LEFT);
		} else if (key.isPressed('down') || key.isPressed('s')) {
			pPos.move(Grid.DIRS.DOWN);
		} else if (key.isPressed('right') || key.isPressed('d')) {
			pPos.move(Grid.DIRS.RIGHT);
		} else if (key.isPressed('up') || key.isPressed('w')) {
			pPos.move(Grid.DIRS.UP);
		}
	});

	*/
	key('left, a', function(){
		pPos.move(Grid.DIRS.LEFT);
	});
	key('down, s', function(){
		pPos.move(Grid.DIRS.DOWN);
	});
	key('right, d', function(){
		pPos.move(Grid.DIRS.RIGHT);
	});
	key('up, w', function(){
		pPos.move(Grid.DIRS.UP);
	});


	$('#restart-level').on('click', function(){
		game.resetLevel();
	});
	$('#random-level').on('click', function(){
		game.randomLevel(10);
	});
	$('#next-level').on('click', function(){
		game.gotoNextLevel(true);
	});

	if (mode !== 'VR') {
		$(document).on('mousemove',  onDocumentMouseMove);
		$(document).on('mousedown',  onDocumentMouseDown);
		$(document).on('mouseup',    onDocumentMouseUp);

		document.addEventListener( 'mousewheel', onDocumentMouseWheel, false );
		//$(document).on('mousewheel', onDocumentMouseWheel); // might need plugin to x-handle
	}

}

function onWindowResize(event) {
	renderer.setSize(window.innerWidth, window.innerHeight);

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	//composer.reset();
	if (mode !== 'VR')
		setupPostprocessing();
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

function onDocumentMouseWheel(event) {
	var MAX_ZOOM = 8000, MIN_ZOOM = 1000;

	radious -= event.wheelDeltaY;

	radious = Math.min(Math.max(radious, MIN_ZOOM), MAX_ZOOM);

	setCameraPosition();
	camera.updateMatrix();

	render();
}

});