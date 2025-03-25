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
}

// HTML
gulp.task('html', () => {
	return gulp
		.src(['src/html/**/*.html', '!src/html/components/*.html']) // Nezahrnovat části
		.pipe(
			fileInclude({
				prefix: '@@', // Značka pro include
				basepath: '@file',
			})
		)
		.pipe(gulp.dest(paths.dest))
		.pipe(browserSync.stream())
})

// SCSS -> CSS + minifikace
gulp.task('styles', () => {
	return gulp
		.src(paths.styles)
		.pipe(sourcemaps.init())
		.pipe(
			sassCompiler({
				outputStyle: 'expanded', // Můžete změnit na 'expanded' pro lepší ladění
				quietDeps: true, // Potlačí většinu varování pro závislosti
			}).on('error', sassCompiler.logError)
		)
		.pipe(autoprefixer({ cascade: false }))
		.pipe(cleanCSS())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(`${paths.dest}/css`))
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
		.pipe(gulp.dest(`${paths.dest}/js`))
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
			baseDir: './build',
			index: 'index.html',
		},
		port: 3000,
		open: true,
	})

	gulp.watch(paths.html, gulp.series('build'))
	gulp.watch(paths.styles, gulp.series('build'))
	gulp.watch(paths.scripts, gulp.series('build'))
	gulp.watch(paths.images, gulp.series('images')) // Sledování změn v obrázcích
})

// Výchozí úloha
gulp.task('default', gulp.series('build', 'watch'))
