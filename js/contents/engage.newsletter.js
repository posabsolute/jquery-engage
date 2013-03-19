$.engage.contents.newsletter = {
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
};