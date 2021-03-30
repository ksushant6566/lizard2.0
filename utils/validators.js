module.exports.validateRegisterInput = (
    username,
    email, 
    password,
    confirmPassword
) => {
    const errors = {};

    if(username.trim() === '' || username.length < 3) {
        errors.username = "Username must be atleast 3 characters long"
    }
    if(email.trim() === '') {
        errors.email = "Email must not be empty";
    } else {
        const regEx = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if(!email.match(regEx)) {
            errors.email = "Invalid email address";
        }
    }
    if(password === '') {
        errors.password = 'Password cant be empty';
    }else if(password !== confirmPassword) {
        errors.confirmPassword = "passwords don't match";
    }
    
    return {
        errors,
        valid: Object.keys(errors).length < 1
    }

}

module.exports.validateLoginInput = (username, password) => {
    const errors = {};

    if(username.trim() === '' || username.length < 3 ) {
        errors.username = 'Username must be atleast 3 characters long';
    }
    if(password.trim() === '') {
        errors.email = "Password must not be empty";
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}