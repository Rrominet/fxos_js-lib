// How to use it : 
// The Page class represent a page of your application.
    // You don't create it directly calling new Page
// You inherit your page from this Class creating a child class like :
// class MyPage extends Page
// And you pass MyClass as argument to app.createPage. (instance of WebApp)
    // Note you pass the Class at argument NOT a class instance
//
    // to customize it you just have to implement you ui stuff in the dom element this.main (in you class)
// you can implement you logic where you want because a Page instance is never destroyed by WebApp unless you do it yourself.
    //
    // you could use event to execute code at certain time (like when the page is shown)
// for this you need to call this.events.add("event-name", () => your code);.
    // all the events for this class are in this file , just search for this.events.emit


class Page
{
    constructor()
    {
        this.div = B.newNode("div", "page");
        this.div.header = this.div.newNode("div", "header");
        this.div.header.titre = this.div.header.newNode("div", "title");
        // should I add a close button ? 


        // you sould add your UI stuff here
        this.main = this.div.newNode("main");
        this.main.style.height = (innerHeight - this.div.header.h()) + "px"; 
        this.events = new Events

        addEventListener("resize", () => this.main.style.height = (innerHeight - this.div.header.h()) + "px");
        addEventListener("load", () => this.main.style.height = (innerHeight - this.div.header.h()) + "px");

        this.events.add("title-changed", () => this.main.style.height = (innerHeight - this.div.header.h()) + "px");
    }

    append(domelmt)
    {
        this.main.appendChild(domelmt);
    }

    setTitle(title)
    {
        this.div.header.titre.innerHTML = title;
        this.events.emit("title-changed", title);
    }

    title()
    {
        return this.div.header.titre.innerHTML;
    }

    hide()
    {
        this.div.hide();
        this.events.emit("hidden", this);
    }

    show()
    {
        this.div.show();
        this.events.emit("shown", this);
    }

    // key should be of the form : ctrl a
    // alt b
    // A (shift a)
    // ctrl shift a
    // no sight like + 
    addkeybind(key, func)
    {
        app.addkeybind(key, func, this);
    }
}
