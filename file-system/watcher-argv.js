const fs = require('fs');
const filename = process.argv[2];

if (!filename) {
    throw Error("A file to watch must be specified!");
}

fs.open(filename, 'r', function(err) {
    if (err) {
	console.log("ERROR: " + err.message);
	throw err;
    }
});

fs.watch(filename, function(event) {
    console.log("File " + filename + " just changed!");
    console.log("Event is " + event);
});

console.log("Now watching " + filename + " for changes...");
