(function(exports, undefined){
    'use strict';
    var document = exports.document,
    	accumulativeTime = 0;
    function Snowfall(){
        this.initial = false;
        this.starting = false;
        this.items = [];
        this.windDirection = -1;
        this.snowfallLevel = 1;
        this.frameRate = 30;
        this.windDirectionChangedInterval = 4000;
        this.gravitationalAcceleration = 0.0001;
        this.imgUrls = ['http://7xqnsj.com1.z0.glb.clouddn.com/snowflake_1.png', 'http://7xqnsj.com1.z0.glb.clouddn.com/snowflake_2.png', 'http://7xqnsj.com1.z0.glb.clouddn.com/snowflake_3.png'];
        this.imgs = [];
        this.imgScale = 0.25;
        return this;
    };
    exports.Snowfall = Snowfall;
    Snowfall.prototype = {
        init: function(opts){
        	var cnt = 0,
                error = false,
                _this = this;
            if(this.initial || this.starting){
                return this;
            }
            this.initial = true;
            this.configure(opts);
            this.canvas = this.canvas || document.querySelector('#canvas');
            this.context = this.context || this.canvas.getContext('2d');
            this.canvasWidth = this.canvasWidth || exports.innerWidth || document.body.clientWidth || document.documentElement.clientWidth;
            this.canvasHeight = this.canvasHeight || exports.innerHeight || document.body.clientHeight || document.documentElement.clientHeight;
            this.canvas.width = this.canvasWidth;
            this.canvas.height = this.canvasHeight;
            this.resourcesLoaded = false;
            this.millisecondsPerFrame = parseInt(1000 / this.frameRate);
            this.imgUrls.forEach(function(item, idx){
            	_this.imgs[idx] = new Image();
                _this.imgs[idx].onload = function(){
                    if(++cnt === _this.imgUrls.length){
                        if(error === false){
                            _this.resourcesLoaded = true;
                        }
                    }
                    if(_this.imgs[idx].width === 0 || _this.imgs[idx].height === 0){
                        error = true;
                    }
                };
                _this.imgs[idx].src = item;
            });
            return this;
        },
        start: function(){
            if(this.initial){
                this.starting = true;
                this.timer = this.timer || setTimeout(this.frame.bind(this), this.millisecondsPerFrame);
            }
        },
        frame: function(){
            if(this.resourcesLoaded === true){
                accumulativeTime += this.millisecondsPerFrame;
                (accumulativeTime % this.windDirectionChangedInterval < this.millisecondsPerFrame) && (this.windDirection *= -1);
                this.render.call(this);
                this.update.call(this);
            }
            this.timer = null;
            this.timer = setTimeout(this.frame.bind(this), this.millisecondsPerFrame);
        },
        update: function(){
            this.addItems.call(this);
            this.updateItems.call(this);
        },
        updateItems: function(){
            var items = this.items,
                len = items.length,
                i = 0,
                cnt = 0;
            for(;i<len;i++){
                items[i].x = items[i].x0 + items[i].v0x * Math.abs(Math.sin(accumulativeTime % this.windDirectionChangedInterval / this.windDirectionChangedInterval * Math.PI)) * this.windDirection;
                items[i].y = items[i].y0 + items[i].v0y * items[i].t + this.gravitationalAcceleration * Math.pow(items[i].t, 2) / 2;
                items[i].t += this.millisecondsPerFrame;
                items[i].rotationAngle += Math.PI / 50;
                if(items[i].y < this.canvasHeight){
                    items[cnt++] = items[i];
                }
            }
            while(len>cnt){
                items.pop();
                len--;
            }
        },
        addItems: function(){
            var item = null,
                i = 0,
                len = this.snowfallLevel,
                imgIndex = 0;
            for(;i<len;i++){
            	imgIndex = Math.floor(Math.random() * this.imgUrls.length);
                item = {
                	x: 0,
                	y: 0,
                    x0: Math.floor(Math.random() * this.canvasWidth * 2 - this.canvasWidth * 0.5),
                    y0: Math.floor(Math.random() * this.imgs[imgIndex].height) - this.imgs[imgIndex].height,
                    v0x: 200 + Math.floor(Math.random() * 10),
                    v0y: Math.floor(Math.random() * 10) / 1000,
                    t: 0,
                    rotationAngle: 0,
                    img: this.imgs[imgIndex],
                    imgWidth: this.imgs[imgIndex].width,
                    imgHeight: this.imgs[imgIndex].height
                }
                this.items.push(item);
            }
        },
        render: function(){
            var ctx = this.context,
                i = 0,
                len = this.items.length;
            ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
            for(;i<len;i++){
            	ctx.save();
            	ctx.beginPath();
                ctx.transform(Math.cos(this.items[i].rotationAngle) * this.imgScale,
                    Math.sin(this.items[i].rotationAngle) * this.imgScale,
                    -Math.sin(this.items[i].rotationAngle) * this.imgScale,
                    Math.cos(this.items[i].rotationAngle) * this.imgScale,
                    this.items[i].x, this.items[i].y);
				ctx.drawImage(this.items[i].img, -this.items[i].imgWidth / 2, -this.items[i].imgHeight / 2);
                ctx.closePath();
                ctx.restore();
            }
        },
        pause: function(){
            clearTimeout(this.timer);
            this.timer = null;
        },
        resume: function(){
            this.start.call(this);
        },
        clear: function(){
            clearTimeout(this.timer);
            this.timer = null;
            this.context && this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
            this.items = [];
            this.initial = false;
            this.starting = false;
            this.resourcesLoaded = false;
        },
        configure: function(opts){
			if(opts && typeof opts === 'object'){
				if(opts instanceof Object){
					for(var pro in opts){
						this[pro] = opts[pro];
					}
				}
			}
		},
    };
})(window);