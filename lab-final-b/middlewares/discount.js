module.exports = (req, res, next) => {
    const couponCode = req.query.coupon || (req.body && req.body.coupon);
    let discount = 0;

    // Check query/body first, otherwise check session
    if (couponCode === 'SAVE10') {
        req.session.coupon = 'SAVE10';
    }

    if (req.session.coupon === 'SAVE10') {
        discount = 0.10; // 10%
    }

    req.discountRate = discount;
    res.locals.discountRate = discount;
    res.locals.couponApplied = req.session.coupon === 'SAVE10';
    next();
};
