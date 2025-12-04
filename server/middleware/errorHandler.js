module.exports = function (err, req, res, next) {
    console.error(err);
    if (res.headersSent) return next(err);
    const status = err.status || 500;
    const message = process.env.NODE_ENV === 'production' ? 'Server Error' : (err.message || 'Server Error');
    res.status(status).json({ error: message });
};
