// 1. Require necessary modules
const express = require("express");
const fs = require("fs");
const path = require("path");

// 2. Create an instance of the express application
const app = express();
const port = 3008;

// 3. Set up a route to handle requests for the movie page

app.get("/", (req, res) => {
  // 4. Retrieve the title parameter from the query string
  let movieTitle = "tmnt2";
  let infoPath = path.join(__dirname, "views", movieTitle, "information.txt");
  let castPath = path.join(__dirname, "views", movieTitle, "cast.txt");
  // 5. Read the necessary information and review files for the specified movie
  const movieFolder = movieTitle;
  const informationFile = fs.readFileSync(infoPath, "utf8").split("\n");
  const castFile = fs.readFileSync(castPath, "utf8").split("\n");
  // Read the reviews for the movie
  let reviewsPath = path.join(__dirname, "views", movieTitle);
  let reviewFiles = fs.readdirSync(reviewsPath);
  let reviews = [],
    reviewsLeft = [],
    reviewsRight = [];
  let freshCount = 0;
  reviewFiles.forEach(function (file) {
    if (file.startsWith("review") && file.endsWith(".txt")) {
      let reviewData = fs
        .readFileSync(path.join(reviewsPath, file), "utf8")
        .split("\n");
      let review = {
        text: reviewData[0],
        rating: reviewData[1],
        reviewer: reviewData[2],
        publication: reviewData[3],
        image: reviewData[1] === "FRESH" ? "fresh.gif" : "rotten.gif",
      };
      reviews.push(review);
      //if (review.rating === "FRESH") freshCount++;
      freshCount++;
    }
  });
  if (freshCount % 2 === 0) {
    for (let i = 0; i < freshCount; i++) {
      if (i < freshCount / 2) {
        reviewsLeft.push(reviews[i]);
      } else {
        reviewsRight.push(reviews[i]);
      }
    }
  } else {
    for (let i = 0; i < freshCount; i++) {
      if (i < (freshCount + 1) / 2) {
        reviewsLeft.push(reviews[i]);
      } else {
        reviewsRight.push(reviews[i]);
      }
    }
  }
  console.log(reviewsLeft);
  console.log("reviewsRight", reviewsRight);
  // 6. Render an EJS template with the movie information and reviews
  res.render("movie.ejs", {
    title: "Tomatoes Rancid",
    movieTitle,
    freshCount,
    reviewsLeft,
    reviewsRight,
    rating: informationFile[0],
    year: informationFile[1],
    name: informationFile[2],
    cast: castFile.map((line) => line.split(":")),
    reviews: reviews.map((review) => ({
      text: review[0],
      rating: review[1],
      reviewer: review[2],
      publication: review[3],
    })),
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Movie review site listening at http://localhost:${port}`);
});
