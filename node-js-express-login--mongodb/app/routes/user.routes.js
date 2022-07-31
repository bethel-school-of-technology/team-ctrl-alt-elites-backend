const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
var express = require('express');
var router = express.Router();


 module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });
  app.get("/api/test/all", controller.allAccess);
  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

  app.get(
    "/api/test/owner",
    [authJwt.verifyToken, authJwt.isOwner],
    controller.ownerBoard
  );
  
  

// GET ALL
router.get('/', async function(req, res, next) {
  try{
    const owners = await Owner.find();

    res.status(200).json({
      data: { owners }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
  
});

// GET ONE
router.get('/:id', async function(req, res, next) {
  try{
      let id = req.params.id;
      const owner = await Owner.findById(id);

      res.status(200).json({
        data: { owner }
      });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
  
});


// Post new profile
router.post('/add', async function (req, res ) {
    try {
      const newOwner = await Owner.create(req.body);

      res.status(201).json({
        data: { owners: newOwner }
      });
    } catch (err) {
      res.status(404).json({
        status: 'fail',
        message: err
      });
    }
});

// UPDATE
router.put('/update/:id', async function (req, res ) {
  try {
    const owner = await Owner.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      data: { owner }
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err
    });
  }
});


// DELETE
router.delete('/delete/:id', async function (req, res ) {
  try {
    await Owner.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err
    });
  }
});


}; 

