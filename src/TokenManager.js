'use script';

const _ = require('lodash');
const Token = require('./Token');

const TokenManagerTag = Symbol('TokenManager');

const _tokens = (global[TokenManagerTag] = global[TokenManagerTag] || {});

class TokenManager {
    constructor() {
        throw new Error('cannot create an instance');
    }

    static init() {
        return (req, _res, next) => {
            let secret;

            try {
                secret = /^Bearer (.+)$/.exec(req.headers.authorization)[1];
            } catch (e) {}

            if (!secret) {
                secret = req.query.token;
            }

            req.token = TokenManager.get(secret);

            next();
        };
    }

    static generate(opts) {
        const token = new Token(opts);

        _tokens[token.secret] = token;
        return token;
    }

    static get(secret) {
        const token = _tokens[secret];
        if (token && !token.valid) {
            this.invalidate(token);
            return;
        }

        return token;
    }

    static invalidate(token) {
        if (_.isString(token)) {
            token = this.get(token);
        }

        if (token instanceof Token) {
            delete _tokens[token.secret];
            token.invalidate();
            return true;
        }

        return false;
    }

    static exists(secret) {
        return !_.isUndefined(_tokens[secret]);
    }

    static ensureValidToken(onInvalidToken) {
        if (onInvalidToken && !_.isFunction(onInvalidToken)) {
            throw new Error('onInvalidToken needs to be a function');
        }

        return (req, res, next) => {
            if (!req.token) {
                if (onInvalidToken) {
                    return onInvalidToken(req, res, next);
                }

                return res.end();
            }

            next();
        };
    }
}

TokenManager.Token = Token;
TokenManager.TokenManagerTag = TokenManagerTag;

module.exports = TokenManager;
