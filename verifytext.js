let REQUEST_ID = ''
let CODE = ''

vonage.verify.check({
    request_id: REQUEST_ID,
    code: CODE
}, (err, result) => {
    if (err) {
        console.error(err);
    } else {
        console.log(result);
    }
});