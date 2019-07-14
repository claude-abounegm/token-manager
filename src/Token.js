'use strict';

const _ = require('lodash');
const crypto = require('crypto');

class Token {
    constructor(opts) {
        this._valid = false;

        let { data, secret, size } = opts || {};

        if (!secret) {
            secret = crypto.randomBytes(size || 64).toString('base64');
        }

        if (_.isFunction(data)) {
            data = data({ secret });
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

    get secretUri() {
        return encodeURIComponent(this.secret);
    }

    invalidate() {
        this._valid = false;
        this._data = null;
        this._secret = null;
    }

    [Symbol.toString]() {
        return this.secret;
    }
}

module.exports = Token;
