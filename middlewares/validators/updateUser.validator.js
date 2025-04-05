const { ReE } = require('../../helper');
const Yup = require('yup');

module.exports = async (req, res, next) => {
    try {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        const signUpValidation = Yup.object({
            firstName: Yup.string(),
            lastName: Yup.string(),
            password: Yup.string()
                .min(8, 'Password must be at least 8 characters long'),
            email: Yup.string()
                .matches(emailRegex, 'Invalid email address'),
        });
        await signUpValidation.validate(req.body, { abortEarly: false });
        next();
    } catch (err) {
        return ReE(res, 400, err.inner[0].message);
    }
}