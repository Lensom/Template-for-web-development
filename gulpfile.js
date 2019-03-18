var gulp         	 = require('gulp');
var	browserSync    = require('browser-sync');
var	concat         = require('gulp-concat');
var	del            = require('del');
var	cache          = require('gulp-cache');
var	autoprefixer   = require('gulp-autoprefixer');
var	plumber				 = require('gulp-plumber');
var	stylus 				 = require('gulp-stylus');
var cleanCSS       = require('gulp-clean-css');
var uglify         = require('gulp-uglify');
 
	gulp.task('browser-sync',()=>{
		browserSync.init({
				server: {
						baseDir: `project`,
				},          
				notify: false,
				open: true
		});
	});

// User scripts

gulp.task('js', gulp.series( function(){
	return gulp.src([
		'project/js/jquery-3.3.1.min.js', // Add optional scripts
		'project/js/common.js', // Always at the end
		])
	.pipe(plumber())
	.pipe(concat('scripts.js'))
	.pipe(gulp.dest('project/js'))
	.pipe(browserSync.reload({ stream: true }));
}));


gulp.task('styl', () => {
	return gulp.src(['project/stylus/**/*.styl']) // Take all style files
		.pipe(plumber())
		.pipe(stylus({ 'include css': true, })) // Take all import css and create 1 file
		.pipe(autoprefixer(['last 3 versions']))
		.pipe(gulp.dest(`project/css`))
		.pipe(browserSync.reload({ stream: true }));
});

gulp.task('html', gulp.series( function(){
	return gulp.src(['project/*.html'])
	.pipe(browserSync.reload({ stream: true }));
}));


gulp.task('watch', function () {
	gulp.watch('project/stylus/**/*.styl', gulp.series('styl'));
	gulp.watch(['libs/**/*.js', 'project/js/common.js'], gulp.series('js'));
	gulp.watch('project/*.html', gulp.series('html'));
});

gulp.task('removebuild', function(cb) { del.sync('build'); cb(); });

gulp.task('build', gulp.series('removebuild', 'styl', 'js', function (cb) {

	gulp.src([
		'project/*.html',
		// 'project/.htaccess',
		]).pipe(gulp.dest('build'));

	gulp.src(['project/css/main.css',])
		.pipe(cleanCSS())  // Optional: min css
		.pipe(gulp.dest('build/css'));

	gulp.src(['project/js/scripts.js',])
		.pipe(uglify()) // Optional: min js
		.pipe(gulp.dest('build/js'));

	gulp.src(['project/fonts/**/*',])
		.pipe(gulp.dest('build/fonts'));

	gulp.src(['project/img/**/*',])
		.pipe(gulp.dest('build/img'));
	
	cb();
	
}));

gulp.task('clearcache', function () { return cache.clearAll(); });

gulp.task('default', gulp.parallel('watch', 'browser-sync'));
