// Karma configuration
// Generated on 2016-05-05

module.exports = function(config) {
  'use strict';

  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // testing framework to use (jasmine/mocha/qunit/...)
    // as well as any additional frameworks (requirejs/chai/sinon/...)
    frameworks: [
      'jasmine'
    ],

    // list of files / patterns to load in the browser
    files: [
      // bower:js
      'bower_components/es5-shim/es5-shim.js',
      'bower_components/jquery/jquery.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'bower_components/angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.js',
      'bower_components/bootstrap/dist/js/bootstrap.min.js',
      'bower_components/angular-bootstrap-nav-tree/dist/abn_tree_directive.js',
      'bower_components/chosen/chosen.jquery.min.js',
      'bower_components/angular-chosen-localytics/chosen.js',
      'bower_components/angular-cookies/angular-cookies.js',
      'bower_components/datatables/media/js/jquery.dataTables.js',
      'bower_components/angular-datatables/dist/angular-datatables.min.js',
      'bower_components/angular-datatables/dist/plugins/bootstrap/angular-datatables.bootstrap.min.js',
      'bower_components/angular-datatables/dist/plugins/colreorder/angular-datatables.colreorder.min.js',
      'bower_components/angular-datatables/dist/plugins/columnfilter/angular-datatables.columnfilter.min.js',
      'bower_components/angular-datatables/dist/plugins/colvis/angular-datatables.colvis.min.js',
      'bower_components/angular-datatables/dist/plugins/fixedcolumns/angular-datatables.fixedcolumns.min.js',
      'bower_components/angular-datatables/dist/plugins/fixedheader/angular-datatables.fixedheader.min.js',
      'bower_components/angular-datatables/dist/plugins/scroller/angular-datatables.scroller.min.js',
      'bower_components/angular-datatables/dist/plugins/tabletools/angular-datatables.tabletools.min.js',
      'bower_components/d3/d3.js',
      'bower_components/angular-file-upload/dist/angular-file-upload.min.js',
      'bower_components/angular-flot/angular-flot.js',
      'bower_components/angular-fontawesome/dist/angular-fontawesome.js',
      'bower_components/angular-fullscreen/src/angular-fullscreen.js',
      'bower_components/angular-simple-logger/dist/angular-simple-logger.js',
      'bower_components/lodash/lodash.js',
      'bower_components/angular-google-maps/dist/angular-google-maps.js',
      'bower_components/intro.js/intro.js',
      'bower_components/angular-intro.js/src/angular-intro.js',
      'bower_components/angular-ipsum/dist/ipsum.min.js',
      'bower_components/leaflet/dist/leaflet-src.js',
      'bower_components/angular-leaflet-directive/dist/angular-leaflet-directive.js',
      'bower_components/angular-loading-bar/build/loading-bar.js',
      'bower_components/masonry/dist/masonry.pkgd.min.js',
      'bower_components/ev-emitter/ev-emitter.js',
      'bower_components/imagesloaded/imagesloaded.js',
      'bower_components/jquery-bridget/jquery-bridget.js',
      'bower_components/angular-masonry/angular-masonry.js',
      'bower_components/angular-aria/angular-aria.js',
      'bower_components/angular-messages/angular-messages.js',
      'bower_components/angular-material/angular-material.js',
      'bower_components/moment/moment.js',
      'bower_components/angular-momentjs/angular-momentjs.js',
      'bower_components/angular-resource/angular-resource.js',
      'bower_components/rickshaw/rickshaw.js',
      'bower_components/angular-rickshaw/rickshaw.js',
      'bower_components/angular-sanitize/angular-sanitize.js',
      'bower_components/angular-smart-table/dist/smart-table.js',
      'bower_components/angular-toastr/dist/angular-toastr.tpls.js',
      'bower_components/angular-touch/angular-touch.js',
      'bower_components/angular-translate/angular-translate.js',
      'bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
      'bower_components/angular-translate-storage-cookie/angular-translate-storage-cookie.js',
      'bower_components/angular-translate-storage-local/angular-translate-storage-local.js',
      'bower_components/jquery-ui/ui/jquery-ui.js',
      'bower_components/fullcalendar/fullcalendar.js',
      'bower_components/angular-ui-calendar/src/calendar.js',
      'bower_components/angular-ui-grid/ui-grid.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/angular-ui-select/dist/select.js',
      'bower_components/angular-ui-tree/dist/angular-ui-tree.js',
      'bower_components/angular-ui-utils/ui-utils.js',
      'bower_components/bootstrap-daterangepicker/daterangepicker.js',
      'bower_components/flot/jquery.flot.js',
      'bower_components/flot/jquery.flot.resize.js',
      'bower_components/flot-spline/js/jquery.flot.spline.min.js',
      'bower_components/flot.tooltip/js/jquery.flot.tooltip.js',
      'bower_components/html.sortable/dist/html.sortable.js',
      'bower_components/jquery.easy-pie-chart/dist/angular.easypiechart.min.js',
      'bower_components/jquery.inputmask/dist/jquery.inputmask.bundle.js',
      'bower_components/jquery.slimscroll/jquery.slimscroll.js',
      'bower_components/jquery.sparkline/index.js',
      'bower_components/json3/lib/json3.js',
      'bower_components/leaflet-draw/dist/leaflet.draw.js',
      'bower_components/leaflet-heat/dist/leaflet-heat.js',
      'bower_components/leaflet-plugins/control/Distance.js',
      'bower_components/leaflet-plugins/control/Layers.Load.js',
      'bower_components/leaflet-plugins/control/Permalink.js',
      'bower_components/leaflet-plugins/control/Permalink.Layer.js',
      'bower_components/leaflet-plugins/control/Permalink.Line.js',
      'bower_components/leaflet-plugins/control/Permalink.Marker.js',
      'bower_components/leaflet-plugins/layer/Icon.Canvas.js',
      'bower_components/leaflet-plugins/layer/Layer.Deferred.js',
      'bower_components/leaflet-plugins/layer/Marker.Rotate.js',
      'bower_components/leaflet-plugins/layer/Marker.Text.js',
      'bower_components/leaflet-plugins/layer/OpenStreetBugs.js',
      'bower_components/leaflet-plugins/layer/vector/GPX.js',
      'bower_components/leaflet-plugins/layer/vector/GPX.Speed.js',
      'bower_components/leaflet-plugins/layer/vector/KML.js',
      'bower_components/leaflet-plugins/layer/vector/OSM.js',
      'bower_components/leaflet-plugins/layer/tile/Bing.js',
      'bower_components/leaflet-plugins/layer/tile/Google.js',
      'bower_components/leaflet-plugins/layer/tile/Yandex.js',
      'bower_components/eve/eve.js',
      'bower_components/raphael/raphael.min.js',
      'bower_components/mocha/mocha.js',
      'bower_components/morrisjs/morris.js',
      'bower_components/momentjs/moment.js',
      'bower_components/ng-bs-daterangepicker/src/ng-bs-daterangepicker.js',
      'bower_components/ng-table/dist/ng-table.min.js',
      'bower_components/ng-tags-input/ng-tags-input.min.js',
      'bower_components/ngImgCrop/compile/minified/ng-img-crop.js',
      'bower_components/oclazyload/dist/ocLazyLoad.js',
      'bower_components/owl-carousel/owl-carousel/owl.carousel.min.js',
      'bower_components/textAngular/dist/textAngular-rangy.min.js',
      'bower_components/textAngular/dist/textAngular-sanitize.min.js',
      'bower_components/textAngular/dist/textAngular.min.js',
      'bower_components/dragular/dist/dragular.min.js',
      'bower_components/magnific-popup/dist/jquery.magnific-popup.js',
      'bower_components/angular-notify/dist/angular-notify.js',
      'bower_components/ng-file-upload/ng-file-upload.js',
      'bower_components/ng-file-upload-shim/ng-file-upload-shim.js',
      'bower_components/vs-google-autocomplete/dist/vs-google-autocomplete.js',
      'bower_components/vs-google-autocomplete/dist/vs-autocomplete-validator.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/angular-scenario/angular-scenario.js',
      // endbower
      'app/scripts/**/*.js',
      'test/mock/**/*.js',
      'test/spec/**/*.js'
    ],

    // list of files / patterns to exclude
    exclude: [
    ],

    // web server port
    port: 8080,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
      'PhantomJS'
    ],

    // Which plugins to enable
    plugins: [
      'karma-phantomjs-launcher',
      'karma-jasmine'
    ],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Uncomment the following lines if you are using grunt's server to run the tests
    // proxies: {
    //   '/': 'http://localhost:9000/'
    // },
    // URL root prevent conflicts with the site root
    // urlRoot: '_karma_'
  });
};
