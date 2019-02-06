var gulp         = require('gulp'),
	// sass           = require('gulp-sass'),
	browserSync    = require('browser-sync'),
	concat         = require('gulp-concat'),
	del            = require('del'),
	cache          = require('gulp-cache'),
	autoprefixer   = require('gulp-autoprefixer'),
	notify         = require('gulp-notify'),
	plumber				 = require('gulp-plumber')
	stylus 				 = require('gulp-stylus');
 
	
	gulp.task('browser-sync', function() {
		browserSync({
			server: {
				baseDir: 'project'
			},
			notify: false,
			// tunnel: true,
			// tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
		});
	});

	gulp.task('browser-sync',()=>{
		browserSync.init({
				server: {
						baseDir: `project`,
				},          
				notify: false,
				open: true,
				cache: false
		});
	});

// User scripts

gulp.task('js', gulp.series( function(){
	return gulp.src([
		'project/js/common.js', // Always at the end
		])
	// .pipe(plumber())
	.pipe(concat('scripts.js'))
	.pipe(gulp.dest('project/js'))
	.pipe(browserSync.reload({ stream: true }));
}));


gulp.task('styl', () => {
	return gulp.src(['project/stylus/**/*.styl']) // Take all style files
		.pipe(plumber())
		.pipe(stylus({ 'include css': true, })) // Take all import css and create 1 file
		.pipe(autoprefixer(['last 15 versions']))
		.pipe(gulp.dest(`project/css`))
		.pipe(browserSync.reload({ stream: true }));
});

gulp.task('html', gulp.series( function(){
	return gulp.src(['project/*.html'])
	.pipe(plumber())
	.pipe(browserSync.reload({ stream: true }));
}));


gulp.task('watch', function () {
	gulp.watch('project/stylus/**/*.styl', gulp.series('styl'));
	gulp.watch(['libs/**/*.js', 'project/js/common.js'], gulp.series('js'));
	gulp.watch('project/*.html', gulp.series('html'));
});

gulp.task('removedist', function() { return del.sync('dist'); });

gulp.task('build', gulp.series('removedist', 'styl', 'js'), function () {

	var buildFiles = gulp.src([
		'project/*.html',
		'project/.htaccess',
		]).pipe(gulp.dest('dist'));

	var buildCss = gulp.src([
		'project/css/main.css',
		]).pipe(gulp.dest('dist/css'));

	var buildJs = gulp.src([
		'project/js/scripts.js',
		]).pipe(gulp.dest('dist/js'));

	var buildFonts = gulp.src([
		'project/fonts/**/*',
		]).pipe(gulp.dest('dist/fonts'));

	var buildImg = gulp.src([
		'project/img/**/*',
	]).pipe(gulp.dest('dist/img'));

});


gulp.task('clearcache', function () { return cache.clearAll(); });


gulp.task('default', gulp.parallel('watch', 'browser-sync'));
