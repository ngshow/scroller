(function($){
	$.fn.scroll = function(options){
		$.fn.scroll.defaults = {			
			sHeight: 100,	//滚动条每次滚动的高度
			speed: 0,	//滚动条滚动的速度
			endFun: null
		};

		return this.each(function() {
			var opts = $.extend({},$.fn.scroll.defaults,options);
			var me = $(this);
			var isScoll = false;
			var scrollHeight = opts.sHeight;
			var scrollSpeed = opts.speed;


			me.wrapInner('<div class="scroll-main"><div style="zoom:1"></div></div>')
			.prepend('<div class="scroll-bar"><span class="scroll-thumb"></span></div>');
			var sMain = $('.scroll-main', me);
			var sBar   = $('.scroll-bar', me);
			var sThumb = $('.scroll-thumb', me);


			//可视窗口高度
			var visualHeight = sMain.height();
			//内容高度
			var contentHeight = sMain.children().height();
			//隐藏高度
			var hiddenHeight = contentHeight - visualHeight;
			//console.log(hiddenHeight);			
			//滚动次数		
			var n = Math.ceil(hiddenHeight / scrollHeight);
			//翻阅条高度
			var thumbHeight = 0;
			//翻阅条位置
			var thumbTop = 0;

			var scroller = {
				init: function(){
					var that = this;
					// sMain.children().resize(function(){
					// 	that.rW();
					// 	alert(0)
					// });
					that.rW();
				},
				rW: function(){	
					
					if(hiddenHeight > 0){						
						//设置翻阅条的高度(百分比)
						thumbHeight = visualHeight * 100 / contentHeight;
						sThumb.height(thumbHeight + '%');

						//翻阅条可移动的高度
						var thumbMoveHeight = 100 - thumbHeight;
						//计算翻阅条每次滚动的位移(百分比)
						thumbTop = thumbMoveHeight * (scrollHeight / hiddenHeight);

						sBar.show();
						isScoll = false;
					}else{
						isScoll = true;
						sBar.hide();
					}

					
				},
				//处理滚轮事件
				mS: function(){
					var i = 0;
					var that = this;
					//that.rW();
					$(sMain).bind("mousewheel DOMMouseScroll", function(e) { 
		                e.preventDefault(); // 阻止与事件关联的默认动作(如果存在这样的动作)
		                if(!isScoll){

		                	var v = e.originalEvent.wheelDelta || -e.originalEvent.detail;  //得到的值为120和-120

			                v<0 ? i++ : i--;

			                if(i < 0){
			                	i = 0; return false;
			                }
			                if(i > n){
			                	i = n; return false;
			                }
			                
			                var that = $(this);
			                //计算内容滚动条高度
				            var _scrollTop = scrollHeight * i;
				            //计算翻阅条定位高度
				            var _thumbTop = thumbTop * i;

				            _thumbTop = (_thumbTop+thumbHeight>100) ? 100-thumbHeight : _thumbTop;
			            	
			            	//定位内容
			            	isScoll = true;
				            that.animate({scrollTop: _scrollTop}, scrollSpeed, function(){
			                	isScoll = false;
			                });
			                //定位翻阅条
			                sThumb.animate({top: _thumbTop+'%'}, scrollSpeed);
			            }
		            });
				}
			}

			scroller.init();
			scroller.mS();			

    	});//each End

	};//scroll End

})(jQuery);