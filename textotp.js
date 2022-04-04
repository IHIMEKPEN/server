const Vonage = require('@vonage/server-sdk')

const vonage = new Vonage({
  apiKey: "858a604b",
  apiSecret: "pH3zl01yocjMy8uC"
})

const from = "Dredgreat Groups"
// const to = "+2348164237819"
const text = 'Sign up was successfull at Dredgreat Management'

module.exports = {
    text: function (to) {
       return vonage.verify.request({
        number: to,
        brand: from
      }, (err, result) => {
        if (err) {
          console.error(err);
        } else {
          const verifyRequestId = result.request_id;
          console.log('request_id', verifyRequestId);
          
        }
      });
    },

};
