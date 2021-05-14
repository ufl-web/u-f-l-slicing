'use strict'

const gulp = require('gulp');
const del = require('del');
const newer = require('gulp-newer');
const browserSync = require('browser-sync').create();
const sassGlob = require('gulp-sass-glob');
const sass = require('gulp-sass');
const debug = require('gulp-debug');
const pugInheritance = require('yellfy-pug-inheritance');
const filter = require('gulp-filter');
const pug = require('gulp-pug');
const uglify = require('gulp-uglify');

const webpackStream = require('webpack-stream');
const webpack = webpackStream.webpack;
const named = require('vinyl-named');
const fileinclude = require('gulp-file-include');
const through2 = require('through2');

var sassUnicode = require('gulp-sass-unicode');


const tpl = 'html';//'pug';
var isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';
var pugInheritanceCache = {};

gulp.task('styles', function(){
  return gulp.src('sources/styles/styles.scss').pipe(sassGlob()).pipe(sass({outputStyle: isDevelopment ? 'expanded' : 'compressed'})).pipe(sassUnicode()).on('error', function(err){
    console.log(err.message);
    this.emit('end');
  }).pipe(gulp.dest('distr/styles'));
  if(!isDevelopment) {
    pipeline.pipe(browserSync.stream());
  }
});


gulp.task('pug', function(){
  var pipeline = gulp.src('sources/*.pug');
  return pipeline.pipe(pug()).on('error', function (err) {
    console.log(err.message);
  }).pipe(gulp.dest('distr')).pipe(browserSync.stream());
});

function pugFilter(file, inheritance, changedFile) {
  const filepath = `sources/${file.relative}`;
  if (inheritance.checkDependency(filepath, changedFile)) {
    console.log(`Compiling: ${filepath}`);
    return true;
  }
  return false;
}

gulp.task('jadeincremental', function(){
  return new Promise(function(resolve, reject){
    var changedFile = global.changedTemplateFile;
    const options = {
      changedFile,
      treeCache: pugInheritanceCache
    };
    pugInheritance.updateTree('sources/', options).then(function(inheritance){
       var pugInheritanceCache = inheritance.tree;
        var ppipeline = gulp.src('sources/*.pug');
        if(global.watch){
          ppipeline.pipe(filter((file) => pugFilter(file, inheritance, global.changedTemplateFile)));
        }
        return ppipeline.pipe(pug()).on('error', function (err) {
          console.log(err.message);
          this.emit('end');
        }).pipe(gulp.dest('distr')).on('end', resolve).on('error', reject).pipe(browserSync.stream());
    });
  });
});

gulp.task('webpack', function(callback) {
  var firstBuildReady = false;

  function done(err, stats) {
    firstBuildReady = true;

    if (err) {
      return;
    }

    // gulplog[stats.hasErrors() ? 'error' : 'info'](stats.toString({
    //   colors: true
    // }));

  }

  var options = {
    output: {
      distrPath: '/js/',
      publicPath: isDevelopment ? '/js/' : '/templates/2015/new_slicing/js/',
      filename: isDevelopment ? '[name].js' : '[name]-[chunkhash:10].js'
    },
    watch:   isDevelopment,
    devtool: isDevelopment ? 'cheap-module-inline-source-map' : null,
    module:  {
      loaders: [{
        test:    /\.js$/,
        include: ['sources/js'],
        loader:  'babel?presets[]=es2015'
      }]
    },
    plugins: [
      new webpack.NoErrorsPlugin(),
      new webpack.ProvidePlugin({
        'global': 'global'
      }),
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',

      }),
    ]
  };

  var pipeline = gulp.src('sources/js/*.js').pipe(named()).pipe(webpackStream(options, null, done)).on('error', function (err) {
    console.log(err.message);
    this.emit('end');
  });
  if(!isDevelopment){
    pipeline.pipe(uglify());
  }
  pipeline.pipe(gulp.dest('distr/js'))
    .on('data', function() {
      if (firstBuildReady) {
        callback();
      }
    });
});


gulp.task('html', function(){
  var pipeline = gulp.src('sources/*.html');
  return pipeline.pipe(fileinclude({
    prefix: '@@',
    basepath: '@file'
  })).pipe(gulp.dest('distr'));
});
gulp.task('touchRootHTML', function () {
  gulp.src('sources/*.html').pipe( through2.obj( function( file, enc, cb ) {
    let date = new Date();
    file.stat.atime = date;
    file.stat.mtime = date;
    cb( null, file );
  }) )
})

gulp.task('resources', function(){
  return gulp.src('sources/resources/**/*', {since: gulp.lastRun('resources')})
    .pipe(newer('distr/resources')).pipe(gulp.dest('distr/resources'))
});
gulp.task('clean', function(){
  return del('distr');
});

gulp.task('build', gulp.series(
  'clean',
  gulp.parallel(tpl, 'styles', 'resources', 'webpack'))
);

gulp.task('watch', function(){
  gulp.watch('sources/styles/*.scss', gulp.series('styles'));
  gulp.watch('sources/blocks/**/*.scss', gulp.series('styles'));
  gulp.watch('sources/*.' + tpl, gulp.series(tpl));
  global.watch = true;

  gulp.watch('sources/blocks/**/*.pug', gulp.series('jadeincremental'))
    .on('all', (event, filepath) => {
      console.log(filepath.replace(/\\/g, '/'));
    global.changedTemplateFile = filepath.replace(/\\/g, '/');
  });
  gulp.watch('sources/blocks/**/*.html', gulp.series('html'));
  gulp.watch('sources/resources/**/*.*', gulp.series('resources'));
});

gulp.task('serve', function(){
  browserSync.init({
    server : 'distr'
  });
  browserSync.watch('distr/*/*.*').on('change', browserSync.reload);
  browserSync.watch('distr/*.html').on('change', browserSync.reload);
});


gulp.task('dev', gulp.series('build', gulp.parallel('watch', 'serve')));


gulp.task('prod:distr', function () {
  return gulp.src('distr/**/*').pipe(gulp.dest('distr'));
});

gulp.task('prod',

  // return new Promise(function(resolve, reject){
    gulp.series(function (done) {
      isDevelopment = false;
      done();
    }, 'build', 'prod:distr')
  // });
);

