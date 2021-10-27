const express = require("express");
const bodyparser = require("body-parser");
const PORT = process.env.PORT || 5000;
const app = express();
const https = require("https");

app.set("view engine", "ejs");

app.use(bodyparser.urlencoded({ extended: true }));
app.use("/css", express.static("css"));
app.use("/views", express.static("views"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/html/index.html");
});

app.post("/data", async (req, res) => {
  const city = req.body.city;
  //   const btn = req.body.button;

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=c1d64b527b83a1cb81bccc39f1bdd9bf`;
  try {
    await https.get(url, (response) => {
      response.on("data", (data) => {
        const weather = JSON.parse(data);
        //   console.log(weather);
        res.render("result", {
          weather: weather.weather[0].main.toUpperCase(),
          name: city.toUpperCase(),
          temp: weather.main.temp,
          min: weather.main.temp_min,
          max: weather.main.temp_max,
          speed: weather.wind.speed,
          humidity: weather.main.humidity,
        });
      });
    });
  } catch (err) {
    res.send("Something Bad Occuared Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server Up ${PORT}`);
});
