# Why this lib?

I created this library during my 10+ years of developing websites and webapps for my business.
All the tools that are available here come from a need I had at one moment.

The lib is in vanilla JS because I fucking hate tools like *Angular*, *React* or *Vue* (even if I know how to use them).
Simply because I like controlling what I'm doing.

The fact that they are in pure vanilla JS means that they are only rendered on client side and that they are freaking fast.

# What can you find in it?

I would say: **absolutely anything**!

From complex widgets to *workers* abstraction for parallelism with pure math and time manipulation.

# How to install it?

Easy as fuck, just clone the git repo and you're done.
```bash
git clone https://github.com/Rrominet/fxos_js-lib
```

You'll get 2 dirs: 

 - js (where are all the modules)
 - css (where are all the default styles)

Put them together where you want (certainly on your server).

>[!warning]
>Some modules need the global variable `window.FM` to work properly.
>This variable corresponds to the public URL where you put the 2 folders `js` and `css`.
>Just set it before importing your JS files.

# How to start?

The lib is really fucking big, and for a beginner to start using it can clearly be overwhelming.

So here are the modules I use the most, that are a really good way to start: 

## utils.js

`utils.js` is certainly the module I use the most.

To use it, just import it in your html like this: 
```html
<script src="where/is/your/utils.js" defer></script>
```

Or you can also import it directly in JS: 
```js
const el = document.create("script");
el.src = "where/is/your/utils.js";
document.body.appendChild(el);
```

*Absolutely all the files in this lib can be imported this way.*

>[!note]
>For now most of this JS lib doesn't use *module import* simply because when it was created, the *modules* didn't exist yet.
>There is no plan to port it in a *module compatible* version because it would break most of the code that depends on it.
>
>That being said, using `defer` keeps the parallelism and still maintains the scripts order so it's basically the same as modules.
>There is still the risk of overwriting an existing attribute or function though.
>You can use the static function `scripts.import(..., callback)` to import scripts sequentially after the DOM has been loaded.

In `utils.js`, you have so many tools really practical like Math manipulation, Date, String, Array, Dom manipulations, new Widgets, etc.

[Just click here](https://motion-live.com/fxos/doc/dev/?cmd-id=draw-module&project=fxos_js-lib&module=utils.js) to have a demo of it and see the main tools that are available to you.

## The Web App modules

This one is composed of several modules: 

 - `WebApp.js`
 - `Page.js`
 - `Menu.js`
 - `Dialog.js`

This couple of classes lets you have a premade interface for any web-app that is completely phone responsive.

Here is how it works: 
```html
<script src="where/is/your/WebApp.js" defer></script>
```

```js
await WebApp.load();
const app = WebApp.create(YourApp) //YourApp extends WebApp
app.createPage(YourPage) //YourPage extends Page
...
```

To see what you can do exactly with it and how to use it, see the [Web App documentation](https://motion-live.com/fxos/doc/dev/?cmd-id=draw-module&project=fxos_js-lib&module=WebApp.js)

# More!

Feel free to navigate in it, you'll find stuff like: 

 - `SoundManager.js` that makes sound playing easy as fuck,
 - `WindowManager.js` that implements a windows system like an OS,
 - `cache.js` that caches all your requests with a versioning system without the need of a PWA,
 - `Commands.js` that abstracts the *Command Pattern* taking care of the undo/redo for you and the URL update.

And a lot more...

PS : use `Ctrl F` to search for anything.
