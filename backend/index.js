const Express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const BCRYPT_SALT_ROUNDS = 10;
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const fs = require("fs");
const readline = require("readline");
// const api_key = "da5ed9adab24bc28615308d12323e418";

const CONNECTION_URL =
  "mongodb+srv://MovieAdmin:Mmv4fDNtWrYjj1ge@movieuserscluster-bhnog.gcp.mongodb.net/users";
const DATABASE_NAME = "users";
const SCOPES = ["https://mail.google.com/"];
const TOKEN_PATH = "token.json";

fs.readFile("credentials.json", (err, content) => {
  if (err) return console.log("Error loading client secret file: ", err);
  authorize(JSON.parse(content), listLabels);
});

function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES
  });
  console.log("Authorize this app by visiting this url: ", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question("Enter the code from that page here: ", code => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error("Error retrieving access token ", err);
      oAuth2Client.setCredentials(token);
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
        if (err) return console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

function listLabels(auth) {
  const gmail = google.gmail({ version: "v1", auth });
  gmail.users.labels.list(
    {
      userId: "me"
    },
    (err, res) => {
      if (err) return console.log("The API returned an error: ", err);
      const labels = res.data.labels;
      if (labels.length) {
        console.log("Labels:");
        labels.forEach(label => {
          console.log(`- ${label.name}`);
        });
      } else {
        console.log("No labels found");
      }
    }
  );
}

var app = Express().use(cors());

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

var database, users, movieInfo;

app.get("/users", (req, res) => {
  users.find({}).toArray((err, result) => {
    if (err) return res.status(500).send(err);
    res.send(result);
  });
});

app.get("/user/:id", (req, res) => {
  console.log("user");
  console.log(req.params.id);
  users.findOne({ _id: new ObjectId(req.params.id) }, (err, user) => {
    if (err) return res.status(500).send(err);
    res.send(user);
  });
});

app.post("/login", BodyParser.json(), (req, res) => {
  users.findOne({ email: req.body.email }, (err, user) => {
    if (!user)
      return res
        .status(401)
        .send({ msg: "email not registered to this service" });
    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if (err) {
        console.error(err);
      }
      if (result) {
        const jwtBearerToken = jwt.sign(JSON.stringify(user), "secret", {
          algorithm: "HS256"
        });
        res.cookie("SESSIONID", jwtBearerToken, {
          httpOnly: true,
          secure: true
        });
        res.json({ success: true, token: jwtBearerToken, expiresIn: 240 }); //res.status(200).send({msg: 'Just sign me in already'});
      } else {
        return res
          .status(401)
          .send({ msg: "Invalid email/password combanation" });
      }
    });
  });
});

app.post("/addUser", BodyParser.json(), (req, res) => {
  bcrypt
    .hash(req.body.password, BCRYPT_SALT_ROUNDS)
    .then(hashedPassword => {
      let user = req.body;
      user.password = hashedPassword;
      console.log(user);
      users.insertOne(user, (err, r) => {
        if (err) throw err;
        console.log(`inserted`);
        console.log(req.body);
      });
    })
    .then(() => {
      res.send();
    })
    .catch(error => {
      console.log("Error: ");
      console.log(error);
      next();
    });
});

app.put("/updateUser/:id", BodyParser.json(), (req, res) => {
  users.findOne({ _id: new ObjectId(req.params.id) }, (err, user) => {
    if (err) return res.status(500).send(err);
    if (!user)
      return res
        .status(401)
        .send({ msg: "email not registered to this service" });
    console.log("found one");
    console.log(user);
    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if (err) console.error(err);
      console.log("in compare");
      console.log(result);
      if (!result) {
        bcrypt
          .hash(req.body.password, BCRYPT_SALT_ROUNDS)
          .then(hashedPassword => {
            users.updateOne(
              { _id: new ObjectId(req.params.id) },
              { $set: { password: hashedPassword } },
              (err, quest) => {
                if (err) res.send("error updating in update user");
              }
            );
          });
      }
    });
  });
  console.log(req.body);
  users.updateOne(
    { _id: new ObjectId(req.params.id) },
    {
      $set: {
        fname: req.body.fname,
        lname: req.body.lname,
        street: req.body.street,
        city: req.body.city,
        state: req.body.state,
        zip_code: req.body.zip_code,
        email: req.body.email,
        phone: req.body.phone,
        username: req.body.username
      }
    },
    (err, junk) => {
      console.log("heowow");
      if (err) {
        console.log("err");
        console.log(err);
        res.send("error updating review");
      }
      users.findOne({ _id: new ObjectId(req.params.id) }, (err, user) => {
        const jwtBearerToken = jwt.sign(JSON.stringify(user), "secret", {
          algorithm: "HS256"
        });
        res.cookie("SESSIONID", jwtBearerToken, {
          httpOnly: true,
          secure: true
        });
        res.json({ success: true, token: jwtBearerToken, expiresIn: 240 });
      });
    }
  );
});

