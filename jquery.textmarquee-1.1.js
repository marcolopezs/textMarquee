/**
 * jQuery textMarquee
 *
 * A simple plugin for accessing text in JSON format via an ajax request
 * and using it to create any number of scrolling marquees.  Marquees are
 * any html element, and naturally run infinitely.
 *
 */
(function($) {
	
	// version of slider
	var version = '1.1.1';
	
	// the plugin namespace
	// $.fn.textMarquee.method = function() {} // adding methods
	// This is basically a preprocessor, going through some data gathering routines & setup
	// to ensure that we can actually initialize our jQuery object(s).  
	// We will go through all of the DOM elements that have been passed in to our jquery object, 
	// and ensure that we are getting our data via ajax.  If the ajax request fails,
	// then we cannot continue.  If the DOM elements are invalid, then we cannot continue.
	// if both are fine, then we will proceed to initialize the plugin on all of the 
	// DOM elements passed in via the $.each() function, and will return 'this' for chainability
	$.fn.textMarquee = function(options) {
		// run the debug to verify we got something
		
		// compile options
		var settings = $.extend({}, $.fn.textMarquee.defaults, options);
		if (settings === false)
			return this;
			
		// pass to fill out the settings object.
		// if nothing else, we have a copy of the settings object as an instance variable	
		$.fn.textMarquee.settings = settings;	
		
		// a random number generated to verify the uniqueness of this instantiated textMarquee
		var rand = Math.floor(Math.random() * 10000);
			
		// internal data object
		// this is not the same as 'settings' which are user defined configuration values,
		// rather this is an object that tracks the state of the marquee	
		var marqueeData = {
			selector:		this.selector,
			initialized: 	false,			// will change to "true" when $.fn.textMarquee.init() is run
			width:			0,
			height:			0,
			targetWidth:	0,
			rowWidth:		0,				// the width of each row, and of course the $target and $clone as well, which will be used to simulate continuous animation
			isRunning:		false,			// actively running at this moment
			isStopped:		false,			// stop is more of a state 
			rand:			rand
		};	
		
	
		// iterate all matching elements
		// maintain chainability with jQuery
		return this.each(function() {
			
			// cast DOM as jQuery
			$this = $(this);
			
			// apply the data object to this textMarquee
			// retrieve at any time within any method with 
			// var marqueeData = $.data(this, 'marqueeData');		
			$.data(this, "marqueeData", marqueeData);
			
			// run the ajax request once for all matched DOM objects
			if(settings.loadAjax == true) {
				var haveData = $.fn.textMarquee.wordsObject.fetchData($this, settings);	
				// init called onComplete of the jason rquest.
			} else if(settings.altJSON != null) {
				// replace the ajax request with a json object,
				// and go directly to processData
				var haveData = $.fn.textMarquee.wordsObject.processData(settings.altJSON);
			} else {
				_debug('Failure to privide a data source.  Please provide an ajaxURL or an alternative data object with the altJSON option');
				return this;
			}
			
			// if we have data we can initialize, otherwise we cannot.
			if(haveData) {
				$.fn.textMarquee.init($this, settings);
			}
			
			// if we have no data at all, then die
			if(settings.altJSON == false && $.fn.textMarquee.wordsObject.words.length < 1) {
				_debug('failure to load data or provide an alternate data source. exiting.');
				return this;
			}
			
		});
		
	};
	
	
	
		
	/**
	 * Timer Object
	 *
	 * To easily reference globally.
	 */
	$.fn.textMarquee.timer = '0';
	
	
	
	
	
	
	
	// private debugger
	// 
	// no implemented in this function, but a handy reference for other firebug
	// debugging tools are the following:
	// console.log
	// console.debug
	// console.info
	// console.warn
	// console.error
	//
	// console.trace() - for a stack trace
	//
	// console.group("a title") - to start a group
	// console.grouEnd() - end a group
	//
	// console.dir(object) - interactive listing of object properties
	// console.dirxml(element) - html/xml outline printout
	//
	// a counter, just a simple grouping
	var log = 0;
	// the _debugger
	var _debug = function($obj, trace, showCaller) {
		if(window.console && window.console.log) {
			window.console.log($obj);
			window.console.log('-----' + log++ +'----'); // separator
			// less helpful than console.trace()
			if(showCaller) {
				// if available, print the callee
				if(arguments.callee.caller) {
					window.console.log(arguments.callee.caller.toString());
				}
			}
			// firebug has a helpful stack trace 
			if(trace) {
				if(window.console && window.console.trace()) {
					console.trace();
				}
			}
		}
	};
	
	
	
	
	
	
	
	// initialization on each element
	// $textMarquee = this jquery object
	// opts = options object
	$.fn.textMarquee.init = function($textMarquee) {
		// handy casting of object,
		// this can be quirky if using window functions like setTimeout()
		// or setInterval()
		var self = this;
		var settings = self.settings;
		
		// append a bunch of divs
		self.creatRows($textMarquee);
		
		// put the words in the rows
		self.writeWordsToRows($textMarquee);
		
		if(settings.matchWidthOfWrapperOnResize == true) {
			// set initial width
			var parentWidth = $textMarquee.parent().width();
			
			$textMarquee.css({
								margin: 0,
								width: parentWidth,
								overflow: 'hidden'
							});
			// add listener
			$(window).resize(function() {
			  	var parentWidth = $textMarquee.parent().width();
			  	$textMarquee.width(parentWidth);
			});
		};
		
		self.animateRows($textMarquee);
 		
	};
	
	
	
	
	
	// start function
	$.fn.textMarquee.start = function($textMarquee, settings) {
		// single point of entry: $.data() 
		var self = this;
		if($textMarquee.data("textMarquee").isStopped == true) {
			$textMarquee.data("textMarquee").isStopped = false;
			// function for starting the animation......
		}
	};
	
	
	
	
	
	// stop function
	$.fn.textMarquee.stop = function($textMarquee, settings) {
		// single point of entry: $.data()
		_debug('stop button clicked');
		if(!$textMarquee.data("textMarquee").isStopped) {
			$textMarquee.data("textMarquee").isStopped = true;
		}
	};
	
	
	
	// ajax request
	$.fn.textMarquee.wordsObject = {
		fetchData: function($textMarquee, settings) {
								
								var $textMarquee = $textMarquee;
								var settings = settings;
								var dataType = settings.dataType;
								var ajaxUrl = settings.ajaxUrl;
								var context = self.selector;
								var ajaxTimeout = 0;
								if(settings.useAjaxTimeout == true) {
									ajaxTimeout = settings.ajaxTimeout;
								} 
								$.ajax({
									dataType: 	dataType,
									url: 		ajaxUrl,
									timeout:	ajaxTimeout,
									//context:	context // a dom element... needed?
									success: 	function(data) {
													_debug('success!');
													var dataProcessed = $.fn.textMarquee.wordsObject.processData(data);
													if(dataProcessed == true) {
														return true;
													}
													
										},
									error: 		function(XMLHttpRequest, textStatus, errorThrown) {
													_debug('Ajax request has failed.  Error: '+ textStatus + ' ' + errorThrown);
													
													if(settings.useAltJSONifAjaxFail == true) {
														if(settings.altJSON != null) {
															$.fn.textMarquee.wordsObject.processData(settings.altJSON);
														} else {
															_debug('retry with altJSON has failed. No data is available.');
														}
													}
													
										},
									complete:	function() {
													// regardless of success or error, will run this function
													
													//_debug('complete. no callback at this time.');
													
													// call initialization on complete.			
													$.fn.textMarquee.init($this, settings);						
													_debug('called init');
										},
									statusCode: {
													404: function() {
														alert('(404 error) The ajax request reports that the data source has not been found.');
													},
													500: function() {
														alert('(500 error) The ajax request reports that the server is unresponsive. Please try again in a few minutes.');
													}
												}		
								});
								
		},
		processData: function(data, $textMarquee, settings) {
			// this is a simple function to ensure that we dig down into our object 
			// to the level that is a collection of strings. This helps us not worry about an accidental
			// wrapper object 
			if(data[0]) {
				// first level, if we get to a string, then we are deep enough. 
				if(typeof data[0].word === 'string') {
					// pass data in
					$.fn.textMarquee.wordsObject.words = data;
					return true;
				} else if(typeof data[0][0] === 'string') {
					// one level deeper
					$.fn.textMarquee.wordsObject.words = data[0];
					return true;
				} else if(typeof data[0][0][0] === 'string') {
					// one level deeper!
					$.fn.textMarquee.wordsObject.words = data[0][0];
					return true;
				} else {
					_debug('The processData method expects a simplified object. Please provide an array of words.');
					return false;
				}
			}
		},
		words: []
								
	};
	
	
	
	
	
	$.fn.textMarquee.creatRows = function($textMarquee) {
		
		var settings = this.settings;
		
		for(var i=0; i < settings.rows; i++) {
			
			// row wrapper
			var $row = $('<'+settings.rowWrapper+' class="row">');
			
			// we actually need to inner wrappers
			var $target = $('<div class="target">');
			
			$row.append($target);
			$textMarquee.append($row);
		};
		
		if(settings.debugRows == true) {
			var $rows = $('.row', $textMarquee);
			$rows.css({outline: "1px dashed #D19921"});
		};
	};
	
	
	
	
	
	// write words to the divs
	// takes a jquery object
	$.fn.textMarquee.writeWordsToRows = function($textMarquee) {
		
		// handy reference to pass into anonymous functions
		var self = this;
		var settings = self.settings;
		// array	
		var words = self.wordsObject.words;
		
		// rows generated
		var $rows = $textMarquee.children(settings.rowWrapper);
		
		// we will set the width based on the words
		var targetWidth = 0;
		
		// for each row, grab the two inner wrappers and write our words
		$.each($rows, function(index, row) {
			// we will also set 
			// width
			// height
			// based on calculation of all children....
			// alter opacity of every other row	
			
			var $row = $(row);
			
			var $target = $('.target', row);
			
			// target outline
			if(settings.debugTarget == true) {
				$target.css({outline: "2px dotted #FF00FF"});
			};
			
			// shuffle?
			if(self.settings.shuffleWords == true) {
				// we will ask jQuery to shuffle for us
				//$words = $._shuffle($words);
				words = $._shuffle(words);
			};	
			
			
			$.each(words, function(index, word) {
					
					// cast as jQuery?
					var $word = $(word);
					var wordWidth = 0;
					
					// wrapper
					var $wordWrapper = $('<'+self.settings.wordWrapper+' class="word">');
					$wordWrapper.append(word.word);		
					
					// debug?
					if(settings.debugWords == true) {
						$wordWrapper.css({outline: "1px dotted #7CFC00"});
					};
					
					// append to DOM
					$target.append($wordWrapper);
				});	
			});
		
		// apply the final target width to the $textMarquee data object for easy referencing
		//$textMarquee.data('marqueeData').rowWidth = targetWidth;
		//var rowWidth = $textMarquee.data('marqueeData').rowWidth;
			
			
		// cloning all targets next
		var $targets = $('.target', $rows);
		
		// now make a copy of each $target
		$.each($targets, function(index, target) {
			var $target = $(target);
			var $words = $target.children();
			// reset to 0 each loop
			var childTotalWidth = 0;
			var rowWidth = 0;
			
			$.each($words, function(index, word) {
				var $word = $(word);
				var wordWidth = $word.outerWidth(true);
				childTotalWidth = childTotalWidth + wordWidth;
			});
			
			// double the childTotalWidth for rowWidth, and add 2 px buffer 
			rowWidth = ((childTotalWidth*2)+2);
			
			// set $target width before cloning
			$target.css({
						width: childTotalWidth,
						float: 'left'
						});
			
			
			// set the width of each row		
			$target.parent().css({
									// twice as wide as the 2 children, +2px for a little buffer
									width: ((childTotalWidth*2)+2)	
									});	
			
			$target.parent().css({
									// twice as wide as the 2 children, +2px for a little buffer
									color: '#990000'	
									});									
			
			// apply this to the data object for easy retrieval later
			$textMarquee.data('marqueeData').targetWidth = childTotalWidth;
		
			$textMarquee.data('marqueeData').rowWidth = rowWidth;
			
			// clone.
			$clone = $target.clone();
			$clone.removeClass('target').addClass('clone');
			$clone.insertAfter($target);
			
			if(settings.debugClone == true) {
				$clone.css({outline: "2px dotted #0000ff"});
			}
		});
		
		
	}
	
	
	/**

	 * animateRows
	 *
	 * the actual animation functionality
	 *
	 */
	$.fn.textMarquee.animateRows = function($textMarquee) {
		
		var self = this;
		var settings = self.settings;
		var pauseTime = settings.pauseTime;
		var rowAnimTime = (pauseTime - 5);
		
		var textMarqueeStateData = $textMarquee.data('marqueeData');
		//console.log(textMarqueeStateData);
		var animateLeft = textMarqueeStateData.targetWidth;
		var rows = $textMarquee.children();
		
	
		// count?
		var ticker = 0;
		
	
		// 
		$.each(rows, function(index, row) {
			var $row = $(row);
			
			var posNeg = 1;
			
			// flip posNeg on each pass
			if(posNeg == 1) {
				posNeg = -1;
			} else {
				posNeg = 1;
			}
			
			// add the unique timeout to the data object of each row
			if(settings.randomizeSpeed == true) {
				// set limiters
				if(!settings.speedVariant || settings.speedVariant > 45000 || settings.speedVariant < 0) {
					settings.speedVariant = 100;
					_debug('speedVariant is either >1000 or <0. reset to 100.');
				}
				
				// randomize & positive/negative flip
				var rowSpeedVariant = (Math.floor(Math.random() * settings.speedVariant)*posNeg);	
			
			} else {
				// otherwise no variation
				var rowSpeedVariant = 0;
			}
			
			// prep a data object for custom speed variation
			var data = {
					rowTimeout : (rowAnimTime + rowSpeedVariant)
				}
				
			// add the data object 	
			$row.data('marqueeRow', data);

		});
		

		$.each(rows, function(index, row) {
			
			var $row = $(row);
			var rowUniqueSpeed = $row.data('marqueeRow').rowTimeout;
			
			
			(function loop($row, rowUniqueSpeed) {
				
				var pointer = $row
				
				$row.animate({
					'margin-left' : '-'+animateLeft
				}, rowUniqueSpeed, 'linear', function() {
					// no arguments are sent to an animation callback function,
					// however 'this' = the currently animating DOM element
					var $this = $(this);
					// query the speed again
					var rowUniqueSpeed = $this.data('marqueeRow').rowTimeout;
					// reset to starting point
					$this.css({'margin-left': '0'});
					// recursively call the loop
					loop($this, rowUniqueSpeed); // recursion
					_debug('restart loop!');
				});
			
				
			})($row, rowUniqueSpeed); // self executing
		
		});

		
	};
	
	
	
	// utility to jQuery
	// add a _reverse() function if it doesn't exist
	if(!$.isFunction($._reverse)) {
		$.fn._reverse = [].reverse;
	}
	
	
	
	
	
	// utility to jQuery
	// add a shuffle function if it doesn't exist
	if(!$.isFunction($._shuffle)) {
		//$.fn._shuffle vs. $.fn._shuffle...
		$._shuffle = function(o){ 
			for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
			return o;
		}
	}
	
	
	
	
	
	
	// return version #
	$.fn.textMarquee.version = function() { 
		return version; 
	};

	
	
	
	// processed settings
	// defaults stay untouched, but can easily access from anywhere
	$.fn.textMarquee.settings = {};
	
	
	
	
	
	// default settings object
	$.fn.textMarquee.defaults = {
		loadAjax: 						true,			// use ajax to request data?
		dataType: 						'json',
		ajaxUrl: 						null,			// ajax url to get words
		altJSON:						null,			// if loadAjax is false, altJSON = the json data to use instead.
		useAjaxTimeout:					true,			// enforce a timeout on the ajax request
		ajaxTimeout:					4000,			// miliseconds
		useAltJSONifAjaxFail:			false,			// if the ajax request fails, the JSON object 'altJSON' will be used,if provided
		//speed:						400,			// speed of text - DEPRACATED
		randomizeSpeed: 				true,			// should all textMarquees run the same speed? 
		speedVariant: 					30000,			// how much variance between textMarquees?
		fxAnimation: 					'scroll',		// what kind of animation? 
		autoScroll: 					true,			// should appear to continually scroll
		pauseTime: 						90000,			// time between scrolls.  should be 'zero' if continuous is truly going to be attained
		pauseOnHover: 					false,			// should animation stop if mouse hovers?
		shuffleWords: 					true,			// if multiple lines of text in a row, we will randomize the text strings
		wordWrapper: 					'span',
		rowWrapper:						'div',
		rows:							10,				// number of rows to generate. could possibly calculate 'rows needed' on the fly instead...
		matchWidthOfWrapperOnResize:	false,			// if true, will automatically update with of wrapper based on doc width changing. useful for flexible wrappers (document resize)
		debugRows:						false,			// handy border drawn for debugging
		debugWords:						false,			// handy border drawn for debugging
		debugTarget:					false,
		debugClone:						false
	};
	
	
	
	
	// add an alias if it doesn't exist
	if(!$.isFunction($.fn.tm)) {
		$.fn.tm = $.fn.textMarquee;
	}

})(jQuery);