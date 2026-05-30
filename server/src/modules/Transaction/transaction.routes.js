import express from "express";
import * as transactionController from "./transaction.controller.js";

const router = express.Router();

router.post("/", transactionController.createTransaction);

router.get("/", transactionController.getTransactions);

router.get("/wallet/:wallet", transactionController.getTransactionsByWallet);

router.get("/:id", transactionController.getTransactionById);

export default router;
