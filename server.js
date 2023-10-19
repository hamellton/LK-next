// import fs from "fs";
// import express from "express";
// import https from "https";

// const app = express();
// // enable ditto on local
// const server = https.createServer(
//   {
//     key: fs.readFileSync("server.key"),
//     cert: fs.readFileSync("server.crt"),
//   },
//   app
// );

// (async () => {
//   if (config.port) {
//     try {
//       await Loadable.preloadAll();
//     } catch (error) {
//       console.log("Server preload error:", error);
//     }

//     server.listen(config.port, (err) => {
//       if (err) {
//         console.error(err);
//       }
//       console.info("----\n==> ✅  %s is running.", config.app.title);
//       console.info(
//         "==> 💻  Open http://%s:%s in a browser to view the app.",
//         config.host,
//         config.port
//       );
//     });
//   } else {
//     console.error(
//       "==>     ERROR: No PORT environment variable has been specified"
//     );
//   }
// })();
const { createServer } = require("https");
const { parse } = require("url");
const next = require("next");
const fs = require("fs");
const dev = process.env.NEXT_PUBLIC_APP_ENV?.toLowerCase?.() !== "production" || process.env.NEXT_PUBLIC_APP_ENV?.toLowerCase?.() !== "prod";
const app = next({ dev });
const handle = app.getRequestHandler();
const httpsOptions = {
  key: fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.crt"),
};
app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(3000, (err) => {
    if (err) throw err;
    console.log("> Server started on https://localhost:3000");
  });
});
