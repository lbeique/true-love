const UserValidation = require('./validateEmailPassword');

test("returns false because email is invalid", () => {
    function testInvalidEmail(email, password) {
        const user = new UserValidation(email, password);
        expect(user.validateEmail()).toBe(false);
    }
    testInvalidEmail("happybodycom", "isPassword");
    testInvalidEmail("happybody.com", "isPassword");
    testInvalidEmail("happy@bodycom", "isPassword");
});

test("returns true because email is valid", () => {
    function testValidEmail(email, password) {
        const user = new UserValidation(email, password);
        expect(user.validateEmail()).toBe(true);
    }
    testValidEmail("happy@body.com", "isPassword");
});

test("returns false because password is invalid", () => {
    function testInvalidPassword(email, password) {
        const user = new UserValidation(email, password);
        expect(user.validatePassword()).toBe(false);
    }
    testInvalidPassword("happybodycom", "isPassword");
    testInvalidPassword("happybodycom", "ispaAs1swor2d");
    testInvalidPassword("happybodycom", "i13ord");
    testInvalidPassword("happybodycom", "iAdeq13");
    testInvalidPassword("happybodycom", "i13@8)dord");
});

test("returns true because password is valid", () => {
    function testValidPassword(email, password) {
        const user = new UserValidation(email, password);
        expect(user.validatePassword()).toBe(true);
    }
    testValidPassword("happybodycom", "W(*hfd9awawa@SD");
    testValidPassword("happybodycom", "A!!SddaE7898sdA");
});