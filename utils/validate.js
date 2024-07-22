const { check, validationResult } = require('express-validator');

const validateUser = [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
];

const validateRegister = [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
];

const validateProduct = [
    check('products', 'Products are required').isArray(),
    check('products.*.name', 'Product name is required').not().isEmpty(),
    check('products.*.qty', 'Product quantity is required').isNumeric(),
    check('products.*.rate', 'Product rate is required').isNumeric(),
];

const checkValidationResult = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    validateUser,
    validateRegister,
    validateProduct,
    checkValidationResult,
};
