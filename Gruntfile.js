module.exports = function (grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        target: grunt.option('target') || '<%= pkg.config.target %>',

        concat: {
            main: {
                src: [
                    'js/libs/*.js',
                    'js/libs/bootstrap/*.js',
                    '!js/bootstrap/excludes/*',
                    'js/components/*.js',
                    'js/main.js'
                ],
                dest: 'build/js/main.js'
            },
            polyfill: {
                src: [
                    'js/polyfill/*.js'
                ],
                dest: 'build/js/polyfill.js'
            }
        },

        uglify: {
            main: {
                files: {
                    '<%= target %>/js/main.min.js': 'build/js/main.js'
                }
            },
            polyfill: {
                files: {
                    '<%= target %>/js/polyfill.min.js': 'build/js/polyfill.js'
                }
            },
            singles: {
                files: [{
                  expand: true,
                  cwd: 'js/singles',
                  src: '**/*.js',
                  dest: '<%= target %>/js'
              }]
            }
        },

        jshint: {
            options: {
                reporter: require('jshint-stylish').toString()
            },
            target: ['js/main.js', 'js/components/*.js']
        },

        sass: {
            dist: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'build/css/main.css': 'sass/main.scss',
                    'build/css/main-legacy.css': 'sass/main-legacy.scss'
                }
            }
        },

        postcss: {
            options: {
                processors: [
                    require('autoprefixer')({
                        browsers: ['last 2 versions']
                    })
                ]
            },
            dist: {
                src: 'build/css/*.css'
            }
        },

        cssmin: {
            minify: {
                expand: true,
                cwd: 'build/css/',
                src: ['*.css', '!*.min.css'],
                dest: '<%= target %>/css/',
                ext: '.min.css'
            }
        },

        imagemin: {
            dynamic: {
                options: {
                    pngquant: true,
                    force: true
                },
                files: [{
                    expand: true,
                    cwd: 'img/',
                    src: ['**/*.{png,jpg,gif,ico}'],
                    dest: 'build/img/'
                }]
            }
        },

        svgmin: {
            options: {
                plugins: [
                    {removeViewBox: false},
                    {cleanupIDs: false},
                    {removeUselessStrokeAndFill: false}
                ]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'img/svg',
                    src: ['**/*.svg'],
                    dest: 'build/img/svg/'
                }]
            }
        },

        svg2png: {
            all: {
                files: [{
                    cwd: 'img/svg/',
                    src: ['**/*.svg', '!grayscale.svg'],
                    dest: 'img/svg/fallback/'
                }]
            }
        },

        webfont: {
            icons: {
                src: 'icons/svg/**/*.svg',
                dest: 'build/fonts',
                destCss: 'sass/core',
                options: {
                    htmlDemo: false,
                    relativeFontPath: '/fonts/',
                    stylesheet: 'scss',
                    template: 'icons/css/custom.css',
                    codepointsFile: 'icons/css/codepoints.json'
                }
            }
        },

        browserSync: {
            proxy: {
                target: "http://*.*.statik.be",
                ws: true,
                port: 3001
            },
            options: {
                watchTask: true
            }
        },

        clean: {
            img: {
                src: ['build/img', '<%= target %>/img']
            },
            fonts: {
                src: ['build/fonts', '<%= target %>/fonts']
            },
            options: {
                'force': true
            }
        },

        copy: {
            images: {
                cwd: 'build/img/',
                src: '**/*.*',
                expand: true,
                dest: '<%= target %>/img',
                filter: 'isFile'
            },
            fonts: {
                cwd: 'build/fonts/',
                src: '**/*.*',
                expand: true,
                dest: '<%= target %>/fonts/',
                filter: 'isFile'
            },
            svgs: {
                cwd: 'build/img/svg',
                src: '**/*.*',
                expand: true,
                dest: '<%= target %>/img/svg',
                filter: 'isFile'
            },
            html: {
                cwd: 'html',
                src: '**/*.*',
                expand: true,
                dest: '<%= target %>/static/',
                filter: 'isFile'
            }
        },

        notify: {
            css: {
                options: {
                    title: '✓ Task complete!',
                    message: 'CSS'
                }
            },
            js: {
                options: {
                    title: '✓ Task complete!',
                    message: 'Javascript'
                }
            },
            img: {
                options: {
                    title: '✓ Task complete!',
                    message: 'Images'
                }
            },
            fonts: {
                options: {
                    title: '✓ Task complete!',
                    message: 'Fonts'
                }
            },
            icons: {
                options: {
                    title: '✓ Task complete!',
                    message: 'Icons'
                }
            }
        },

        watch: {
            options: {
                livereload: false
            },
            js: {
                files: ['js/**/*.js'],
                tasks: ['js', 'notify:js'],
                options: {
                    spawn: false,
                },
            },
            css: {
                files: ['sass/**/*.scss'],
                tasks: ['css', 'notify:css'],
                options: {
                    spawn: false,
                }
            },
            images: {
                files: ['img/**/*.{png,jpg,gif,ico,svg}'],
                tasks: ['img', 'notify:img']
            },
            html: {
                files: ['html/**/*.html'],
                tasks: ['copy:html']
            },
            fonts: {
                files: ['fonts/**', 'icons/**'],
                tasks: ['fonts', 'notify:fonts']
            }
        }
    });

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    grunt.registerTask('default', ['build', 'copy:html', 'watch']);
    grunt.registerTask('serve', ['browserSync']);
    grunt.registerTask('js', ['jshint', 'concat', 'uglify']);
    grunt.registerTask('img', ['clean:img', 'imagemin', 'svg2png', 'svgmin', 'copy:images', 'copy:svgs']);
    grunt.registerTask('fonts', ['clean:fonts', 'webfont', 'copy:fonts']);
    grunt.registerTask('css', ['sass', 'postcss', 'cssmin']);
    grunt.registerTask('build', ['fonts', 'css', 'js', 'img']);

};
