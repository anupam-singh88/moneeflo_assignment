const notFoundHandler = (req, res) => {
    res.status(404).send('Route Not Found');
}

module.exports = { notFoundHandler }