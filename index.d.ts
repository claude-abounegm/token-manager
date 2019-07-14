import express = require('express');

declare namespace token_manager {
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

    interface Manager {
        init(): express.Handler;

        /**
         * Ensures that the current request has a valid token.
         */
        ensureValidToken(onInvalidToken?: express.Handler): express.Handler;

        generate<T extends {}>(opts: TokenOpts<T>): Token<T>;
        invalidate<T>(token: Token<T> | string): boolean;
        get<T extends {}>(secret: string): Token<T> | null;
        exists(secret: string): boolean;

        readonly Token: typeof Token;
        readonly TokenManagerTag: Symbol;
    }
}

declare global {
    namespace Express {
        interface Request {
            token?: token_manager.Token<{}>;
        }
    }
}

declare const TokenManager: token_manager.Manager;
export = TokenManager;
