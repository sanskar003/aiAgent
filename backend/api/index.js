import app from "../index.mjs";
import serverless from "serverless-http";

// Wrap the Express app in a serverless handler
export default serverless(app);