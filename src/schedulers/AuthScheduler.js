const {CronJob} = require('cron'),
    AuthService = require('../services/AuthService'),
    authService = new AuthService()

 
new CronJob('0 * * * * *', function() {

    var tokens = authService.get_tokens()
    for (const token_index in tokens) {
        tokens[token_index].expiration -= 1
        if (tokens[token_index].expiration <= 0) {
            tokens.splice(token_index, 1)
        }
    }
    console.table( tokens )

}, null, true);



