const express = require("express");
const { handleGetAllProducts, handleGetProductById, handleCreateProduct, handleUpdateProduct, handleDeleteProduct ,handleAIInsights} = require("../controller/product");
const router = express.Router();

router.post("/products", (req, res) => {
    handleCreateProduct(req, res)
})
router.put("/products/:id", (req, res) => {
    handleUpdateProduct(req, res)
})
router.delete("/products/:id", (req, res) => {
    handleDeleteProduct(req, res)
})
router.get("/products", (req, res) => {
    handleGetAllProducts(req, res)
})
router.get("/products/:id", (req, res) => {
    handleGetProductById(req, res)
})

// ai
router.get("/ai/insights", (req, res) => {
    handleAIInsights(req, res)
})

module.exports = router;

