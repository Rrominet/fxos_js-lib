class SoundManager
{
    constructor()
    {
        this._ctx = null;
        this._analyser = null;
        this._distortion = null;
        this._gain = null;
        this.visualizers = [];
        this.sounds = {};

        //method alias
        this.play = this.playSound;
        this.pause = this.pauseSound;
        this.toggle = this.toggleSound;
    }

    set volume(val)
    {
        this.gain().gain.value = val;
    }

    get volume()
    {
        return this.gain().gain.value;
    }

    ctx()
    {
        if (!this._ctx)
            this._ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.gain(true).connect(this._ctx.destination);
        return this._ctx;
    }

    analyser()
    {
        if (!this._analyser)
            this._analyser = this.ctx().createAnalyser();
        this._analyser.fftSize = 1024;
        return this._analyser;
    }

    distortion()
    {
        if (!this._distortion)
            this._distortion = this.ctx().createWaveShaper();
        return this._distortion;
    }

    gain(fromCtx = false)
    {
        if (!this._gain)
        {
            if (fromCtx)
                this._gain = this._ctx.createGain();
            else 
                this._gain = this.ctx().createGain();
        }
        return this._gain;
    }

    _nameFromPath(path)
    {
        let name = path.split("/").last();
        let tmp = name.split(".");
        tmp.pop();
        return tmp.join(".");
    }

    // if force, it will create the sound even if it already exists, useful for playing 2 time the same sound in the same time
    // params is an object that can contain loop, voulume and Audio api params
    newSound(path, force=false, params = {})
    {
        let name = this._nameFromPath(path);
        if (this.sounds[name] && !force)
        {
            this.setParams(this.sounds[name], params);
            return this.sounds[name];
        }
        else 
        {
            let i=0;
            while (this.sounds[name])
            {
                if (name.includes("_" + (i-1)))
                {
                    let tmp = name.split("_");
                    tmp.pop();
                    name = tmp.join("_");
                }
                name += "_" + i;
            }
            this.sounds[name] = new Audio(path);
        }
        this.setParams(this.sounds[name], params);
        return this.sounds[name];
    }

    // needed to create seamless loop
    newSeamlessLoop(path, volume=1.0, onloaded=null)
    {
        const xhr = HttpRequest();
        xhr.responseType = "arraybuffer";
        xhr.open("GET", path, true);

        xhr.onload = () => 
        {
            this.ctx().decodeAudioData(xhr.response, (buf) => 
                {
                    let name = this._nameFromPath(path);
                    let i=0;
                    while (this.sounds[name])
                    {
                        if (name.includes("_" + (i-1)))
                        {
                            let tmp = name.split("_");
                            tmp.pop();
                            name = tmp.join("_");
                        }
                        name += "_" + i;
                    }
                    const audio = this._newAudioBuffer(buf, name, volume); 
                    if (onloaded)
                        onloaded(audio);
                    else 
                        audio.play();
                })
        };
        xhr.send();
    }

    // it automaticly loop it, there is no benefit to use buffer otherwise
    _newAudioBuffer(buf, name, volume=1.0)
    {
        let audio = this.ctx().createBufferSource();
        audio.connect(this.gain());
        this.gain().gain.value = volume; // Not ideal but it will do it for now.
 
        audio.buffer = buf;
        audio.loop = true;

        audio.paused = true;
        audio.started = false;

        audio.play = () => 
        {
            console.log("Audio::Play()");
            if (!audio.paused)
            {
                console.log("Already playing");
                return audio;
            }
            if (audio.started)
            {
                console.log("Already started, creating a new buffer and playing it.");
                audio = this._newAudioBuffer(audio.buffer, name);
                audio.play();
                return audio;
            }
            audio.start(0); 
            audio.paused = false;
            audio.started = true;
            return audio;
        }
        audio.pause = function(){
            console.log("Audio::Pause()");
            this.stop();
            this.paused = true;
            console.log("Audio Paused.");
        }

        this.sounds[name] = audio;
        return audio;
    }

    // name cound be the path, in that case it will create the sound if it does not exists
    // if force, it will create the sound even if it already exists (only if the first sound is already playing), useful for playing 2 time the same sound in the same time
    // params is an object that can contain loop, volume, fromstart and Audio api params
    playSound(name, force=false, params = {})
    {
        let s = null;
        if (this.sounds[name] && !force)
        {
        	this.setParams(this.sounds[name], params);
            this.sounds[name].play();
            s = this.sounds[name];
        }
        else if (force && (!this.sounds[name] || !this.sounds[name].paused))
        {
            if (this.sounds[name])
            {
                s = this.newSound(this.sounds[name].src, true, params);
                s.play();
            }
            else 
            {
                s = this.newSound(name, true, params);
                s.play();
            }
        }
        else if (!this.sounds[name])
        {
            s = this.newSound(name, false, params);
            s.play();
        }
        else 
        {
            this.setParams(this.sounds[name], params);
            this.sounds[name].play();
            s = this.sounds[name]
        }
        return s;
    }

    pauseSound(name)
    {
        if (name.includes("/") || name.includes("."))
            name = this._nameFromPath(name);
        this.sounds[name].pause();
    }

    toggleSound(name)
    {
        if (name.includes("/") || name.includes("."))
            name = this._nameFromPath(name);
    	if (this.sounds[name].paused)
    		this.sounds[name].play(); 
    	else 
    		this.sounds[name].pause();
    }

    setParams(sound, params) 
    {
        if (params.loop & params.loop === true)
            sound.loop = params.loop;
        else if(params.loop & params.loop === false) 
            sound.loop = params.loop;

        if (params.volume)
            sound.volume = params.volume;

        if ("fromstart" in params && params.fromstart)
            sound.currentTime = 0;
    }


    //sound could be an Audio object or a string represeting the name in this.sounds
    //func take one argument (the audio data in an ArrayBuffer)
    data(sound, func)
    {
        if (typeof(sound) != "object")
            sound = this.sounds[sound];

        this.xhr = HttpRequest();
        this.xhr.open("GET", sound.src, true);
        this.xhr.responseType = "blob";
        
        const f = () =>
        {
            let blob = this.xhr.response;
            blob.arrayBuffer().then(buffer => func(buffer));
        };
        this.xhr.onload = f;
        this.xhr.send();
    }

    //sound could be an Audio object or a string represeting the name in this.sounds
    //func take one argument (the audio data in an AudioBuffer)
    decode(sound, func)
    {
        this.data(sound, (buff) => 
            {
                this.ctx().decodeAudioData(buff)
                .then(data => func(data));
            })
    }

    //onReady take one arg the Visualizer
    visualizer(sound, onReady, realtime = true)
    {
        let viz = new SoundRealTimeVisualizer(this);
        viz.sound = sound;
        this.visualizers.push(viz);

        this.decode(sound, (data) => {
            viz.setData(data);
            onReady(viz);
        });
        return viz;
    }

    addFunctionToExecuteOnTime(sound, time, func)
    {
    	let fc = {}; 
    	fc.executed = false;
    	let f = () => 
    	{
    		if (fc.executed)
    			return;
    		if (sound.currentTime >= time)
    		{
    			func();
    			fc.executed = true;
    		}
    	}

    	sound.addEventListener("timeupdate", f);
    }

    pauseAll()
    {
        for (let s in this.sounds)
            this.sounds[s].pause();
    }
}
