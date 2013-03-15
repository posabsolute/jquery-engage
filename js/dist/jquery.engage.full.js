/*
 *  Project: Engage -  Engage you readers better with a dynamic social footer
 *  Author: Cedric Dugas, http://www.position-relative.net
 *  License: MIT
 */
;(function ( $, window, document, undefined ) {

    var pluginName = "engage",
        defaults = {
            offset : 0,
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
            if($("#footerEngageContainer").length) return false;
            var $content = $(this.getHTML()),
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
                $("#footerEngageContainer").remove();
            });
        },
        getHTML : function(texts){
            return "<div id='footerEngageContainer'>\
                    <div id='footerEngage'>\
                        <a href='#' class='btn_x'>&#215;</a>\
                    </div>\
                </div>";
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

})( jQuery, window, document );$.engage.contents.comment = {
    defaults : {
        url : '/wp-comments-post.php',
        mode : "",
        text : {
            defaults : {
                title : "Have your say!",
                thanks : "Thank you for contributing, your comment will be added shortly."
            },
            morning : {
                title : "Morning! Have some opinions on this article?",
                thanks : "Thank you for contributing, your comment will be added shortly."
            },
            night : {
                title : "Have your say!",
                thanks : "Thank you for contributing, your comment will be added shortly."
            }
        }
    },
    init : function (time) {
        this.loadEvents();
        return this.getHTML(this.options, time);
    },
    loadEvents : function () {
        var self = this;
        $(document).on("focus.engage", "#footerCommentForm textarea", function(){ self.showFields(); });
        $(document).on("submit.engage", "#footerCommentForm", function(){ self.postData(); return false;});
        $(document).on("engage.destroy", function(){ self.destroy(); return false;});
    },
    destroy : function() {
         $(document).off("submit.engage");
         $(document).off("focus.engage");
    },
    showFields : function(){
        $(".hideFooterComment").slideDown();
        $("#footerEngageContainer, #footerEngage").animate({height:380});
    },
    postData : function () {
        $("#footerCommentForm").find("[name=comment_post_ID]").val($("#comment_post_ID").val());
        $("#footerCommentForm").find("[name=comment_parent]").val($("#comment_parent").val());
        var data = $("#footerCommentForm").serialize();
        $.ajax({
          url: this.options.url,
          type: 'POST',
          dataType: 'html',
          data: data,
          success: function(data, textStatus, xhr) {
             $("#footerCommentForm").hide();
             $("#footerEngageContainer .thankyou").show();
             $("#footerEngageContainer, #footerEngage").animate({height:200});
          },
          error: function(xhr, textStatus, errorThrown) {
            //called when there is an error
          }
        });
    },
    getHTML : function (options, time) {
        return "<div class='comments'>\
                    <div class='commentsTitle'>"+options.text[time].title+"</div>\
                    <form id='footerCommentForm' method='post' action='"+options.url+"'>\
                        <textarea class='text' name='comment' placeholder='Add your comment'></textarea>\
                        <div class='hideFooterComment' style='display:none;'>\
                            <label>Name</label><br />\
                            <input type='text' class='text' name='author' />\
                            <label>Email</label><br />\
                            <input type='text' class='text' name='email' />\
                            <input type='hidden' name='comment_post_ID' value=''>\
                            <input type='hidden' name='comment_parent' value=''>\
                        </div>\
                        <button class='btn btn-warning' type='submit'>Send comment</button>\
                    </form>\
                    <div class='thankyou' style='display:none; font-style:italic; color:#555;'>"+options.text[time].thanks+"</div>\
                </div>";
    }
};$.engage.contents.newsletter = {
    defaults : {
        url : '',
        text : {
            defaults : {
                title : "Liked this article? <span>Get more content right in your mailbox</span>"
            },
            morning : {
                title : "Need more coffeine? <span>Get more content right in your mailbox</span>"
            },
            night : {
                title : "Doing some overtime? <span>Get more content right in your mailbox</span>"
            },
            weekend : {
                commentTitle : "Have your say!"
            }
        }
    },
    init : function (time) {
        this.loadEvents();
        return this.getHTML(this.options, time);
    },
    loadEvents : function () {
      var self = this;
      $(document).on("engage.destroy", function(){ self.destroy(); return false;});
    },
    destroy : function() {
         $(document).off("submit.engage");
    },
    post : function () {
        var data = $("#footerCommentForm").serialize();
        $.ajax({
          url: this.options.commentUrl,
          type: 'POST',
          dataType: 'html',
          data: data,
          success: function(data, textStatus, xhr) {
            //called when successful
          },
          error: function(xhr, textStatus, errorThrown) {
            //called when there is an error
          }
        });
    },
    getHTML : function (options, time) {
        return "<div class='newsletter'>\
                    <div class='newsletterTitle'>"+options.text[time].title+"</div>\
                    <form id='footerNewsletterForm' method='post' action='"+options.url+"'>\
                        <input type='text' name='email' class='text' placeholder='Email'>\
                        <input type='hidden' name='goto' value='' />\
                        <input type='hidden' name='iehack' value='&#9760;' />\
                        <button class='btn  btn-warning' type='submit'>Subscribe</button>\
                    </form>\
                </div>";
    }
};$.engage.contents.share = {
	init : function () {
		
	}
};