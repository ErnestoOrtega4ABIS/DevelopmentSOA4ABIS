import bodyParser from "body-parser";
import express from "express";
import clientRoutes from "./routes/clientRoutes.js";
import swaggerSpec from "./api-docs.js";
import swaggerUI from 'swagger-ui-express';

const app = express();

app.use(bodyParser.json());

app.use('/api/clients', clientRoutes);
app.use('/api-docs', swaggerUI.serve,
    swaggerUI.setup(swaggerSpec));

export default app;