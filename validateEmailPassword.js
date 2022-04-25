class UserValidation {

    #email
    #password

    constructor(email, password) {
        this.#email = email
        this.#password = password
    }

    validateEmail () {
        const regex = /^(?=.*[@])(?=.*[.])/
        return regex.test(this.#email)
    }

    validatePassword () {
        const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@#$!()%*?&])[A-Za-z0-9@#$!()%*?&]{8,}$/
        return regex.test(this.#password)
    }

}

module.exports = UserValidation