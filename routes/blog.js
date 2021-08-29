var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
const db = require('monk')('localhost:27017/TutorialDB')


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render("blog")
});

router.get('/add', function(req, res, next) {
  res.render("addblog")
});

router.post('/add',[
  check("name","กรุณาป้อนชื่อบทความ").not().isEmpty(),
  check("description","กรุณาป้อนเนื้อหา").not().isEmpty(),
  check("arthor","กรุณาป้อนชื่อผู้แต่ง").not().isEmpty(),
], function(req, res, next) {
  const result = validationResult(req);
  var errors = result.errors;
  if (!result.isEmpty()) {
    //return res.status(400).json({ errors: errors.array() });
    res.render('addblog',{ errors:errors })
  }else{
    //insert to db
    var ct = db.get('blogs')
    ct.insert({
      name: req.body.name,
      description: req.body.description,
      arthor: req.body.arthor,
    },function(err,blogs){
      if(err){
        res.send(err)
      }else{
        req.flash("success", "บันทึกบทความเรียบร้อย");
        res.location('/blog/add')
        res.redirect('/blog/add')
      }
    })
  }
});

  module.exports = router;