'use strict';

const
    cluster = require('cluster'),
//    fs = require('fs'),
    zmq = require('zmq');

if (cluster.isMaster) {
    // master process create ROUTER and DEALER sockets, bind endpts
    let
	sendsock = zmq.socket('push').bind('ipc://bonus-push.ipc'),
	recvsock = zmq.socket('pull').bind('ipc://bonus-pull.ipc'),
	ready = 0;

    recvsock.on('message', function(data) {
	    let request = JSON.parse(data);
	    if (request.type === 'ready') {
		console.log('Got ready from ' + request.pid);
		if (++ready === 3) {
		    console.log('Got third ready, sending out work');
		    // send out 30 jobs
		    for (let i = 0; i < 30; i++) {
			sendsock.send(JSON.stringify({
				    type: "job",
					jobnum: i,
					timestamp: Date.now(),
					}));
		    }
		}
	    } else if (request.type === 'result') {
		console.log('Got response from ' + request.pid + ': ' + request.message);
	    }
	});
	    
    // listen for workers to come online
    //    cluster.on('online', function(worker) {
    //	    console.log('Worker ' + worker.process.pid + ' is online');
    //	});

    // fork three worker processes
    for (let i = 0; i < 3; i++) {
	cluster.fork();
    }
} else {
    console.log('Hello world from child process ' + process.pid);

    // worker process create REP socket, connect to DEALER
    let
	pullsock = zmq.socket('pull').connect('ipc://bonus-push.ipc'),
	pushsock = zmq.socket('push').connect('ipc://bonus-pull.ipc');

    pullsock.on('message', function(data) {
	    // parse incoming message
	    let request = JSON.parse(data);
	    console.log(process.pid + ' received request for: ' + request.type + ' ' + request.jobnum);
	    pushsock.send(JSON.stringify({
			    type: 'result',
			    message: 'hello world',
			    pid: process.pid,
			    }));
	    /*
	    // read file and reply with content
	    fs.readFile(request.path, function(err, data) {
		    console.log(process.pid + ' sending response');
		    responder.send(JSON.stringify({
				    pid: process.pid,
				    content: data.toString(),
				    timestamp: Date.now(),
				    }));
		});
	    */
	});

    // notify master that this child is ready to receive jobs
    pushsock.send(JSON.stringify({
		type: 'ready',
		    pid: process.pid,
		    }));
}
