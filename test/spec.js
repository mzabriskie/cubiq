var gallery;

function assertImgSrc(img, src) {
    return img.src.substring(img.src.length - src.length) === src;
}

QUnit.testStart(function () {
    gallery = new ImageGallery(document.getElementById('gallery'));
});

QUnit.testDone(function () {
    gallery.detach();
    gallery = null;
    document.getElementById('gallery').innerHTML = '';
});

QUnit.module('constructor');
QUnit.test('properties', function (assert) {
    assert.equal(gallery.el, document.getElementById('gallery'));
    assert.equal(gallery.images.length, 0);
    assert.equal(gallery.thumbs.length, 0);
});

QUnit.module('render');
QUnit.test('dom structure', function (assert) {
    gallery.render();
    assert.equal(gallery.gallery.parentNode, gallery.el);
    assert.equal(gallery.container.parentNode, gallery.gallery);
    assert.equal(gallery.preview.parentNode, gallery.container);
    assert.equal(gallery.image.parentNode, gallery.preview);
    assert.equal(gallery.caption.parentNode, gallery.preview);
    assert.equal(gallery.imageprev.parentNode, gallery.preview);
    assert.equal(gallery.imagenext.parentNode, gallery.preview);
    assert.equal(gallery.thumbnails.parentNode, gallery.container);
    assert.equal(gallery.thumbprev.parentNode, gallery.container);
    assert.equal(gallery.thumbnext.parentNode, gallery.container);
});

QUnit.module('images');
QUnit.test('adding images', function (assert) {
    //1. Add images and render
    gallery.add('a.jpg', null, 'Image A');
    gallery.add('b.jpg');
    gallery.add('c.jpg', 'c-t.jpg', 'Image C');
    gallery.render();

    //2. Make sure logical images, thumbs and labels are correct
    assert.equal(gallery.images.length, 3);
    assert.equal(gallery.thumbs.length, 3);

    assert.equal(gallery.images[0], 'a.jpg');
    assert.equal(gallery.images[1], 'b.jpg');
    assert.equal(gallery.images[2], 'c.jpg');

    assert.equal(gallery.thumbs[0], null);
    assert.equal(gallery.thumbs[1], null);
    assert.equal(gallery.thumbs[2], 'c-t.jpg');

    assert.equal(gallery.labels[0], 'Image A');
    assert.equal(gallery.labels[1], null);
    assert.equal(gallery.labels[2], 'Image C');

    //3. Make sure gallery image source is correct
    assert.ok(assertImgSrc(gallery.image, 'a.jpg'));

    //4. Make sure thumbnail image sources are correct
    assert.equal(gallery.thumbnails.children.length, 3);
    assert.ok(assertImgSrc(gallery.thumbnails.children[0].children[0], 'a.jpg'));
    assert.ok(assertImgSrc(gallery.thumbnails.children[1].children[0], 'b.jpg'));
    assert.ok(assertImgSrc(gallery.thumbnails.children[2].children[0], 'c-t.jpg'));
});