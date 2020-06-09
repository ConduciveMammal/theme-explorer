import gulp from 'gulp'
import { paths } from '../gulpfile.babel'
import del from 'del'


export function clean() {
  return del(['build'])
}
