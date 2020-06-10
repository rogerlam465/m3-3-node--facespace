'use strict';

const express = require('express');
const morgan = require('morgan');

const { users } = require('./data/users');

let currentUser = {};

// declare the 404 function
const handleFourOhFour = (req, res) => {
  res.status(404).send("I couldn't find what you're looking for.");
};

const handleHomepage = (req, res) => {
  res.status(200).render('pages/homepage', { users: users, currentUser: currentUser });;
}

const handleProfilePage = (req, res) => {

  // find - much more concise.
  // check every value; if the logic check is truthy
  // return the whole array item that passed the logic check

  let userData = users.find(user => {
    return user._id === req.params._id;
  });

  let friends = [];

  userData.friends.forEach(friendNum => {
    users.forEach(entry => {
      if (entry._id === friendNum) {
        friends.push(entry);
      }
    })
  })

  res.status(200).render('pages/profile', { user: userData, friends: friends });
}

const handleSignin = (req, res) => {
  res.render('pages/signin');
}

const handleName = (req, res) => {
  let firstName = req.query.firstName;
  let thisUser = users.find(user => {
    return user.name === firstName;
  });
  if (thisUser) {
    currentUser = thisUser;
    res.status(200).redirect('/users/' + thisUser._id);
  } else {
    res.status(404).redirect('/signin');
  }
}

// -----------------------------------------------------
// server endpoints
express()
  .use(morgan('dev'))
  .use(express.static('public'))
  .use(express.urlencoded({ extended: false }))
  .set('view engine', 'ejs')

  // endpoints

  .get('/', handleHomepage)

  .get('/users/:_id', handleProfilePage)

  .get('/signin', handleSignin)

  .get('/getname', handleName)

  // a catchall endpoint that will send the 404 message.
  .get('*', handleFourOhFour)

  .listen(8000, () => console.log('Listening on port 8000'));
