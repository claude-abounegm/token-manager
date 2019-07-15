import express = require('express');

declare class TokenManager {
    static init(): express.Handler;

    /**
     * Ensures that the current request has a valid token.
     */
    static ensureValidToken(onInvalidToken?: express.Handler): express.Handler;

    static generate<T extends {}>(opts: TokenManager.TokenOpts<T>): TokenManager.Token<T>;
    static invalidate<T>(token: TokenManager.Token<T> | string): boolean;
    static get<T extends {}>(secret: string): TokenManager.Token<T> | null;
    static exists(secret: string): boolean;

    static readonly TokenManagerTag: Symbol;
}

declare namespace TokenManager {
    interface TokenOpts<T> {
        data?: T | ((opts: { secret: string }) => T);
        secret?: string;
        size?: number;

        /**
         * Default: 3hrs (3 * 60 * 60)
         */
        expireAfterSeconds?: number | false;
    }

    class Token<T extends {} = {}> {
        constructor(opts: TokenOpts<T>);

        readonly data: T;
        readonly secret: string;
        readonly secretUri: string;
        readonly valid: boolean;
        readonly expires: boolean;

        invalidate(): void;
    }
}

declare global {
    namespace Express {
        interface Request {
            token?: TokenManager.Token<{}>;
        }
    }
}

export = TokenManager;
