'use strict';

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import Prism from 'node-prismjs';
import pug from 'pug';
import del from 'del';
import browserSync from 'browser-sync';

pug.filters.code = function(str, options, locals) {
  const opts = Object.assign({}, options || {}, locals || {});
  const lang = opts.lang || 'plain';
  const start = (typeof opts.start === 'number')? opts.start : null;

  const highlighted = (Prism.languages[opts.lang])
    ? Prism.highlight(str, Prism.languages[opts.lang])
    : str;

  const lineNumberGutter = (start !== null)
    ?   `<span class="line-numbers-rows" style="counter-reset: linenumber ${start - 1}">`
      + Array(str.split('\n').length).join('<span></span>')
      + `</span>`
    : '';

  return `<pre class="${(start !== null)? 'line-numbers' : ''}" ${(start !== null)? 'data-start="'+start+'"' : ''}>`
       +   `<code class="language-${lang}">${lineNumberGutter}${highlighted}</code>`
       + `</pre>`;
}

const $ = gulpLoadPlugins();
const plumberOpt = {
  errorHandler: function(err) {
    console.error(err.stack);
    this.emit('end');
  },
}

gulp.task('default', ['pug', 'assets', 'stylus']);

gulp.task('pug', () =>
  gulp.src('content/index.pug')
    .pipe($.plumber(plumberOpt))
    .pipe($.pug({
      pug: pug,
      pretty: true,
    }))
    .pipe(gulp.dest('dest/'))
);

gulp.task('assets', ['assets:delete'], () =>
  gulp.src('content/assets/**/*')
    .pipe(gulp.dest('dest/assets/'))
);

gulp.task('assets:delete',
  del.bind(null, ['dest/assets/**/*'])
);

gulp.task('stylus', () =>
  gulp.src('style/main.styl')
    .pipe($.plumber(plumberOpt))
    .pipe($.sourcemaps.init())
    .pipe($.stylus({
      'include css': true,
    }))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('dest/'))
    .pipe(browserSync.reload({
      stream: true,
    }))
);

gulp.task('browsersync', () => {
  browserSync({
    server: {
      baseDir: 'dest/',
      index: 'index.html',
    },
  });
});

gulp.task('bs-reload', () => {
  browserSync.reload();
})

gulp.task('watch', ['default', 'browsersync'], () => {
  gulp.watch('content/**/*.pug', ['pug']);
  gulp.watch('content/assets/**/*', ['assets']);
  gulp.watch('style/**/*.styl', ['stylus']);
  gulp.watch('dest/*.html', ['bs-reload']);
});

