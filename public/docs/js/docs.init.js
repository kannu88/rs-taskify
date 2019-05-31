$(function(){
	$('#sidebarnav a').click(function () {
            $('html, body').animate({
                scrollTop: $($(this).attr('href')).offset().top - 85
            }, 500);
            return false;
        });
        var lastId, topMenu = $("#sidebarnav"),
            topMenuHeight = topMenu.outerHeight(),
            menuItems = topMenu.find("a"),
            scrollItems = menuItems.map(function () {
                var item = $($(this).attr("href"));
                if (item.length) {
                    return item;
                }
            });
        $(window).scroll(function () {
            var fromTop = $(this).scrollTop() + topMenuHeight - 85;
            var cur = scrollItems.map(function () {
                if ($(this).offset().top < fromTop) return this;
            });
            cur = cur[cur.length - 1];
            var id = cur && cur.length ? cur[0].id : "";
            if (lastId !== id) {
                lastId = id;
                menuItems.removeClass("active").filter("[href='#" + id + "']").addClass("active");
            }
        });

        /*******************************************/
        // Basic Date Range Picker
        /*******************************************/
        $('.daterange').daterangepicker();

        /*******************************************/
        // Date & Time
        /*******************************************/
        $('.datetime').daterangepicker({
            timePicker: true,
            timePickerIncrement: 30,
            locale: {
                format: 'MM/DD/YYYY h:mm A'
            }
        });

        /*******************************************/
        //Calendars are not linked
        /*******************************************/
        $('.timeseconds').daterangepicker({
            timePicker: true,
            timePickerIncrement: 30,
            timePicker24Hour: true,
            timePickerSeconds: true,
            locale: {
                format: 'MM-DD-YYYY h:mm:ss'
            }
        });

        /*******************************************/
        // Single Date Range Picker
        /*******************************************/
        $('.singledate').daterangepicker({
            singleDatePicker: true,
            showDropdowns: true
        });


    // ============================================================== 
    // sales 2
    // ============================================================== 
    var chart = new Chartist.Line('.sales2', {
        labels: [1, 2, 3, 4, 5, 6, 7, 8],
        series: [
            [22.5, 34.3, 24.7, 28.5, 11.4, 30.6, 44.5, 34],
        ]
    }, {
        low: 0,
        high: 48,
        showArea: true,
        fullWidth: true,
        plugins: [
            Chartist.plugins.tooltip()
        ],
        axisY: {
            onlyInteger: true,
            scaleMinSpace: 40,
            offset: 0,
            labelInterpolationFnc: function(value) {
                return (value / 10) + 'k';
            }
        },
        chartPadding: {
            right: 0,
            left:0
        },
       lineSmooth: Chartist.Interpolation.simple({
            divisor: 2
        }),     
    });

    // Offset x1 a tiny amount so that the straight stroke gets a bounding box
    // Straight lines don't get a bounding box 
    // Last remark on -> http://www.w3.org/TR/SVG11/coords.html#ObjectBoundingBox
    chart.on('draw', function(ctx) {
        if (ctx.type === 'area') {
            ctx.element.attr({
                x1: ctx.x1 + 0.001
            });
        }
    });

    // Create the gradient definition on created event (always after chart re-render)
    chart.on('created', function(ctx) {
        var defs = ctx.svg.elem('defs');
        defs.elem('linearGradient', {
            id: 'gradient',
            x1: 0,
            y1: 1,
            x2: 0,
            y2: 0
        }).elem('stop', {
            offset: 0,
            'stop-color': 'rgba(255, 255, 255, 1)'
        }).parent().elem('stop', {
            offset: 1,
            'stop-color': 'rgba(64, 196, 255, 1)'
        });
    });

    var chart = [chart];

    // ==============================================================    
    //weather cards
    // ============================================================== 
    var chart = new Chartist.Line('#weather', {
        labels: [1, 2, 3, 4, 5, 6, 7, 8],
        series: [
            [22.5, 34.3, 24.7, 28.5, 11.4, 30.6, 44.5, 34],
        ]
    }, {
        low: -10,
        high: 42,
        showArea: true,
        fullWidth: true,
        plugins: [
            Chartist.plugins.tooltip()
        ],
        axisY: {
            onlyInteger: true,
            scaleMinSpace: 40,
            offset: 0,
            labelInterpolationFnc: function(value) {
                return (value / 10) + 'k';
            }
        },
        chartPadding: {
            right: 0,
            left:0
        },
            lineSmooth: Chartist.Interpolation.simple({
            divisor: 2
        }),
    });

    // Offset x1 a tiny amount so that the straight stroke gets a bounding box
    // Straight lines don't get a bounding box 
    // Last remark on -> http://www.w3.org/TR/SVG11/coords.html#ObjectBoundingBox
    chart.on('draw', function(ctx) {
        if (ctx.type === 'area') {
            ctx.element.attr({
                x1: ctx.x1 + 0.001
            });
        }
    });

    var chart = [chart];

    // ============================================================== 
    // Overview
    // ============================================================== 
    Morris.Area({
        element: 'morris-area-chart2'
        , data: [{
                period: '2010'
                , SiteA: 0
                , SiteB: 0
        , }, {
                period: '2011'
                , SiteA: 130
                , SiteB: 100
        , }, {
                period: '2012'
                , SiteA: 80
                , SiteB: 60
        , }, {
                period: '2013'
                , SiteA: 70
                , SiteB: 200
        , }, {
                period: '2014'
                , SiteA: 180
                , SiteB: 150
        , }, {
                period: '2015'
                , SiteA: 105
                , SiteB: 90
        , }
            , {
                period: '2016'
                , SiteA: 250
                , SiteB: 150
        , }]
        , xkey: 'period'
        , ykeys: ['SiteA', 'SiteB']
        , labels: ['Site A', 'Site B']
        , pointSize: 0
        , fillOpacity: 0.4
        , pointStrokeColors: ['rgba(223,226,233, 0.3)', '#137eff']
        , behaveLikeLine: true
        , gridLineColor: 'rgba(0,0,0, 0.2)'
        , lineWidth: 0
        , smooth: false
        , hideHover: 'auto'
        , lineColors: ['#b5b5b5', '#137eff']
        , resize: true
    });
    
});