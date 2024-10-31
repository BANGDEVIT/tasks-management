const express = require('express');

const route = express.Router();

const controller = require('../controllers/task.controller')

route.get("/",controller.task);

route.get("/detail/:id",controller.detail);

route.patch("/change-status/:id",controller.changeStatus);

route.patch("/change-multi",controller.changeMulti);

route.post("/create",controller.create);

route.patch("/edit/:id",controller.edit);

route.patch("/delete/:id",controller.delete);

module.exports = route;
