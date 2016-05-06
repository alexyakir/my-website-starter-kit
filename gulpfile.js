/*====================================
=            Gulp Plugins            =
====================================*/

var gulp = require('gulp');
var pug = require('gulp-pug');
var concat = require('gulp-concat');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var imagemin = require('gulp-imagemin');
var uglify = require('gulp-uglify');


/*=======================================
=            Postcss Plugins            =
=======================================*/


var postcss = require('gulp-postcss');
var lost = require('lost');
var normalize = require('postcss-normalize');
var autoprefixer = require('autoprefixer');


/*====================================
=            Scripts Task            =
====================================*/

var libs = [
    'src/js/jquery.min.js',
    'src/js/custom.js'
]

gulp.task('js:libs', function() {
    gulp.src(libs)
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
});

/*================================
=            Styles Task            =
================================*/

gulp.task('styles', function () {
    var processors = [
      lost,
      autoprefixer({browsers: ['last 2 version']}),
      normalize
    ];
    return gulp.src('src/scss/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.reload({
          stream: true
        }))
});


/*================================
=            Pug Task            =
================================*/

gulp.task('pug', function() {
  return gulp.src('src/views/*.pug')
    .pipe(pug())
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

/*================================================
=            Watch + BrowserSync Task            =
================================================*/

gulp.task('watch',['browserSync', 'styles', 'pug', 'js:libs'], function(){
  gulp.watch('src/scss/**/*.scss', ['styles']); 
  gulp.watch('src/views/**/*.pug', ['pug']);
  gulp.watch('src/js/**/*.js', ['js:libs']); 
  gulp.watch('dist/js/**/*.js', browserSync.reload); 
});

gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: 'dist'
    },
  })
});



/*==========================================
=            Minify Image Task            =
==========================================*/

gulp.task('imagemin', function() {
    return gulp.src('src/images/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [
                {removeViewBox: false},
                {cleanupIDs: false}
            ]
        }))
        .pipe(gulp.dest('dist/images'));
});

/*==========================================
=            Gulp General Tasks           =
==========================================*/

gulp.task('default', ['styles', 'pug', 'watch', 'js:libs', 'browserSync']);
gulp.task('build', ['styles', 'pug', 'imagemin', 'js:libs', 'browserSync']);


