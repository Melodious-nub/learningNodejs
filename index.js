const fs = require('fs');
const http = require('http');
const url = require('url');

// day-1 for files
// Blockinng i/o(input/output) model, syncronous way
// const textInput = fs.readFileSync('./text/input.txt', 'utf-8');
// const textOutput = `I am kashem the great. \n ${textInput} \n ${Date.now()}`;
// fs.writeFileSync('./text/output.txt', textOutput, 'utf-8');
// console.log('Text file has been generated. Hurray!');

// non-blocking, asyncronous way
// fs.readFile('./text/inputttt.txt', 'utf-8', (err, data1) => {
//     if (err) return console.log('Error! ❓');
    
//     fs.readFile(`./text/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2);
//         fs.readFile(`./text/append.txt`, 'utf-8', (err, data3) => {
//             console.log(data3);
//             fs.writeFile('./text/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//                 console.log('File has been created.');
//             })
//         })
//     })
//     console.log(data1);
// })
// console.log('Wait a bit!');
// end-------------------------------------------------------------------------------------

// Http server & routing & statusCode & http header
const replaceTemplate = (temp, product) => {
    // console.log(product);
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);
    
    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;
}

const tempOverview = fs.readFileSync('./templates/template-overview.html', 'utf-8');
const tempCard = fs.readFileSync('./templates/template-card.html', 'utf-8');
const tempProduct = fs.readFileSync('./templates/template-product.html', 'utf-8');

const data = fs.readFileSync('./dev-data/data.json', 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
    // console.log(req.url);
    // console.log(url.parse(req.url, true));
    const {query, pathname} = url.parse(req.url, true);

    // overview page
    if(pathname === '/overview' || pathname === '/') {
        res.writeHead(200, {'Content-type': 'text/html'});

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

        res.end(output);

    // product page 
    } else if (pathname === '/product') {
        res.writeHead(200, {'Content-type': 'text/html'});
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);

    // api page 
    } else if(pathname === '/api') {
        res.writeHead(200, {'Content-type': 'application/json'});
        res.end(data);

    // not found page
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'error-page'
        });
        res.end('<h1 style="text-align: center;">Page not found.</h1>');
    }
});

server.listen(1000, '127.0.0.1', () => {
    console.log('Listening to request on port 1000');
});
