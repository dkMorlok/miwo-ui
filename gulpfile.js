var gulp = require('gulp');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var browserify = require('gulp-browserify');
var optimizeBrowserify = require('gulp-optimize-browserify');
var less = require('gulp-less');
var minifycss = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var newer = require('gulp-newer');


var paths = {
	css: {
		src: 'less/index.less',
		distDir: './dist/css/'
	},
	js: {
		src: 'src/index.coffee',
		distDir: './dist/js/'
	},
	img: {
		src: 'img/**/*',
		distDir: './dist/img/'
	},
	assets: {
		src: 'less/**/*',
		distDir: './dist/less/'
	},
	watch: {
		coffee: ['src/**/*.coffee'],
		less: ['less/*.less'],
		images: ['img/**/*']
	}
};


var pipes = {
	createBrowserify: function(options) {
		var pipe = browserify(options);
		pipe.on('error', function(err) {
			gutil.log(err);
			gutil.beep();
		});
		return pipe;
	},
	createLess: function(options) {
		var pipe = less(options)
		pipe.on('error', function(err) {
			gutil.log(err);
			gutil.beep();
		});
		return pipe;
	}
};



gulp.task('default', ['build', 'watch']);

gulp.task('build', ['compile-js', 'compile-css', 'copy-images', 'copy-assets']);

gulp.task('dist', ['compile-js', 'compile-css', 'minify-js', 'minify-css', 'copy-images', 'copy-assets']);

gulp.task("watch", function() {
	gulp.watch(paths.watch.coffee, ['compile-js']);
	gulp.watch(paths.watch.less, ['compile-css', 'copy-assets']);
	gulp.watch(paths.watch.images, ['copy-images']);
});


gulp.task('copy-images', function() {
	return gulp.src(paths.img.src)
		.pipe(newer(paths.img.distDir))
		.pipe(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }))
		.pipe(gulp.dest(paths.img.distDir))
});

gulp.task('copy-assets', function() {
	return gulp.src(paths.assets.src)
		.pipe(gulp.dest(paths.assets.distDir))
});

gulp.task('compile-css', function() {
	return gulp.src(paths.css.src)
		.pipe(pipes.createLess())
		.pipe(rename('miwo-ui.css'))
		.pipe(gulp.dest(paths.css.distDir));
});

gulp.task('compile-js', function() {
	return gulp.src(paths.js.src, { read: false })
		.pipe(pipes.createBrowserify({transform: ['caching-coffeeify'], extensions: ['.coffee'], debug: true}))
		.pipe(rename('miwo-ui.js'))
		.pipe(gulp.dest(paths.js.distDir));
});

gulp.task('minify-css', function() {
	return gulp.src(paths.css.src)
		.pipe(pipes.createLess())
		.pipe(minifycss({keepBreaks:true}))
		.pipe(rename('miwo-ui.min.css'))
		.pipe(gulp.dest(paths.css.distDir));
});

gulp.task('minify-js', function() {
	return gulp.src(paths.js.src, { read: false })
		.pipe(pipes.createBrowserify({transform: ['caching-coffeeify'], extensions: ['.coffee']}))
		.pipe(optimizeBrowserify())
		.pipe(uglify())
		.pipe(rename('miwo-ui.min.js'))
		.pipe(gulp.dest(paths.js.distDir));
});