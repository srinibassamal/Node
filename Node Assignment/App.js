"use strict";
const express=require("express");
const res = require("express/lib/response");
const app=express();
const port=3004;
var bodyParser = require('body-parser');
var flash = require('express-flash');
var session = require('express-session');
const mysql=require("./connection").con
var hbs = require('hbs');
const { route } = require("express/lib/application");
hbs.registerHelper('dateFormat', require('handlebars-dateformat'));

app.set("view engine", "hbs")
app.set("views", "./view")
app.use(express.static(__dirname+"/public"))

app.use(express.urlencoded())
app.use(express.json())
app.use(session({ 
    secret: '123456catr',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))
app.use(flash());

// App Routing Home Page
app.get("/", (req, res)=>{
    res.render("index")
})

app.get("/teacherview", (req, res)=>{
    let qry="select * from students" 
    mysql.query(qry, (err, results)=>{
        if(err) throw err;
        else{
            res.render("teacherview", {data:results})
        }
    })
})

app.get("/studentview", (req, res)=>{
    // let qry="select * from students" 
    // mysql.query(qry, (err, results)=>{
    //     if(err) throw err;
    //     else{
    //         res.render("teacherview", {data:results})
    //     }
    // })
    res.render("studentview")
})

app.get("/addresults", (req, res)=>{
    res.render("addresults")
})

app.post("/insertresult", (req, res)=>{
    var rollnumber = req.body.rollnumber;
    var name = req.body.name;
    var dob = req.body.dob;
    var score = req.body.score;
    var status = req.body.status;

    let qry2=`insert into students (rollnumber, name, dob, score, status) values("${rollnumber}", "${name}", "${dob}", "${score}", "${status}")`

    mysql.query(qry2, (err, results)=>{
        if(err) throw err;
        console.log('record inserted');
        req.flash('success', 'Data added successfully!');
        res.redirect('/teacherview');
    });  

    // sanitization xss...
    // let qry="select * from test where emailid=? or phoneno=?" 
    // mysql.query(qry, [email, phone], (err, results)=>{
    //     if(err) 
    //         throw err;
    //     else{
    //         if(results.length>0){
    //             res.render("add", {checkmesg:true})
    //         }
    //         else{
    //             // Insert
    //             let qry2="insert into test (username, phoneno, emailid, gender) values(?,?,?,?)"
    //             mysql.query(qry2, [name, phone, email, gender], (err, results)=>{
    //                 if(results.affectedRows>0){
    //                     res.render("add", {mesg:true})
    //                 }
    //             });              
    //         }
    //     }
    // })
})

// app.get("/searchstudent", (req, res)=>{
//     // res.send(req.body)
//     const {phone}=req.query;
//     let qry="select * from test where phoneno=?";
//     mysql.query(qry, [phone], (err, results)=>{
//         if(err) throw err
//         else{
//             if(results.length>0){
//                 res.render("search", {mesg1:true, mesg2:false})
//             }
//             else{
//                 res.render("search", {mesg1:false, mesg2:true})
//             }
//         }
//     })

// })

app.post("/showresults", (req, res)=>{
    var rollnumber = req.body.rollnumber;
    var dob = req.body.dob;
    // const {rollnumber, dob}=req.query;
    let qry=`select * from students where rollnumber='${rollnumber}' and dob='${dob}'`;
    mysql.query(qry, (err, results)=>{
        if(err) throw err;
        else{
            if(results.length>0){
                res.render('showresults', {item:results[0]})
            }
            else{
                res.render("studentview", {mesg1:true})
            }
        }
        console.log(results);
    })

})

app.get("/removestudent/:id", (req, res)=>{
    // const {id}=req.query;
    var id=req.params.id;
    let qry="delete from students where id=?";
    mysql.query(qry, [id], (err, results)=>{
        if(err) throw err;
        console.log(results.affectedRows + " record(s) updated");
    })
    res.redirect('/teacherview')
})

app.get("/editresults/:id", (req, res)=>{
    // const {id}=req.query;
    var userId=req.params.id;
    let qry=`select * from students where id=${userId}`;
    mysql.query(qry, (err, results)=>{
        if(err) throw err;
        res.render('editresults', {data: results[0]})
        console.log(results.affectedRows + " record(s) updated");
    })
})

app.post("/updateresults/:id", (req, res)=>{
    // const {id}=req.query;
    var id=req.params.id;
    var updatedData=req.body;
    let qry=`update students set ? where id=?`;
    mysql.query(qry,[updatedData, id], (err, results)=>{
        if(err) throw err
        console.log(results.affectedRows + " record(s) updated");
    })
    res.redirect('/teacherview')
})

// create Server
app.listen(port, (err)=>{
    if(err)
        throw err
    else
        console.log("server is running at port %d:", port);
});