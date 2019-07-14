# Token Manager
A simple in-memory token manager for Express. You can store data in the token.


# Install
`npm i token-manager-express`

# Usage

## Setup Express with TokenManager
```js
const express = require('express');
const TokenManager = require('token-manager-express');

app.use(TokenManager.init());

// will accept and parse any type of request (ex. GET, POST, PUT, ...etc)
app.use('/data', 
    TokenManager.ensureValidToken(
        // optional. if not specified, TokenManager just
        // ends the connection using `res.end()`
        (req, res, next) => res.send('invalid token')
    ),
    (req, res, next) => {
        // we can only get here if the token
        // is valid. TokenManager creates a token
        // field in req.
        const { token } = req;

        console.log(token.data.anotherField); // `${secret}[moreData]`
        console.log(req.body) // 'this data should only be visible to bearer'

        // if it's a one time use token:
        TokenManager.invalidate(token);
    }
);
```

## Generate token:
```js
const token = TokenManager.generate({
    // default is 3hrs. set to false
    // for no expiration
    expireAfterSeconds: false,

    // default is 64
    size: 64,

    // for convenience if you pass a function,
    // it will give you the generated secret
    data: ({ secret }) => ({
        anotherField: `${secret}[moreData]`
    }),

    // this is also valid:
    data: {
        anotherField: 'someData'
    }
});

console.log(token.secret); // the secret
```

## Send data with Token
```js
// You can now use the token to access the /data route

// For GET requests:
request(`/data?token=${token.secret}`);

// For other type of requests:
request('/data', {
    auth: {
        bearer: token.secret
    },
    method: 'POST',
    body: 'this data should only be visible to bearer',
    json: true
});
```

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

# Credits
Made with ❤ at [Income Store](http://incomestore.com) in _Lancaster, PA_.