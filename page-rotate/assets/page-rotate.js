(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        var DEFAULT_ROTATE_INTERVAL = 60;

        var rotate = {
            start: function (urls, interval) {
                interval = interval || DEFAULT_ROTATE_INTERVAL;
                this.stop();
                this._urls = urls.filter(function (url) {
                    return Boolean(url);
                });
                if (!this._urls.length) {
                    return;
                }
                this.current = -1;
                this._timer = setInterval(this.next.bind(this), Math.max(interval, 5) * 1000);
                this.next();
                pageElem.setAttribute('state', 'rotating');
            },
            next: function () {
                this.current = (this.current + 1) % this._urls.length;
                frameElem.setAttribute('src', this._urls[this.current]);
                document.title = 'Page Rotate | ' + this._urls[this.current];
            },
            stop: function () {
                if (this._timer) {
                    clearInterval(this._timer);
                    this._timer = null;
                }
                pageElem.setAttribute('state', '');
            }
        };

        var pageElem = document.querySelector('.page-rotate');
        var frameElem = pageElem.querySelector('.page-rotate__frame');
        var urlsElem = document.getElementById('urls');
        var timeoutElem = document.getElementById('timeout');

        try {
            var data = JSON.parse(localStorage.getItem('page-rotate')) || data;
            urlsElem.value = data.urls;
            timeoutElem.value = data.timeout;
        } catch (e) {
            // nop - not saved yet
        }

        pageElem.querySelector('.button[name="start"]')
            .addEventListener('click', function () {
                var urls = (urlsElem.value || '').split('\n'),
                    interval = Number(timeoutElem.value);
                rotate.start(urls, interval);
            });

        pageElem.querySelector('.button[name="save"]')
            .addEventListener('click', function () {
                var data = JSON.stringify({
                    timeout: timeoutElem.value,
                    urls: urlsElem.value
                });
                localStorage.setItem('page-rotate', data);
            });

        pageElem.querySelector('.button[name="stop"]')
            .addEventListener('click', function () {
                rotate.stop();
            });
    });
})();
