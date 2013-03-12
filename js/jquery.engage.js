/*
 *  Project: Engage -  Engage you readers better with a dynamic social footer
 *  Author: Cedric Dugas, http://www.position-relative.net
 *  License: MIT
 */
;(function ( $, window, document, undefined ) {

    var pluginName = "engage",
        defaults = {
            contents : ["comment", "newsletter"]
        };

    function Plugin( element, options ) {
        this.element = element;
        this.options = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype = {
        init: function() {
            this.loadContent();
            this.loadScroller();
        },
        allContent : [],
        loadContent : function () {
            var self = this,
                colClass = "column" + this.options.contents.length,
                time = this.getTimes();

            $.each(this.options.contents, function(i, type){
                var contents = $.engage.contents;
                if(contents[type] && contents[type].init){
                    contents[type].options = this.options;
                    var $content  = $(contents[type].init(time)).addClass(colClass);
                    self.allContent.push($content);
                }
            });
        },
        loadScroller : function () {
            var self = this,
                $el  = $(self.element);

            $(window).on("scroll.engage", function() {
              var distanceTop = $el.offset().top + $el.height();
              if ($(window).scrollTop() > distanceTop) {
                self.show();
              }else{
                self.hide();
              }
            });
        },
        getTimes : function () {
            var today = new Date();
            var curHr = today.getHours();
            var time = "";
            if(curHr<10){
                time = "morning";
            }else if(curHr<20){
                time = "defaults";
            }else{
                time = "night";
            }
            return time;
        },
        show : function(){
            if($("#footerEngageContainer").length) return false;
            var $content = $(this.getHTML());
            $.each(this.allContent, function(i , html){
                $content.find("#footerEngage").append(html);
            });
            $("body").append($content);
            $("#footerEngage").animate({
                marginTop:0
            });
        },
        hide : function () {
            if(!$("#footerEngageContainer").length) return false;
            $("#footerEngage").animate({
                marginTop:205
            }, function(){
                $("#footerEngageContainer").remove();
            });
        },
        getHTML : function(texts){
            return "<div id='footerEngageContainer'>\
                    <div id='footerEngage'>\
                    </div>\
                </div>";
        }
    };

    $[pluginName] = {
        contents : {}
    };
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin( this, options ));
            }
        });
    };

})( jQuery, window, document );