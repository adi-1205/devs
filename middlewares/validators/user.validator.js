const { ReE } = require('../../helper');
const Yup = require('yup');

module.exports = async (req, res, next) => {
    try {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        const signUpValidation = Yup.object({
            firstName: Yup.string().required('First name is required'),
            lastName: Yup.string().required('Last name is required'),
            email: Yup.string()
                .matches(emailRegex, 'Invalid email address')
                .required('Email is required'),
            password: Yup.string()
                .required('Password is required')
                .min(8, 'Password must be at least 8 characters long'),
        })

        await signUpValidation.validate(req.body, { abortEarly: false });
        next();
    } catch (err) {
        return ReE(res, 400, err.inner[0].message);
    }
}