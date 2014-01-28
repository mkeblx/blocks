
// INPUT.KeyboardState.js keep the current state of the keyboard.
// It is possible to query it at any time. No need of an event.
// This is particularly convenient in loop driven case, like in
// 3D demos or games.
//
// # Usage
//
// **Step 1**: Create the object
//
// ```var keyboard	= new INPUT.KeyboardState();```
//
// **Step 2**: Query the keyboard state
//
// This will return true if shift and A are pressed, false otherwise
//
// ```keyboard.pressed("shift+A")```
//
// **Step 3**: Stop listening to the keyboard
//
// ```keyboard.destroy()```
//
// NOTE: this library may be nice as standaline. independant from three.js
// - rename it keyboardForGame
//
// # Code
//

var INPUT = INPUT || {};

/**
 * - NOTE: it would be quite easy to push event-driven too
 *   - microevent.js for events handling
 *   - in this._onkeyChange, generate a string from the DOM event
 *   - use this as event name
 */
INPUT.KeyboardState = function() {
    // to store the current state
    this.keyCodes = {};
    this.modifiers = {};
    this.lastKeyChecked = null;

    // create callback to bind/unbind keyboard events
    var self = this;
    this._onKeyDown = function(event) {
        self._onKeyChange(event, true);
    };
    this._onKeyUp = function(event) {
        self._onKeyChange(event, false);
    };

    // bind keyEvents
    document.addEventListener("keydown", this._onKeyDown, false);
    document.addEventListener("keyup", this._onKeyUp, false);
}


/**
 * To stop listening of the keyboard events
 */
INPUT.KeyboardState.prototype.destroy = function() {
    // unbind keyEvents
    document.removeEventListener("keydown", this._onKeyDown, false);
    document.removeEventListener("keyup", this._onKeyUp, false);
}

INPUT.KeyboardState.MODIFIERS = ['shift', 'ctrl', 'alt', 'meta'];
INPUT.KeyboardState.ALIAS = {
    'left': 37,
    'up': 38,
    'right': 39,
    'down': 40,
    'space': 32,
    'pageup': 33,
    'pagedown': 34,
    'tab': 9
};

/**
 * to process the keyboard dom event
 */
INPUT.KeyboardState.prototype._onKeyChange = function(event, pressed) {
    // log to debug
    //console.log("onKeyChange", event, pressed, event.keyCode, event.shiftKey, event.ctrlKey, event.altKey, event.metaKey)
    var keyCode = event.keyCode;

    console.log('key'+((pressed)?'down':'up') + ': ' + keyCode);

    //clear last on keyup
    if (!pressed && this.lastKeyChecked) {
        console.log('key up with lastkeychecked present');
        //convert lastKey string to num
        var lastKeyCheckedCode;
        if (Object.keys(INPUT.KeyboardState.ALIAS).indexOf(this.lastKeyChecked) != -1) {
            lastKeyCheckedCode = INPUT.KeyboardState.ALIAS[this.lastKeyChecked];
        } else {
            lastKeyCheckedCode = this.lastKeyChecked.toUpperCase().charCodeAt(0);
        }

        console.log('comparing', keyCode, this.lastKeyChecked, lastKeyCheckedCode);
        if (lastKeyCheckedCode == keyCode)
            this.lastKeyChecked = null;
    }

    this.keyCodes[keyCode] = pressed;

    // update this.modifiers
    this.modifiers['shift'] = event.shiftKey;
    this.modifiers['ctrl'] = event.ctrlKey;
    this.modifiers['alt'] = event.altKey;
    this.modifiers['meta'] = event.metaKey;
}

/**
 * query keyboard state to know if a key is pressed of not
 *
 * @param {String} keyDesc the description of the key. format : modifiers+key e.g shift+A
 * @returns {Boolean} true if the key is pressed, false otherwise
 */
INPUT.KeyboardState.prototype.pressed = function(keyDesc, once) {

    once = typeof once !== 'undefined' ? once : true;

    var keys = keyDesc.split("+");
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var pressed;
        if (INPUT.KeyboardState.MODIFIERS.indexOf(key) !== -1) {
            pressed = this.modifiers[key];
        } else if (Object.keys(INPUT.KeyboardState.ALIAS).indexOf(key) != -1) {
            pressed = this.keyCodes[INPUT.KeyboardState.ALIAS[key]];
        } else {
            pressed = this.keyCodes[key.toUpperCase().charCodeAt(0)];
        }
        
        if (!pressed) return false;
    };


    if (this.lastKeyChecked == keyDesc) {
        //console.log('pressed', pressed, 'prev', this.lastKeyChecked, 'curr', keyDesc);

        //this.lastKeyChecked = null;
        console.log('returning false');
        return false;
    } else {

        this.lastKeyChecked = keyDesc;
        console.log('pressed', pressed, 'prev', this.lastKeyChecked, 'curr', keyDesc);

        return true;
    }
} 