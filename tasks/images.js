import gulp from 'gulp'
import { paths } from '../gulpfile.babel'


export function images() {
  return gulp.src(paths.images, { since: gulp.lastRun(images) })
    .pipe(gulp.dest('build/images'))
}
