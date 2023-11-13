const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const router = require("./routes/route");
const path = require("path");
const { default: axios } = require("axios");

const PORT = 3030;

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Middleware для установки заголовка при запросе изображений
app.use("/uploads", async (req, res, next) => {
  try {
    const imageResponse = await axios.get(
      `https://bf5d-185-244-20-210.ngrok-free.app${req.url}`,
      {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
        responseType: "arraybuffer",
      }
    );

    // Передача изображения в ответ
    res.type(imageResponse.headers["content-type"]).send(imageResponse.data);
    console.log("images");
  } catch (error) {
    // Обработка ошибки
    next(error);
  }
});

app.use(router);
app.use(express.static(path.join(__dirname, "uploads")));
app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  }

  console.log("server started on port " + PORT);
});
