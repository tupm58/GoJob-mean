'use strict';

/**
 * Module dependencies
 */
var postsPolicy = require('../policies/posts.server.policy'),
  posts = require('../controllers/posts.server.controller');

module.exports = function(app) {
  // Posts Routes
  app.route('/api/posts').all(postsPolicy.isAllowed)
    .get(posts.list)
    .post(posts.create);

  //query post by category
  app.route('/api/posts/categories/:categoryId')
    .get(posts.listPostByCategory);

  app.route('/api/posts/:postId').all(postsPolicy.isAllowed)
    .get(posts.read)
    .put(posts.update)
    .delete(posts.delete);

  app.route('/api/posts/:postId/comments')
    .post(posts.createComment)


  app.route('/api/getUserComment/:postId')
    .get(posts.getUserComment);

  // Finish by binding the Post middleware
  app.param('postId', posts.postByID);

  // Search post by Tag
  app.route('/api/posts/search/:tag')
    .post(posts.listPostByTag)


  //  add category
  app.route('/api/categories')
    .get(posts.listCategory)
    .post(posts.createCategory);

  app.route('/api/categories/:categoryId')
    .delete(posts.deleteCategory);

  // Finish by binding the Post middleware
  app.param('categoryId', posts.categoryByID);
  

};
