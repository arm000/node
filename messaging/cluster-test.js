'use strict';

const cluster = require('cluster');

if (cluster.isMaster) {
    console.log('I am the master, creating children...');
    for (let i = 0; i < 10; i++) {
	cluster.fork();
    }
} else {
    console.log('I am child ' + process.pid);
    let timeout = Math.floor(Math.random() * 1000);;
    let timer = setTimeout(function() {
	    console.log('Timeout from child ' + process.pid);
	    process.exit();
	}, timeout);
}

cluster.on('online', function(worker) {
	console.log('Worker ' + worker.process.pid + ' is online');
    });

cluster.on('exit', function(worker, code, signal) {
	console.log('Worker ' + worker.process.pid + ' exited with code ' + code);
    });
