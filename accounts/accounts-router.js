const express = require("express")
const db = require("../data/dbConfig")

const router = express.Router()

router.get("/", async (req, res, next) => {
    try {
        // "SELECT * FROM accounts"
        const accounts = await db
        .select("*")
        .from("accounts")

        res.json(accounts)
    } catch (err) {
        next(err)
    }
})

router.get("/:id", async (req, res, next) => {
    try {
        // "SELECT * FROM accounts WHERE id = ?"
        const [account] = await db
        .select("*")
        .from("accounts")
        .where("id", req.params.id)
        .limit(1)

        res.json(account)
    } catch (err) {
        next(err)
    }
})


router.post("/", async (req, res, next) => {
    try {
        // "INSERT INTO account (name, budget) VALUES (?, ?)"
        const [id] = await db
        .insert({
            name: req.body.name,
            budget: req.body.budget,
        })
        .into("accounts")
        // "SELECT * FROM accounts WHERE id = ? LIMIT 1"
        const account = await db("accounts")
        .where("id", id)
        .first()

        res.status(201).json(account)
    } catch (err) {
        next(err)
    }
})

router.put("/:id", async (req, res, next) => {
    try {
        // "UPDATE account SET name = ? AND budget = ? WHERE id = ?"
        await db("accounts")
        .update({
            name: req.body.name,
            budget: req.body.budget,
        })
        .where("id", req.params.id)
        
        // use 'req.params.id' to make another SELECT statement to respond with
        const account = await db("accounts")
        .where("id", req.params.id)
        .first()

        res.json(account)
    } catch (err) {
        next(err)
    }
})

router.delete("/:id", async (req, res, next) => {
    try {
        // "DELETE FROM account WHERE id = ?"
        await db("accounts")
        .where("id", req.params.id)
        .del()
        // Since we no longer have a resource to return, just send a 204, which means success byt no response data is being sent
        res.status(204).end()
    } catch (err) {
        next(err)
    }
})


module.exports = router