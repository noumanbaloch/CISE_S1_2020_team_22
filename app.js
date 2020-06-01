//import modules
const express = require('express');
const bodyParser = require('body-parser');
const searchRouter = require('./routers/articleRouter');
const submitRouter = require('./routers/userRouter');
const frontendRouter = require('./routers/frontendRouter');
const moderatorSchema = require('./models/moderatorModels');
const app = express();

//This body parser is use to get the values from body request of submit and article form page and make a post call.
var urlencodedParser = bodyParser.urlencoded({ extended: true });

//middlewares
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// app.get('/', (rep, res) => {
//   res.status(200).json({
//     message: 'Hello',
//   });
// });

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//Post request to submit article
app.post('/api/v1/article/moderator', urlencodedParser, function(req, res, next){
  //Post request for an article.
  //Condition run if this is article.
  if(req.body.choice == "isArticle"){
    //This post object is created which store the request body from article page in object.
    var post = new moderatorSchema({
      //Here body request contain the input data of user and give it to title and detail properties.
      title: req.body.title,
      //Concatenation of user input
      detail: req.body.author + '. (' + req.body.year + '). ' + req.body.title + '. ' + req.body.journel + ', ' + req.body.volume + ', ' + req.body.startPage + '-' + req.body.endPage + '. ' + req.body.DOI + '.',
    })
    //save method save the data into API end point of /api/v1/article/moderator
    post.save(function (err, post) {
      //In case error occur
      if (err) { return next(err) }
      //After successful submission user will be redirected to submit book page.
      res.redirect('/submit-article');
    })
  }
  //Post request for a book.
  //Condition run if this is book.
  if(req.body.choice == "isBook"){
    //This post object is created which store the request body from book page in object.
    var post = new moderatorSchema({
      //Here body request contain the input data of user and give it to title and detail properties.
      title: req.body.title,
      //Concatenation of user input
      detail: req.body.author + '. (' + req.body.year + '). ' + req.body.title + '. ' + req.body.place + ': ' + req.body.name +'.',
    })
    //save method save the data into API end point of /api/v1/article/moderator
    post.save(function (err, post) {
      //In case error occur
      if (err) { return next(err) }
      //After successful submission user will be redirected to submit book page.
      res.redirect('/submit-book');
    })
  }
});

app.use('/api/v1/article', searchRouter);
app.use('/api/v1/user', submitRouter);
app.use('/', frontendRouter);

module.exports = app;
