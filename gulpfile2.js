var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    cleanCSS = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer'),
    ftp = require('vinyl-ftp'),
    notify = require("gulp-notify"),
    rsync = require('gulp-rsync');

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: 'project'
        },
        notify: false,
        // tunnel: true,
        // tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
    });
});

// Пользовательские скрипты проекта


// ------------------------------------------------------
// For min your js file uncomment this code 33-51 lines, and delete 56-66 lines

// gulp.task('common-js', function() {
// 	return gulp.src([
// 		'project/js/common.js',
// 		])
// 	.pipe(concat('common.min.js'))
// 	.pipe(uglify()) // Min js
// 	.pipe(gulp.dest('project/js'));
// });
// gulp.task('js', ['common-js'], function() {
// 	return gulp.src([
// 		// Add custom js libs and files
// 		'project/libs/jquery/jquery.min.js',
// 		'project/js/common.min.js', // Всегда в конце
// 		])
// 	.pipe(concat('scripts.min.js'))
// 	.pipe(uglify()) // Optional Min all js 
// 	.pipe(gulp.dest('project/js'))
// 	.pipe(browserSync.reload({ stream: true }));
// });

// ------------------------------------------------------

gulp.task('js', function () {
    return gulp.src([
            'project/js/common.js', // Всегда в конце
        ])
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest('project/js'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('sass', function () {
    return gulp.src('project/sass/**/*.sass')
        .pipe(sass({
            outputStyle: 'expanded'
        }).on("error", notify.onError()))
        .pipe(rename({
            suffix: '.min',
            prefix: ''
        }))
        .pipe(autoprefixer(['last 15 versions']))
        // .pipe(cleanCSS()) // Optional, min your css
        .pipe(gulp.dest('project/css'))
        .pipe(browserSync.stream())
});

gulp.task('watch', ['sass', 'js', 'browser-sync'], function () {
    gulp.watch('project/sass/**/*.sass', ['sass']);
    gulp.watch(['libs/**/*.js', 'project/js/common.js'], ['js']);
    gulp.watch('project/*.html', browserSync.reload);
});

gulp.task('imagemin', function () {
    return gulp.src('project/img/**/*')
        .pipe(cache(imagemin())) // Cache Images
        .pipe(gulp.dest('dist/img'));
});

gulp.task('build', ['removedist', 'imagemin', 'sass', 'js'], function () {

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

});

gulp.task('deploy', function () {

    var conn = ftp.create({
        host: 'hostname.com',
        user: 'username',
        password: 'userpassword',
        parallel: 10,
        log: gutil.log
    });

    var globs = [
        'dist/**',
        'dist/.htaccess',
    ];
    return gulp.src(globs, {
            buffer: false
        })
        .pipe(conn.dest('/path/to/folder/on/server'));

});

gulp.task('rsync', function () {
    return gulp.src('dist/**')
        .pipe(rsync({
            root: 'dist/',
            hostname: 'username@yousite.com',
            destination: 'yousite/public_html/',
            // include: ['*.htaccess'], // Скрытые файлы, которые необходимо включить в деплой
            recursive: true,
            archive: true,
            silent: false,
            compress: true
        }));
});

gulp.task('removedist', function () {
    return del.sync('dist');
});
gulp.task('clearcache', function () {
    return cache.clearAll();
});

gulp.task('default', ['watch']);
