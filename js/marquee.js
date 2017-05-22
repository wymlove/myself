/**
 * jQuery UI Widget marquee 2.0
 * Author: lovebing
 * Depends: jquery.js, jquery.ui.widget.js
 * Created at 2013-09-02
 * Last updated at 2013-12-06
 * Copyright 2013 lovebing.org
 */
$.widget("lovebing.marquee", {
    options: {
        width: 'auto',
        type: 'normal', // or round
        speed: 'normal'
    },
    _create: function() {
        var self = $(this.element);
        var span = $('<span class="lovebing-marquee"/>');
        this._setOption('elementStyle', self.attr('style'));


        span.html('<span>' + self.html() + '</span>');
        self.html(span);
        span.append();
        self.addClass('lovebing-marquee-container');
        self.parent().addClass('lovebing-marquee-parent');
        if (this.options.width > $(this.element).parent().width() || this.options.width === 'auto') {
            this._setOption('width', $(this.element).parent().width());
        }
        this._setOption('marqueeWidth', self.find('.lovebing-marquee span').width());
        this._initOptions();
        this._size();
        this.start(true);

    },
    _initOptions: function() {
        this._setOption('direction', 'left');
        this._setOption('offsetLeft', 0);
        this._setOption('interval', null);

        var intervalTime;
        switch (this.options.speed) {
            case 'fast':
                intervalTime = 20;
                break;
            case 'slow':
                intervalTime = 100;
                break;
            case 'normal':
            default:
                intervalTime = 50;
        }
        this._setOption('intervalTime', intervalTime);
    },
    _init: function() {

    },
    _size: function() {
        var self = $(this.element);
        var h = self.height();
        self.css({
            width: this.options.width,
            height: h
        });
        //self.find('.lovebing-marquee').width(this.options.marqueeWidth + 10);
    },
    _scroll: function(delay) {
        $(this.element).scrollLeft(0);
        switch (this.options.type) {
            case 'normal':
                this._scroll1();
                break;
            case 'round':
                this._scroll2(delay);
            default:

        }
    },
    _scroll2: function(delay) {
        if (this.options.interval !== null) {
            return;
        }
        var self = $(this.element), obj = this,
                left = this.options.offsetLeft, marqueeWidth = this.options.marqueeWidth,
                count = delay ? 1 : 0, intervalTime = this.options.intervalTime;
        var run = function() {
            //暂停20次后恢复
            if (count >= 20) {
                count = 0;
            }
            if (count > 0) {
                count++;
            }
            if (count === 0) {
                //滚动条向右滚动，文字向左滚动
                if (left <= 0) {
                    if (obj.options.direction === 'right') {
                        //方向改变，开始暂停
                        count++;
                    }
                    obj._setOption('direction', 'left');
                }
                //滚完后，滚动条向左滚动，文字向右滚动
                if (left > marqueeWidth - obj.options.width) {
                    obj._setOption('direction', 'right');
                    //方向改变，开始暂停
                    count++;
                }
                if (obj.options.direction === 'left') {
                    left += 2;
                }
                else {
                    left -= 2;
                }
                self.scrollLeft(left);
                obj._setOption('offsetLeft', left);
            }
        };
        self.scrollLeft(left);
        var interval = setInterval(run, intervalTime);

        this._setOption('interval', interval);
    },
    _scroll1: function() {
        if (this.options.interval !== null) {
            return;
        }

        var self = $(this.element);
        self.css({
            paddingLeft: this.options.width
        });
        var left = this.options.offsetLeft;
        var marqueeWidth = this.options.marqueeWidth;
        var _self = this;
        var intervalTime = this.options.intervalTime;

        var scollLen = this.options.width + marqueeWidth;
        var interval = setInterval(function() {
            left += 2;
            _self._setOption('offsetLeft', left);
            self.scrollLeft(left);
            if (left >= scollLen) {
                left = 0;
                _self._setOption('offsetLeft', 0);
            }
        }, intervalTime);
        self.scrollLeft(left);
        this._setOption('interval', interval);
    },
    pause: function() {
        clearInterval(this.options.interval);
        this._setOption('interval', null);
    },
    start: function(delay) {
        if (delay !== true) {
            delay = false;
        }
        this._scroll(delay);
    },
    stop: function() {
        clearInterval(this.options.interval);
        this._setOption('offsetLeft', 0);
        $(this.element).scrollLeft(0);
        this._setOption('interval', null);
    },
    restart: function() {
        this.stop();
        this.start();
    },
    destroy: function() {
        var self = $(this.element);
        self.removeClass('lovebing-marquee-container');
        self.parent().removeClass('lovebing-marquee-parent');
        var html = self.find('.lovebing-marquee > span').html();
        if (html !== null) {
            self.html(html);
            clearInterval(this.options.interval);
        }
        if (typeof(this.options.elementStyle) === 'undefined') {
            self.removeAttr('style');
        }
        else {
            self.attr('style', this.options.elementStyle);
        }
        $.Widget.prototype.destroy.call(this);
    }
});
