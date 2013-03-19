/*
 *  Project: Engage -  Engage you readers better with a dynamic social footer
 *  Author: Cedric Dugas, http://www.position-relative.net
 *  License: MIT
 */
;(function ( $, window, document, undefined ) {

    var pluginName = "engage",
        defaults = {
            offset : 0,
            contents : ["share", "comment" ]
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
                title : "Morning! Want to comment?",
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
        $(document).on("engage.destroy", function(){ self.destroy(); });
        $(document).on("engage.hide",  function(){ $(".hideFooterComment").hide(); });
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
          success: function() {
             $("#footerCommentForm").hide();
             $("#footerEngageContainer .thankyou").show();
             $("#footerEngageContainer, #footerEngage").animate({height:200});
          },
          error: function() {
            //called when there is an error
          }
        });
    },
    getHTML : function (options, time) {
        var text = "<div class='comments'>\
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
        return text;
    }
};$.engage.contents.newsletter = {
    defaults : {
        url : '',
        text : {
            defaults : {
                title : "Liked this article? <span>Get more content right in your mailbox</span>"
            },
            morning : {
                title : "Need more caffeine? <span>Get more content right in your mailbox</span>"
            },
            night : {
                title : "Doing some overtime? <span>Get more content right in your mailbox</span>"
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
          success: function() {
            //called when successful
          },
          error: function() {
            //called when there is an error
          }
        });
    },
    getHTML : function (options, time) {
        var text = "<div class='newsletter'>\
                    <div class='newsletterTitle'>"+options.text[time].title+"</div>\
                    <form id='footerNewsletterForm' method='post' action='"+options.url+"'>\
                        <input type='text' name='email' class='text' placeholder='Email'>\
                        <input type='hidden' name='goto' value='' />\
                        <input type='hidden' name='iehack' value='&#9760;' />\
                        <button class='btn  btn-warning' type='submit'>Subscribe</button>\
                    </form>\
                </div>";
        return text;
    }
};$.engage.contents.share = {
    defaults : {
        url : '',
        buttons : ['linkedin','facebook','twitter','reddit'],
        title:'',
        text : {
            defaults : {
                title : "Help us by sharing this article"
            },
            morning : {
                title : "Help us by sharing this article"
            },
            night : {
                title : "Help us by sharing this article"
            }
        }
    },
    init : function (time) {
        this.loadEvents();

        this.options.title = (this.options.title) ? this.options.title : encodeURIComponent(document.title);
        this.options.url = (this.options.url) ? this.options.url : encodeURIComponent(location.href);

        var $share =  $(this.getHTML(this.options, time));

        $.each(this.options.buttons, function(i, button){
            var cssClass = '.share-'+button;
            $share.find(cssClass).css({display:"inline-block"});
        });

        return $share;
    },
    loadEvents : function () {
      var self = this;
      $(document).on("engage.destroy", function(){ self.destroy();});
    },
    destroy : function() {
         $(document).off("submit.engage");
    },
    getHTML : function (options, time) {
        var text = "<div class=''>\
                    <div class='socialTitle'>"+options.text[time].title+"</div>\
                    <div class='share-container'>\
                        <a class='share-buttons share-linkedin' style='display:none;' onclick='window.open(\"http://www.linkedin.com/cws/share?title="+options.title+"&token=&isFramed=true&lang=en_US&url="+options.url+"\",\"sharer\",\"toolbar=0,status=0,width=548,height=325\");' href='javascript: void(0)'>Share</a>\
                        <a class='share-buttons share-facebook' style='display:none;' onclick='window.open(\"http://www.facebook.com/sharer.php?t="+options.title+"&u="+options.url+"\",\"sharer\",\"toolbar=0,status=0,width=548,height=325\");' href='javascript: void(0)'>Share</a>\
                        <a class='share-buttons share-twitter' style='display:none;' onclick='window.open(\"https://twitter.com/intent/tweet?text="+options.title+" "+options.url+"\",\"sharer\",\"toolbar=0,status=0,width=548,height=325\");' href='javascript: void(0)'>Share</a>\
                        <a class='share-buttons share-reddit' style='display:none;' href='javascript: void(0)' onclick='window.open(\"http://www.reddit.com/submit?v=5&noui&jump=close&url="+options.url+"&title="+options.title+"\", \"delicious\",\"toolbar=no,width=910,height=700\"); return false;'>reddit</a>\
                    </div>\
                </div>";
        return text;
    }
};