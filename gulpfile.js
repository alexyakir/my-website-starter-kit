var gulp = require('gulp');
var postcss = require('gulp-postcss');
var jade = require('gulp-pug');
var autoprefixer = require('autoprefixer');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
//postcss plugins
// var precss = require('precss');
var lost = require('lost');
var normalize = require('postcss-normalize');
var imagemin = require('gulp-imagemin');


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
    .pipe(jade())
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

/*================================================
=            Watch + BrowserSync Task            =
================================================*/

gulp.task('watch',['browserSync', 'styles', 'pug'], function(){
  gulp.watch('src/scss/**/*.scss', ['styles']); 
  gulp.watch('src/views/**/*.pug', ['pug']); 
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
=            Gulp General Task            =
==========================================*/

gulp.task('default', ['styles', 'pug', 'watch', 'browserSync']);

