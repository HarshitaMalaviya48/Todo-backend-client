const PHONENO_REGEX = /^\d{10}$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!?])[A-Za-z\d@#$%^&*!?]{8,}$/;


module.exports = {
    PHONENO_REGEX,
    PASSWORD_REGEX,
    USERNAME_REGEX
}