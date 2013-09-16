/*

Copyright (c) 2013 by Matt Zabriskie

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/
(function (window, document) {
    'use strict';

    // Provide function binding for browsers that lack support (IE<9)
    if (typeof Function.prototype.bind !== 'function') {
        Function.prototype.bind = function (instance) {
            var method = this;
            return function () { method.apply(instance, arguments); };
        };
    }

    // Facade for adding DOM events
    function addEvent(el, event, handler) {
        if (!el) { return; }
        if (el.attachEvent) {
            el.attachEvent('on' + event, handler);
        } else if (el.addEventListener) {
            el.addEventListener(event, handler, true);
        } else {
            el['on' + event] = handler;
        }
    }

    // Facade for removing DOM events
    function removeEvent(el, event, handler) {
        if (!el) { return; }
        if (el.detachEvent) {
            el.detachEvent('on' + event, handler);
        } else if (el.removeEventListener) {
            el.removeEventListener(event, handler, true);
        } else {
            el['on' + event] = null;
        }
    }

    // Add className to element
    function addClass(el, className) {
        if (!hasClass(el, className)) {
            el.className = trim(el.className + ' ' + className);
        }
    }

    // Remove className from element
    function removeClass(el, className) {
        if (hasClass(el, className)) {
            el.className = trim(el.className.replace(createClassRegExp(className), ' '));
        }
    }

    // Toggle className for element
    function toggleClass(el, className, condition) {
        if (condition === true) {
            addClass(el, className);
        } else {
            removeClass(el, className);
        }
    }

    // Test if element has a className
    function hasClass(el, className) {
        return new RegExp(createClassRegExp(className)).test(el.className);
    }

    // Create RegExp for matching className
    function createClassRegExp(className) {
        return new RegExp('(?:^|\\s)(' + className + ')(?:$|\\s)');
    }

    var REGEXP_TRIM = /^\s+|\s+$/gm;
    // Trim whitespace from the ends of a string
    function trim(str) {
        return !str ? '' : str.replace(REGEXP_TRIM, '');
    }

    // Find the index of an item in a collection
    function indexOf(collection, item) {
        for (var i=0, l=collection.length; i<l; i++) {
            if (collection[i] === item) {
                return i;
            }
        }
        return -1;
    }

    // Determine if fn is a function
    function isFunction(fn) {
        return typeof fn === 'function';
    }

    // Determine if full screen support is available
    function supportsFullScreen() {
        var el = document.createElement('div');

        return isFunction(el.requestFullscreen) ||
                isFunction(el.webkitRequestFullscreen) ||
                isFunction(el.webkitRequestFullScreen) ||
                isFunction(el.mozRequestFullScreen) ||
                isFunction(el.msRequestFullscreen);
    }

    // Determine if document is currently in full screen mode
    function isFullScreen() {
        return document.fullscreenElement ||
                document.webkitFullscreenElement ||
                document.webkitCurrentFullScreenElement ||
                document.mozFullScreenElement ||
                document.msFullscreenElement;
    }

    // Exit full screen mode
    function exitFullScreen() {
        if (isFunction(document.exitFullscreen)) {
            document.exitFullscreen();
        } else if (isFunction(document.webkitExitFullscreen)) {
            document.webkitExitFullscreen();
        } else if (isFunction(document.webkitCancelFullScreen)) {
            document.webkitCancelFullScreen();
        } else if (isFunction(document.mozCancelFullScreen)) {
            document.mozCancelFullScreen();
        } else if (isFunction(document.msExitFullscreen)) {
            document.msExitFullscreen();
        }
    }

    // Request full screen mode
    function requestFullScreen(el) {
        if (isFunction(el.requestFullscreen)) {
            el.requestFullscreen();
        } else if (isFunction(el.webkitRequestFullscreen)) {
            el.webkitRequestFullscreen();
        } else if (isFunction(el.webkitRequestFullScreen)) {
            el.webkitRequestFullScreen();
        } else if (isFunction(el.mozRequestFullScreen)) {
            el.mozRequestFullScreen();
        } else if (isFunction(el.msRequestFullscreen)) {
            el.msRequestFullscreen();
        }
    }

    // Get vendor prefixed fullscreenchange event
    function getFullScreenChange() {
        var el = document.createElement('div'),
            event;

        if (isFunction(el.requestFullscreen)) {
            event = 'fullscreenchange';
        } else if (isFunction(el.webkitRequestFullscreen)) {
            event = 'webkitfullscreenchange';
        } else if (isFunction(el.webkitRequestFullScreen)) {
            event = 'webkitfullscreenchange';
        } else if (isFunction(el.mozRequestFullScreen)) {
            event = 'mozfullscreenchange';
        } else if (isFunction(el.msRequestFullscreen)) {
            event = 'MSFullscreenchange';
        }

        return event;
    }

    // Preserve aspect ratio when scaling an image
    function ratio(image, width, height) {
        var imageRatio = image.offsetWidth / image.offsetHeight,
            targetRatio = width / height;

        if (targetRatio < imageRatio) {
            height = width / imageRatio;
        } else {
            width = height * imageRatio;
        }

        return {w:width, h:height};
    }

    // Scale an image to specified width and height
    function scale(image, targetWidth, targetHeight) {
        var size = ratio(image, targetWidth, targetHeight),
            width = image.offsetWidth,
            height = image.offsetHeight;

        targetWidth = size.w;
        targetHeight = size.h;

        do {
            // For down scaling, run multiple passes until the target size is achieved.
            // For up scaling, this will result in the correct size in one pass.
            if (width > targetWidth) width /= 2;
            if (width < targetWidth) width = targetWidth;
            if (height > targetHeight) height /= 2;
            if (height < targetHeight) height = targetHeight;

        } while (width != targetWidth || height != targetHeight);

        image.style.width = Math.floor(width) + 'px';
        image.style.height = Math.floor(height) + 'px';
    }

    /**
     * Create an ImageGallery instance
     *
     * @param {Element} el The container element for the gallery
     * @constructor
     */
    function ImageGallery(el) {
        this.el = el || document.body;
        this.images = [];
        this.thumbs = [];

        this._build();
        this._bind();
    }

    /**
     * Create the needed elements
     *
     * @private
     */
    ImageGallery.prototype._build = function () {
        this.image = new Image();
        this.gallery = document.createElement('div');
        this.preview = document.createElement('div');
        this.thumbnails = document.createElement('ul');
        this.thumbprev = document.createElement('a');
        this.thumbnext = document.createElement('a');
        this.imageprev = document.createElement('div');
        this.imagenext = document.createElement('div');

        this.gallery.appendChild(this.preview);
        this.gallery.appendChild(this.thumbnails);
        this.gallery.appendChild(this.thumbprev);
        this.gallery.appendChild(this.thumbnext);
        this.preview.appendChild(this.imageprev);
        this.preview.appendChild(this.imagenext);
        this.preview.appendChild(this.image);
        this.imageprev.appendChild(document.createElement('a'));
        this.imagenext.appendChild(document.createElement('a'));

        addClass(this.gallery, 'img-gallery');
        addClass(this.preview, 'img-gallery-preview');
        addClass(this.thumbnails, 'img-gallery-thumbnails');
        addClass(this.thumbprev, 'img-gallery-thumbprev');
        addClass(this.thumbnext, 'img-gallery-thumbnext');
        addClass(this.imageprev, 'img-gallery-imageprev');
        addClass(this.imagenext, 'img-gallery-imagenext');

        if (supportsFullScreen()) {
            this.fullscreen = document.createElement('a');
            this.preview.appendChild(this.fullscreen);
            addClass(this.fullscreen, 'img-gallery-fullscreen');
        }
    };

    /**
     * Bind the event handlers
     *
     * @private
     */
    ImageGallery.prototype._bind = function () {
        this.handleWindowResize = function () {
            this._scale();
        }.bind(this);

        this.handleDocumentKeydown = function (e) {
            switch(e.keyCode) {
                case 37:
                    this.previous();
                    break;
                case 39:
                    this.next();
                    break;
            }
        }.bind(this);

        this.handleImageLoad = function () {
            this._width = this.image.offsetWidth;
            this._height = this.image.offsetHeight;
            this._scale();
        }.bind(this);

        this.handleGalleryClick = function (e) {
            var target = e.target || e.srcElement;
            switch(true) {
                // Previous image
                case (hasClass(target, 'img-gallery-imageprev') ||
                    (target.nodeName === 'A' && hasClass(target.parentNode, 'img-gallery-imageprev'))):
                    this.previous();
                    break;
                // Next image
                case (hasClass(target, 'img-gallery-imagenext') ||
                    (target.nodeName === 'A' && hasClass(target.parentNode, 'img-gallery-imagenext'))):
                    this.next();
                    break;
                // Activate image
                case (target.nodeName === 'IMG' && target.parentNode.nodeName === 'LI' &&
                    hasClass(target.parentNode.parentNode, 'img-gallery-thumbnails')):
                    this.select((indexOf(target.parentNode.parentNode.children, target.parentNode)));
                    break;
                // Previous thumbnail
                case hasClass(target, 'img-gallery-thumbprev'):
                    this._scroll(-1);
                    break;
                // Next thumbnail
                case hasClass(target, 'img-gallery-thumbnext'):
                    this._scroll(1);
                    break;
            }
        }.bind(this);

        this.handleFullScreenClick = function () {
            if (isFullScreen()) {
                exitFullScreen();
            } else {
                requestFullScreen(this.gallery);
            }
        }.bind(this);

        this.handleFullScreenChange = function () {
            this._scale(); // Safari and Opera need this when exiting full screen
            this._scroll();
        }.bind(this);
    };

    /**
     * Scale the preview image
     *
     * @private
     */
    ImageGallery.prototype._scale = function () {
        this.image.style.marginTop = '';
        this.image.style.marginLeft = '';
        this.image.style.width = this._width + 'px';
        this.image.style.height = this._height + 'px';

        scale(this.image, this.preview.offsetWidth, this.preview.offsetHeight);

        this.image.style.marginTop = ((this.preview.offsetHeight - this.image.offsetHeight) / 2) + 'px';
        this.image.style.marginLeft = ((this.preview.offsetWidth - this.image.offsetWidth) / 2) + 'px';

        this._adjust();
    };

    /**
     * Adjust the thumbnail arrows
     *
     * @private
     */
    ImageGallery.prototype._adjust = function () {
        removeClass(this.gallery, 'img-gallery-hasthumbprev');
        removeClass(this.gallery, 'img-gallery-hasthumbnext');

        if (this.thumbnails.scrollWidth > this.thumbnails.offsetWidth) {
            if (this.thumbnails.scrollLeft > 0) {
                addClass(this.gallery, 'img-gallery-hasthumbprev');
            }
            if ((this.thumbnails.scrollLeft + this.thumbnails.offsetWidth) < this.thumbnails.scrollWidth) {
                addClass(this.gallery, 'img-gallery-hasthumbnext');
            }
        }
    };

    /**
     * Scroll the thumbnails by a specified offset
     *
     * @param {Number} offset If offset is -1 scrolls thumbnails a page to the left,
     *                          if offset is 1 scrolls thumbnails a page to the right,
     *                          otherwise sets the thumbnails scrollLeft to specified offset
     * @private
     */
    ImageGallery.prototype._scroll = function (offset) {
        var sWidth = this.thumbnails.scrollWidth,
            sLeft = this.thumbnails.scrollLeft,
            oWidth = this.thumbnails.offsetWidth;

        if (typeof offset === 'undefined') {
            // Sync thumbs with active image
            var thumb = this.thumbnails.children[this._index];
            if (thumb.offsetLeft < this.thumbnails.scrollLeft) {
                offset = (thumb.offsetLeft - thumb.offsetWidth);
            } else if ((thumb.offsetLeft + thumb.offsetWidth) > (this.thumbnails.scrollLeft + this.thumbnails.offsetWidth)) {
                offset = ((thumb.offsetLeft + (thumb.offsetWidth * 2)) - this.thumbnails.offsetWidth);
            }

            // If offset is undefined then thumbnail is already visible
            if (typeof offset === 'undefined') {
                return;
            }
        }

        if (offset === -1) {
            this.thumbnails.scrollLeft = Math.max(0, sLeft - oWidth);
        } else if (offset === 1) {
            this.thumbnails.scrollLeft = Math.min(sWidth, sLeft + oWidth);
        } else {
            if (offset <= 5) { offset = 0; }
            if (offset > sWidth) { offset = sWidth; }
            this.thumbnails.scrollLeft = offset;
        }

        this._adjust();
    };

    /**
     * Attach the event handlers
     */
    ImageGallery.prototype.attach = function () {
        if (this._attached) return;
        addEvent(window, 'resize', this.handleWindowResize);
        addEvent(document, 'keydown', this.handleDocumentKeydown);
        addEvent(document, getFullScreenChange(), this.handleFullScreenChange);
        addEvent(this.image, 'load', this.handleImageLoad);
        addEvent(this.gallery, 'click', this.handleGalleryClick);
        addEvent(this.fullscreen, 'click', this.handleFullScreenClick);
        this._attached = true;
    };

    /**
     * Detach the event handlers
     */
    ImageGallery.prototype.detach = function () {
        if (!this._attached) return;
        removeEvent(window, 'resize', this.handleWindowResize);
        removeEvent(document, 'keydown', this.handleDocumentKeydown);
        removeEvent(document, getFullScreenChange(), this.handleFullScreenChange);
        removeEvent(this.image, 'load', this.handleImageLoad);
        removeEvent(this.gallery, 'click', this.handleGalleryClick);
        removeEvent(this.fullscreen, 'click', this.handleFullScreenClick);
        this._attached = false;
    };

    /**
     * Add an image and optional thumbnail to the gallery
     *
     * @param {String} image The source of the image to show in the gallery
     * @param {String} [thumb] The source of the thumbnail for the image
     */
    ImageGallery.prototype.add = function (image, thumb) {
        this.images.push(image);
        this.thumbs.push(thumb);
    };

    /**
     * Select a specific image to be the current preview image
     *
     * @param {Number} index The index of the desired image
     */
    ImageGallery.prototype.select = function (index) {
        if (index < this.images.length && index > -1) {
            if (typeof this._index !== 'undefined') {
                removeClass(this.thumbnails.children[this._index], 'active');
            }

            this.image.src = this.images[index];
            this._index = index;

            addClass(this.thumbnails.children[this._index], 'active');
            toggleClass(this.preview, 'img-gallery-hasimageprev', index > 0);
            toggleClass(this.preview, 'img-gallery-hasimagenext', index < this.images.length - 1);

            this._scroll();
        }
    };

    /**
     * Select the next image in the gallery
     */
    ImageGallery.prototype.next = function () {
        this.select(this._index + 1);
    };

    /**
     * Select the previous image in the gallery
     */
    ImageGallery.prototype.previous = function () {
        this.select(this._index - 1);
    };

    /**
     * Render the gallery
     */
    ImageGallery.prototype.render = function () {
        this.el.innerHTML = '';
        this.thumbnails.innerHTML = '';
        this.el.appendChild(this.gallery);

        for (var i=0, l=this.thumbs.length; i<l; i++) {
            var item, thumb;
            this.thumbnails.appendChild(item = document.createElement('li'));
            item.appendChild(thumb = document.createElement('img'));

            thumb.src = this.thumbs[i] || this.images[i];
        }

        this.select(0);
        this.attach();
    };

    // Expose ImageGallery
    if (typeof define === 'function' && define.amd) {
        define('ImageGallery', [], function() { return ImageGallery; });
    } else {
        window.ImageGallery = ImageGallery;
    }

})(window, document);