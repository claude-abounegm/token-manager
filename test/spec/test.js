'use strict';

const { expect } = require('chai');
const TokenManager = require('../..');

describe('Token Manager', function() {
    it('should generate secret', function() {
        const token = TokenManager.generate({
            data: ({ secret }) => ({
                secret
            })
        });

        expect(token.data.secret).to.be.equal(token.secret);
    });
});
