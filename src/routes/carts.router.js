const express = require("express");
const router = express.Router();
const fs = require("fs");

// POST Crear carrito
router.post("/carts", (req, res) => {
  const { products } = req.body;

  let data = fs.readFileSync("carrito.json", "utf8");

  const carts = JSON.parse(data);

  const id = carts.length + 1;

  carts.push({ id, products });

  fs.writeFileSync("carrito.json", JSON.stringify(carts, null, 2));

  res.json({ id, products });
});

// GET Listar productos del carrito según id
router.get("/carts/:id", (req, res) => {
  let data = fs.readFileSync("carrito.json", "utf8");

  const carts = JSON.parse(data);

  const paramId = parseInt(req.params.id);

  const cart = carts.find((p) => p.id === paramId);

  if (cart) {
    res.json(cart.products);
  } else {
    res.status(404).json({ message: "Carrito no encontrado" });
  }
});

// POST Agregar productos a un carrito
router.post("/carts/:cid/product/:pid", (req, res) => {
  let data = fs.readFileSync("carrito.json", "utf8");
  let dataP = fs.readFileSync("productos.json", "utf8");

  let carts = JSON.parse(data);
  let products = JSON.parse(dataP);

  const paramCartId = parseInt(req.params.cid);
  const paramProductId = parseInt(req.params.pid);

  let cartProducts = carts.find((p) => p.id === paramCartId).products;

  let lookProduct = products.find((p) => p.id === paramProductId);

  cartProducts.push({ product: paramProductId, quantity: 1 });

  if (cartProducts && lookProduct) {
    fs.writeFileSync("carrito.json", JSON.stringify(carts, null, 2));

    res.json("Producto agregado al carrito exitosamente");
  } else {
    res.status(404).json({ message: "Producto no encontrado" });
  }
});

module.exports = router;