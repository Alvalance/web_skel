var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    browserSync = require('browser-sync'),
    gulpif = require('gulp-if'),
    jsonminify = require('gulp-jsonminify'),
    uglify = require('gulp-uglify'),
    compass = require('gulp-compass'), // gem install compass --user-install
    // cleanCSS = require('gulp-clean-css'),
    htmlmin = require('gulp-htmlmin'),
    concat = require('gulp-concat');
    // fileinclude = require('gulp-file-include');



// Define all variables
var ENV,
JS,
SASS,
DIST,
cssStyle;



// Redirect output of expanded / minified files
// NODE_ENV=prod gulp
ENV = process.env.NODE_ENV || 'dev';

if (ENV === 'dev') {
	DIST = 'dist/dev/';
	cssStyle = 'expanded';
} else if (ENV === 'prod') {
	DIST = 'dist/prod/';
	cssStyle = 'compressed';
}



// File paths
JS = [
	'src/js/example.js' // scripts processed in order found in array
];
SASS = ['src/sass/**/*.scss'];



gulp.task('html', function() {
	gulp.src('dist/dev/*.html')
        .pipe(plumber({
            handleError: function(e) {
                console.log(e);
                this.emit('end');
            }
        }))
    	.pipe(gulpif(ENV === 'prod', htmlmin({
            collapseWhitespace: true,
            removeComments: true
        })))
    	.pipe(gulpif(ENV === 'prod', gulp.dest('dist/prod/')));
});



gulp.task('json', function() {
	gulp.src('dist/dev/json/*.json')
        .pipe(plumber({
            handleError: function(e) {
                console.log(e);
                this.emit('end');
            }
        }))
    	.pipe(gulpif(ENV === 'prod', jsonminify()))
    	.pipe(gulpif(ENV === 'prod', gulp.dest('dist/prod/json/')));
});



gulp.task('js', function() {
	gulp.src(JS)
        .pipe(plumber({
            handleError: function(e) {
                console.log(e);
                this.emit('end');
            }
        }))
		.pipe(concat('main.js'))
		.pipe(gulpif(ENV === 'prod', uglify()))
		.pipe(gulp.dest(DIST + 'js'));
});



gulp.task('compass', function() {
	gulp.src(SASS)
        .pipe(plumber({
            handleError: function(e) {
                console.log(e);
                this.emit('end');
            }
        }))
		.pipe(compass({
			css: DIST + 'css',
			sass: 'src/sass',
			image: DIST + 'img',
			style: cssStyle //,
			// comments: true
		}));
});



gulp.task('watch', function() {
    browserSync.init({
        open:  false,
        server: {
            baseDir: DIST
        },
        ui: false,
        port: 8000
    });
	gulp.watch(JS, ['js']);
	gulp.watch(SASS, ['compass']);
	gulp.watch('dist/dev/*.html', ['html']);
	gulp.watch('dist/dev/js/*.json', ['json']);
    gulp.watch(DIST + '**/*', ['sync'] );
});



gulp.task('sync', function(){
  browserSync.reload();
});



gulp.task('default', ['html', 'json', 'js', 'compass', 'watch']);
