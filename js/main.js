define(function(require){

window.Class = require('Class');

var Game = require('Game');
var Grid = require('Grid');
var KEYS = require('Keys');

$(_init);

if (!Detector.webgl) {
	alert('I\'m sorry, you\'re browser doesn\'t support WebGL.');
	return;
}

var DEBUG = 0;
var config = {
	postprocess: 1,
	debug: 0,
	animate: {
		player: 1,
		piece: 1,
		level: 1
	}
};

var container, stats;

var camera, renderer, composer;

window.scene;

var sphere, plane;

var target = new THREE.Vector3(0,0,0);

Math.deg2rad = Math.PI/180;
Math.deg2rad_h = Math.deg2rad/2;


window.BG_COLOR = 0xcccccc;

var isMouseDown = false;
var isShiftDown = false, isCtrlDown = false, isAltDown = false;
var onMouseDownTheta;
var onMouseDownPhi;
var onMouseDownPosition = new THREE.Vector2();
var radious = 8000,
	theta = 45, onMouseDownTheta = 45,
	phi = 60, onMouseDownPhi = 60;

function _init() {
	getData();
}

function init() {
	container = document.createElement('div');
	document.body.appendChild(container);

	camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
	setCameraPosition();

	scene = new THREE.Scene();

	setupLights();

	scene.fog = new THREE.FogExp2( BG_COLOR, 0.0002 );

	renderer = new THREE.WebGLRenderer({
		antialias: true});

	renderer.shadowMapEnabled = true;
	renderer.shadowMapSoft = true;
	renderer.shadowMapWidth = 2048;
	renderer.shadowMapHeight = 2048;
	renderer.shadowMapType = THREE.PCFSoftShadowMap;

	renderer.setClearColor(BG_COLOR, 1);
	renderer.setSize(window.innerWidth, window.innerHeight);

	container.appendChild(renderer.domElement);

	if (DEBUG){
		var axes = new THREE.AxisHelper(30);
		scene.add(axes);
	}

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	if (DEBUG) {
		container.appendChild(stats.domElement);
	}

	if (config.postprocess)
		setupPostprocessing();


	$(document).on('click', '#start', function(){
		startGame();
		$('#start').attr('id','#restart').html('restart');
		$('#menu').hide();
	});

	var autostart = 0; // tmp: t.b.controllable
	if(autostart)
		$('#start').click();


	animate();
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

	if (DEBUG) dl.shadowCameraVisible = true;

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
	vignettePass.uniforms[ "darkness" ].value = 0.7;
	vignettePass.uniforms[ "offset" ].value = 0.8;
	vignettePass.renderToScreen = true;

	composer.addPass( vignettePass );

	/*var shader = new THREE.ShaderPass( THREE.FXAAShader );
	shader.uniforms[ "resolution" ].value = new THREE.Vector2( 1 / 1024, 1 / 512 );
	shader.renderToScreen = true;

	composer.addPass( shader );
	*/
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

}


function animate() {
	requestAnimationFrame(animate);

	TWEEN.update();
	render();
	stats.update();
}

function render() {
	camera.lookAt(target);

	config.postprocess ? composer.render() : renderer.render(scene, camera);
}

function getData() {

	$.getJSON('data/levels.json', function(data){
		window.levelData = data;
		init();
	});
}

function startGame() {
	window.game = new Game({mode: '3D'});

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
	$(document).on('keydown', onKeyDown);
	$(document).on('keyup', onKeyUp);

	$(document).on('mousemove',  onDocumentMouseMove);
	$(document).on('mousedown',  onDocumentMouseDown);
	$(document).on('mouseup',    onDocumentMouseUp);

	document.addEventListener( 'mousewheel', onDocumentMouseWheel, false );
	//$(document).on('mousewheel', onDocumentMouseWheel); // might need plugin to x-handle

	$(document).on('resize', onWindowResize);

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
	console.log('resize event');
	return;

	var s = 1;
	renderer.setSize( s * window.innerWidth, s * window.innerHeight );
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
	console.log(event);

	var MAX_ZOOM = 3000, MIN_ZOOM = 1000;

	radious -= event.wheelDeltaY;

	radious = radious.clamp(MIN_ZOOM, MAX_ZOOM);


	setCameraPosition();
	camera.updateMatrix();

	render();
}

//handle movements of player to progress gameplay, and camera
function onKeyDown(ev) {

	var pPos = game.player;

	var code = ev.keyCode;

	if (code === KEYS.SHIFT) {
		isShiftDown = true;
	}
	if (code === KEYS.CTRL) {
		isCtrlDown = true;
	} 

	if (code == KEYS.LEFT) {
		pPos.move(Grid.DIRS.LEFT);
	} else if (code == KEYS.DOWN) {
		pPos.move(Grid.DIRS.DOWN);
	} else if (code == KEYS.RIGHT) {
		pPos.move(Grid.DIRS.RIGHT);
	} else if (code == KEYS.UP) {
		pPos.move(Grid.DIRS.UP);
	}

	if (code == KEYS.R) // r => restart
		game.resetLevel();
}

function onKeyUp(ev) {
	var code = ev.keyCode;

	if (code === 16) {
		isShiftDown = false;
	}
	if (code === 17) {
		isCtrlDown = false;
	}

}

});