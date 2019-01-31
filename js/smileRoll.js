var smileObject = {
	scrollType : "all",
	hasColBar : false,
	hasRowBar : false,
	smile : function (option) {
		var _style = document.createElement('style');
        _style.innerHTML = '.smile-scroll{border:1px solid #ddd;position:relative;overflow:hidden;}.smile-scroll:hover>.row-bar,.smile-scroll:hover>.col-bar{opacity:1;}.smile-scroll:active>.row-bar,.smile-scroll:active>.col-bar{opacity:1;}.smile-scroll>.row-bar,.smile-scroll>.col-bar{display:none;background-color:#ddd;position:absolute;border-radius:10px;-moz-user-select:none;-khtml-user-select:none;user-select:none;onselectstart:none;transition:all 0.3s ease;opacity:0;}.smile-scroll>.row-bar{height:100%;width:6px;top:0;right:0px;}.smile-scroll>.col-bar{width:100%;height:6px;bottom:0;left:0;}.smile-scroll>.row-bar>span,.smile-scroll>.col-bar>span{position:absolute;top:0;left:0;background-color:#999;border-radius:10px;transition:all 0.3s cubic-bezier(0.12,0.32,0,0.51);cursor:pointer;}.smile-scroll>.row-bar:hover>span,.smile-scroll>.col-bar:hover>span{background-color:#666;}.smile-scroll>.row-bar:active>span,.smile-scroll>.col-bar:active>span{background-color:#333;z-index:10;}.smile-scroll>.row-bar>span:after,.smile-scroll>.col-bar>span:after{position:absolute;top:0;content:"";}.smile-scroll>.row-bar>span:after{right:0;width:300%;height:100%;}.smile-scroll>.col-bar>span:after{left:0;bottom:0;width:100%;height:300%;}';
        document.head.appendChild(_style);
		var rowBar = document.createElement("div"),colBar = document.createElement("div");
		var dotstr = '<span></span>';
		rowBar.classList.add("row-bar");
		colBar.classList.add("col-bar");
		rowBar.innerHTML = dotstr;
		colBar.innerHTML = dotstr;
		this.oSmileScroll = document.getElementsByClassName('smile-scroll')[0]; //获取滚动内容最外层元素
		this.scrollType = option.scrollType;
		this.oSmileScroll.getElementsByClassName('row-bar')[0]===undefined ? this.hasRowBar = true : this.hasRowBar = false;
		this.oSmileScroll.getElementsByClassName('col-bar')[0]===undefined ? this.hasColBar = true : this.hasColBar = false;
		this.oSmileScroll.appendChild(rowBar);
		this.oSmileScroll.appendChild(colBar);
		switch (option.scrollType) {
			case "vertical":
				if (this.hasRowBar) {
					rowBar.style.display = "block";
				};
				break;
			case "horizontal":
				if (this.hasColBar) {
					colBar.style.display = "block";
				};
				break;
			case "all":
				if (this.hasRowBar || this.hasColBar) {
					rowBar.style.display = "block";
					colBar.style.display = "block";
				};
				break;
		};
		this.viewWidth = option.viewWidth + 18; //获取文本可视内容宽度 + 18
		this.viewHeight = option.viewHeight + 18; //获取文本可视内容高 + 18
		this.init();
		this.moveControl();
		this.clickControl();
		this.wheelControl("DOMMouseScroll");
		this.wheelControl("mousewheel");
	},
	init : function () { //初始化
		this.ofirstChild = this.oSmileScroll.children[0]; //定义内部DOM
		this.contentWidth = this.ofirstChild.offsetWidth;  //获取整个内容宽度
		this.contentHeight = this.ofirstChild.offsetHeight;  //获取整个内容高度
		this.oSmileScroll.style.cssText = "width :" + this.viewWidth + "px;height:" + this.viewHeight +"px"; //设置最外层宽度
		this.ratioX = this.viewWidth / this.contentWidth; //获取可视内容与完整内容宽度比例
		this.ratioY = this.viewHeight / this.contentHeight; //获取可视内容与完整内容高度比例
		if (this.hasRowBar) {
			this.oRowBar = this.oSmileScroll.getElementsByClassName('row-bar')[0]; //获取横向滚动条最外层元素
			this.oRowDot = this.oRowBar.getElementsByTagName('span')[0]; //获取横向滚动条内部控制元素
			this.oRowBarHeight = this.oRowBar.offsetHeight;
			this.oRowDotHeight = this.oSmileScroll.offsetHeight * this.ratioY;  //响应纵向滑块的高度
			this.oRowDot.style.cssText = "height :" + this.oRowDotHeight + "px;width:100%;"; //设置纵向滑块的高度
		};
		if (this.hasColBar) {
			this.oColBar = this.oSmileScroll.getElementsByClassName('col-bar')[0]; //获取纵向滚动条最外层元素
			this.oColDot = this.oColBar.getElementsByTagName('span')[0]; //获取纵向滚动条内部控制元素
			this.oColBarWidth = this.oColBar.offsetWidth;
			this.oColDotWidth = this.oSmileScroll.offsetWidth * this.ratioX;  //响应纵向滑块的高度
			this.oColDot.style.cssText = "width :" + this.oColDotWidth + "px;height:100%;"; //设置纵向滑块的高度
		};
		this.oSmileScrollY = this.oSmileScroll.offsetTop;  //获取组件最外层到可视窗口顶部的距离
		this.oSmileScrollX = this.oSmileScroll.offsetLeft;  //获取组件最外层到可视窗口左端的距离
		this.dotTop = 0;
		this.dotLeft = 0;
	},
	moveControl : function () { //拖动滑块控制
		this.oRowDot.addEventListener("mousedown", function (event) {
			smileObject.rowBarFocus = true;
			smileObject.colBarFocus = false;
			var event = event || window.event;
			event.preventDefault();
			if (smileObject.hasRowBar) {
				smileObject.mouseY = event.pageY - smileObject.oSmileScrollY - smileObject.oRowDot.offsetTop;
			};
			_move();
			return false;
		});
		this.oColDot.addEventListener("mousedown", function (event) {
			smileObject.rowBarFocus = false;
			smileObject.colBarFocus = true;
			var event = event || window.event;
			event.preventDefault();
			if (smileObject.hasColBar) {
				smileObject.mouseX = event.pageX - smileObject.oSmileScrollX - smileObject.oColDot.offsetLeft;
			};
			_move();
			return false;
		});
		function _move() {
			document.addEventListener("mousemove", smileObject.calculate);
			document.addEventListener("mouseup", function (event) {
				var event = event || window.event;
				event.preventDefault();
				document.removeEventListener("mousemove", smileObject.calculate);
			});
		}
	},
	clickControl : function () { //点击滚动条外框定位
		this.oRowBar.addEventListener("click", function (event) {
			var event = event || window.event;
			event.preventDefault();
			var mY = event.pageY - smileObject.oSmileScrollY;
			if (mY<=smileObject.oRowDot.offsetTop) {
				smileObject.dotTop -= 60;
			} else if (mY>=smileObject.oRowDot.offsetTop+smileObject.oRowDotHeight) {
				smileObject.dotTop += 60;
			} else {
				return false;
			};
			smileObject.limitRange();
		});
	},
	calculate : function (event) { //计算滑块的滑动距离
		var event = event || window.event;
		event.preventDefault();
		if (smileObject.hasRowBar && smileObject.rowBarFocus) {
			smileObject.dotTop = event.pageY - smileObject.oSmileScrollY - smileObject.mouseY;
		};
		if (smileObject.hasColBar && smileObject.colBarFocus) {
			smileObject.dotLeft = event.pageX - smileObject.oSmileScrollX - smileObject.mouseX;
		};
		smileObject.limitRange();
	},
	limitRange : function () { //范围限制
		if (this.hasRowBar && this.rowBarFocus) { //纵向
			if (this.dotTop<0) {
				this.dotTop=0;
			};
			if (this.dotTop>this.oRowBarHeight-this.oRowDotHeight) {
				this.dotTop=this.oRowBarHeight-this.oRowDotHeight;
			};
			var contentTop = this.dotTop / this.ratioY;
			if ( this.dotTop>=0 && this.dotTop<=this.oRowBarHeight-this.oRowDotHeight) {
				this.oRowDot.style.top = this.dotTop + "px";
				this.ofirstChild.style.top = - contentTop + "px";
			};
		};
		if (this.hasColBar && this.colBarFocus) { //横向
			if (this.dotLeft<0) {
				this.dotLeft=0;
			};
			if (this.dotLeft>this.oColBarWidth-this.oColDotWidth) {
				this.dotLeft=this.oColBarWidth-this.oColDotWidth;
			};
			var contentLeft = this.dotLeft / this.ratioX;
			if ( this.dotLeft>=0 && this.dotLeft<=this.oColBarWidth-this.oColDotWidth) {
				this.oColDot.style.left = this.dotLeft + "px";
				this.ofirstChild.style.left = - contentLeft + "px";
			};
		}
	},
	wheelControl : function (wheel) { //鼠标滑轮控制
		this.oSmileScroll.addEventListener( wheel , function (event) {
			smileObject.rowBarFocus = true;
			smileObject.colBarFocus = false;
			var event = event || window.event;
			smileObject.wheelRange = event.wheelDelta ? -event.wheelDelta / 120 : ( event.detail || 0 ) / 3;
			smileObject.dotTop += smileObject.wheelRange*10;
			smileObject.limitRange();
		});
	}
}