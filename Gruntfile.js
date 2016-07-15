module.exports = function(grunt) {
	grunt.initConfig({
		concat: {
		    js: {
		    	src: ['js/login.js', 'js/dashboard.js', 'js/charts.js'],
		    	dest: 'build/app.js',
		    },
		},
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
}