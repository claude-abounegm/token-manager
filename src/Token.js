'use strict';

const _ = require('lodash');
const crypto = require('crypto');

class Token {
    constructor(opts) {
        this._valid = false;

        let { data, secret, size, expireAfterSeconds } = opts || {};

        if (!secret) {
            secret = crypto.randomBytes(size || 64).toString('base64');
        }

        if (_.isFunction(data)) {
            data = data({ secret });
        }

        if (!_.isNumber(expireAfterSeconds) && expireAfterSeconds !== false) {
            expireAfterSeconds = 3 * 60 * 60;
        }

        if (expireAfterSeconds !== false) {
            this._timeout = setTimeout(
                () => this.invalidate(),
                expireAfterSeconds * 1000
            ).unref();
        }

        this._secret = secret;
        this._data = data;
        this._valid = true;
    }

    get data() {
        return this._data;
    }

    get secret() {
        return this._secret;
    }

    get valid() {
        return this._valid;
    }

    get expires() {
        return !_.isUndefined(this._timeout);
    }

    get secretUri() {
        return encodeURIComponent(this.secret);
    }

    invalidate() {
        if (!this.valid) {
            return false;
        }

        this._valid = false;

        if (this._timeout) {
            clearTimeout(this._timeout);
            this._timeout = null;
        }

        this._data = null;
        this._secret = null;

        return true;
    }

    [Symbol.toString]() {
        return this.secret;
    }
}

module.exports = Token;
