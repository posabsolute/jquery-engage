$.engage.contents.comment = {
    defaults : {
        url : '/wp-comments-post.php',
        text : {
            defaults : {
                title : "Have your say!"
            },
            morning : {
                title : "Morning! Have some opinions on this article?"
            },
            night : {
                title : "Have your say!"
            },
            weekend : {
                title : "Have your say!"
            }
        }
    },
    init : function (time) {
        var self = this;
        this.loadEvents();
        this.options =  $.extend( {}, this.defaults, this.options );
        return this.getHTML(this.options.text, time);
    },
    loadEvents : function () {
        $(document).on("submit.engage", "#footerCommentForm", function(){
            var data = $(this).serialize();
            $.ajax({
              url: self.options.url,
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
        });
    },
    destroy : function() {
         $(document).off("submit.engage");
    },
    postComment : function () {
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
    getHTML : function (texts, time) {
        return "<div class='comments'>\
                    <div class='commentsTitle'>"+texts[time].title+"</div>\
                    <form id='footerCommentForm'>\
                        <div class='hideFooterComment' style='display:none;'>\
                            <label>Name</label>\
                            <input type='text' name='name' />\
                            <label>Email</label>\
                            <input type='text' name='email' />\
                        </div>\
                        <textarea class='text' placeholder='Add your comment'></textarea>\
                        <button class='btn' type='submit'>Send comment</button>\
                    </form>\
                </div>";
    }
};