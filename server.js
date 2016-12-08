var bodyParser  = require('body-parser'),
    mongoose    = require('mongoose'),
    express     = require('express'),
    path        = require('path'),
    app         = express();

app.use(bodyParser.urlencoded({extended: true}));

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

// Mongoose
mongoose.connect('mongodb://localhost/friends_demo');
mongoose.connection.on('connected', function() {
    console.log('Mongoose connection succesful.');
})

var FriendSchema = mongoose.Schema({
    name: {type: String, required: true},
    age: {type: Number, required: true}
}, {timestamps: true});

mongoose.model('Friend', FriendSchema);
var Friend = mongoose.model('Friend');

// Routes
app.get('/', function(req, res) {
    Friend.find({}, function(err, data) {
        if (err) {
            console.log('Error:', err);
            res.send(500);
            res.end();
        } else {
            res.render('index', {friends: data});
        }
    })
})
app.get('/new', function(req, res) {
    res.render('new');
})
app.get('/edit/:id', function(req, res) {
    console.log('Req.params:', req.params);
    Friend.findOne({_id: req.params.id}, function(err, data) {
        if (err) {
            console.log('Error:', err);
            res.redirect('/');
        } else {
            console.log('Edit:', data);
            res.render('edit', {friend: data});
        }
    })
})
app.get('/friends', function(req, res) {
    Friend.find({}, function(err, data) {
        if (err) {
            console.log('Error:', err);
            res.send(500);
            res.end();
        } else {
            res.json({success: true, data: data});
        }
    })
})

//res.send()
//res.render()

//res.redirect();
//res.json();

app.post('/friends', function(req, res) {
    var friend = new Friend({name: req.body.name, age: req.body.age});
    friend.save(function(err, data) {
        if (err) {
            console.log(err);
            res.json(err);
            // Friend.find({}, function(error, datum) {
            //     if (err) {
            //         console.log(err.errors);
            //         res.render('index', {friends: datum, errors: err});
            //     } else {
            //         console.log(err.errors);
            //         console.log(err.errors.name);
            //         res.render('index', {friends: datum, errors: err});
            //     }
            // })
        } else {
            res.redirect('/');
        }
    })
})

app.post('/update/:id', function(req, res) {
    Friend.findOne({_id: req.params.id}, function(err, data) {
        if (err) {
            console.log("Error.", err)
            res.redirect('/edit/'+req.params.id);
        } else {
            for (var i in req.body) {
                if (data[i] && data[i] != req.body[i]) {
                    data[i] = req.body[i];
                }
            }
            data.save(function(err, data) {
                if (err) {
                    res.redirect('/edit/'+req.params.id);
                } else {
                    res.redirect('/');
                }
            })
        }
    })
})

app.post('/destroy/:id', function(req, res) {
    Friend.findOne({_id: req.params.id}, function(err, data) {
        if (err) {
            console.log("Error.", err)
            res.redirect('/');
        } else {
            Friend.remove({_id: req.params.id}, function(err) {
                if (err) {
                    console.log("Error.", err)
                    res.redirect('/'); 
                } else {
                    res.redirect('/');
                }
            })
        }
    })
})


app.listen(8000, function() {
    console.log('Mongoose DEMO on port 8000');
})