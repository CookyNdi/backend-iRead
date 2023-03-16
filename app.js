const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");

const { authentication, authorization } = require("./helpers/middlewares");
const { SuperController } = require("./controllers");
const errorHandler = require("./helpers/errorHandler");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use(express.static("public"));
app.use(
  "/",
  express.urlencoded({
    extended: false,
  })
);

app.get("/", SuperController.welcome);
app.post("/login", SuperController.login);
app.get("/content/data", SuperController.getAllContent);
app.get("/content/data/search", SuperController.searchContent);
app.get("/content/data/:id", SuperController.getContentById);
app.patch("/pageviews", SuperController.incPageView);
app.get("/get/genre", SuperController.getAllDataFromColumn);

app.use(authentication);

app.post("/content/create", SuperController.createContent);
app.patch("/content/update/:id", authorization, SuperController.updateContent);
app.delete("/content/delete/:id", authorization, SuperController.deleteContent);

app.get("/readinglist", SuperController.getReadingList);
app.post("/readinglist/add", SuperController.addToReadingList);
app.delete("/readinglist/remove", SuperController.removeFromReadingList);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`This app is listening on port ${port} - Kawah Edukasi`);
});
