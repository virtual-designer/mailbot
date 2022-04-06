const express = require('express');

function keepAlive() {
    const app = express();

    app.all('/', (req, res) => {
        res.send("Server is up.");
    });

    app.listen(3000);
}

module.exports = keepAlive;
