module.exports = function (app, passport, db) {

  // normal routes ===============================================================

  // show the home page (will also have our login links)
  app.get('/', function (req, res) {
    res.render('index.ejs');
  });

  // PROFILE SECTION =========================
  app.get('/profile', isLoggedIn, function (req, res) {
    db.collection('messages').find().toArray((err, result) => {
      if (err) return console.log(err)
      res.render('profile.ejs', {
        user: req.user,
        messages: result
      })
    })
  });

  // cuisine====================================
  app.get('/cuisine/:cuisine', isLoggedIn, function (req, res) {
    db.collection('community').find().toArray((err, result) => {
      if (err) return console.log(err)
      res.render('cuisine.ejs', {
        user: req.user,
        community: result,
        cuisine: req.params.cuisine
      })
    })
  });

  app.get('/recipies/:cuisine', isLoggedIn, function (req, res) {
    const url = `https://api.edamam.com/api/recipes/v2?type=public&app_id=95126682&app_key=0f2861679f02814dff4dbfb672f5b302&cuisineType=${req.params.cuisine}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log(data)
        res.send(data)
      })

  });

  // Japan PAGE==============================
  // app.get('/japan', isLoggedIn, function (req, res) {
  //   db.collection('community').find().toArray((err, result) => {
  //     if (err) return console.log(err)
  //     res.render('japan.ejs', {
  //       user: req.user,
  //       community: result
  //     })
  //   })
  // });

  // app.post('/japan', (req, res) => {
  //   db.collection('messages2').save({ name: req.body.name, msg: req.body.msg, thumbUp: 0, thumbDown: 0 }, (err, result) => {
  //     if (err) return console.log(err)
  //     console.log('saved to database')
  //     res.redirect('/japan')
  //   })
  // })

  // //===================United States==============================
  // app.get('/unitedstates', isLoggedIn, function (req, res) {
  //   db.collection('community').find().toArray((err, result) => {
  //     if (err) return console.log(err)
  //     res.render('unitedstates.ejs', {
  //       user: req.user,
  //       community: result
  //     })
  //   })
  // });

  // app.post('/unitedstates', (req, res) => {
  //   db.collection('messages2').save({ name: req.body.name, msg: req.body.msg, thumbUp: 0, thumbDown: 0 }, (err, result) => {
  //     if (err) return console.log(err)
  //     console.log('saved to database')
  //     res.redirect('/unitedstates')
  //   })
  // })

  // LOGOUT ==============================
  app.get('/logout', function (req, res) {
    req.logout(() => {
      console.log('User has logged out!')
    });
    res.redirect('/');
  });

  // message board routes ===============================================================

  app.post('/messages', (req, res) => {
    db.collection('messages').save({ name: req.body.name, msg: req.body.msg, thumbUp: 0, thumbDown: 0 }, (err, result) => {
      if (err) return console.log(err)
      console.log('saved to database')
      // res.redirect('/profile')
    })
  })



  app.delete('/messages', (req, res) => {
    db.collection('messages').findOneAndDelete({ name: req.body.name, msg: req.body.msg }, (err, result) => {
      if (err) return res.send(500, err)
      res.send('Message deleted!')
    })
  })

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get('/login', function (req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // SIGNUP =================================
  // show the signup form
  app.get('/signup', function (req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get('/unlink/local', isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect('/profile');
    });
  });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}
