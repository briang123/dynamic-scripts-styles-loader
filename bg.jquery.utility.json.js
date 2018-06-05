(function (bg, $, undefined) {
	
	if (bg.utility === undefined) { bg.utility = {} }
	
	bg.utility.json = {
        
		//  deep copy merge of json2 into json1
    	merge: function merge(json1, json2) {
        	return $.extend(true, {}, json1, json2);
    	},
		
		//  get json object items(s) from mappings object. To get an array of json objects, don't pass key parm
        getMappingItem: function (jsonArray, containerId, category, key) {
            if (jsonArray !== undefined && $.type(jsonArray) === "array" && jsonArray.length > 0 &&
                (containerId !== undefined && containerId !== null) &&
                (category !== undefined && category !== null)) {
                return $.grep(jsonArray, function (item, i) {
                    if (key) {
                        return item.container.toUpperCase() === containerId.toUpperCase() &&
                            item.category.toUpperCase() === category.toUpperCase() &&
                            item.key.toUpperCase() === key.toUpperCase();
                    } else {
                        return item.container.toUpperCase() === containerId.toUpperCase() &&
                            item.category.toUpperCase() === category.toUpperCase()
                    }
                });
            } else {
                throw "Invalid arguments (jsonArray with at least one element, containerId, and category arguments are required)";
            }
		},

		//  helper function that sorts an array of json objects and returns the correct order
        sort: function jsonSort(obj, prop, asc, fn) {
            if ($.type(obj) !== "array") throw "obj is an invalid array argument";
            if (fn) {
                if ($.type(fn) !== "function") throw "fn argument is an invalid function";
				var list = obj.sort(fn);
				if (asc === false) list.reverse();
				return list;
            } else {
                if (prop === undefined || prop === null || prop === "") throw "Missing prop argument";
				return obj.sort(function sortObject(a, b) {
					if (asc) {
						return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
					} else {
						return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
					}
				});
			}
		}
	};
	
})( window.bg = window.bg || {}, jQuery );
