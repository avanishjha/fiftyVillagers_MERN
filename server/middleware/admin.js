module.exports = function (req, res, next) {
    // 401 Unauthorized vs 403 Forbidden
    // 401 = I don't know who you are (Auth failed)
    // 403 = I know who you are, but you can't come in (Role failed)

    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied: Admins only' });
    }
    next();
};
