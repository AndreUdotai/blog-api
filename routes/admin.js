import express from 'express';
var router = express.Router();
const passport = require('passport');
const { verifyToken } = require("../auth/protect");

// Require admin controller module
const admin_controller = require("../controllers/adminController");

/// ADMIN USER ROUTES

// POST request for creating an admin user
router.post("/user/register", admin_controller.adminUser_create_post);

// GET request for list of all admin users
router.get("/users", verifyToken, admin_controller.adminUser_list);

// POST requst for login
router.post("/user/login", admin_controller.adminUser_login);

// GET request for one admin user
router.get("/user/:id", verifyToken, admin_controller.adminUser_detail);

// POST request to update an admin user
router.post("/user/:id/update", verifyToken, admin_controller.adminUser_update_post);

/// ADMIN POST ROUTES

// POST request for creating a post
router.post("/post/create", verifyToken, admin_controller.adminPost_create);

// GET request for listing all posts
router.get("/posts", verifyToken, admin_controller.adminPost_list);

// POST requst for updating post
router.post("/post/:id/update", verifyToken, admin_controller.adminPost_update);

/// ADMIN DASHBAORD ROUTE

// GET request for dashboard counts
router.get("/dashboard", verifyToken, admin_controller.adminDashboard);

module.exports = router;
