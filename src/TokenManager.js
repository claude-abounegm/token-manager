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
        let { expireAfterSeconds } = _.isPlainObject(opts) ? opts : {};

        if (!_.isNumber(expireAfterSeconds) && expireAfterSeconds !== false) {
            expireAfterSeconds = 3 * 60 * 60;
        }

        const token = new Token(opts);
        _tokens[token.secret] = token;

        if (expireAfterSeconds !== false) {
            // expire
            token._timeout = setTimeout(
                () => TokenManager.invalidate(token),
                expireAfterSeconds * 1000
            ).unref();
        }

        return token;
    }

    static get(secret) {
        const token = _tokens[secret];
        if (token && !token.valid) {
            TokenManager.invalidate(token);
            return;
        }

        return token;
    }

    static invalidate(token) {
        if (_.isString(token)) {
            token = TokenManager.get(token);
        }

        if (token instanceof Token) {
            delete _tokens[token.secret];
            token.invalidate();

            if (token._timeout) {
                clearTimeout(token._timeout);
            }

            return true;
        }

        return false;
    }

    static exists(secret) {
        return !_.isUndefined(_tokens[secret]);
    }

    static ensureValidToken(onError) {
        if (onError && !_.isFunction(onError)) {
            throw new Error('onError needs to be a function');
        }

        return (req, res, next) => {
            if (!req.token) {
                if (onError) {
                    return onError(req, res, next);
                }

                return res.end();
            }

            next();
        };
    }
}

TokenManager.Token = Token;
Token.TokenManagerTag = TokenManagerTag;

module.exports = TokenManager;
