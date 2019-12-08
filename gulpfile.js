const gulp = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const server = require('browser-sync').create();
const minify = require('gulp-csso');
const del = require('del');
const plumber = require('gulp-plumber');
const autoprefixer = require('autoprefixer');
const copy = require('gulp-copy');
var svgstore = require("gulp-svgstore");
var rename = require("gulp-rename");
var imagemin= require("gulp-imagemin");

    gulp.task("clean", function () {
        return del("build");
    });

    gulp.task("css", function () {
        return gulp.src("src/style/style.scss")
            .pipe(plumber())
            .pipe(sass({ outputStyle: 'expanded' }))
            .pipe(postcss([
                autoprefixer()
            ]))
            .pipe(minify())
            .pipe(gulp.dest("build/css"))
            .pipe(server.stream());
    });

    gulp.task("copy", function () {
        return gulp.src("src/fonts")
            .pipe(gulp.dest("build/fonts"))
    });

    gulp.task("img", function () {
        return gulp.src("src/img/*")
            .pipe(imagemin([
                imagemin.gifsicle({interlaced: true}),
                imagemin.jpegtran({progressive: true}),
                imagemin.optipng({optimizationLevel: 5}),
                imagemin.svgo({
                    plugins: [
                        {removeViewBox: true},
                        {cleanupIDs: false}
                    ]
                })
            ]))
            .pipe(gulp.dest("build/img"))
    });

    gulp.task("svg", function () {
        return gulp.src("src/img/svg/*.svg")
            .pipe(svgstore({
                inlineSvg: true
            }))
            .pipe(rename("sprite.svg"))
            .pipe(gulp.dest("build/img/svg"));
    });

    gulp.task('html', function() {
        return gulp
            .src("src/*.html")
            .pipe(gulp.dest("build"))
    });

    gulp.task('js', function() {
        return gulp
            .src("src/js/*.js")
            .pipe(gulp.dest("build/js"))
    });


    gulp.task("server", function () {
        server.init({
            server: "build/",
            notify: false,
            open: true,
            cors: true,
            ui: false
        });

        gulp.task("refresh", function (done) {
            server.reload();
            done();
        });


        gulp.watch("src/style/**/*.{scss,sass}", gulp.series("css"));
        gulp.watch("src/img/*.{png,jpeg,jpg,svg,webp}", gulp.series("img", "refresh"));
        gulp.watch("src/img/svg/*.svg", gulp.series("svg", "refresh"));
        gulp.watch("src/**/*.html", gulp.series("html", "refresh"));
        gulp.watch("src/js/*.js", gulp.series("js", "refresh"));
    });

    gulp.task("build", gulp.series(
        "clean",
        "copy",
        "img",
        "svg",
        "css",
        "js",
        "html"
    ));

    gulp.task("start", gulp.series("build", "server"));
