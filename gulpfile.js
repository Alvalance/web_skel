var gulp = require('gulp'),
    gutil = require('gulp-util'),
    compass = require('gulp-compass'), // gem install compass --user-install
    connect = require('gulp-connect'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyHTML = require('gulp-minify-html'),
    jsonminify = require('gulp-jsonminify'),
    concat = require('gulp-concat');

var env,
jsSrcs,
sassSrcs,
htmlSrcs,
jsonSrcs,
outputDir,
sassStyle;

// NODE_ENV=prod gulp compass
env = process.env.NODE_ENV || 'dev';

if (env === 'dev') {
	outputDir = 'builds/development/';
	sassStyle = 'expanded';
} else if (env === 'prod') {
	outputDir = 'builds/production/';
	sassStyle = 'compressed';
}

jsSrcs = [
	'components/scripts/example.js' // scripts processed in order found in array
];
sassSrcs = ['components/sass/**/*.scss'];
htmlSrcs = [outputDir + '*.html'];
jsonSrcs = [outputDir + 'js/*.json'];




gulp.task('js', function() {
	gulp.src(jsSrcs)
		.pipe(concat('main.js'))
		.pipe(gulpif(env === 'prod', uglify()))
		.pipe(gulp.dest(outputDir + 'js'))
		.pipe(connect.reload());
});

gulp.task('compass', function() {
	gulp.src(sassSrcs)
		.pipe(compass({
			css: outputDir + 'css',
			sass: 'components/sass',
			image: outputDir + 'img',
			style: sassStyle //,
			// comments: true
		}))
		.on('error', gutil.log)
		.pipe(connect.reload());
});

gulp.task('watch', function() {
	gulp.watch(jsSrcs, ['js']);
	gulp.watch('components/sass/**/*.scss', ['compass']);
	gulp.watch('builds/development/*.html', ['html']);
	gulp.watch('builds/development/js/*.json', ['json']);
});

gulp.task('connect', function() {
	connect.server({
		root: outputDir,
		livereload: true
	});
});

gulp.task('html', function() {
	gulp.src('builds/development/*.html')
	.pipe(gulpif(env === 'prod', minifyHTML()))
	.pipe(gulpif(env === 'prod', gulp.dest(outputDir)))
	.pipe(connect.reload());
});

gulp.task('json', function() {
	gulp.src('builds/development/js/*.json')
	.pipe(gulpif(env === 'prod', jsonminify()))
	.pipe(gulpif(env === 'prod', gulp.dest('builds/production/js')))
	.pipe(connect.reload());
});


gulp.task('default', ['html', 'json', 'js', 'compass', 'connect', 'watch']);