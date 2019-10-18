const gulp = require('gulp');
const rename = require('gulp-rename');

const configFolder = 'config';

gulp.task('gulp:config:default', () => {
	console.log('=== PREPARING A CLEAN CONFIG FILE FOR DEVELOPMENT');
	return gulp.src(`${configFolder}/_default.json`)
		.pipe(rename(p => { path.basename = 'default' }))
		.pipe(gulp.dest(paths.build.js))
});

gulp.task('gulp:config:production', () => {
	console.log('=== PREPARING A CLEAN CONFIG FILE FOR PRODUCTION');
	return gulp.src(`${configFolder}/_production.json`)
		.pipe(rename(p => { path.basename = 'production' }))
		.pipe(gulp.dest(configFolder))
});

gulp.task('gulp:config:test', () => {
	console.log('=== PREPARING A CLEAN CONFIG FILE FOR TESTING');
	return gulp.src(`${configFolder}/_test.json`)
		.pipe(rename(p => { path.basename = 'test' }))
		.pipe(gulp.dest(configFolder))
});

gulp.task('gulp:config', gulp.series(
	'gulp:config:default',
	'gulp:config:production',
	'gulp:config:test',
));
