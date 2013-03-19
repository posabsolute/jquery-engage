$.engage.contents.comment = {
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
};