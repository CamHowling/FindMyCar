//this is the api server that connects to your database
//you want it to process json requests and return json responses

//add requires as needed
//you will want that body parse thing


app.get('/car-space/:id', function (req, res) {
    //read json from req store in variable called user
    //user = db.get(req.body)
    //handle errors and send as respose if error occurs
    //marshal user to json and send as res body
});

app.get('/car-space', function (req, res) {
    //read json from req store in variable called user
    //user = db.get(req.body)
    //handle errors and send as respose if error occurs
    //marshal user to json and send as res body
});

app.post('/user', function (req, res) {
    //read json from req store in variable called user
    //user = db.get(req.body) => pseudocode, this wont actually work lol
    //handle errors and send as respose if error occurs
    //marshal user to json and send as res body
});

app.delete('/user/:id', function (req, res) {
    //read json from req store in variable called user
    //user = db.getUser(req.params['id']) => pseudocode, this wont actually work lol
    //handle errors and send as respose if error occurs
    //marshal user to json and send as res body

});

app.get('/user/:id', function (req, res) {

});

app.get('/user', function (req, res) {

});

app.put('/user/:id', function (req, res) {

});
