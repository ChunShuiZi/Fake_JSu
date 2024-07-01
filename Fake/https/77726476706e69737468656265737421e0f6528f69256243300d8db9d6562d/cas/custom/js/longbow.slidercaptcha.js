vpn_eval((function(){
(function ($) {
    'use strict';

    var SliderCaptcha = function (element, options) {
        this.$element = $(element);
        this.options = $.extend({}, SliderCaptcha.DEFAULTS, options);
        this.$element.css({
            'position': 'relative',
            'width': this.options.width + 'px',
            'margin': '0 auto'
        });
        this.init();
    };
    var loadingText=$("#loadingText").val();
    if(!loadingText){
        loadingText="向右滑动填充拼图";
    }
    var failedText=$("#failedText").val();
    if(!failedText){
        failedText="再试一次";
    }
    SliderCaptcha.VERSION = '2.0';
    SliderCaptcha.Author = 'XX@XX.com';
    SliderCaptcha.DEFAULTS = {
        width: 280,     // canvas宽度
        height: 155,    // canvas高度
        PI: Math.PI,
        sliderL: 42,    // 滑块边长
        sliderR: 9,     // 滑块半径
        offset: 5,      // 容错偏差
        loadingText: loadingText,
        failedText: failedText,
        barText: loadingText,
        repeatIcon: 'fa fa-repeat',
        closeIcon: 'fa fa-close',
        maxLoadCount: 3,
        localImages: function () {
            return 'images/Pic' + Math.round(Math.random() * 4) + '.jpg';
        }
    };

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('lgb.SliderCaptcha');
            var options = typeof option === 'object' && option;

            if (data && !/reset/.test(option)) return;
            if (!data) $this.data('lgb.SliderCaptcha', data = new SliderCaptcha(this, options));
            if (typeof option === 'string') data[option]();
        });
    }

    $.fn.sliderCaptcha = Plugin;
    $.fn.sliderCaptcha.Constructor = SliderCaptcha;
    var _proto = SliderCaptcha.prototype;
    _proto.init = function () {
        this.initDOM();
        this.initImg();
        this.bindEvents();
    };

    _proto.initDOM = function () {
        var createElement = function (tagName, className) {
            var elment = document.createElement(tagName);
            elment.className = className;
            return elment;
        };

        var createCanvas = function (width, height) {
            var canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            return canvas;
        };
        var canvas = createCanvas(this.options.width - 2, this.options.height); // 画布
        var block = canvas.cloneNode(true); // 滑块
        var sliderContainer = createElement('div', 'sliderContainer');
        var refreshIcon = createElement('i', 'refreshIcon ' + this.options.repeatIcon);
        //新增消除closeIcon
        var closeIcon = createElement('i', 'closeIcon ' + this.options.closeIcon);
        var sliderMask = createElement('div', 'sliderMask');
        var sliderbg = createElement('div', 'sliderbg');
        var slider = createElement('div', 'slider');
        var sliderIcon = createElement('i', 'fa fa-arrow-right sliderIcon');
        var text = createElement('span', 'sliderText');

        block.className = 'block';
        text.innerHTML = this.options.barText;

        var el = this.$element;
        el.append($(canvas));
        el.append($(refreshIcon));
        el.append($(closeIcon));
        el.append($(block));
        slider.appendChild(sliderIcon);
        sliderMask.appendChild(slider);
        sliderContainer.appendChild(sliderbg);
        sliderContainer.appendChild(sliderMask);
        sliderContainer.appendChild(text);
        el.append($(sliderContainer));

        // 解决Object.assign IE 兼容方法开始===
        if (typeof Object.assign != 'function') {
            Object.assign = function(target) {
                'use strict';
                if (target == null) {
                    throw new TypeError('Cannot convert undefined or null to object');
                }
                target = Object(target);
                for (var index = 1; index < arguments.length; index++) {
                    var source = arguments[index];
                    if (source != null) {
                        for (var key in source) {
                            if (Object.prototype.hasOwnProperty.call(source, key)) {
                                target[key] = source[key];
                            }
                        }
                    }
                }
                return target;
            };
        }
        // 解决Object.assign IE 兼容方法结束===
        Object.assign(this, {
            canvas:canvas,
            block:block,
            sliderContainer: $(sliderContainer),
            refreshIcon:refreshIcon,
            closeIcon:closeIcon,
            slider:slider,
            sliderMask:sliderMask,
            sliderIcon:sliderIcon,
            text:$(text),
            canvasCtx: canvas.getContext('2d'),
            blockCtx: block.getContext('2d')
        })
    };

    _proto.initImg = function () {
        var that = this;
        var isIE = window.navigator.userAgent.indexOf('Trident') > -1;
        var L = this.options.sliderL + this.options.sliderR * 2 + 3; // 滑块实际边长

        var getRandomNumberByRange = function (start, end) {
            return Math.round(Math.random() * (end - start) + start);
        };
        var img = new Image();
        var img2 = new Image()
        img.crossOrigin = "Anonymous";
        var loadCount = 0;
        img.onload = function () {
            // 随机创建滑块的位置
            that.x = getRandomNumberByRange(L + 10, that.options.width - (L + 10));
            that.y = getRandomNumberByRange(10 + that.options.sliderR * 2, that.options.height - (L + 10));
            var wscale = that.options.width / $("#img1")[0].naturalWidth;
            var newl = $("#img2")[0].naturalWidth * wscale;
            that.canvasCtx.drawImage(img, 0, 0, that.options.width - 2, that.options.height);
            that.blockCtx.drawImage(img2, 0, 0, newl - 2, that.options.height);
            var y = that.y - that.options.sliderR * 2 - 1;

            //that.block.width = newl;
            //var ImageData = that.blockCtx.getImageData(0, 0, newl, that.options.height);

            //var hscale = this.options.height / $("#img1")[0].height;

            //that.block.width = $("#img1")[0].height * wscale;
            //that.blockCtx.putImageData(ImageData, 0, y);
            that.text.text(that.text.attr('data-text'));
        };
        img.onerror = function () {
            loadCount++;
            if (window.location.protocol === 'file:') {
                loadCount = that.options.maxLoadCount;
                console.error("can't load pic resource file from File protocal. Please try http or https");
            }
            if (loadCount >= that.options.maxLoadCount) {
                that.text.text('加载失败').addClass('text-danger');
                return;
            }
            img.src = that.options.localImages();
        };
        img.setSrc = function () {
            var src = $("#img1")[0].src;
            var src2 = $("#img2")[0].src;
            loadCount = 0;
            that.text.removeClass('text-danger');
            img.src = src;
            img2.src = src2;
        };
        img.setSrc();
        this.text.attr('data-text', this.options.barText);
        this.text.text(this.options.loadingText);
        this.img = img
    };

    _proto.clean = function () {
        this.canvasCtx.clearRect(0, 0, this.options.width, this.options.height);
        this.blockCtx.clearRect(0, 0, this.options.width, this.options.height);
        this.block.width = this.options.width;
    };

    _proto.bindEvents = function () {
        var that = this;
        this.$element.on('selectstart', function () {
            return false;
        });
        //改造：刷新按钮
        $(this.refreshIcon).on('click', function () {
            //刷新图片滑块
            createSliderCaptcha();
        });

        $(this.closeIcon).on('click', function () {
            that.reset();
            $("#captcha-id").hide();
        });

        var originX, originY, trail = [],
            isMouseDown = false

        var handleDragStart = function (e) {
            if (that.text.hasClass('text-danger')) return;
            originX = e.clientX || e.touches[0].clientX;
            originY = e.clientY || e.touches[0].clientY;
            isMouseDown = true;
        };

        var handleDragMove = function (e) {
            if (!isMouseDown) return false;
            var eventX = e.clientX || e.touches[0].clientX;
            var eventY = e.clientY || e.touches[0].clientY;
            var moveX = eventX - originX;
            var moveY = eventY - originY;
            if (moveX < 0 || moveX + 40 > that.options.width) return false;
            that.slider.style.left = (moveX - 1) + 'px';
            var blockLeft = moveX;
            that.block.style.left = blockLeft + 'px';

            that.sliderContainer.addClass('sliderContainer_active');
            that.sliderMask.style.width = (moveX + 4) + 'px';
            trail.push(moveY);
        };

        var handleDragEnd = function (e) {
            if (!isMouseDown) {
                return false
            }
            isMouseDown = false;
            var eventX = e.clientX || e.changedTouches[0].clientX;
            if (eventX == originX) {
                return false
            }
            //滑块参数
            var canvasLength = $("#captcha").width();
            var moveLength = eventX - originX;
            //验证滑块
            verifySliderImageCode(canvasLength,moveLength);
            return;
        };
        var verifySliderImageCode =function (canvasLength,moveLength) {
            $.ajax({
                url: "verifySliderImageCode.do",
                dataType: 'json',
                data: {
                    "canvasLength": canvasLength,
                    "moveLength": moveLength
                },
                success: function (data) {
                    that.sliderContainer.removeClass('sliderContainer_active');
                    if (data.code==0) {
                        var sliderSign=data.sign;
                        that.sliderContainer.addClass('sliderContainer_success');
                        if ($.isFunction(that.options.onSuccess)) that.options.onSuccess.call(that.$element);
                        setTimeout(function(){
                            //动态码登录，先验证滑块再发送验证码
                            var isDynamicCode=$("#sliderCaptchaDynamicCode").val();
                            $("#captcha-id").hide();
                            if(isDynamicCode=="isDynamicCode"){
                                //滑块验证成功，发送验证码
                                //发送手机动态码
                                var username = $("#casDynamicLoginForm").find("#username");
                                var _t = username.val();
                                try{
                                    _t = encryptAES(_t,$("#casDynamicLoginForm").find("#dynamicPwdEncryptSalt").val());
                                }catch(e){
                                }
                                //滑块验证码
                                sendDynamicCodeByPhone(_t, "dynamicCodeType", sliderSign);
                            }else{
                                //账号密码登录提交表单
                                var casLoginForm = $("#casLoginForm");
                                var signInput=$("<input type='hidden' name='sign'/>");
                                signInput.attr("value", sliderSign);
                                casLoginForm.append(signInput);
                                casLoginForm.submit();
                            }
                        },1000);
                    } else {
                        that.sliderContainer.addClass('sliderContainer_fail');
                        if ($.isFunction(that.options.onFail)) that.options.onFail.call(that.$element);
                        setTimeout(function(){
                            that.text.text(that.options.failedText);
                            //刷新图片滑块
                            createSliderCaptcha();
                        },1000);
                    }
                }
            })
        };
        this.slider.addEventListener('mousedown', handleDragStart);
        this.slider.addEventListener('touchstart', handleDragStart);
        document.addEventListener('mousemove', handleDragMove);
        document.addEventListener('touchmove', handleDragMove);
        document.addEventListener('mouseup', handleDragEnd);
        document.addEventListener('touchend', handleDragEnd);
        document.addEventListener('mousedown', function () {
            return false;
        });
        document.addEventListener('touchstart', function () {
            return false;
        });
    };

    _proto.verify = function () {
        var sum = function (x, y) {
            return x + y;
        };
        var square = function (x) {
            return x * x;
        };
        var arr = this.trail // 拖动时y轴的移动距离
        var average = arr.reduce(sum) / arr.length;
        var deviations = arr.map(function (x) {
            return x - average;
        });
        var stddev = Math.sqrt(deviations.map(square).reduce(sum) / arr.length);
        var left = parseInt(this.block.style.left);
        return {
            spliced: Math.abs(left - this.x) < this.options.offset,
            verified: stddev !== 0, // 简单验证下拖动轨迹，为零时表示Y轴上下没有波动，可能非人为操作
        }
    };

    _proto.reset = function () {
        this.sliderContainer.removeClass('sliderContainer_fail sliderContainer_success');
        this.slider.style.left = 0
        this.block.style.left = 0
        this.sliderMask.style.width = 0
        this.clean()
        this.text.attr('data-text', this.text.text());
        this.text.text(this.options.loadingText);
        this.img.setSrc();
    };
})(jQuery);

}
).toString().slice(12, -2),"");