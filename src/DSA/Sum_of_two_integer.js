
const Sum_of_two_integer = () => {return (<div></div>)};export default Sum_of_two_integer

let a = 10;
let b = 20;

console.log("sum of 10 and 20 is" + a + b)  // "sum of 10 and 20 is" 1020

// server.mjs
import { createServer } from 'node:http';

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World!\n');
});

// starts a simple http server locally on port 3000
server.listen(3001, '127.0.0.1', () => {
  console.log('Listening on 127.0.0.1:3000');
});

// run with `node server.mjs`
