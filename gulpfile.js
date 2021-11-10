'use strict';

// Load plugins
const autoprefixer = require('autoprefixer');
const gulp = require('gulp');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const concat = require('gulp-concat');
const sass = require('gulp-sass')(require('sass'));
const eslint = require('gulp-eslint');
const babel = require('gulp-babel');

const browserSync = require('browser-sync').create();

const pathSrc = './src/';
const pathDest = './';
const appPathSrc = pathSrc + 'app/';
const testPathSrc = pathSrc + 'test/';
const assetsPathSrc = pathSrc + 'assets/';
const assetsPathDest = pathDest + 'assets/';

const browserSyncParams = {
    open: false,
    injectChanges: true,
    proxy: process.cwd().replace('/var/www', 'localhost'), // root folder
    notify: false
};

// Assets tasks
var assets = {
    css: function () {
        return gulp
            .src(assetsPathSrc + 'css/*.scss')
            .pipe(plumber())
            .pipe(sass({
                outputStyle: 'expanded',
                indentType: 'space',
                indentWidth: 4
            }))
            .pipe(postcss([
                autoprefixer({
                    Browserslist: [ 'last 3 versions' ]
                })
            ]))
            .pipe(gulp.dest(assetsPathDest + 'css/'))
            .pipe(browserSync.stream());
    },
    js: function () {
        return gulp
            .src([
                assetsPathSrc + 'js/**/*.js',
            ])
            .pipe(eslint())
            .pipe(babel({
                presets: ['@babel/preset-env']
            }))
            .pipe(concat('script.js'))
            .pipe(gulp.dest(assetsPathDest + 'js/'))
            .pipe(eslint.format())
            .pipe(browserSync.stream());
    }
};

// App tasks
var app = {
    js: function () {
        return gulp
            .src([
                appPathSrc + '**/*.js',
            ])
            .pipe(eslint())
            .pipe(babel({
                presets: ['@babel/preset-env']
            }))
            .pipe(concat('app.js'))
            .pipe(gulp.dest(pathDest))
            .pipe(eslint.format())
            .pipe(browserSync.stream());
    }
};

// Test tasks
var test = {
    js: function () {
        return gulp
            .src([
                testPathSrc + '**/*.js',
            ])
            .pipe(eslint())
            .pipe(babel({
                presets: ['@babel/preset-env']
            }))
            .pipe(concat('test.js'))
            .pipe(gulp.dest(pathDest))
            .pipe(eslint.format())
            .pipe(browserSync.stream());
    }
};

// Watch files
function watchFiles() {
    browserSync.init(browserSyncParams);

    gulp.watch(appPathSrc + '**/*', app.js);
    gulp.watch(testPathSrc + '**/*', test.js);

    gulp.watch(assetsPathSrc + 'css/**/*', assets.css);
    gulp.watch(assetsPathSrc + 'js/**/*', assets.js);
    
    gulp.watch([
        pathDest + 'views/**/*'
    ]).on('change', browserSync.reload);
}

// define complex tasks
const assetsBuild = gulp.parallel(assets.css, assets.js);
const build = gulp.series(app.js, test.js, assetsBuild);
const watch = gulp.series(app.js, test.js, assetsBuild, watchFiles);

// export tasks
exports.build = build;
exports.watch = watch;
exports.default = build;
