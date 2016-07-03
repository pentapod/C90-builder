'use strict';

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import Prism from 'node-prismjs';
import pug from 'pug';

const $ = gulpLoadPlugins();

pug.filters.code = function(str, options, locals) {
  const opts = Object.assign({}, options || {}, locals || {});
  const lang = opts.lang || 'plain';
  const highlighted = (Prism.languages[opts.lang])
    ? Prism.highlight(str, Prism.languages[opts.lang])
    : str;
  return `<pre><code class="language-${lang}">${highlighted}</code></pre>`;
}

gulp.task('default', ['pug']);

gulp.task('pug', () =>
  gulp.src('content/index.pug')
    .pipe($.pug({
    //  pug: pug,
      pretty: true,
    }))
    .pipe(gulp.dest('content/dest/'))
);
