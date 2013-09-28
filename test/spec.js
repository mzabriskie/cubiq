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
    assert.ok(gallery.thumbnails.children[index].className === 'cubiq-gallery-thumbactive');
    assert.equal(gallery.caption.innerHTML, images[index].label);
}

function populateGallery() {
    for (var i=0; i<images.length; i++) {
        gallery.add(images[i].image, images[i].thumb, images[i].label);
    }
}

QUnit.testStart(function () {
    gallery = Cubiq.create(document.getElementById('gallery'));
    populateGallery();
    gallery.render();
});

QUnit.testDone(function () {
    gallery.detach();
    gallery = null;
    document.getElementById('gallery').innerHTML = '';
});

QUnit.module('constructor');
QUnit.test('properties', function (assert) {
    gallery = Cubiq.create(document.getElementById('gallery'));
    assert.equal(gallery.el, document.getElementById('gallery'));
    assert.equal(gallery.images.length, 0);
    assert.equal(gallery.thumbs.length, 0);
    assert.equal(gallery.labels.length, 0);
});

QUnit.module('render');
QUnit.test('dom structure', function (assert) {
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
    var i;

    //1. Make sure logical images, thumbs and labels are correct
    assert.equal(gallery.images.length, images.length);
    assert.equal(gallery.thumbs.length, images.length);
    assert.equal(gallery.labels.length, images.length);

    for (i=0; i<images.length; i++) {
        assert.equal(gallery.images[i], images[i].image);
        assert.equal(gallery.thumbs[i], images[i].thumb);
        assert.equal(gallery.labels[i], images[i].label);
    }

    //2. Make sure thumbnail image sources are correct
    assert.equal(gallery.thumbnails.children.length, images.length);

    for (i=0; i<images.length; i++) {
        assert.ok(assertImgSrc(gallery.thumbnails.children[i].children[0], images[i].thumb));
    }
});

QUnit.test('default thumb', function (assert) {
    gallery = Cubiq.create(document.getElementById('gallery'));
    gallery.add('Image-A.jpg');
    gallery.render();

    assert.equal(gallery.images[0], 'Image-A.jpg');
    assert.equal(gallery.thumbs[0], null);

    assert.ok(assertImgSrc(gallery.thumbnails.children[0].children[0], 'Image-A.jpg'));
});

QUnit.test('caption', function (assert) {
    gallery = Cubiq.create(document.getElementById('gallery'));
    gallery.add('Image-A.jpg');
    gallery.add('Image-B.jpg', null, 'This is image B');
    gallery.render();

    assert.ok(gallery.caption.innerHTML === '');
    assert.ok(gallery.caption.style.display === 'none');

    gallery.next();

    assert.ok(gallery.caption.innerHTML === 'This is image B');
    assert.ok(gallery.caption.style.display === '');
});

QUnit.module('select');
QUnit.test('default select', function (assert) {
    // Make sure first image is selected by default
    assertImgSelect(assert, 0);
});

QUnit.test('select by index', function (assert) {
    // Test selecting various images
    gallery.select(3);
    assertImgSelect(assert, 3);

    gallery.select(7);
    assertImgSelect(assert, 7);

    gallery.select(10);
    assertImgSelect(assert, 10);
});

QUnit.test('select boundary', function (assert) {
    // Make sure selection can't be made out of bounds
    gallery.select(0);
    gallery.select(-1);
    assertImgSelect(assert, 0);

    gallery.select(images.length);
    assertImgSelect(assert, 0);
});

QUnit.test('select navigation', function (assert) {
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