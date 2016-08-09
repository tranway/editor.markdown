var gulp = require('gulp'),
    sass = require('gulp-sass'),
    changed = require('gulp-changed'),
    del = require('del'),
    exec = require('child_process').exec,
    runSequence = require('gulp-run-sequence'),
    livereload = require('gulp-livereload'),
    replace = require('gulp-replace');
var DEST = 'build';

gulp.task('build:scss', function() {
    gulp.src('scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(changed(DEST + '/css'))
        .pipe(gulp.dest(DEST + '/css'))
        .pipe(livereload());
});
gulp.task('build:src', function() {
    gulp.src(['src/img/**'])
       .pipe(gulp.dest(DEST+'/img/'));
    gulp.src(['src/**','!src/img/**'])
        .pipe(changed(DEST))
        .pipe(replace("../build/lib", "lib"))
        .pipe(gulp.dest(DEST))
        .pipe(livereload());
   
         
})
gulp.task('clean', function() {
    // clear build directory;
    console.log("clean task is run.")
    return del([
        'build/**/*', '!build/lib', '!build/lib/**/*', '!build/db/*', '!build/db'
    ]);
});
gulp.task('clean:all', function() {
    // clear build directory;
    console.log("clean task is run.")
    return del([
        'build/**/*'
    ]);
})

gulp.task('watch', [], function() {

    livereload.listen();
    gulp.watch('scss/*.scss', ['build:scss']);
    gulp.watch('src/**', ['build:src']);

});
gulp.task('bower:install', [], function(cb) {
    exec('bower  install', (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return cb(err);
        }
        console.log(stdout);
        cb();
    });
})

gulp.task('build:init', ['clean:all'], function(cb) {
    console.log("build:init is executed!");
    runSequence('bower:install', cb);
});

gulp.task('default', ['clean'], function(cb) {
    runSequence(['build:src', 'build:scss'], 'watch', cb);
});
