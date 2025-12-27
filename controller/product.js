const signUp = require("../model/user");
const product_tbl = require("../model/product");
async function handleGetAllProducts(req, res) {
    try {
        const user = req.user;
        console.log("log of all products::", user);

        // let filter = {};

        // if (user.role === "client") {
        //     filter.owner = user._id;
        // }
        // customer → filter stays empty → all products
        const allProducts = await product_tbl.find().sort({ createdAt: -1 });
        console.log("log of all allProducts::", allProducts);

        return res.status(200).json({
            status_code: 200,
            products: allProducts,
        });

    } catch (err) {
        console.error(err);
        return res.status(200).json({
            msg: "Something went wrong while getting products",
        });
    }
}

// members dd 
async function handleGetProductById(req, res) {
    const productId = req.params.id;
    console.log("call by id 1:", productId);

    try {
        const product = await product_tbl.find({ owner: productId }).sort({createdAt:-1})
        console.log("call by id 2:", product);
        
        
        if (!product) return res.status(200).json({ msg: "Product not found", status_code: 404 });
        console.log("call by id 3:");
        // if (!mem) return res.status(404).json({ msg: "Project not found" ,status_code:404});

        return res.status(200).json({ product: product, status_code: 200 });
    } catch (err) {
        return res.status(200).json({ msg: "Something went wrong while get Product", status_code: 500 })
    }
}

async function handleCreateProduct(req, res) {
    try {
        const { name, category, price, description, totalSales } = req.body;
        console.log('log og body handleCreateProduct', totalSales);


        if (!req.user || !req.user._id) {
            return res.status(200).json({
                msg: "Unauthorized user",
                status_code: 401,
            });
        }

        if (!name || !category || price === undefined) {
            return res.status(200).json({
                msg: "name, category and price are mandatory fields", status_code: 400,
            });
        }

        if (isNaN(price) || Number(price) <= 0) {
            return res.status(200).json({
                msg: "Price must be a valid positive number", status_code: 400,
            });
        }

        const reqData = {
            name,
            category,
            price,
            description,
            totalSales,
            owner: req.user._id,
        };

        const response = await product_tbl.create(reqData);

        return res.status(201).json({ prod_id: response._id, status_code: 200, });

    } catch (error) {
        console.error(error);
        return res.status(200).json({
            msg: "Something went wrong while creating product", status_code: 500,
        });
    }
}

async function handleUpdateProduct(req, res) {
    try {
        console.log("update called");

        const prod_id = req.params.id;
        const { name, category, price, description } = req.body;


        if (!req.user || !req.user._id) {
            return res.status(200).json({
                msg: "Unauthorized",
                status_code: 401,
            });
        }

        if (!name && !category && price === undefined && !description) {
            return res.status(400).json({
                msg: "At least one field is required to update",
                status_code: 400,
            });
        }

        if (price !== undefined && (isNaN(price) || Number(price) <= 0)) {
            return res.status(200).json({
                msg: "Price must be a positive number",
                status_code: 400,
            });
        }


        const product = await product_tbl.findById(prod_id);
        if (!product) {
            return res.status(200).json({ msg: "Product not found", status_code: 404 });
        }

        if (product.owner.toString() !== req.user._id.toString()) {
            return res.status(200).json({
                msg: "You are not allowed to update this product", status_code: 403
            });
        }


        const updateData = {};
        if (name) updateData.name = name;
        if (category) updateData.category = category;
        if (price !== undefined) updateData.price = price;
        if (description) updateData.description = description;

        const updatedProduct = await product_tbl.findByIdAndUpdate(
            prod_id,
            { $set: updateData },
            { new: true }
        );

        return res.status(200).json({

            data: updatedProduct,
            status_code: 200,
        });

    } catch (error) {
        console.error(error);
        return res.status(200).json({
            msg: "Something went wrong while updating product", status_code: 500
        });
    }
}
async function handleDeleteProduct(req, res) {
    try {
        const del_id = req.params.id;


        if (!req.user || !req.user._id) {
            return res.status(200).json({ msg: "Unauthorized", status_code: 401 });
        }

        // 🔍 find product
        const product = await product_tbl.findById(del_id);
        if (!product) {
            return res.status(200).json({ msg: "Product not found", status_code: 404, });
        }

        // 🔒 ownership check
        if (product.owner.toString() !== req.user._id.toString()) {
            return res.status(200).json({
                msg: "You are not allowed to delete this product", status_code: 403
            });
        }

        await product_tbl.findByIdAndDelete(del_id);

        return res.status(200).json({ msg: "Product deleted successfully", status_code: 200 });

    } catch (error) {
        console.error(error);
        return res.status(200).json({
            msg: "Something went wrong while deleting product", status_code: 500
        });
    }
}

// ai
async function handleAIInsights(req, res) {
    try {
        // only client
        if (req.user.role !== "client") {
            return res.status(200).json({
                msg: "Only clients can access AI insights", status_code: 403
            });
        }

        const products = await product_tbl.find({
            owner: req.user._id,
        });

        if (!products.length) {
            return res.status(200).json({
                summary: "No products available yet",
                mostSoldProduct: null,
                improvementAreas: [],
                suggestions: [],
            });
        }

        // 1️⃣ Most sold product
        let mostSold = products[0];
        products.forEach((p) => {
            if (p.totalSales > mostSold.totalSales) {
                mostSold = p;
            }
        });

        // 2️⃣ Category performance
        const categorySales = {};
        products.forEach((p) => {
            categorySales[p.category] =
                (categorySales[p.category] || 0) + p.totalSales;
        });

        const lowCategories = Object.keys(categorySales).filter(
            (cat) => categorySales[cat] < 30
        );

        // 3️⃣ Summary
        const summary =
            mostSold.totalSales > 50
                ? `Your ${mostSold.category} category is performing well, led by ${mostSold.name}.`
                : "Sales are currently moderate. Consider promotions.";

        // 4️⃣ Suggestions
        const suggestions = lowCategories.length
            ? [`Consider discount campaigns for ${lowCategories.join(", ")}`]
            : ["Keep up the good performance"];

        return res.status(200).json({
            status_code: 200,
            summary,
            mostSoldProduct: {
                name: mostSold.name,
                sales: mostSold.totalSales,
            },
            improvementAreas: lowCategories,
            suggestions,
        });
    } catch (err) {
        console.error(err);
        return res.status(200).json({ msg: "AI insight generation failed", status_code: 500 });
    }
}


module.exports = { handleGetAllProducts, handleGetProductById, handleDeleteProduct, handleUpdateProduct, handleCreateProduct, handleAIInsights };