app.put("/updateAdminStatus/:userId", (req, res) => {
  users.updateOne(
    { _id: new ObjectId(req.params.userId) },
    { $set: { admin: req.body.admin } },
    (err, obj) => {
      if (err) {
        console.log("err");
        res.send("error updating");
      }
    }
  );
});

app.put("/updateUsername/:userid", (req, res) => {
  movieInfo.updateMany(
    { userId: req.params.userid },
    { $set: { userName: req.body.username } },
    (err, updatedReview) => {
      if (err) {
        console.log("err");
        console.log(err);
        res.send("error updating review");
      } else {
        res.send(JSON.stringify(updatedReview));
      }
    }
  );
});

app.post("/forgotPassword/:email", BodyParser.json(), (req, res) => {
  console.log(req.body);
  console.log(req.params);
  users.findOne({ email: req.params.email }, async (err, user) => {
    if (!user) {
      return res.status(401).send("No user with that email");
    }
    console.log(user);
    let token = 4;
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "jbjabzin@gmail.com",
        clientId:
          "1005674630723-m7t9uvfti7lus5aqt0fvf1qgi9t95s8o.apps.googleusercontent.com",
        clientSecret: "WXtLg_JL4B18gB7GgmyaCpwV",
        refreshToken:
          "1//04f3RKi0dPW_QCgYIARAAGAQSNwF-L9IrHWomIF1mvvvdCmT4Z7k3lcsTbX7luSa_ogO1q9jQqNLl6kcLU4mrYkHNEKRYR4p4OMM",
        accessToken:
          "ya29.Il-_Bz9qaSo-Frximlr9IHHbQgmVgxtWphIJvQPrWuzByhMUwV2RTkcEw6hqti0GG8rTw4g7JMYSM04u76CVb2LY1aFN1mYVFFPcQsjfe9nDww0yM4WMVmMzXyd0XM-yZA",
        expires: 1484314697598
      }
    });
    let info = await transporter.sendMail({
      from: '"FullStackMovie" <jbjabzin@gmail.com>',
      to: user.email,
      subject: "reset your password",
      text: "reset password",
      html: `<h3>Reset Password</h3><p>To reset your password; link</p><a href='http://localhost:4200/reset/${user._id}/${token}'>reset password</a><br/><h3>Movie team!</h3>`
    });
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  });
});

app.post("/LOCKOUT/:email", (req, res) => {
  console.log(req.body);
  console.log(req.params);
  users.findOne({ email: req.params.email }, async (err, user) => {
    if (!user) return res.status(401).send("no user with that email");
    console.log(user);
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "jbjabzin@gmail.com",
        clientId:
          "1005674630723-m7t9uvfti7lus5aqt0fvf1qgi9t95s8o.apps.googleusercontent.com",
        clientSecret: "WXtLg_JL4B18gB7GgmyaCpwV",
        refreshToken:
          "1//04f3RKi0dPW_QCgYIARAAGAQSNwF-L9IrHWomIF1mvvvdCmT4Z7k3lcsTbX7luSa_ogO1q9jQqNLl6kcLU4mrYkHNEKRYR4p4OMM",
        accessToken:
          "ya29.Il-_Bz9qaSo-Frximlr9IHHbQgmVgxtWphIJvQPrWuzByhMUwV2RTkcEw6hqti0GG8rTw4g7JMYSM04u76CVb2LY1aFN1mYVFFPcQsjfe9nDww0yM4WMVmMzXyd0XM-yZA",
        expires: 1484314697598
      }
    });
    let info = await transporter.sendMail({
      from: '"FullStackMovie" <jbjabzin@gmail.com>',
      to: user.email,
      subject: "Failed attempts to sign in",
      text:
        "You have tried to sign in waaaaayyyy to many times, please reset your password",
      html: `<h3>Reset Your Password!</h3><p>You have tried to sign in too many times! Please reset your password by using the link provided!</p><a href='http://localhost:4200/reset/${user._id}/4'>reset password</a><br/><h3>Movie team!</h3>`
    });
  });
  bcrypt.hash('req.body.password', BCRYPT_SALT_ROUNDS).then(hashedPassword => {
    users.updateOne(
      { email: req.params.email },
      { $set: { password: hashedPassword } },
      (err, quest) => {
        if (err) res.send("error updating in update user");
      }
    );
  });
});

