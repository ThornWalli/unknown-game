"use strict";

var gulp = require('gulp');
var runSequence = require('run-sequence').use(gulp);
require('gp-boilerplate-environment');
require('gp-boilerplate-webserver');

gulp.task('default', ['watch', 'server']);

gulp.task('run', function(callback) {
    if(process.env.NODE_ENV === 'development') {
        runSequence('prebuild', 'default', callback);
    } else if(process.env.NODE_ENV === 'production') {
        runSequence('build', 'server', callback);
    }
});

process.once('SIGINT', function() { process.exit(0); });
