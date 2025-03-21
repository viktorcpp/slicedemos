
const fsio        = require('fs');
const gulp        = require('gulp');
const del         = require('del');
const gulp_sass   = require('gulp-sass')(require('sass'));
const sass_glob   = require('gulp-sass-glob');
const {series}    = require('gulp');
const {watch}     = require('gulp');
const spritesmith = require('gulp.spritesmith');
const svg_sprite  = require('gulp-svg-sprite');
const merge       = require('merge-stream');
const concat      = require('gulp-concat');
const uglify      = require('gulp-uglifyes');
const twig        = require('gulp-twig');
const babel       = require('gulp-babel');
const browserify  = require('browserify');
const babelify    = require('babelify');
const source      = require("vinyl-source-stream");
const buffer      = require("vinyl-buffer");
const webserver   = require('gulp-webserver');

let BUILD_TYPE = 'debug'; // debug/release

const PATHs =
{
    DEST_MAIN:        "build/",
    DEST_HTML:        "build/",
    DEST_CSS:         "build/css/",
    DEST_IMAGES:      "build/images/",
    DEST_SPRITES_PNG: "build/images/",
    DEST_SPRITES_SVG: "build/images/",
    DEST_FONTS:       "build/fonts/",
    DEST_FILES:       "build/temp-files/",
    DEST_SCRIPTS:     "build/scripts/",
    
    SRC_MAIN:        "src/",
    SRC_HTML:        "src/markup/",
    SRC_SCSS:        "src/scss/",
    SRC_IMAGES:      "src/images/",
    SRC_SPRITES_PNG: "src/sprites-png/",
    SRC_SPRITES_SVG: "src/sprites-svg/",
    SRC_FONTS:       "src/fonts/",
    SRC_FILES:       "src/temp-files/",
    SRC_SCRIPTS:     "src/scripts/"
};


function SetBuildType( build_type )
{
    BUILD_TYPE = build_type;
    
    PATHs.DEST_MAIN    = PATHs.DEST_MAIN   .replace( 'build/', `${build_type}/` );
    PATHs.DEST_HTML    = PATHs.DEST_HTML   .replace( 'build/', `${build_type}/` );
    PATHs.DEST_CSS     = PATHs.DEST_CSS    .replace( 'build/', `${build_type}/` );
    PATHs.DEST_IMAGES  = PATHs.DEST_IMAGES .replace( 'build/', `${build_type}/` );
    PATHs.DEST_FONTS   = PATHs.DEST_FONTS  .replace( 'build/', `${build_type}/` );
    PATHs.DEST_FILES   = PATHs.DEST_FILES  .replace( 'build/', `${build_type}/` );
    PATHs.DEST_SCRIPTS = PATHs.DEST_SCRIPTS.replace( 'build/', `${build_type}/` );
    
    if( !fsio.existsSync(`${build_type}/`) )
    {
        fsio.mkdirSync(`${build_type}/`);
    }
    
} // SetBuildType


function build_html()
{
    del( [ `${PATHs.DEST_HTML}*.html`, `!${PATHs.DEST_HTML}` ] );
    
    return gulp.src( [ `${PATHs.SRC_HTML}*.twig` ] )
        .pipe( twig() )
        .pipe( gulp.dest( PATHs.DEST_HTML ) );
    
} // build_html


function build_files()
{
    del( [ `${PATHs.DEST_FILES}*`, `!${PATHs.DEST_FILES}` ] );
    
    gulp.src( [ `${PATHs.SRC_MAIN}favicon.png` ] )
        .pipe( gulp.dest( PATHs.DEST_MAIN ) );
    
    return gulp.src( [ `${PATHs.SRC_FILES}**/*` ] )
        .pipe( gulp.dest( PATHs.DEST_FILES ) );
    
} // build_files


function build_fonts()
{
    return gulp.src( [ `${PATHs.SRC_FONTS}**/*` ] )
        .pipe( gulp.dest( PATHs.DEST_FONTS ) );
    
} // build_fonts


function build_images()
{
    return gulp.src( [ `${PATHs.SRC_IMAGES}**/*` ] )
        .pipe( gulp.dest( PATHs.DEST_IMAGES ) );
    
} // build_images


function build_js()
{
    return browserify({ entries: [ `${PATHs.SRC_SCRIPTS}main.js` ] })
        .transform(babelify.configure({ presets : ["@babel/preset-env"] }))
        .bundle()
        .pipe(source("main.js"))
        .pipe(buffer())
        .pipe(gulp.dest( PATHs.DEST_SCRIPTS ));
    
} // build_js


function build_sprites_png()
{
    let sprite_data = gulp.src( `${PATHs.SRC_SPRITES_PNG}**/*` )
        .pipe( spritesmith({
            imgName:   'sprite.png',
            cssName:   '_sprite.scss',
            cssFormat: 'scss',
            padding:   2,
            imgPath:   '../images/sprite.png'
        }));
    let _sprite_img = sprite_data.img.pipe( gulp.dest( PATHs.DEST_IMAGES ) );
    let _sprite_css = sprite_data.css.pipe( gulp.dest( PATHs.SRC_SCSS ) );
        
    return merge( _sprite_img, _sprite_css );
    
} // build_sprites_png

function build_sprites_svg()
{
    //*
    return gulp.src( `${PATHs.SRC_SPRITES_SVG}**/*.svg` )
        .pipe(svg_sprite({
                mode:
                {
                    stack:
                    {
                        sprite: "../sprite.svg"  //sprite file name
                    },
                    //view: true,
                    example: true
                }
            }
        ))
        .pipe( gulp.dest( PATHs.DEST_IMAGES ) );//*/
    
} // build_sprites_svg


function build_sass()
{
    del( [ `${PATHs.DEST_CSS}**/*.css`, `!${PATHs.DEST_CSS}` ] );

    return gulp.src( [ `${PATHs.SRC_SCSS}main.scss` ] )
      .pipe( sass_glob() )
      .pipe( gulp_sass() )
      .pipe( gulp.dest( PATHs.DEST_CSS ) );
    
} // build_sass


function gulp_server()
{
    gulp.src( `./${PATHs.DEST_HTML}` )
        .pipe(webserver({
            livereload: true,
            open: true,
        }));

} // gulp_server


function gulp_server_standalone()
{
    SetBuildType( 'debug' );
    gulp_server();

} // gulp_server_standalone


function build_watch()
{
    gulp.series( build_html, build_files, build_fonts, build_images, build_js, build_sprites_png, build_sprites_svg, build_sass, gulp_server )();

    watch( `${PATHs.SRC_HTML}**/*.twig`,   build_html );
    watch( `${PATHs.SRC_FILES}**/*`,       build_files );
    watch( `${PATHs.SRC_FONTS}**/*`,       build_fonts );
    watch( `${PATHs.SRC_IMAGES}**/*`,      build_images );
    watch( `${PATHs.SRC_SCRIPTS}**/*`,     build_js );
    watch( `${PATHs.SRC_SPRITES_PNG}**/*`, build_sprites_png );
    watch( `${PATHs.SRC_SPRITES_SVG}**/*`, build_sprites_svg );
    watch( `${PATHs.SRC_SCSS}**/*`,        build_sass );
    
} // build_watch


function build_watch_debug()
{
    SetBuildType( 'debug' );
    build_watch();
    
} // build_watch_debug


function build_watch_release()
{ 
    SetBuildType( 'release' );
    build_watch();
    
} // build_watch_release

exports.default = build_watch_debug;
exports.debug   = build_watch_debug;
exports.release = build_watch_release;
exports.server  = gulp_server_standalone;
