module.exports = function(grunt) {

	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		dirs: {
			lib: 'js/libs/'
		},

		babel: {
			options: {
				sourceMap: false,
				modules: 'amd'
			},
			dist: {
				files: [{
					expand: true,
					cwd: 'js/src',
					src: ['*.js'],
					dest: 'js/comp',
					ext: '.js'
				}]
			}
		},
		concat: {
			options: {
				nonull: true,
				separator: '\n;\n',
				stripBanners: true,
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd hh:MM") %> */\n'
			},
			libs: {
				src: [
					'js/libs/jquery.min.js',
					'js/libs/lodash.min.js',
					'js/libs/tween.min.js',
					'js/libs/keymaster.js',
					'js/libs/three.min.js',
					'js/libs/VREffect.js',
					'js/libs/VRControls.js',
					'js/libs/shaders/CopyShader.js',
					'js/libs/shaders/VignetteShader.js',
					'js/libs/shaders/FXAAShader.js',
					'js/libs/postprocessing/EffectComposer.js',
					'js/libs/postprocessing/RenderPass.js',
					'js/libs/postprocessing/MaskPass.js',
					'js/libs/postprocessing/ShaderPass.js',
					'js/libs/Stats.js',
					'js/libs/Detector.js',
					'js/libs/dat.gui.min.js'],
				dest: 'js/dist/libs.js'
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd hh:MM") %> */\n',
				beautify: {
					width: 80,
					beautify: true
				}
			},
			build: {
				src: 'js/dist/libs.js',
				dest: 'js/dist/libs.min.js'
			}
		},
		requirejs: {
			compile: {
				options: {
					baseUrl: 'js/comp',
					name: 'main',
					out: 'js/dist/main.js'
				}
			}
		},
		jshint: {
			jshintrc: '.jshintrc',
			files: {
				src: ['js/*.js']
			}
		},
		clean: {
			dist: ['css/*.css']
		},
		compass: {
			dist: {
				options: {
					sassDir: 'css/sass/',
					cssDir: 'css'
				}
			}
		},
		watch: {
			options: {
				livereload: true
			},
			sass: {
				files: ['css/sass/*.scss'],
				tasks: ['compass:dist'],
				options: {
				}
			}
		}
	});

	grunt.registerTask('default', ['concat','uglify','compass:dist']);
	grunt.registerTask('dev', ['babel']);
	grunt.registerTask('dist' , ['requirejs']);

};
