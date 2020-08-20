const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const app = express();

const items = ["buy food", "cook food"];
const workItems = [];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));



mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const itemsSchema = {
  name: String,
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to you todo",
});

const item2 = new Item({
  name: "This is your items",
});

const item3 = new Item({
  name: "This is collection",
});

const defaultItems = [item1, item2, item3];

Item.insertMany(defaultItems, function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log("sucessfully added");
  }
});

// Home route
app.get("/", function (req, res) {
  res.render("list", { listTitle: "Today", newListItems: items });
});

// This if function allows to push items to work list if the listitle is Work
app.post("/", function (req, res) {
  const item = req.body.newItem;
  //res.body.list is the name = "list" of the button and the value = "work"
  // if (req.body.list === "Work") {
  //   workItems.push(item);
  //   res.redirect("/work");
  // } else {
  //   items.push(item);
  //   res.redirect("/");
  // }
});

// Work Route
app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work", newListItems: workItems });
});

// About Route
app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
