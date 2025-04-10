import gulp from 'gulp'
import sass from 'sass'
import gulpSass from 'gulp-sass'
import cleanCSS from 'gulp-clean-css'
import concat from 'gulp-concat'
import terser from 'gulp-terser'
import sourcemaps from 'gulp-sourcemaps'
import autoprefixer from 'gulp-autoprefixer'
import browserSync from 'browser-sync'
import fileInclude from 'gulp-file-include'

const sassCompiler = gulpSass(sass)

sassCompiler.compiler.options = {
	quietDeps: true,
	noDeprecation: true,
}

// Cesty
const paths = {
	html: 'src/html/**/*.html',
	styles: 'src/scss/**/*.scss',
	scripts: 'src/js/**/*.js',
	images: 'src/images/**/*',
	dest: 'build',
	htmlDest: 'build/html',
	jsDest: 'build/js',
	cssDest: 'build/css',
}

// HTML úloha
gulp.task('html', () => {
	return gulp
		.src(['src/html/**/*.html', '!src/html/components/*.html']) // Nezahrnovat části
		.pipe(
			fileInclude({
				prefix: '@@',
				basepath: '@file',
			})
		)
		.pipe(gulp.dest(paths.htmlDest))
		.pipe(browserSync.stream())
})

// SCSS -> CSS + minifikace
gulp.task('styles', () => {
	return gulp
		.src(paths.styles)
		.pipe(sourcemaps.init())
		.pipe(
			sassCompiler({
				outputStyle: 'expanded',
				quietDeps: true,
			}).on('error', sassCompiler.logError)
		)
		.pipe(autoprefixer({ cascade: false }))
		.pipe(cleanCSS())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(paths.cssDest))
		.pipe(browserSync.stream())
})

// JS minifikace + concat
gulp.task('scripts', () => {
	return gulp
		.src(paths.scripts)
		.pipe(sourcemaps.init())
		.pipe(concat('main.js'))
		.pipe(terser())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(paths.jsDest))
		.pipe(browserSync.stream())
})

// Obrázky - pouze kopírování
gulp.task('images', () => {
	return gulp.src(paths.images).pipe(gulp.dest(`${paths.dest}/images`))
})

// Build úloha
gulp.task('build', gulp.series('html', 'styles', 'scripts', 'images'))

// Sledování změn + automatický build
gulp.task('watch', () => {
	browserSync.init({
		server: {
			baseDir: 'build',
		},
		startPath: '/html/index.html',
		port: 3000,
		open: true,
	})

	// Sledování změn
	gulp.watch(paths.html, gulp.series('html'))
	gulp.watch(paths.styles, gulp.series('styles'))
	gulp.watch(paths.scripts, gulp.series('scripts'))
	gulp.watch(paths.images, gulp.series('images'))
})

// Výchozí úloha
gulp.task('default', gulp.series('build', 'watch'))
