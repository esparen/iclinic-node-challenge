const NodeCache = require('node-cache')


class Cache {
    constructor(ttlSeconds) {
        this.cache = new NodeCache({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2, useClones: false });
    }

    /**
     * @description retrieves the key on cache, and if its not present, stores it
     * @param {*} key an identifier to look in the cache for a value
     * @returns {*} the value for the key in the cache
     */
    get(key) {
        const value = this.cache.get(key);
        if (value) {
            return Promise.resolve(value);
        }
    }

    /**
     * @name set
     * @description set an value to a key in the cache
     * @param {*} key the key for the value
     * @param {*} value the value of an key
     * @returns {*} the value itself
     */
    set(key, value) {
        this.cache.set(key, value);
        return value;
    }

    /**
     * @name del
     * @description remove a key from the cache
     * @param {*} keys one or more keys
     */
    del(keys) {
        this.cache.del(keys);
    }

    /**
     * @name flush
     * @description flushes all the keys in the cache
     */
    flush() {
        this.cache.flushAll();
    }
}

module.exports = { Cache };