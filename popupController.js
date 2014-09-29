;(function($, win, doc) {
	$.popupController = function(settings) {
		var defaults = {
			positionX: '50%', // 퍼센트 혹은 픽셀 단위 (e.g. '30%', '200', 100)
			positionY: '35%',
			closeButton: '.closeBtn'
		};

		var popup = this;
		var config = $.extend(true, {}, defaults, settings);

		var popupId = getQueryParams().id;
		var openerObj = win.opener.popups[popupId];

		popup.reposition = function() {
			var isOldIE = ieVersion() < 9;
			var outerWidth, outerHeight;

			if (isOldIE) {
				outerWidth = $(doc).outerWidth();
				outerHeight = $(doc).outerHeight();
			} else {
				outerWidth = win.outerWidth;
				outerHeight = win.outerHeight;
			}

			var screenWidth = screen.width;
			var screenHeight = screen.height;
			var groundX = screenWidth - outerWidth;
			var groundY = screenHeight - outerHeight;

			Number.prototype.getPos = function(val) {
				var position = 0;
				var ratio = this / 100;

				if (isNaN(val)) {
					if (val.slice(-1) === '%') {
						position = parseFloat(val);
					}

					return ratio * position;
				} else {
					position = Number(val);
					return position;
				}
			};

			var popupPosX = groundX.getPos(config.positionX);
			var popupPosY = groundY.getPos(config.positionY);

			win.moveTo(popupPosX, popupPosY);
		};

		popup.resizer = function(callback) {
			var reqSize = openerObj.size;
			var reqWidth = Number(reqSize.width);
			var reqHeight = Number(reqSize.height);

			if (openerObj.isOpened) {
				return;
			}

			setTimeout(function() {
			var bodyOffsetWidth = doc.body.offsetWidth;
			var bodyOffsetHeight = doc.body.offsetHeight;
			var remainderW = (bodyOffsetWidth - reqWidth);
			var remainderH = (bodyOffsetHeight - reqHeight);

			openerObj.isOpened = true;
			openerObj.size.width = bodyOffsetWidth;
			openerObj.size.height = bodyOffsetHeight;

			win.resizeBy(-remainderW, remainderH);

				var winWidth = $(win).width();
				var winHeight = $(win).height();

				if (reqWidth != winWidth) {
					win.resizeBy(reqWidth - winWidth, 0)
				}

				if (reqHeight != winHeight) {
					win.resizeBy(0, reqHeight - winHeight);
				}

				if (callback && typeof(callback) == 'function') {
					callback();
				}
			}, 160);
		};

		popup.updater = function() {
			openerObj.isOpened = false;
			popup.resizer();
		};

		popup.init = function() {
			popup.resizer(function() {
				popup.reposition();
			});

			popup.reposition();
		};

		popup.closer = function(e) {
			openerObj = null;
			win.open('', '_self', '');
			win.close();
		};

		popup.init();

		var $closeBtn = $(config.closeButton);
		$closeBtn.on('click', function(e) {
			e.preventDefault();
			popup.closer();
		});
	};
})(jQuery, window, document);
