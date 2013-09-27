cubiq [![Build Status](https://travis-ci.org/mzabriskie/cubiq.png?branch=master)](https://travis-ci.org/mzabriskie/cubiq)
===========

JavaScript image gallery

## TODO
Although functional, this is a rough first draft

* Testing
* Animations
* Themes/Layouts
* Examples

## Example

```js
var gallery = Cubiq.create(document.getElementById('gallery'));
gallery.add('image-a.png', 'image-a-thumb.png');
gallery.add('image-b.png', 'image-b-thumb.png');
gallery.add('image-c.png', 'image-c-thumb.png');
gallery.add('image-d.png', 'image-d-thumb.png');
gallery.render();
```

## API

### Instance methods

#### add(image[, thumb[, label]])
Add an image and optional thumbnail to the gallery

##### image
The source of the image to show in the gallery

##### thumb
The source of the thumbnail for the image

##### label
The label associated with the image

###### Note
If `thumb` is not provided `image` will be used as the thumbnail. While this may be convenient, the image will be scaled on the client using `width` and `height` styles without any consideration for aspect ratio. This will more than likely leave your image loooking distorted. It is recommended that you create a thumbnail yourself. The proper dimensions for thumbnails are `96px` x `72px`.

#### select(index)
Select a specific image to be the current preview image

##### index
The index of the desired image

#### next()
Select the next image in the gallery

#### previous()
Select the previous image in the gallery

#### render()
Render the gallery

#### attach()
Attach the event handlers

###### Note
This method is already called by `render`. You only need to call it manually if you have called `detach` and want to restore events.

#### detach()
Detach the event handlers

### Static methods

#### create(el)
Create a Cubiq instance

##### el
The container element for the gallery

#### scale(image, width, height)
Scale an image preserving aspect ratio

##### image
The image being scaled

##### width
The target width for the image

##### height
The target height for the image

## Building

First you will need to clone a copy of the cubiq repository:

```bash
git clone https://github.com/mzabriskie/cubiq.git
```

From the cubiq directory install the Node dependencies:

```bash
cd cubiq && npm install
```

Now you can build the project:

```bash
grunt
```

This will run the tests and if they pass copy the built files to the `dist` directory.

## Testing

First you will need to clone the repo and install the Node dependencies (see the first two steps from Building above).

Using grunt:

```bash
grunt test
```

Using npm:

```bash
npm test
```

## License

Cubiq is released under the MIT license.