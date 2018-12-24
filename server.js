var express = require("express");

var app = express();

// Set the port of our application
// process.env.PORT lets the port be set by Heroku
var PORT = process.env.PORT || 8080;

// Use the express.static middleware to serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "nfl_games_db"
});

connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});

// Serve index.handlebars to the root route.
app.get("/predictions", function(req, res) {
  connection.query("SELECT * FROM games;", function(err, data) {
    if (err) {
      return res.status(500).end();
    }

    res.render("index", { games: data });
  });
});


app.get("/", function(req, res) {
  connection.query("SELECT * FROM games;", function(err, data) {
    if (err) {
      return res.status(500).end();
    }

    res.render("passport", { games: data });
  });
});


// Show the user the individual quote and the form to update the quote.
app.get("/results", function(req, res) {
  connection.query("SELECT games.Home,games.away, user_pick.winner FROM games LEFT JOIN user_pick ON games.id = user_pick.id ORDER BY games.id;",  function(err, data) {
    if (err) {
      return res.status(500).end();
    }

    console.log(data);
    res.render("single-quote", {games: data});
    
  });
});

app.post("/api/user_pick", function(req, res) {

  connection.query("INSERT INTO user_pick (winner) VALUES ( ?)",[req.body.winner], function(err,result) {
    if (err) {
      // If an error occurred, send a generic server failure
      return res.status(500).end();
    }

    // Send back the ID of the new quote
    res.json({ id: result.insertId });
  });
});

app.delete("/api/user_pick/", function(req, res) {

  connection.query("DELETE FROM nfl_games_db.user_pick ", [req.body.winner, req.params.id], function(err, result) {

    if (err) {

      // If an error occurred, send a generic server failure

      return res.status(500).end();

    }

    else if (result.affectedRows === 0) {

      // If no rows were changed, then the ID must not exist, so 404

      return res.status(404).end();

    }


    
    res.status(200).end();



  });

  connection.query("ALTER TABLE nfl_games_db.user_pick AUTO_INCREMENT = 1 ", [req.body.winner, req.params.id], function(err, result) {

    if (err) {

      // If an error occurred, send a generic server failure

      return res.status(500).end();

    }

    else if (result.affectedRows === 0) {

      // If no rows were changed, then the ID must not exist, so 404

      return res.status(404).end();

    }


    
    res.status(200).end();



  });

});


// Update a quote by an id and then redirect to the root route.
app.put("/api/user_pick/:id", function(req, res) {
  connection.query(
    "UPDATE user_pick SET winner = ? WHERE id = ?",

    [req.body.winner, req.params.id],
    function(err, result) {
      if (err) {
        // If an error occurred, send a generic server failure
        return res.status(500).end();
      }
      else if (result.changedRows === 0) {
        // If no rows were changed, then the ID must not exist, so 404
        return res.status(404).end();
      }
      res.status(200).end();

    }
  );
});

// Start our server so that it can begin listening to client requests.
app.listen(PORT, function() {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT);
});
