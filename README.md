# Token Manager
A simple in-memory token manager for Express. You can store data in the token.

---

# Install
`npm i token-manager-express`

---

# Usage

## Generate token:
```js
const TokenManager = require('token-manager-express');

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

## Setup Express with TokenManager
```js
const express = require('express');
const TokenManager = require('token-manager-express');

app.use(TokenManager.init());

// will accept and parse any type of request (ex. GET, POST, PUT, ...etc)
app.use('/data', 
    TokenManager.ensureValidToken(
        // On invalid token (optional). If not specified, TokenManager just
        // ends the connection using `res.end()`
        (req, res, next) => res.send('invalid token')
    ),
    (req, res, next) => {
        // we can only get here if the token is valid. TokenManager 
        // creates a token field in req.
        const { token } = req;

        console.log(token.data.anotherField); // `${secret}[moreData]`
        console.log(req.body) // 'this data should only be visible to bearer'

        // if it's a one time use token:
        token.invalidate();
    }
);
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

---

# TokenManager
```js
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
```

---

# Token
```js
constructor(opts: TokenOpts<T>);

readonly data: T;
readonly secret: string;
readonly secretUri: string;
readonly valid: boolean;
readonly expires: boolean;

invalidate(): void;
```

---

# Credits
Made with ❤ at [Income Store](http://incomestore.com) in _Lancaster, PA_.
