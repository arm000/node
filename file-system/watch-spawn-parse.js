"use strict";
const fs = require('fs');
const spawn = require('child_process').spawn;
const filename = process.argv[2];

if (!filename) {
    throw Error("A file name to watch must be specified!");
}

fs.watch(filename, function() {
    let ls = spawn('ls', ['-lh', filename]);
    let output = '';
    ls.stdout.on('data', function(chunk) {
	output += chunk.toString();
	console.log("output is: " + output);
    });
    ls.on('close', function() {
	let parts = output.split(/\s+/);
	for (let i = 0; i < 9; i++) {
	    console.log("parts[" + i + "] = " + parts[i]);
	}
	console.dir([parts[0], parts[4], parts[8]]);
    });
});

console.log("Now watching " + filename + " for changes...");
