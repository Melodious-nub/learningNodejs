const fs = require('fs');
const superagnet =  require('superagent');

const readFilePromise = file => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, (err,data) => {
            if (err) reject('I could not fild the file 😥');
            resolve(data);
        })
    });
};

const writeFilePromise = (file, data) => {
    return new Promise((resolve, reject) => {
      fs.writeFile(file, data, err => {
        if (err) reject('Could not write file 😢');
        resolve('success');
      });
    });
};

const getDogPic = async () => {
    try {
        const data = await readFilePromise('./text/dog.txt');
        console.log('Bread:' + data);

        const res = await superagnet.get('https://dog.ceo/api/breed/'+ data +'/images/random ');
        const res2 = await superagnet.get('https://dog.ceo/api/breed/'+ data +'/images/random ');
        const res3 = await superagnet.get('https://dog.ceo/api/breed/'+ data +'/images/random ');
        
        const all = await Promise.all([res, res2, res3]);
        const images = all.map(el => el.body.message);
        console.log(images);

        await writeFilePromise('./text/dog-img.txt', images.join('\n'));
        console.log('Random dog image is generared');
    } catch (err) {
        console.log(err);
    }
};
console.log('Step-1: Will get dog pics');
getDogPic();
console.log(('Done with dong pic'));

// readFilePromise('./text/dog.txt').then(data => {
//     superagnet.get('https://dog.ceo/api/breed/'+ data +'/images/random ').then( res => {
//         console.log(res.body.message);

//         fs.writeFile('./text/dog-img.txt', res.body.message, err => {
//             console.log('Random dog is saved');
//         });
//     }).catch(err => {
//         console.log(err.message);
//     });
// });