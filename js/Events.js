class Events
{
    constructor()
    {
        this.listeners = {};

        // could be use to transfer data to the listeners functions. Need to be setted BEFORE the emit call
        // The SAFER WAY is to use set via data arg in emit method if needed 
        this.data = null;
    }

    add(type, f)
    {
        if (!this.listeners[type])
            this.listeners[type] = [];
        this.listeners[type].push(f);
    }

    remove(type, f)
    {
        if (!this.listeners[type])
            return;
        for (let i = 0; i < this.listeners[type].length; i++)
            if (this.listeners[type][i] == f)
                this.listeners[type].splice(i, 1);
    }

    emit(type, data=null)
    {
        if (!this.listeners[type])
            return;
        if (data)
            this.data = data;
        for (let i = 0; i < this.listeners[type].length; i++)
            this.listeners[type][i]();
    }

    clear(type)
    {
        this.listeners[type] = [];
    }
}
