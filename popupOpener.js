;(function($, win) {
	$.fn.popupOpener = function() {
		var defaults = {
			url: '',
			name: '',
			specs: {
				width: 680,
				height: 430,
				resizable: 'no',
				status: 'no',
				location: 'no',
				menubar: 'no',
				toolbar: 'no'
			}
		};

		String.prototype.toDash = function(){
			return this.replace(/([A-Z])/g, function($1) {
				return '-' + $1.toLowerCase();
			});
		};

		var serialize = function(obj) {
			var str = [];
			var pushData;
			for (var p in obj) {
				if (obj.hasOwnProperty(p)) {
					pushData = encodeURIComponent(p).toDash();
					pushData += obj[p] ? '=' + encodeURIComponent(obj[p]) : '';
					str.push(pushData);
				}
			}

			return str.join(',');
		};

		var getRandomKey = function() {
			return Math.random().toString(36).substr(2, 5);
		};

		popups = {};

		return this.each(function() {
			$(this).on('click', function(e) {
				e.preventDefault();

				var screenSize = win.screen;
				var screenW = screenSize.width;
				var screenH = screenSize.height;

				var data = $(this).data();
				var topPos = (screenH - (data.winheight || 0)) / 2;
				var leftPos = (screenW - (data.winwidth || 0 )) / 2;

				var randomId = ['popup_', getRandomKey()].join('');

				var options = {
					url: data.winurl,
					name: data.winname || randomId,
					specs: {
						width: data.winwidth,
						height: data.winheight,
						resizable: data.winresizable,
						status: data.winstatus,
						location: data.winlocation,
						menubar: data.winmenubar,
						toolbar: data.wintoolbar,
						top: topPos,
						left: leftPos
					}
				};

				options = $.extend(true, {}, defaults, options);

				var urlWithParams = [options.url, '?id=', randomId].join('');

				popups[randomId] = {};
				popups[randomId].isOpened = false;
				popups[randomId].size = {
					width: options.specs.width,
					height: options.specs.height
				};

				win.open(urlWithParams, options.name, serialize(options.specs));
			});
		});
	};
})(jQuery, window);
