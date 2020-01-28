"use strict";

const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const util = require("util");
const writeFileAsync = util.promisify(fs.writeFile);
let actualName;
let userImg;
let userBio;
let userFollowers;
let useFollowing;
let userRepos;
let pickedColor;

inquirer
  .prompt([
    {
      message: "Enter your GitHub username:",
      name: "username"
    },
    {
      message: "Enter a color:",
      name: "color"
    }
  ])
  .then(({ username }) => {
    const queryUrl = `https://api.github.com/users/${username}`;

    axios
      .get(queryUrl)
      .then(response => {
        console.log(response.data);
        actualName = response.data.name;
        // console.log(actualName);
        userImg = response.data.avatar_url;
        // console.log(userImg);
        userBio = response.data.bio;
        // console.log(userBio);
        userFollowers = response.data.followers;
        // console.log(userFollowers);
        useFollowing = response.data.following;
        // console.log(useFollowing);
        userRepos = response.data.public_repos;
        // console.log(userRepos);
      })
      // .then(({ color }) => {
      //   pickedColor = color;
      // })
      .then(function(response) {
        const htmlVar = `<!DOCTYPE html>
         <html lang="en">
           <head>
             <meta charset="UTF-8" />
             <meta http-equiv="X-UA-Compatible" content="ie=edge" />
             <link
               rel="stylesheet"
               href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
             />
             <title>Github Discovery</title>
           </head>
           <body>
               <div class="container text-center">
                   <div class="row">
                       <div class="col-md-12">
                         <div class="card" style="background-color:">
                           <div class="card-body">
                             <img src="${userImg}" height="250px" width="250px" class="img-responsive img-circle" style="border: solid; border-radius: 50%;">
                             <h2>My name is ${actualName}</h2>
                             <h2>This is my GitHub Overview.</h2>
                             <p>${userBio}</p>
                           </div>
                         </div>
                       </div>
                   </div>
               </div>
             <div class="container text-center">
               <div class="row" style="padding-top: 70px;">
                 <div class="col-md-6">
                   <div class="card">
                     <div class="card-body">
                       <h3 class="card-title">Followers</h3>
                       <h4 class="card-text">${userFollowers}</h4>
                     </div>
                   </div>
                 </div>
                 <div class="col-md-6">
                   <div class="card">
                     <div class="card-body">
                       <h3 class="card-title">Following</h3>
                       <h4 class="card-text">${useFollowing}</h4>
                     </div>
                   </div>
                 </div>
               </div>
               <div class="row" style="padding-top: 20px;">
                   <div class="col-md-6">
                     <div class="card">
                       <div class="card-body">
                         <h3 class="card-title">Public Repos</h3>
                         <h4 class="card-text">${userRepos}</h4>
                       </div>
                     </div>
                   </div>
                   <div class="col-md-6">
                     <div class="card">
                       <div class="card-body">
                         <h3 class="card-title">Github Stars</h3>
                         <h4 class="card-text"></h4>
                       </div>
                     </div>
                   </div>
                 </div>
             </div>
           </body>
         </html>`;
        writeFileAsync("index.html", htmlVar, function(err) {
          if (err) {
            return console.error(err);
          }
          console.log("Discovered User Infos!");
        });
      });
  });
