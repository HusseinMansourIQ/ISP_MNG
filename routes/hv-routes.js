const express = require("express")
const router = express.Router()

//mario
router.get('/mario', (req,res)=> {
    res.render('../HaveFun/hv.ejs', {
        error: req.flash('error')
    })
})

module.exports = router