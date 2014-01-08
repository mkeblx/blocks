module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		concat: {
			options: {
				nonull: true,
				separator: '\n;\n',
				stripBanners: true,
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd hh:MM") %> */\n'
			},
			libs: {
				src: [
					'js/libs/json2.min.js',
					'js/libs/jquery.min.js',
					'js/libs/lodash.min.js',
					'js/libs/three.min.js',
					'js/libs/shaders/CopyShader.js',
					'js/libs/shaders/VignetteShader.js',
					'js/libs/shaders/FXAAShader.js',
					'js/libs/postprocessing/EffectComposer.js',
					'js/libs/postprocessing/RenderPass.js',
					'js/libs/postprocessing/MaskPass.js',
					'js/libs/postprocessing/ShaderPass.js',
					'js/libs/Stats.js',
					'js/libs/Detector.js',
					'js/libs/dat.gui.min.js',
					'js/libs/tween.min.js'],
				dest: 'js/libs/libs.js'
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
				src: 'js/libs/libs.js',
				dest: 'js/dist/libs.min.js'
			}
		},
		requirejs: {
			options: {

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

	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.registerTask('default', ['concat','uglify','compass:dist']);
	grunt.registerTask('compile' , ['requirejs']);

};
