const express = require('express');

function keepAlive() {
    const app = express();

    app.all('/', (req, res) => {
        res.send("Server is up.");
    });

    app.listen(80);
}

module.exports = keepAlive;
