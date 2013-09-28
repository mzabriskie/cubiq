var gallery,
    images = [
        {image:'examples/img/acrobat.jpg', thumb:'examples/img/acrobat_thumb.jpg', label:'Young Acrobat on a Ball, 1905 by Picasso'},
        {image:'examples/img/blue-nude.jpg', thumb:'examples/img/blue-nude_thumb.jpg', label:'Blue Nude, 1902 by Picasso'},
        {image:'examples/img/bull-fight.jpg', thumb:'examples/img/bull-fight_thumb.jpg', label:'Bullfight: Death of the Toreador, 1933 by Picasso'},
        {image:'examples/img/don-quixote.jpg', thumb:'examples/img/don-quixote_thumb.jpg', label:'Don Quixote, 1955 by Picasso'},
        {image:'examples/img/guernica.jpg', thumb:'examples/img/guernica_thumb.jpg', label:'Guernica, 1937 by Picasso'},
        {image:'examples/img/ma-jolie.jpg', thumb:'examples/img/ma-jolie_thumb.jpg', label:'Ma Jolie, 1911-1912 by Picasso'},
        {image:'examples/img/mother-and-child.jpg', thumb:'examples/img/mother-and-child_thumb.jpg', label:'Mother and Child, 1901 by Picasso'},
        {image:'examples/img/the-old-guitarist.jpg', thumb:'examples/img/the-old-guitarist_thumb.jpg', label:'The Old Guitarist, 1903 by Picasso'},
        {image:'examples/img/three-musicians.jpg', thumb:'examples/img/three-musicians_thumb.jpg', label:'Three Musicians, 1921 by Picasso'},
        {image:'examples/img/woman-with-a-flower.jpg', thumb:'examples/img/woman-with-a-flower_thumb.jpg', label:'Woman with a Flower, 1932 by Picasso'},
        {image:'examples/img/young-acrobat-on-a-ball.jpg', thumb:'examples/img/young-acrobat-on-a-ball_thumb.jpg', label:'Young Acrobat on a Ball, 1905 by Picasso'}
    ];

function assertImgSrc(img, src) {
    return img.src.substring(img.src.length - src.length) === src;
}

function assertImgSelect(assert, index) {
    assert.ok(assertImgSrc(gallery.image, images[index].image));
    assert.ok(gallery.thumbnails.children[index].className = 'active');
    assert.equal(gallery.caption.innerHTML, images[index].label);
}

function populateGallery() {
    for (var i=0; i<images.length; i++) {
        gallery.add(images[i].image, images[i].thumb, images[i].label);
    }
}

QUnit.testStart(function () {
    gallery = Cubiq.create(document.getElementById('gallery'));
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

QUnit.module('select');
QUnit.test('default select', function (assert) {
    populateGallery();
    gallery.render();

    // Make sure first image is selected by default
    assertImgSelect(assert, 0);
});

QUnit.test('select by index', function (assert) {
    populateGallery();
    gallery.render();

    // Test selecting various images
    gallery.select(3);
    assertImgSelect(assert, 3);

    gallery.select(7);
    assertImgSelect(assert, 7);

    gallery.select(10);
    assertImgSelect(assert, 10);
});

QUnit.test('select boundary', function (assert) {
    populateGallery();
    gallery.render();

    // Make sure selection can't be made out of bounds
    gallery.select(0);
    gallery.select(-1);
    assertImgSelect(assert, 0);

    gallery.select(images.length);
    assertImgSelect(assert, 0);
});

QUnit.test('select navigation', function (assert) {
    populateGallery();
    gallery.render();

    // Make sure navigation is correct
    gallery.select(0);
    assert.ok(gallery.preview.className.indexOf('cubiq-gallery-hasimageprev') === -1);
    assert.ok(gallery.preview.className.indexOf('cubiq-gallery-hasimagenext') > 0);

    gallery.select(images.length - 1);
    assert.ok(gallery.preview.className.indexOf('cubiq-gallery-hasimageprev') > 0);
    assert.ok(gallery.preview.className.indexOf('cubiq-gallery-hasimagenext') === -1);

    gallery.select(5);
    assert.ok(gallery.preview.className.indexOf('cubiq-gallery-hasimageprev') > 0);
    assert.ok(gallery.preview.className.indexOf('cubiq-gallery-hasimagenext') > 0);
});

QUnit.test('next/previous', function (assert) {
    populateGallery();
    gallery.render();

    gallery.next();
    assertImgSelect(assert, 1);

    gallery.next();
    assertImgSelect(assert, 2);

    gallery.next();
    assertImgSelect(assert, 3);

    gallery.select(10);

    gallery.previous();
    assertImgSelect(assert, 9);

    gallery.previous();
    assertImgSelect(assert, 8);

    gallery.previous();
    assertImgSelect(assert, 7);
});