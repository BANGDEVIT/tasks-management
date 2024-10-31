const Task = require('../models/task.model');
const paginationHelper = require('../../../helpers/pagination.helper')
const searchHelper = require('../../../helpers/search.helper');
const { response } = require('express');


//[GET] /api/v1/tasks
module.exports.task =  async (req, res) => {
  const id = req.user.id;
  const find = {
    $or : [
      {createdBy : id},
      {listUsers : id},
    ], 
    deleted : false
  }
  if (req.query.status){
    find.status = req.query.status;
  }

  // sort 
  const sort = {};

  if (req.query.sortKey && req.query.sortValue){
    sort[req.query.sortKey] = req.query.sortValue;
  }
  // sort
  
  //pagination
  let intitPagination ={
    currentPage : 1,
    limitItems : 2,
  }

  const countTasks = await Task.countDocuments(find);
  const objectsPagination =paginationHelper(
    intitPagination,
    req.query,
    countTasks,  
  )
  //End pagination

  //Search
  let objectSearch = searchHelper(req.query);

  if (req.query.keyword){
    find.title = objectSearch.regex;
  }
  //End Search
  const tasks = await Task.find(find).sort(sort).limit(objectsPagination.limitItems).skip(objectsPagination.skip);
  res.json(tasks)
};

//[GET] /api/v1/tasks/detail/:id
module.exports.detail =  async (req, res) => {
  try {
    const id = req.params.id;
  const tasks = await Task.findOne({
    _id : id,
    deleted : false
  })
    res.json(tasks)
  } catch (error) {
    res.json("Không tìm thấy ")
  }
};

//[PATCH] /api/v1/tasks/change-status/:id
module.exports.changeStatus =  async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.body.status;
    await Task.updateOne({
      _id : id,
      deleted : false
    },{
      status : status,
    })
    res.json( {
      code : 200,
      message:"cập nhật thành công"
    });
  } catch (error) {
    res.json( {
      code : 400,
      message:"Không tồn tại"
    });
  }
};

//[PATCH] /api/v1/tasks/changeMulti
module.exports.changeMulti =  async (req, res) => {
  try {
    const ids = req.body.ids;
    const key = req.body.key;
    const value = req.body.value;
    // console.log(ids)
    // console.log(key)
    // console.log(value)

    switch (key) {
      case "status":
        await Task.updateMany({
          _id : {$in : ids},
          deleted : false
        },{
          status : value
        })
        res.json( {
          code : 200,
          message:"cập nhật thành công"
        });
        break;
    
      case "deleted":
        await Task.updateMany({
          _id : {$in : ids},
          deleted : false
        },{
          deleted : true,
          deletedAt : new Date()
        })
        res.json( {
          code : 200,
          message:"cập nhật thành công"
        });
        break;

      default:
        res.json( {
          code : 400,
          message:"Không tồn tại"
        });
        break;
    }

  } catch (error) {
    res.json( {
      code : 400,
      message:"Không tồn tại"
    });
  }
};

//[POST] /api/v1/tasks/create
module.exports.create =  async (req, res) => {
  try {
    req.body.createdBy = req.user.id;
    const task = new Task(req.body);
    await task.save();
    res.json( {
      code : 200,
      message:"Cập nhật thành công",
      data : task
    });

  } catch (error) {
    res.json( {
      code : 400,
      message:"Không tồn tại"
    });
  }
};

//[PATCH] /api/v1/tasks/edit/:id
module.exports.edit =  async (req, res) => {
  try {
    const id = req.params.id;
    await Task.updateOne({
      _id : id,
      deleted : false
    },
      req.body)
    res.json( {
      code : 200,
      message:"Cập nhật thành công",
    });

  } catch (error) {
    res.json( {
      code : 400,
      message:"Không tồn tại"
    });
  }
};

//[PATCH] /api/v1/tasks/delete/:id
module.exports.delete =  async (req, res) => {
  try {
    const id = req.params.id;
    await Task.updateOne({
      _id : id,
    },{
      deleted : true,
      deletedAt : new Date(),
    }),
    res.json( {
      code : 200,
      message:"xóa thành công",
    });

  } catch (error) {
    res.json( {
      code : 400,
      message:"Không tồn tại"
    });
  }
};