app.delete("/deleteUserById/:userId", (req, res) => {
  console.log("in delete");
  console.log(req.params.userId);
  users.deleteOne({ _id: new ObjectId(req.params.userId) }, (err, obj) => {
    if (err) throw err;
    console.log("deleted user");
    console.log(obj);
  });
});

app.get("/reviews", (req, res) => {
  movieInfo.find({}).toArray((err, result) => {
    if (err) return res.status(500).send(err);
    res.send(result);
  });
});

app.get("/reviews/ByUser/:id", (req, res) => {
  console.log("reviewID");
  console.log(req.params);
  movieInfo.find({ userId: req.params.id }).toArray((err, result) => {
    if (err) return res.status(500).send(err);
    console.log(result);
    res.send(result);
  });
});

app.get("/reviews/ByMovie/:id", (req, res) => {
  movieInfo.find({ movieId: req.params.id }).toArray((err, result) => {
    if (err) return res.status(500).send(err);
    console.log(result);
    res.send(result);
  });
});

app.post("/addReview", BodyParser.json(), (req, res) => {
  movieInfo.insertOne(req.body, (err, r) => {
    if (err) throw err;
    console.log(`inserted`);
    console.log(req.body);
    return req.body;
  });
});

app.put("/updateReview/:id", (req, res) => {
  movieInfo
    .find({ _id: new ObjectId(req.params.id) })
    .toArray((err, result) => {
      if (err) return res.status(500).send(err);
      console.log(result);
    });
  movieInfo.updateOne(
    { _id: new ObjectId(req.params.id) },
    {
      $set: {
        review: req.body.review,
        rating: req.body.rating
      }
    },
    {
      new: true
    },
    (err, updatedReview) => {
      console.log("heowow");
      if (err) {
        console.log("err");
        console.log(err);
        res.send("error updating review");
      } else {
        res.send(JSON.stringify(updatedReview));
      }
    }
  );
});

app.delete("/deleteReview/:id", (req, res) => {
  console.log("in delete");
  movieInfo.deleteOne({ _id: new ObjectId(req.params.id) }, (err, obj) => {
    if (err) throw err;
    console.log("deleted documnet... hopefully");
  });
});

app.delete("/deleteAllUserReviews/:userId", (req, res) => {
  console.log(req.params.userId);
  movieInfo.deleteMany({ userId: req.params.userId }, (err, obj) => {
    if (err) throw err;
    console.log("deleted reviews");
  });
});

app.get("/movies/:movie", (req, res) => {
  console.log(req.params.movie);
  queryString = req.params.movie;
  let searchAddress = `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${queryString}`;
  request(searchAddress, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      let info = JSON.parse(body);
      console.log(info);
      res.send(info);
    }
  });
});

app.get("/movies/genre/:genre", (req, res) => {
  console.log(req.params.genre);
  queryGenre = req.params.genre;
  let numberGenre;
  let searchGenresAddress = `https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}&language=en-US`;
  request(searchGenresAddress, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      let info = JSON.parse(body);
      console.log(info);
      for (let i = 0; i < info.genres.length; i++) {
        if (info.genres[i].name.toLowerCase() == queryGenre.toLowerCase()) {
          numberGenre = info.genres[i].id;
          let searchGenres = `https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&with_genres=${numberGenre}`;
          request(searchGenres, function(error, response, body) {
            if (!error && response.statusCode == 200) {
              let info = JSON.parse(body);
              // console.log(info);
              res.send(info);
            }
          });
        }
      }
    }
  });
});

app.get("/actor/:actor", (req, res) => {
  console.log(req.params.actor);
  queryString = req.params.actor;
  let searchAddress = `https://api.themoviedb.org/3/search/person?api_key=${api_key}&query=${queryString}`;
  request(searchAddress, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      let info = JSON.parse(body);
      res.send(info);
    }
  });
});

app.listen(3000, () => {
  MongoClient.connect(
    CONNECTION_URL,
    { useNewUrlParser: true },
    (err, client) => {
      if (err) throw err;
      database = client.db(DATABASE_NAME);
      users = database.collection("MovieUsers");
      movieInfo = database.collection("MovieReviews");
      console.log(`connected to ${DATABASE_NAME}!`);
    }
  );
});
