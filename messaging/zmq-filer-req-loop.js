'use strict';
const
    zmq = require('zmq'),
    filename = process.argv[2],
// create request endpoint
    requester = zmq.socket('req');

// handle replies from responder
requester.on('message', function(data) {
	let response = JSON.parse(data);
	process.stdout.write("Received response (" + response.pid + "): " +  response.content);
    });

requester.connect('tcp://localhost:5433');

// send request for content
for (let i = 0; i < 4; i++) {
    console.log('Sending request ' + i + ' for ' + filename);
    requester.send(JSON.stringify({
		path: filename
		    }));
}
