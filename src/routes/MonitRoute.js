var express = require('express');
var router = express.Router();

var process = require('process')
var os = require('os');



router.get('/', (req, res, next) => {

    var server_state = {
        status: 'UP',
        memory: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total_memory: os.totalmem() / (1024 * 1024),
        free_mem: os.freemem() / (1024 * 1024)
    }
    
    res.json(server_state);
})

module.exports = router;