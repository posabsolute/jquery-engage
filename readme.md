## jQuery Engage, a better flow for blog readers

The plugin show a toolbar when a user finish reading an article containing engaging options (subscribe to newsletter, commenting & social sharing). It also include optional text for different period of the day.

Example : http://www.position-absolute.com/?p=4449


## Installation

Include the css & js.

	<script src="js/dist/jquery.behaviorminer.min.js" type="text/javascript"></script>
	<!-- below is the google analitycs plugin -->
	<script src="js/connectors/ga.js" type="text/javascript"></script>

After you can instanciate the plugin on the article container:

	<script>$(".article").engage();</script>


## Options
Example:

	<script>
		{
            offset: 0, // change position
            contents : ["comment", "newsletter"], // content shown in the toolbar
            // text example
            comment : {
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
		    }
        };
	</script>

### Offset (int)

Help you better position when the toolbar is shown, negative number are allowed. This is particulary useful when dealing with margins.


### contents (array)

Content zone shown into the toolbar by order. For example you could change comment by social

### Changing text

The plugin allowed customized text depending of the time of the day, this can help you optimize users engagement by better connecting with the user.

Each content type can be customized like shown above. Check all the text options in the content js file on the contents folder.

## Adding other contents

Adding other content type like adding to bookmark or related article is easy. First add a js file in the contents folder, you can base yourself on the comment plugin, here how to namespace it.

	$.engage.contents.yourname


When launching the plugin to not forget your content name name to the contents option

	<script>$(".article").engage({contents: ['yourname','newsletter']});</script>

### The init(time)

When the script load your content it will call the *init()* method.  The options are automatically passed to your plugin, you can retrieve them using *this.options*. The time (string, "morning", "night", "default") is given as parameter to the init function so you can use this information to better target your text.

You *must* return the parsed html content to the init function.

### Adding your new content to the minified file

You can always simply add your behavior file below the plugin in the html document like this:

	<script src="js/jquery.enagage.min.js" type="text/javascript" charset="utf-8"></script>
	<!-- below is the google analitycs plugin -->
	<script src="js/contents/name.js" type="text/javascript" charset="utf-8"></script>

Or you can compile your behavior in the minified script using grunt, first *load npm install* to install dependencies, then just do grunt and it's all automatic. You must comply with jslint before a compilation is completed. If that sound complicated please check gruntjs, it should be simple to pick it up from there.


## License (MIT)

Copyright 2013 Cedric Dugas
http://www.position-relative.net/

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.