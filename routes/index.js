var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");

// 连接数据库
mongoose.connect("mongodb://127.0.0.1:27017/admin", function (err) {
  if (err) {
    throw err;
  } else {
    console.log("数据库连接成功");
  }
});

// 定义骨架
var listSchema = new mongoose.Schema({
  title: String,
  content: String,
  time: String,
});

// 创建模型
var listModel = mongoose.model("list", listSchema, "list");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

// 挂在save_add.html
router.post("/save_add.html", function (req, res, next) {
  var title = req.body.title;
  var content = req.body.content;

  //将数据添加到数据库
  var list = new listModel();
  list.title = title;
  list.content = content;
  list.time = new Date().toLocaleString();
  list.save(function () {
    res.send("发布成功");
  });
});

// 新闻列表
router.get("/list.html", function (req, res, next) {
  listModel.find().exec(function (err, data) {
    res.render("newslist.ejs", { list: data });
  });
});

// 删除新闻
router.get("/del.html", function (req, res, next) {
  var id = req.query.id;
  listModel.findById(id).exec(function (err, data) {
    data.remove(function () {
      res.send('<script>alert("删除成功");location.href="/list.html"</script>');
    });
  });
});

// 编辑
router.get("/edit.html", function (req, res, next) {
  var id = req.query.id;
  listModel.findById(id).exec(function (err, data) {
    res.render("newsedit.ejs", { news: data });
  });
});

router.post("/save_edit.html", function (req, res, next) {
  var title = req.body.title;
  var content = req.body.content;
  var id = req.body.id;

  //将数据修改到数据库
  listModel.findById(id).exec(function (err, data) {
    data.title = title;
    data.content = content;
    data.save(function () {
      res.send('<script>alert("修改成功");location.href="/list.html"</script>');
    });
  });
});

module.exports = router;
