# token-manager
A simple in-memory token manager for Node.js

# TokenManager
```js
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
```

# Token
```js
constructor(opts: TokenOpts<T>);

readonly data: T;
readonly secret: string;
readonly secretUri: string;
readonly valid: boolean;

invalidate(): void;
```