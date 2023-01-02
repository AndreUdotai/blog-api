var express = require('express');
const { route } = require('../../andres-club/app');
var router = express.Router();


/// ADMIN USER ROUTES

// GET request for creating an admin user
router.get("/users/create", admin_controller.adminUser_create_get);

// POST request for creating an admin user
router.post("/users/create", admin_controller.adminUser_create_post);

// GET request for list of all admin users
router.get("/users", admin_controller.adminUser_list);

// GET request for one admin user
router.get("/users/:id", admin_controller.adminUser_detail);

// GET request to update an admin user
router.get("/users/:id/update", admin_controller.adminUser_update_get);

// POST request to update an admin user
router.post("/users/:id/update", admin_controller.adminUser_update_post);

// GET request for login
router.get("/users/login", admin_controller.adminUser_login_get);

// POST requst for login
router.post("/users/login", admin_controller.adminUser_login_post);

// GET request for logout
router.get("/users/logout", admin_controller.adminUser_logout);

/// ADMIN POST ROUTES

// POST request for creating a post
router.post("/posts/create", admin_controller.adminPost_create_post);

// GET request for listing all posts
router.get("/posts", admin_controller.adminPost_list);

// GET request for updating post
router.get("/posts/:id/update", admin_controller.adminPost_update_get);

// POST requst for updating post
router.post("/posts/:id/update", admin_controller.admin_update_post);

// GET request for one post
router.get("/posts/:id", admin_controller.adminPost_detail);

/// ADMIN DASHBAORD ROUTE

- Dashboard - /admin/dashboard

// GET request for dashboard counts
router.get("/dashboard", admin_controller.adminDashboard);

module.exports = router;
