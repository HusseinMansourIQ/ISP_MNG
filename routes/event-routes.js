const express = require("express")
const router = express.Router()
const User_E = require('../models/User_E')
const User_deb = require('../models/user_debs')
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
        
        let newEvent = new Event({
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

    Event.findOne({_id: req.params.id}, (err,event)=> {
        
        if(!err) {
       
         res.render('event/edit', {
             event: event,
             eventDate: moment(event.date).format('YYYY-MM-DD'),
             errors: req.flash('errors'),
             message: req.flash('info')
         })
 
        } else {
            console.log(err)
        }
     
     })

})

// update the form

router.post('/update',[
    check('title').isLength({min: 5}).withMessage('Title should be more than 5 char'),
    check('description').isLength({min: 5}).withMessage('Description should be more than 5 char'),
    check('location').isLength({min: 3}).withMessage('Location should be more than 5 char'),
    check('date').isLength({min: 5}).withMessage('Date should valid Date'),

], isAuthenticated,(req,res)=> {
    
    const errors = validationResult(req)
    if( !errors.isEmpty()) {
       
        req.flash('errors',errors.array())
        res.redirect('/events/edit/' + req.body.id)
    } else {
       // crete obj
       let newfeilds = {
           title: req.body.title,
           description: req.body.description,
           location: req.body.location,
           date: req.body.date
       }
       let query = {_id: req.body.id}

       Event.updateOne(query, newfeilds, (err)=> {
           if(!err) {
               req.flash('info', " The event was updated successfuly"),
               res.redirect('/events/edit/' + req.body.id)
           } else {
               console.log(err)
           }
       })
    }
   
})

//delete event

router.delete('/delete/:id',isAuthenticated, (req,res)=> {

    let query = {_id: req.params.id}

    Event.deleteOne(query, (err)=> {

        if(!err) {
            res.status(200).json('deleted')
        } else {
            res.status(404).json('There was an error .event was not deleted')
        }
    })
})
// save amount to db
router.post('/sub',isAuthenticated, (req,res)=> {


        let new_deb = new User_deb({
            userEname: req.body.userEname,
            user_name: req.body.user_name,
            left_deb: req.body.left_deb,
            am_paid: req.body.am_paid,
            note:req.body.note,
            created_at: Date.now()
        })

    new_deb.save( (err)=> {
            if(!err) {
                console.log('deb was added')
                req.flash('info', ' The event was created successfuly')
                res.redirect('/events/home')
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
                res.redirect('/events/home')
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

module.exports = router 