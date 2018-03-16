(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(factory);
    } else if (typeof module === "object" && module.exports) {
        module.exports = factory(true);
    } else {
        window.smoothie = factory();
    }
}(this, function(){

    var Smoothie = function(){
    	this.tweens = {};

    	this.__onTransitionEvent = this.__onTransitionEvent.bind(this);
    };

    Smoothie.prototype = {
    	__genRandString : function(length){
			var string = "";

			while(string.length < length){
				string = string + (Math.random().toString(32).substring(3, 12));
			}

			string = string.substring(0, length);
			return string;
		},
		__loop : function(list, callback, context){
			if (list.length){
				for (var a = 0, l = list.length; a < l; a++){
					callback.call(context, list[a], a, list);
				}
			} else {
				for (var k in list){
					callback.call(context, list[k], k, list);
				}
			}
		},
		__configureTransition : function(element, config){
			this.__loop(config, function(value, name){
				switch (name){
					case "duration":
						element.style.transitionDuration = value;
					break;
					case "delay":
						element.style.transitionDelay = value;
					break;
					case "ease":
						element.style.transitionTimingFunction = value;
					break;
				}
			}, this);
		},
		__configureTransitionProperties : function(element, properties){
			var transitionProps = "";
			this.__loop(properties, function(value, name){
				transitionProps = name + " ";
			}, this);

			element.style.transitionProperties = transitionProps;
		},
		__setTransitionProperties : function(element, properties){
			this.__loop(properties, function(value, name){
				element.style[name] = value;
			}, this);
		},

		/*callbacks*/
    	__onTransitionEvent : function(evt){
    		var type = evt.type;
    		var element = evt.target || evt.srcElement;
    		var tweenID = element.activeSmoothie;
    		var tweenConfig = this.tweens[tweenID];

    		element.removeEventListener(type, this.__onTransitionEvent);

    		switch (type){
    			case "transitionend":
    				if (typeof tweenConfig.onComplete == "function"){
    					tweenConfig.onComplete(element);
    					delete this.tweens[tweenID];
    				}
    			break;
    		}
    		
    		console.log(type, element, tweenID, this.tweens[tweenID], evt);
    	},
    	fromTo : function(element, config, fromProps, toProps){
    		
    	},
    	to : function(element, config, properties){
    		var tweenID = this.__genRandString(16);

    		config.duration = config.duration || "1s";
    		config.delay = config.delay || "0s";

    		element.activeSmoothie = tweenID;
    		this.tweens[tweenID] = config;

    		element.addEventListener("transitionrun", this.__onTransitionEvent);
    		// element.addEventListener("transitionstart", this.__onTransitionEvent);
    		element.addEventListener("transitioncancel", this.__onTransitionEvent);
    		element.addEventListener("transitionend", this.__onTransitionEvent);

    		/*TODO: remove it after transitionstart event get more compatibility than now (march 218)*/
    		if (typeof config.onStart == "function"){
    			config.onStart(element);
    		}

    		this.__configureTransition(element, config);
    		this.__configureTransitionProperties(element, properties);
    		this.__setTransitionProperties(element, properties);
    	}
    };

    return new Smoothie();
    
}));