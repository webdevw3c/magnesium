const { src, dest, series, watch } = require('gulp');

const plumber = require('gulp-plumber'),
  notify = require('gulp-notify'),
  pug = require('gulp-pug'),
  sass = require('gulp-sass')(require('sass')),
  sourcemaps = require('gulp-sourcemaps'),
  paths = {
    'static': [
      'src/**/img/*.{gif,png,jpg,jpeg,svg,ico}',
      'src/**/fonts/*.{eot,otf,ttf,woff,woff2,svg}',
      'src/**/*.{js,pdf,html,php,ico,png,xml,svg,webmanifest,mp3}'
    ],
    'views': 'src/**/*.pug',
    'sass': 'src/**/*.scss',
  };

var onError = function(err) {
  console.log(err);
  // notify.onError({
  //   title: "Error in " + err.plugin,
  // })(err);
  this.emit('end');
};

function process_static() {
  return src(paths['static'], { encoding: false })
    // .pipe(plumber({
    //   errorHandler: onError
    // }))
    .pipe(dest('build/'));
}

function process_views() {
  return src(paths['views'])
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(pug({
      pretty: true
    }))
    .pipe(dest('build/'));
}

function process_styles() {
  return src(paths['sass'])
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        outputStyle: 'expanded'
      })
      .on('error', sass.logError)
    )
    .pipe(sourcemaps.write())
    .pipe(dest('build/'));
}



function buildTask() {
  return series(
    process_static
    , process_views
    , process_styles
  )
}

// exports.default = defaultTask

exports.build = buildTask();

exports.watch = series(
  buildTask(),
  function watch_internal(cb) {
    watch(paths['static'], process_static);
    watch(paths['views'], process_views);
    watch(paths['sass'], series(process_styles));
    cb();
  }
)
