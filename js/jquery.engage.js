/*
 *  Project: Engage -  Engage you readers better with a dynamic social footer
 *  Author: Cedric Dugas, http://www.position-relative.net
 *  License: MIT
 */
;(function ( $, window, document, undefined ) {

    var pluginName = "engage",
        defaults = {
            offset : 0,
            contents : ["comment", "share", "newsletter"]
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
                time = this.getTimes(),
                $el  = $(self.element);

            this.distanceTop = ($el.offset().top + $el.height()) - ($(window).height()/2)-100 + this.options.offset;

            $(document).on("click.engage", "#footerEngageContainer .btn_x", function(){ self.hideFull(); return false; });

            $.each(this.options.contents, function(i, type){
                var contents = $.engage.contents;
                if(contents[type] && contents[type].init){
                    contents[type].options =  $.extend( {}, contents[type].defaults, self.options[type] );
                    var $content  = $(contents[type].init(time)).addClass(colClass);
                    self.allContent.push($content);
                }
            });
        },
        loadScroller : function () {
            var self = this;

            $(window).on("scroll.engage", function() {
              if ($(window).scrollTop() > self.distanceTop) {
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
            if(!$("#footerEngageContainer").length) {
                 var containerClass = "containerColumn" + this.options.contents.length,
                    $content = $(this.getHTML(containerClass)),
                    self = this;

                $.each(this.allContent, function(i , html){
                    $content.find("#footerEngage").append(html);
                    if(i !== (self.allContent.length -1)){
                        $content.find("#footerEngage").append("<div class='separator'></div>");
                    }
                });
                $("body").append($content);
                $("#footerEngage").animate({
                    marginTop:0
                });
                $(document).trigger("engage.show");
            }
        },
        hideFull : function () {
            this.noshow = true;
            this.destroy();
            this.hide();
        },
        hide : function () {
            if(!$("#footerEngageContainer").length) return false;
            $("#footerEngage").animate({
                marginTop:205
            }, function(){
                $(document).trigger("engage.hide");
                $("#footerEngageContainer").remove();
            });
        },
        getHTML : function(containerClass){
            var text = "<div id='footerEngageContainer'>\
                    <div id='footerEngage' class='"+containerClass+"'>\
                        <a href='#' class='btn_x'>&#215;</a>\
                    </div>\
                </div>";
            return text;
        },
        destroy : function () {
            $(document).trigger("engage.destroy");
            $(document).off("click.engage");
            $(window).off("scroll.engage");
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