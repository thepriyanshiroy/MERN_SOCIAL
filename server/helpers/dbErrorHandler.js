'use strict'

/**
 * Get unique error field name
 */
const getUniqueErrorMessage = (err) => {
    let output = 'Email already exists'
    try {
        if (err.keyPattern) {
            const field = Object.keys(err.keyPattern)[0]
            output = field.charAt(0).toUpperCase() + field.slice(1) + ' already exists'
        } else if (err.keyValue) {
            const field = Object.keys(err.keyValue)[0]
            output = field.charAt(0).toUpperCase() + field.slice(1) + ' already exists'
        } else if (err.message && err.message.includes('email')) {
            output = 'Email already exists'
        }
    } catch (ex) {
        output = 'Email already exists'
    }

    return output
}

/**
 * Get the error message from error object
 */
const getErrorMessage = (err) => {
    let message = ''

    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = getUniqueErrorMessage(err)
                break
            default:
                message = 'Something went wrong'
        }
    } else {
        for (let errName in err.errors) {
            if (err.errors[errName].message) message = err.errors[errName].message
        }
    }

    return message
}

export default {getErrorMessage}
