import gulp from "gulp";
import gpug from "gulp-pug"; //https://www.npmjs.com/package/gulp-pug
import del from "del";
import ws from "gulp-webserver";
import imgage from "gulp-image";
import autop from "gulp-autoprefixer";
import miniCss from "gulp-csso";
import bro from "gulp-bro"; //browserify - 웹상에서 노드스타일 모듈작성할 수 있는 자바스크립도구
import babelify from "babelify";
import uglify from "uglifyify";
import ghPages from "gulp-gh-pages";

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
  js: {
    watch: "src/js/**/*.js",
    src: "src/js/main.js",
    dest: "build/js",
  },
};

const pug = () =>
  gulp.src(routes.pug.src).pipe(gpug()).pipe(gulp.dest(routes.pug.dest));

const clean = () => del([routes.pug.dest, ".publish"]);

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
  gulp.watch(routes.js.watch, js);
};

const img = () =>
  gulp.src(routes.img.src).pipe(imgage()).pipe(gulp.dest(routes.img.dest));

const styles = () =>
  gulp
    .src(routes.scss.src)
    .pipe(sass().on("error", sass.logError))
    .pipe(autop({})) //https://www.npmjs.com/package/gulp-autoprefixer usage 참조
    .pipe(miniCss())
    .pipe(gulp.dest(routes.scss.dest));

const js = () =>
  gulp
    .src(routes.js.src)
    .pipe(
      bro({
        transform: [
          babelify.configure({ presets: ["@babel/preset-env"] }),
          [uglify, { global: true }],
        ],
      })
    )
    .pipe(gulp.dest(routes.js.dest));

const gh = () => gulp.src("build/**/*").pipe(ghPages());

const prepare = gulp.series([clean]);

const assets = gulp.series([pug, styles, img, js]);

const live = gulp.parallel([webserver, watch]);

// export는 pakage.json에서 호출되는 것만 쓰면 됨
export const build = gulp.series([prepare, assets]);
export const dev = gulp.series([build, live]);
//export const deploy = gulp.series([build, gh, clean]);
export const deploy = gulp.series([build, gh, clean]);
