const { src, dest, series, watch } = require('gulp');

const plumber = require('gulp-plumber'),
  notify = require('gulp-notify'),
  pug = require('gulp-pug'),
  sass = require('gulp-sass')(require('sass')),
  sourcemaps = require('gulp-sourcemaps'),
  paths = {
    'sass': 'src/**/*.scss',
    'views': 'src/**/*.pug',
    'static': [
      'src/**/img/*.{gif,png,jpg,jpeg,svg,ico}',
      'src/**/fonts/*.{eot,otf,ttf,woff,woff2,svg}',
      'src/**/*.{js,pdf,html,php,ico,png,xml,svg,webmanifest,mp3}'
    ]
  };

var onError = function(err) {
  console.log(err);
  notify.onError({
    title: "Error in " + err.plugin,
  })(err);
  this.emit('end');
};

function static() {
  return src(paths['static'])
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(dest('build/'));
}

function views() {
  return src(paths['views'])
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(pug({
      pretty: true
    }))
    .pipe(dest('build/'));
}

function styles() {
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

function styles_copy() {
  // styles();
  return src('build/konkurs_vr/style.css')
    .pipe(dest('/var/www/konkurs-vr.wbbb.ru/www/local/templates/konkurs-vr/'));
}

function build() {
  return series(
    static,
    views,
    styles
  )
}

exports.build = build();

exports.watch = series(
  build(),
  function watch_internal(cb) {
    watch(paths['sass'], series(styles, styles_copy));
    // watch(paths['views'], views);
    // watch(paths['static'], static);
    cb();
  }
)

exports.default = function(cb) {
  cb();
}
