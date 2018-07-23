const gulp = require('gulp');
const $ = {
	autoprefixer: require('gulp-html-autoprefixer'),
	emailBuilder: require('gulp-email-builder'),
	minifyHtml: require('gulp-htmlmin'),
	minifyCss: require('gulp-minify-inline'),
	rename: require('gulp-rename'),
	replace: require('gulp-token-replace'),
	sass: require('gulp-sass')
};
const config = require('./config.json');

// =============================================================================

gulp.task('sass', function () {
  return gulp.src('./assets/sass/*.scss')
    .pipe($.sass().on('error', $.sass.logError))
    .pipe(gulp.dest('./assets/css'));
});

gulp.task('emailBuilder', ['sass'], function() {
	return gulp.src(['index.html'])
		.pipe($.replace({global:config}))
		.pipe($.emailBuilder(config.build).build())
		.pipe(gulp.dest('./build'));
});

gulp.task('htmlMin', function() {
  return gulp.src('./build/index.html')
  	.pipe($.autoprefixer())
    .pipe($.minifyHtml({
    	collapseWhitespace: true
    }))
    .pipe($.minifyCss())
    .pipe($.rename({
    	suffix: '.min'
    }))
    .pipe(gulp.dest('./build'));
});

gulp.task('send', function() {
	return gulp.src('./build/index.min.html')
		.pipe($.emailBuilder({
			emailTest: config.send
		}).sendEmailTest());
});

// =============================================================================

gulp.task('watch', function() {
	gulp.watch(['./index.html', './assets/**/*'], ['emailBuilder']);
	gulp.watch(['./build/index.html'], ['htmlMin']);
	gulp.watch(['./assets/sass/*.scss'], ['sass']);
});

// =============================================================================

gulp.task('build', ['sass', 'emailBuilder', 'htmlMin']);
gulp.task('default', ['watch', 'build']);