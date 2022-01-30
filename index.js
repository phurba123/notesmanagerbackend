let express = require('express');
// let app = express();

// // setting local variables
// app.locals.email ="psherpa592@gmail.com";
// app.locals.id= 412;
// app.locals.mydata = {
//     id:1,
//     name:'phursang',
//     married:false
// };
// app.locals.mysites = [
//     {
//         sitename:'phursang.com',
//         type:'portfolio'
//     },
//     {
//         sitename:'sikkimverse',
//         type:'personal project'
//     }
// ]



// app.get('/hello',(req,res)=>
// {
//     // console.log('before')
//     // console.log('req.app : ', req.app)
//     // console.log('after');
//     console.log('app locals title : ', app.locals);
//     console.log('app locals id : ',app.locals.id);
//     console.log('app locals email : ', app.locals.email)
//     res.send('hello morons')
// }).listen(3000, ()=>console.log('helllllllllllooooooo'))

// If a sub-app is mounted on multiple path patterns, app.mountpath returns the list of patterns it is mounted on, as shown in the following example.

var app = express()

app.get('/', function (req, res) {
  console.dir(app.mountpath) // [ '/adm*n', '/manager' ]
  res.send('app Homepage')
})

var admin = express()
admin.get('/', function (req, res) {
  console.log(admin.mountpath) // /secr*t
  res.send('admin homepage')
});

admin.get('/allusers', (req,res)=>
{
    console.dir( req.baseUrl)
    console.dir(admin.mountpath);
    // let uesrs = 
    res.send('this are all the available users in admin section')
});


admin.on('mount',(parent)=>
{
    console.log('admin subapp is mounted on parent app');
    console.log('parent : ', parent)
})

app.use('/admin', admin) // load the 'secret' router on '/secr*t', on the 'admin' sub app
// app.use(['/adm*n', '/manager'], admin) // load the 'admin' router on '/adm*n' and '/manager', on the parent app


app.listen(3000,()=>
console.log('application started'));
console.log('never ever executing this line of code')
// admin.on('mount',(parent)=>
// {
//     console.log('admin subapp is mounted on parent app');
//     console.log('parent : ', parent)
// })
