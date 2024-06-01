const express = require('express');
const router = express.Router();
const passport = require("passport")
const upload = require("./multer")
const userModel = require("./users")
const taskModel = require("./tasks")
const localStrategy = require("passport-local")
passport.use(new localStrategy(userModel.authenticate()));
const path = require("path");
const uploadsPath = path.join(__dirname, "uploads");
router.use("/uploads", express.static(uploadsPath));

router.get('/', function (req, res) {
  res.render('regi');
});
router.get('/login', function (req, res, next) {
  res.render('login', { error: req.flash('error') });
});


router.get('/home', isLoggedIn, async function (req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user })
  res.render('home', { user });
});



router.get('/addpanel', isLoggedIn, async function (req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user })
  res.render('addpanel', { user });
})

//  ----------------  Create Panel --------------

router.post('/addpanel', isLoggedIn, upload.single('image'), async function (req, res) {
  const { task, term, description, award } = req.body;
  const imagefile = req.file ? req.file.filename : null;
  const newtask = await taskModel.create({ task, term, description, award, image: imagefile });
  console.log(newtask);
  res.redirect("/panel");
});


//  ----------------  Read Panel --------------

router.get('/panel', isLoggedIn, async function (req, res) {
  const tasks = await taskModel.find();
  res.render('panel', { tasks });
});


//  ----------------  Update Panel --------------


router.get("/update/:id", async function (req, res) {
  const id = req.params.id;
  const task = await taskModel.findOne({ _id: id });
  res.render("update", { task })
})



router.post("/updatetask/:id", async function (req, res) {
  const { task, term, description, award } = req.body;
  const id = req.params.id;
  const newtask = await taskModel.create(id, { task, term, description, award }, { new: true });
  const tasks = await taskModel.find();
  res.render("addtask", { tasks })
});




//  ----------------  Delete Panel --------------

router.get("/delete/:id", async function (req, res) {
  const id = req.params.id;
  await taskModel.deleteOne({ _id: id });
  const tasks = await taskModel.find();
  res.render("panel", { tasks })
})

















router.post("/register", function (req, res) {
  const { username, email, password, confirm } = req.body;
  const userdata = new userModel({ username, email, password, confirm })

  userModel.register(userdata, req.body.password)
    .then(function (registereduser) {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/home")
      })
    });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/home",
  failureRedirect: "/login",
  failureFlash: true,
}));


router.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect("/");
  });
});


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}


module.exports = router;

