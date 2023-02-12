require("make-promises-safe");
require("express-async-errors");
const express = require("express");
const app = express();
const httpServer = require("http").createServer(app);
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");
const { AbstractError } = require("./src/errors/abstract-errors");


// initialize .env file
dotenv.config();

//logs
const log4js = require("log4js");
log4js.configure("./src/config/log4js.json");
const log = log4js.getLogger("app");

// Call start server
startServer();

// Import DB
require("./src/db/mongo-connection");

const indexRoutes = require("./src/routes/index");





// app usages
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});
app.use(log4js.connectLogger(log4js.getLogger("http"), { level: "auto" }));
app.use(express.json());
app.use(cors());
app.use("/api", indexRoutes);
app.use(helmet());
app.use(handleSuccessResponse);

// Error Handler
app.use((e, req, res, next) => {
  //   log.error(e);
  const frame = e?.stack?.split("\n")[1];
  const lineNumber = frame?.split(":")[1];
  const path = frame?.split(":")[0].split("/");
  const file = path?.[path.length - 1];
  const functionName = frame?.split(" ")[5];

  if (process.env.NODE_ENV !== "test" || !e.statusCode) {
    console.info(
      `${e.statusCode || 500} - ${
        e.name
      } - ${file}:${functionName}:${lineNumber} - ${e.message} - ${
        req.originalUrl
      } - ${req.method} - ${req.ip}`
    );

    if (!e.statusCode || e.statusCode === 500) {
      console.trace(e.stack);
    }
  }

  if (e instanceof AbstractError) {
    return res
      .status(e.statusCode)
      .send({ success: false, errors: e.serializeErrors().flat() });
  }

  if (/invalid signature/.test(e) || /JsonWebTokenError/.test(e))
    return res.status(401).send({
      success: false,
      errors: [
        {
          message: content.en.errors.notAuth,
          field: "authToken",
        },
      ],
    });

  res.status(e?.response?.data?.message ? 400 : 500).send({
    success: false,
    errors: [
      {
        message: e?.response?.data?.message || "Something went wrong",
      },
    ],
  });
});

// 404 Handler
app.use((req, res, next) => {
  console.info(
    `404 - NotFound - ${req.originalUrl} - ${req.method} - ${req.ip}`
  );
  res.status(404).send({
    success: false,
    errors: [
      {
        message: "NotFound: there is no handler for this url",
      },
    ],
  });
});

// 404 Handler
app.use((req, res, next) => {
  console.info(
    `404 - NotFound - ${req.originalUrl} - ${req.method} - ${req.ip}`
  );
  res.status(404).send({
    success: false,
    errors: [
      {
        message: "NotFound: there is no handler for this url",
      },
    ],
  });
});

/**
 * Convert response from being the raw data to be object with sucess state
 * and data key
 *
 * @example data: [...] -> {success: true, data: [...]}
 */
function handleSuccessResponse(_, res, next) {
  const originalSend = res.send;
  let dataToSend = null;

  res.send = function (data) {
    res.send = originalSend;

    try {
      // if the response is an error just don't modify it
      if (res.statusCode && res.statusCode < 400) {
        data = JSON.parse(data) || data;
        dataToSend = {
          success: true,
        };
        // console.log(data)
        dataToSend = { ...dataToSend, ...data };
      } else {
        dataToSend = data;
      }
    } catch (e) {
      dataToSend = data;
    }

    // console.log(dataToSend)
    return res.send(dataToSend);
  };

  next();
}

// Start Server Function
function startServer(port = process.env.PORT || 3003) {
  return httpServer.listen(
    port,
    () => process.env.NODE_ENV !== "test" && console.log(`Listening on ${port}`)
  );
}

module.exports = startServer;
