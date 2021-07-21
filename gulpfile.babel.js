import gulp from "gulp";
import gpug from "gulp-pug"; //https://www.npmjs.com/package/gulp-pug
import del from "del";
import ws from "gulp-webserver";
import imgage from "gulp-image";

const sass = require("gulp-sass")(require("node-sass"));

const routes = {
  pug: {
    watch: "src/**/*.pug",
    src: "src/*.pug",
    dest: "build",
  },
  img: {
    src: "src/img/*",
    dest: "build/img",
  },
  scss: {
    watch: "src/scss/**/*.scss",
    src: "src/scss/style.scss",
    dest: "build/css",
  },
};

const pug = () =>
  gulp.src(routes.pug.src).pipe(gpug()).pipe(gulp.dest(routes.pug.dest));

const clean = () => del([routes.pug.dest]);

const webserver = () =>
  gulp.src(routes.pug.dest).pipe(
    ws({
      livereload: true,
      open: true,
    })
  );

const watch = () => {
  gulp.watch(routes.pug.watch, pug);
  gulp.watch(routes.img.src, img);
  gulp.watch(routes.scss.watch, styles);
};

const img = () =>
  gulp.src(routes.img.src).pipe(imgage()).pipe(gulp.dest(routes.img.dest));

const styles = () =>
  gulp
    .src(routes.scss.src)
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest(routes.scss.dest));

const prepare = gulp.series([clean]);

const assets = gulp.series([pug, styles, img]);

//const postDev = gulp.series([webserver, watch]);
const postDev = gulp.parallel([webserver, watch]);

// export는 pakage.json에서 호출되는 것만 쓰면 됨
export const dev = gulp.series([prepare, assets, postDev]);
