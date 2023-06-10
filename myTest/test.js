app.post("/products", async (req, res) => {
    const products =  req.body;
    res.send(products);
    //   console.log(products);
    const result = await DBCollection.insertOne(products);
    console.log(result);
  });

  app.patch("/my_toys/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const updatedData =  req.body;
    const updatedDoc = {
      $set: updatedData,
    };
    const result = await DBCollection.updateOne(query, updatedDoc);
    // console.log(result);
    res.send(updatedData);
  });
  app.delete("/my_toys/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await DBCollection.deleteOne(query);
      console.log(result);
      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });
  app.get("/products", async (req, res) => {
    const products = await DBCollection.find({}).toArray();
    res.send(products);
  });
  app.get("/products/all_toys_table", async (req, res) => {
    let query = {};
    if (req.query.product_name) {
      query = { product_name: req.query.product_name };
    }
    const products = await DBCollection.find(query).limit(20).toArray();
    res.send(products);
  });
  app.get("/products/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const product = await DBCollection.findOne(query);
    res.send(product);
  });

  app.get("/category/:id", async (req, res) => {
    const selected = req.params.id;
    const query = { category: selected };
    const products = await DBCollection.find(query).toArray();
    res.send(products);
  });
  app.get("/users/:id", async (req, res) => {
    const email = req.params.id;
    const query = { seller_email: email };
    let number = parseInt(req.query.sort_number);
    if (number === 1) {
      const products = await DBCollection.find(query)
        .sort({ price: 1 })
        .toArray();
      res.send(products);
    } else {
      const products = await DBCollection.find(query)
        .sort({ price: -1 })
        .toArray();
      res.send(products);
    }
  });