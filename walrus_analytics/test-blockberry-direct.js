const http = require('https');

const options = {
  method: 'GET',
  hostname: 'api.blockberry.one',
  port: null,
  path: '/walrus-mainnet/v1/widgets/total-accounts?period=24H&size=SMALL&widgetPage=HOME',
  headers: {
    accept: '*/*',
    'x-api-key': 'uRQ2FafmcegmCzOGJVZ6qWHiMKyK1a'
  }
};

const req = http.request(options, function (res) {
  const chunks = [];

  res.on('data', function (chunk) {
    chunks.push(chunk);
  });

  res.on('end', function () {
    const body = Buffer.concat(chunks);
    console.log(body.toString());
  });
});

req.end();
