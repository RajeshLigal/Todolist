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

const listSchema = {
  name: String,
  items: [itemsSchema],
};

const List = mongoose.model("List", listSchema);

// Home route
app.get("/", function (req, res) {
  Item.find({}, function (err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("sucessfully added");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: "Today", newListItems: foundItems });
    }
  });
});

app.get("/:customListName", function (req, res) {
  const customListName = req.params.customListName;

  List.findOne({ name: customListName }, function (err, foundlist) {
    if (!err) {
      if (!foundlist) {
        //create new list
        const list = new List({
          name: customListName,
          items: defaultItems,
        });
        list.save();
        res.redirect("/" + customListName);
      } else {
        //show an existing list
        res.render("list", {listTitle: foundlist.name, newListItems: foundlist.items});
      }
    }
  });

  

  
});

//submit post route for home route
app.post("/", function (req, res) {
  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName,
  });

  item.save();

  res.redirect("/");
});

//Delete post route
app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  Item.findByIdAndRemove(checkedItemId, function (err) {
    if (!err) {
      console.log("Successfully deleted checked i");
      res.redirect("/");
    }
  });
});

// About Route
app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
