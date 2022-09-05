import express from 'express'

export const router = express.Router();

router.all("/*", (_, res) => {
  res.sendFile("index.html", { root: "./public/" });
});