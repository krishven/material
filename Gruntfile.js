module.exports = function(grunt) {
	grunt.initConfig({
		concat: {
		    js: {
		    	src: ['js/app.js','js/login.js', 'js/dashboard.js', 'js/charts.js', 'js/error.js'],
		    	dest: 'build/app.js',
		    },
		    css: {
		    	src: ['css/materialize.css', 'css/style.css'],
		    	dest: 'build/styles.css',
		    },
		},
		watch: {
			options: {
      			livereload: true,
    		},
		  	js: {
		    	files: ['js/**/*.js'],
		    	tasks: ['concat:js'],
		  	},
		  	css: {
		    	files: ['css/**/*.css'],
		    	tasks: ['concat:css'],
		  	},
		},
		connect: {
	    	server: {
	      		options: {
	        		port: 9000,
	        		base: '.',
	        		hostname: '0.0.0.0',
	        		protocol: 'http',
	        		livereload: true,
	        		open: true,
	      		}
    		}
  		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat'); //To concatenate files
	grunt.loadNpmTasks('grunt-contrib-watch'); //To watch for any changes and do concatenation automatically
	grunt.loadNpmTasks('grunt-contrib-connect'); //To live reload after changes
	grunt.registerTask('default', ['concat', 'connect', 'watch']);
}