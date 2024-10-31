const taskRouters = require('./task.route')
const userRouters = require('./user.route')
const authMiddleware = require('../middleware/auth.middleware')


module.exports = (app) =>{
  app.use("/api/v1/tasks",authMiddleware.requireAuth,taskRouters);

  app.use("/api/v1/users",userRouters);
}