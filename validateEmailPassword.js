class UserValidation {

    #email;
    #password;

    constructor(email, password) {
        this.#email = email;
        this.#password = password;
    }

    validateEmail () {
        const regex = new RegExp('^(?=.*[@])(?=.*[.])', '');
        if (regex.test(this.#email)) {
            return true;
        } else {
            return false;
        }
    };

    validatePassword () {
        const regex = new RegExp("^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@#$!()%*?&])[A-Za-z0-9@#$!()%*?&]{8,}$", '');
        if (regex.test(this.#password)) {
            return true;
        } else {
            return false;
        }
    };

};

module.exports = UserValidation;