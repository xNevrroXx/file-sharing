const gulp = require("gulp");
const webpack = require("webpack-stream");
const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require("gulp-sourcemaps")
const rename = require('gulp-rename');
const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json");
const tsProjectServer = ts.createProject("server.tsconfig.json");
const nodemon = require("gulp-nodemon");
const env = require("gulp-env");

const dist = "./dist/";
const src = "./src/";

gulp.task("copy-handlebar-views", () => {
  return gulp.src(src + "/views/**/*.hbs")
    .pipe(gulp.dest(dist + "/views"))
});

gulp.task("copy-fonts", () => {
  return gulp.src(src + "/fonts/**/*.*")
    .pipe(gulp.dest(dist + "/public/fonts"))
});

gulp.task("copy-assets", () => {
  return gulp.src(src + "/assets/**/*.*")
    .pipe(gulp.dest(dist + "/public/assets"))
})

gulp.task("copy-env-file", () => {
  return gulp.src(src + "/server/.env.json")
    .pipe(gulp.dest(dist));
})

gulp.task("serve", () => {
  env({
    file: dist + "/.env.json"
  })
  nodemon({
    script: dist + "/index.js",
    ext: 'js hbs css'
  })
})

gulp.task("build-ts", () => {
  return tsProject.src()
    .pipe(tsProject()).js
    .pipe(gulp.dest(src + "/buildJS"))
})
gulp.task("build-server-ts", () => {
  return tsProjectServer.src()
    .pipe(tsProjectServer()).js
    .pipe(gulp.dest(dist));
})

gulp.task("build-js", () => {
  return gulp.src(src + "/buildJS/main.js")
    .pipe(webpack({
      mode: 'development',
      output: {
        filename: 'bundle.js'
      },
      watch: false,
      devtool: "source-map",
      module: {
        rules: [
          {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [['@babel/preset-env', {
                  debug: true,
                  corejs: 3,
                  useBuiltIns: "usage"
                }]]
              }
            }
          }
        ]
      }
    }))
    .pipe(gulp.dest(dist + "/public/scripts"))
});

gulp.task("build-styles", () => {
  return gulp.src(src + "/styles/main.@(scss|sass)")
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(sourcemaps.write())
    .pipe(rename("style.css"))
    .pipe(gulp.dest(dist + "/public/styles"))
})

gulp.task("watch", () => {
  gulp.watch(src + "server/**/*.ts", gulp.series("build-server-ts"));
  gulp.watch(src + "views/**/*.hbs", gulp.parallel("copy-handlebar-views"));
  gulp.watch(src + "scripts/**/*.ts", gulp.series("build-ts", "build-js"));
  gulp.watch(src + "styles/**/*.@(scss|sass)", gulp.parallel("build-styles"));
  gulp.watch(src + "assets/**/*.*", gulp.parallel("copy-assets"));
  gulp.watch(src + "fonts/**/*.*", gulp.parallel("copy-fonts"));
})

gulp.task("build", gulp.parallel(gulp.series("copy-env-file", "build-server-ts", "serve"), gulp.series("build-ts", "build-js"), "copy-handlebar-views", "build-styles", "copy-assets", "copy-fonts"));

gulp.task("default", gulp.parallel("watch", "build"))