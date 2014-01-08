var gulp = require('gulp'),
    tmpl = require('gulp-template'),
    inquirer = require('inquirer'),
    q = require('q'),
    path = require('path'),
    rename = require('gulp-rename');

gulp.task('init', function () {

    var filenameRegex = /__([\s\S]+?)__/;

    function getFilename(origFilename, answers) {
        var key = origFilename.match(filenameRegex)[1];
        if (!answers[key]) {
            throw new Error('No value defined for ' + key);
        }
        return origFilename.replace(filenameRegex, answers[key]);
    };

    var tplOpts = {
        'interpolate': /{{([\s\S]+?)}}/g,
        'evaluate': /{{([\s\S]+?)}}/g
    };

    var deferred = q.defer();

    var questions = [
        {
            message: 'What is the name of the component?',
            name: 'componentName',
            type: 'input'
        },
        {
            message: 'Give me a short description of the component',
            name: 'description',
            type: 'input'
        },
        {
            message: 'What is the name of the angular module?',
            name: 'moduleName',
            type: 'input'
        }
    ];

    inquirer.prompt(questions, function (ans) {

        gulp.src('./template/**/*')
            .pipe(tmpl(ans, tplOpts))
            .pipe(rename(function (dir, base, ext) {
                return (base.match(filenameRegex) ? getFilename(base,ans) : base) + ext;
            }))
            .pipe(gulp.dest(path.resolve(process.cwd())));

        deferred.resolve();
    });

    return deferred.promise;

});

module.exports = {
    run: function () {
        gulp.run('init');
    }
};