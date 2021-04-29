const NodeCache = require('node-cache')


class Cache {
    constructor(ttlSeconds) {
        this.cache = new NodeCache({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2, useClones: false });
    }

    /**
     * @description retrieves the key on cache, and if its not present, stores it
     * @param {*} key 
     * @param {*} storeFunction 
     * @returns the value for the key in the storeFuncton
     */
    get(key) {
        const value = this.cache.get(key);
        if (value) {
            return Promise.resolve(value);
        }
    }

    /**
     * @name
     * @description
     * @param {*} key 
     * @param {*} value 
     * @returns 
     */
    set(key, value) {
        this.cache.set(key, value);
        return value;
    }

    /**
     * @name del
     * @description
     * @param {*} keys 
     */
    del(keys) {
        this.cache.del(keys);
    }


    flush() {
        this.cache.flushAll();
    }
}

module.exports = { Cache };