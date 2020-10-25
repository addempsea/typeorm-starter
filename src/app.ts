import * as express from "express";
import { Request, Response } from "express";
import { createConnection } from "typeorm";
import { User } from "./entity/User";
import { Product } from "./entity/product";

// create typeorm connection
createConnection().then((connection) => {
  const userRepository = connection.getRepository(User);
  const productRepository = connection.getRepository(Product)
  // create and setup express app
  const app = express();
  app.use(express.json());

  // register routes

  app.get("/users", async function (req: Request, res: Response) {
    const users = await userRepository.find();
    res.json(users);
  });

  app.get("/users/:id", async function (req: Request, res: Response) {
    const results =  (await userRepository.findOne(req.params.id, {relations: ["products"]}));
    return res.send(results);
  });

  app.post("/users", async function (req: Request, res: Response) {
    const user = await userRepository.create(req.body);
    const results = await userRepository.save(user);
    return res.send(results);
  });

  app.post("/product", async function (req: Request, res: Response) {
    const product = await productRepository.create(req.body);
    const results = await productRepository.save(product);
    return res.send(results);
  });

  app.put("/users/:id", async function (req: Request, res: Response) {
    const user = await userRepository.findOne(req.params.id);
    userRepository.merge(user, req.body);
    const results = await userRepository.save(user);
    return res.send(results);
  });

  app.delete("/users/:id", async function (req: Request, res: Response) {
    const results = await userRepository.delete(req.params.id);
    return res.send(results);
  });

  // start express server
  app.listen(3000);
});
