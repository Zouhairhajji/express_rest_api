var express = require('express');
var router = express.Router();

var AuthService = require('../services/AuthService')
var authService = new AuthService();


router.get('/register_token', function(req, res, next) {
  let email = req.query.email
  let password = req.query.password
  let ip = req.connection.remoteAddress

  authService.get_roles_by_email(req.query.email)
    .then((data) => {
        if (data.rows.length > 0) {
          var uuid_code = authService.register_endpoint(req.query.email, data.rows, ip)
          res.json({
            token: uuid_code
          })
        }else{
          res.json({
            token: null
          })
        }
    }).catch(next)
});



router.get('/user_has_role', (req, res, next) => {
  let email = req.query.email
  let role = req.query.role
  
  authService.has_role_by_email(email, role)
    .then((result) => {
       res.json({
         result : result
       });
    })
    .catch( e => res.status(400).json())
})



router.get('/get_tokens', (req, res, next) => {
   res.json(authService.get_tokens());
})



router.get('/authentificate_user', function(req, res, next) {
  let email = req.query.email
  let password = req.query.password

  authService.get_user_by_email('admin@admin.fr')
    .then((data) => {
       console.info( data )
    })
})

 

module.exports = router;