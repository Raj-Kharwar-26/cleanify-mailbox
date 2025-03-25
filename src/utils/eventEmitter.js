
// Simple EventEmitter polyfill for browser environments
class EventEmitter {
  constructor() {
    this._events = {};
  }

  on(type, listener) {
    this._events[type] = this._events[type] || [];
    this._events[type].push(listener);
    return this;
  }

  once(type, listener) {
    const onceWrapper = (...args) => {
      this.off(type, onceWrapper);
      listener.apply(this, args);
    };
    this.on(type, onceWrapper);
    return this;
  }

  off(type, listener) {
    if (!this._events[type]) return this;
    
    if (!listener) {
      delete this._events[type];
      return this;
    }
    
    const index = this._events[type].indexOf(listener);
    if (index !== -1) {
      this._events[type].splice(index, 1);
    }
    return this;
  }

  emit(type, ...args) {
    if (!this._events[type]) return false;
    
    this._events[type].forEach(listener => {
      listener.apply(this, args);
    });
    return true;
  }

  listenerCount(type) {
    return (this._events[type] || []).length;
  }

  removeAllListeners(type) {
    if (type) {
      delete this._events[type];
    } else {
      this._events = {};
    }
    return this;
  }

  prependListener(type, listener) {
    this._events[type] = this._events[type] || [];
    this._events[type].unshift(listener);
    return this;
  }

  prependOnceListener(type, listener) {
    const onceWrapper = (...args) => {
      this.off(type, onceWrapper);
      listener.apply(this, args);
    };
    this.prependListener(type, onceWrapper);
    return this;
  }

  removeListener(type, listener) {
    return this.off(type, listener);
  }
}

// Export both the class and an instance
exports = module.exports = new EventEmitter();
exports.EventEmitter = EventEmitter;
