import express = require('express');

declare namespace token_manager {
    interface TokenOpts<T> {
        data?: T | ((opts: { secret: string }) => T);
        secret?: string;
        size?: number;
    }

    class Token<T> {
        constructor(opts: TokenOpts<T>);

        readonly data: T;
        readonly secret: string;
        readonly secretUri: string;
        readonly valid: boolean;

        invalidate(): void;
    }

    interface ManagerOpts<T> extends TokenOpts<T> {
        /**
         * Default: 3hrs (3 * 60 * 60)
         */
        expireAfterSeconds?: number | false;
    }

    interface Manager {
        static init(): express.Handler;

        /**
         * Ensures that the current request has a valid token.
         */
        static ensureValidToken(onError?: express.Handler): express.Handler;

        static generate<T extends {}>(opts: ManagerOpts<T>): Token<T>;
        static invalidate<T>(token: Token<T> | string): boolean;
        static get<T extends {}>(secret: string): Token<T> | null;
        static exists(secret: string): boolean;

        readonly Token: Token;
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
