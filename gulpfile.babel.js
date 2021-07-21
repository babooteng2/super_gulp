import gulp from "gulp";
import gpug from "gulp-pug"; //https://www.npmjs.com/package/gulp-pug
import del from "del";
import ws from "gulp-webserver";
import imgage from "gulp-image";

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
};

const pug = () =>
  gulp.src(routes.pug.src).pipe(gpug()).pipe(gulp.dest(routes.pug.dest));

const clean = () => del([routes.pug.dest]);

const webserver = () =>
  gulp.src(routes.pug.dest).pipe(ws({ livereload: true, open: true }));

const watch = () => {
  gulp.watch(routes.pug.watch, pug);
  gulp.watch(routes.img.src, img);
};

const img = () =>
  gulp.src(routes.img.src).pipe(imgage()).pipe(gulp.dest(routes.img.dest));

const prepare = gulp.series([clean, img]);

const assets = gulp.series([pug]);

//const postDev = gulp.series([webserver, watch]);
const postDev = gulp.parallel([webserver, watch]);

// export는 pakage.json에서 호출되는 것만 쓰면 됨
export const dev = gulp.series([prepare, assets, postDev]);
