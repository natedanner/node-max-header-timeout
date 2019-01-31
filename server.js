const http = require('http');
const port = 3000;

const server = http.createServer((req, res) => {
	res.writeHead(200, {'Content-Type': 'text/plain; charset=UTF-8'});
	res.end('Hello World\n');
})

server.listen(port, () => {
	console.log(`Listening on ${port}`);

	// Headers that together exceed default 8k limit
	const defaultHeaders = {
		'FOO': '6'.repeat(8100),
		'BAR': '6'.repeat(8192)
	};
	
	function callServer(callerName, headers) {
		return http.get('http://localhost:3000', { headers }, (response) => {
			console.log(callerName, 'responded with:', response.statusCode);
		});
	}
	
	const excessHeadersRequest = callServer('EXCESS_HEADER', defaultHeaders);
	excessHeadersRequest.setTimeout(2000, () => {
		console.log('SHOULD NOT SEE THIS');
	});

	// If you exceed header limit on a single header by 1 then the request hangs open
	defaultHeaders['BAR'] += '6'
	const headerTimeoutRequest = callServer('EXCESS_HEADER_TIMEOUT', defaultHeaders);
	headerTimeoutRequest.setTimeout(2000, () => {
		console.log('EXCESS_HEADER_TIMEOUT CALL TIMED OUT!');
	});
});

