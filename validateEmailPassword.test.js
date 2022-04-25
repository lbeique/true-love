const UserValidation = require('./validateEmailPassword')

describe('USER VALIDATION', () => {

    const testInvalidEmail = (email) => {
        const user = new UserValidation(email, null)
        expect(user.validateEmail()).toBe(false)
    }

    describe('EMAIL SAD PATH', () => {
        test("returns false because email is missing @ and .", () => {
            testInvalidEmail("happybodycom")
        })

        test("returns false because email is missing @", () => {
            testInvalidEmail("happybody.com")
        })

        test("returns false because email is missing .", () => {
            testInvalidEmail("happy@bodycom")
        })

        test("returns false because email has @ and . in the wrong order", () => {
            testInvalidEmail("happy.body@com")
        })
    })

    describe('EMAIL HAPPY PATH', () => {

        function testValidEmail(email) {
            const user = new UserValidation(email, null)
            expect(user.validateEmail()).toBe(true)
        }

        test("returns true because email is valid", () => {
            testValidEmail("happy@body.com")
        })
    })

    describe('PASSWORD SAD PATH', () => {

        function testInvalidPassword(password) {
            const user = new UserValidation(null, password)
            expect(user.validatePassword()).toBe(false)
        }

        test("returns false because password only contains letters", () => {
            testInvalidPassword("isPassword")
        })

        test("returns false because password only contains numbers", () => {
            testInvalidPassword("1231455151")
        })

        test("returns false because password only contains numbers and letters", () => {
            testInvalidPassword("ispaAs1swor2d")
        })

        test("returns false because password only contains symbols", () => {
            testInvalidPassword("@(%&@^%)@%!!")
        })

        test("returns false because password length is shorter than 8 characters", () => {
            testInvalidPassword("A2a!")
        })

        test("returns false because password contains no capital letters", () => {
            testInvalidPassword("i13@8)dord")
        })
    })

    describe('PASSWORD HAPPY PATH', () => {

        function testValidPassword(password) {
            const user = new UserValidation(null, password)
            expect(user.validatePassword()).toBe(true)
        }

        test("returns true because password is valid", () => {

            testValidPassword("W(hfd9awawa@SD")
            testValidPassword("A!!SdE27")
        })
    })
})