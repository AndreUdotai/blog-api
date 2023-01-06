var express = require('express');
// const { route } = require('../../andres-club/app');
var router = express.Router();
const { verifyToken } = require("../auth/protect");

// Require admin controller module
const admin_controller = require("../controllers/adminController");

/// ADMIN USER ROUTES

// GET request for creating an admin user
// router.get("/", admin_controller.adminUser_create_get);

// POST request for creating an admin user
router.post("/user/register", admin_controller.adminUser_create_post);

// GET request for list of all admin users
router.get("/users", admin_controller.adminUser_list);

// POST requst for login
router.post("/user/login", admin_controller.adminUser_login);

// GET request for logout
router.get("/user/logout", admin_controller.adminUser_logout);

// GET request for one admin user
router.get("/user/:id", admin_controller.adminUser_detail);

// POST request to update an admin user
router.post("/user/:id/update", admin_controller.adminUser_update_post);

/// ADMIN POST ROUTES

// POST request for creating a post
router.post("/post/create", admin_controller.adminPost_create);

// GET request for listing all posts
router.get("/posts", admin_controller.adminPost_list);

// POST requst for updating post
router.post("/post/:id/update", admin_controller.adminPost_update);

/// ADMIN DASHBAORD ROUTE

// GET request for dashboard counts
router.get("/dashboard", verifyToken, admin_controller.adminDashboard);

module.exports = router;
