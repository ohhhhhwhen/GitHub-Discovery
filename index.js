"use strict";

const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const util = require("util");
const colors = require("./colors");
const writeFileAsync = util.promisify(fs.writeFile);
let actualName;
let userImg;
let userBio;
let userFollowers;
let useFollowing;
let userRepos;
let userStars;
let userLocation;
let locationLink;

inquirer
  .prompt([
    {
      type: "input",
      message: "Enter your GitHub username:",
      name: "username"
    },
    {
      type: "list",
      message: "Enter a color:",
      name: "color",
      choices: [
        "red",
        "orange",
        "yellow",
        "green",
        "blue",
        "purple",
        "pink",
        "black",
        "grey"
      ]
    }
  ])
  .then(({ username, color }) => {
    const gitUrl = `https://api.github.com/users/${username}`;

    const starUrl = `https://api.github.com/users/${username}/starred`;

    axios.get(starUrl).then(response => {
      userStars = response.data.length;
    });

    axios
      .get(gitUrl)
      .then(response => {
        actualName = response.data.name;
        userImg = response.data.avatar_url;
        userBio = response.data.bio;
        userLocation = response.data.location;
        locationLink = `https://www.google.com/maps/place/${userLocation}`;
        userFollowers = response.data.followers;
        useFollowing = response.data.following;
        userRepos = response.data.public_repos;
      })
      .then(function() {
        makeHTML(
          actualName,
          userImg,
          userBio,
          userLocation,
          userFollowers,
          useFollowing,
          userRepos,
          userStars,
          color
        );
        writeFileAsync(
          "index.html",
          makeHTML(
            actualName,
            userImg,
            userBio,
            userLocation,
            userFollowers,
            useFollowing,
            userRepos,
            userStars,
            color,
            locationLink
          ),
          function(err) {
            if (err) {
              return console.error(err);
            } 
            else {
              return console.log("Discovered User Infos!");
            }
          }
        );
      });
  });
function makeHTML(
  actualName,
  userImg,
  userBio,
  userLocation,
  userFollowers,
  useFollowing,
  userRepos,
  userStars,
  color,
  locationLink
) {
  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
        />
        <title>Github Discovery</title>
        <style>
        body{
          background-color: ${colors[color].bodyBackground};
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
        a:hover{
          opacity: 60%;
        }
        </style>
      </head>
      <body>
          <div class="container text-center">
              <div class="row">
                  <div class="col-md-12">
                    <div class="card" style="border: solid; border-color:${colors[color].borderColor}; color:${colors[color].textColor};">
                      <div class="card-body" style="color:${colors[color].textColor}; background-color:${colors[color].cardBackground};">
                        <img src="${userImg}" height="250px" width="250px" class="img-responsive img-circle" style="border: solid; border-radius: 50%; border-color:${colors[color].borderColor}">
                        <h2>My name is ${actualName}</h2>
                        <h2>This is my GitHub Overview.</h2>
                        <a style="font-size: 32px; color: ${colors[color].textColor}; text-decoration: none;" href="${locationLink}" target="_blank">${userLocation}</a>
                        <p>${userBio}</p>
                      </div>
                    </div>
                  </div>
              </div>
          </div>
        <div class="container text-center">
          <div class="row" style="padding-top: 70px;">
            <div class="col-md-6">
              <div class="card" style="border: solid; border-color:${colors[color].borderColor}; color:${colors[color].textColor};">
                <div class="card-body" style="color:${colors[color].textColor}; background-color:${colors[color].cardBackground};">
                  <h3 class="card-title">Followers</h3>
                  <h4 class="card-text">${userFollowers}</h4>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="card" style="border: solid; border-color:${colors[color].borderColor}; color:${colors[color].textColor};">
                <div class="card-body" style="color:${colors[color].textColor}; background-color:${colors[color].cardBackground};">
                  <h3 class="card-title">Following</h3>
                  <h4 class="card-text">${useFollowing}</h4>
                </div>
              </div>
            </div>
          </div>
          <div class="row" style="padding-top: 20px;">
              <div class="col-md-6">
                <div class="card" style="border: solid; border-color:${colors[color].borderColor}; color:${colors[color].textColor};">
                  <div class="card-body" style="color:${colors[color].textColor}; background-color:${colors[color].cardBackground};">
                    <h3 class="card-title">Public Repos</h3>
                    <h4 class="card-text">${userRepos}</h4>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="card" style="border: solid; border-color:${colors[color].borderColor}; color:${colors[color].textColor};">
                  <div class="card-body" style="color:${colors[color].textColor}; background-color:${colors[color].cardBackground};">
                    <h3 class="card-title">Github Stars</h3>
                    <h4 class="card-text">${userStars}</h4>
                  </div>
                </div>
              </div>
            </div>
        </div>
        <script
        type="text/javascript"
        src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"
      ></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
      </body>
    </html>`;
}
