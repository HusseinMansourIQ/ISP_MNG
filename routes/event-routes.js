const express = require("express")
const router = express.Router()
const User_E = require('../models/User_E')
const User_deb = require('../models/user_debs')
const Mng = require('../models/Mng')
const { check, validationResult } = require('express-validator/check')
const moment = require('moment');
moment().format();

// middleware to check if user is loogged in

isAuthenticated = (req,res,next) => {
    if (req.isAuthenticated()) return next()
    res.redirect('/users/login')
}

//create new events

router.get('/create',isAuthenticated, (req,res)=> {
   
    res.render('event/create', {
        errors: req.flash('errors')
    })
})
// route to home events
router.get('/',isAuthenticated, (req,res)=> {
    User_E.find({}, (err,users)=> {

                 //res.json(chunk)
                  res.render('event/index', {
                      users : users,
                      message: req.flash('info'),

                  })
             })
    })

  


// save user to db

router.post('/create', [
    check('userEname').isLength({min: 2}).withMessage('Title should be more than 5 char'),
    check('user_name').isLength({min: 2}).withMessage('Description should be more than 5 char'),
    check('user_deb').isLength({min: 2}).withMessage('Location should be more than 5 char'),
    check('user_note').isLength({min: 2}).withMessage('Date should valid Date'),

] , (req,res)=> {

    const errors = validationResult(req)

    if( !errors.isEmpty()) {
        
        req.flash('errors',errors.array())
        res.redirect('/events/create')
    } else {
        
        let newEvent = new User_E({
            userEname: req.body.userEname,
            user_name: req.body.user_name,
            user_deb: req.body.user_deb,
            user_note: req.body.user_note,
            created_at: Date.now()
        })

        newEvent.save( (err)=> {
            if(!err) {
                console.log('event was added')
                req.flash('info', ' The event was created successfuly')
                res.redirect('/events')
            } else {
                console.log(err)
            } 
        })
    }
   
})

// show single event
router.get('/show/:id', isAuthenticated, (req,res)=> {
    User_E.findOne({_id: req.params.id}, (err,user)=> {
        
       if(!err) {
           
        res.render('event/show', {
            user: user
        })

       } else {
           console.log(err)
       }
    
    })
 
})

// edit route

router.get('/edit/:id', isAuthenticated,(req,res)=> {

    User_E.findOne({_id: req.params.id}, (err,user)=> {
        
        if(!err) {
       
         res.render('event/edit', {
             user:user,
             errors: req.flash('errors'),
             message: req.flash('info')
         })
 
        } else {
            console.log(err)
        }
     
     })

})

// update the form

router.post('/update', isAuthenticated,(req,res)=> {
    

       // crete obj
       let newfeilds = {
           userEname: req.body.userEname,
           user_name: req.body.user_name,
           user_note: req.body.user_note
       }
       let query = {_id: req.body.id}

       User_E.updateOne(query, newfeilds, (err)=> {
           if(!err) {
               req.flash('info', " The event was updated successfuly"),
               res.redirect('/events/edit/' + req.body.id)
           } else {
               console.log(err)
           }
       })

   
})

//delete event

router.delete('/delete/:id',isAuthenticated, (req,res)=> {

    let query = {_id: req.params.id}

    User_E.deleteOne(query, (err)=> {

        if(!err) {
            res.status(200).json('deleted')
        } else {
            res.status(404).json('There was an error .event was not deleted')
        }
    })
})
// save amount to db
router.post('/sub',isAuthenticated, (req,res)=> {
    var amtype
    var left_deb_check = req.body.left_deb_check
    var left_deb = req.body.left_deb

    if(parseInt (left_deb_check) > parseInt (left_deb) ){
        amtype="تسديد"
    }
    if(parseInt(left_deb) > parseInt (left_deb_check) ) {
        console.log(left_deb.dataType)
        console.log(left_deb_check.dataType)
        amtype = "اضافة"
    }

        let new_deb = new User_deb({
            userEname: req.body.userEname,
            user_name: req.body.user_name,
            left_deb: req.body.left_deb,
            am_paid: req.body.am_paid,
            am_type:amtype,
            note:req.body.note,
            created_at: Date.now(),
            mng:req.user.email
        })

    new_deb.save( (err)=> {
            if(!err) {
                console.log('deb was added')
                req.flash('info', ' The event was created successfuly')

            } else {
                console.log(err)
            }
        })
    let newfeilds = {
        user_deb: req.body.left_deb

    }
    let query = {_id: req.body.user_id}

    User_E.updateOne(query, newfeilds, (err)=> {
        if(!err) {
            req.flash('info', " The event was updated successfuly"),
                res.redirect('/events')
        } else {
            console.log(err)
        }
    })
    })

router.get('/user_debs',isAuthenticated, (req,res)=> {
    User_deb.find({}, (err,debs)=> {
        //res.json(chunk)
        res.render('event/am_paid_list', {
            debs : debs,
            message: req.flash('info'),

        })
    })




})
//show single deb
router.get('/showdeb/:id', isAuthenticated, (req,res)=> {
    User_deb.findOne({_id: req.params.id}, (err,user)=> {


        if(!err) {

            res.render('event/deb_show', {
                user: user,
            })

        } else {
            console.log(err)
        }

    })

})

module.exports = router 