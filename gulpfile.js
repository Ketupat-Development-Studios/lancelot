/*
	after npm install gulp
	npm modules required
	npm install --save-dev main-bower-files gulp-filter gulp-uglify gulp-rename gulp-minify-css gulp-util gulp-concat gulp-order
*/

var gulp = require('gulp');
var gutil = require('gulp-util');
var order = require('gulp-order');
var concat = require('gulp-concat');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var flatten = require('gulp-flatten');
var gulpFilter = require('gulp-filter');
var minifyCss = require('gulp-minify-css');
var mainBowerFiles = require('main-bower-files');

var dest_path =  'minified';

console.log(mainBowerFiles())

gulp.task('libs', function() {
	var jsFilter = gulpFilter('*.js');
    var cssFilter = gulpFilter('*.css');
    var fontFilter = gulpFilter(['*.eot', '*.woff', '*.svg', '*.ttf']);

	return gulp.src(mainBowerFiles())

	.pipe(jsFilter)
	.pipe(gulp.dest(dest_path + '/js'))
	.pipe(order([
			'jquery.js',
			'angular.js',
			'angular-route.js',
			'angular-animate.js',
			'angular-aria.js',
			'angular-material.js',
			'angular-hero.js',
			'*'
	    ])
	)
	.pipe(concat('main.js'))
	.pipe(uglify())
	.pipe(rename({
        suffix: ".min"
    }))
	.pipe(gulp.dest(dest_path + '/js'))
	.pipe(jsFilter.restore())

	.pipe(cssFilter)
	.pipe(gulp.dest(dest_path + '/css'))
	.pipe(order([
	        'material-design-color-palette.css',
	        '*'
	    ])
	)
	.pipe(concat('main.css'))
	.pipe(minifyCss())
	.pipe(rename({
        suffix: ".min"
    }))
	.pipe(gulp.dest(dest_path + '/css'))
	.pipe(cssFilter.restore())

	// grab vendor font files from bower_components and push in /public
	.pipe(fontFilter)
	.pipe(flatten())
	.pipe(gulp.dest(dest_path + '/fonts'))
});
gulp.task('default', ['libs']);