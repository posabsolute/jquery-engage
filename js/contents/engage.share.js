$.engage.contents.share = {
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