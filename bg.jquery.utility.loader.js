(function (bg, $, undefined) {
	
	if (bg.utility === undefined) { bg.utility = {} }

	//  object that encapsulates the utility functions for dynamic asset loading functionality
    	
	bg.utility.loader = {
			
		stylesheets: {
			
			//  dynamically load stylesheets if they don't already exist
			//  [{path: "/path/to/style1.css", order: 5}, {path: "/path/to/style2.css", order: 10}]
			load: function (styles) {
				
				var dfd = new $.Deferred();
				
				//  loop through each dynamic script to load
				$(styles).each(function (index) {
				
					//  get current style path
					var currentPath = this.path;
					
					//  determine if stylesheet is loaded in page
					var isLoaded = function (path) {
					
						var loaded = false;
						
						//  loop each link tag and check href attribute
						$.each($("link[href]"), function () {
						
							//  if already loaded then break out of loop and return true;
							if (this.href.toLowerCase().indexOf(currentPath.toLowerCase()) > -1) {
								loaded = true;
								return;
							}
						});
						
						//  if not found then false; otherwise, true
						return loaded;
					};
					
					//  check if current dynamically loaded stylesheet path is already loaded in page
					var loaded = isLoaded(currentPath);
					
					//  if not already loaded, then load the stylesheet
					if (!loaded) {
						$("head").append('<link rel="stylesheet" type="text/css" href="' + this.url + this.path + '" />');
						dfd.resolve();
					}
				});
				
				//  let caller know we're done
				return dfd.promise();
			}
		},
		
		scripts: {
			
			//  dynamically load script references if they don't already exist
			load: function (scripts) {
				
				//  build an array of promises which is what gets returned from each $.getScript call
				var promises = $.map(scripts, function (obj) {
					
					//  determine if script is loaded in page
					var isLoaded = function () {
						
						//  check object reference. If not defined, double-check if path loaded
						if (obj.referenceCheck) {
							return true;
						} else {
							return $("script[src*='" + obj.path + "']").length > 0;
						}
					};
					
					//  if already loaded, then skip
					if (!isLoaded()) {
						
						return $.ajax({
							async: false,   // we want to ensure that the script is loaded before loading up the next one (for our object references-sake)
							cache: true,
							url: obj.url + obj.path,
							dataType: "script"
						}).always();
					}
				});
				
				//  resolve the promises
				promises.push(
					$.Deferred(function (dfd) {
						$(dfd.resolve);
					})
				);
				
				//  return all resolved promises
				return $.when.apply($, promises);
			}
		},
		
		references: {
			
			//  helper function to get references in order for which to load and return to caller
			get: function (list) {
				var refs = bg.utility.json.sort(list, "order", true);
				var dependencies = [];
				for (var i = 0; i < refs.length; i++) {
					dependencies.push(refs[i]);
				}
				return dependencies;
			}
		}
		
	};
	
})( window.bg = window.bg || {}, jQuery );
