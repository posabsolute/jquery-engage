$.engage.contents.newsletter = {
    defaults : {
        url : '/wp-comments-post.php',
        text : {
            defaults : {
                title : "Liked this article? Get more content right in your mailbox"
            },
            morning : {
                title : "Need more coffeine? Get more content right in your mailbox"
            },
            night : {
                title : "Doing some overtime? Get more content right in your mailbox"
            },
            weekend : {
                commentTitle : "Have your say!"
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
                    <div class='newsletterTitle'>"+texts[time].title+"</div>\
                    <form id='footerNewsletterForm'>\
                        <input type='text' class='text' placeholder='Email'><br />\
                        <button class='btn' type='submit'>Subscribe</button>\
                    </form>\
                </div>";
    }
};