const UserValidation = require('./validateEmailPassword');

test("returns false because email is missing @ and .", () => {
    function testInvalidEmail(email, password) {
        const user = new UserValidation(email, password);
        expect(user.validateEmail()).toBe(false);
    }
    testInvalidEmail("happybodycom", "isPassword");
});

test("returns false because email is missing @", () => {
    function testInvalidEmail(email, password) {
        const user = new UserValidation(email, password);
        expect(user.validateEmail()).toBe(false);
    }
    testInvalidEmail("happybody.com", "isPassword");
});

test("returns false because email is missing .", () => {
    function testInvalidEmail(email, password) {
        const user = new UserValidation(email, password);
        expect(user.validateEmail()).toBe(false);
    }
    testInvalidEmail("happy@bodycom", "isPassword");
});

test("returns false because email has @ and . in the wrong order", () => {
    function testInvalidEmail(email, password) {
        const user = new UserValidation(email, password);
        expect(user.validateEmail()).toBe(false);
    }
    testInvalidEmail("happy.body@com", "isPassword");
});

test("returns true because email is valid", () => {
    function testValidEmail(email, password) {
        const user = new UserValidation(email, password);
        expect(user.validateEmail()).toBe(true);
    }
    testValidEmail("happy@body.com", "isPassword");
});

test("returns false because password only contains letters", () => {
    function testInvalidPassword(email, password) {
        const user = new UserValidation(email, password);
        expect(user.validatePassword()).toBe(false);
    }
    testInvalidPassword("happybodycom", "isPassword");
});

test("returns false because password only contains numbers", () => {
    function testInvalidPassword(email, password) {
        const user = new UserValidation(email, password);
        expect(user.validatePassword()).toBe(false);
    }
    testInvalidPassword("happybodycom", "1231455151");
});

test("returns false because password only contains numbers and letters", () => {
    function testInvalidPassword(email, password) {
        const user = new UserValidation(email, password);
        expect(user.validatePassword()).toBe(false);
    }
    testInvalidPassword("happybodycom", "ispaAs1swor2d");
});

test("returns false because password only contains symbols", () => {
    function testInvalidPassword(email, password) {
        const user = new UserValidation(email, password);
        expect(user.validatePassword()).toBe(false);
    }
    testInvalidPassword("happybodycom", "@*(%&@^%)@%!!");
});

test("returns false because password length is shorter than 8 characters", () => {
    function testInvalidPassword(email, password) {
        const user = new UserValidation(email, password);
        expect(user.validatePassword()).toBe(false);
    }
    testInvalidPassword("happybodycom", "A2a!");
});

test("returns false because password contains no capital letters", () => {
    function testInvalidPassword(email, password) {
        const user = new UserValidation(email, password);
        expect(user.validatePassword()).toBe(false);
    }
    testInvalidPassword("happybodycom", "i13@8)dord");
});

test("returns true because password is valid", () => {
    function testValidPassword(email, password) {
        const user = new UserValidation(email, password);
        expect(user.validatePassword()).toBe(true);
    }
    testValidPassword("happybodycom", "W(*hfd9awawa@SD");
    testValidPassword("happybodycom", "A!!SdE27");
});