import express from "express";
import routes from "./src/routes/crmRoutes";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import "dotenv/config";
import jsonwebtoken from "jsonwebtoken"

const app = express();
const PORT = process.env.PORT || 3000;
const uri = process.env.DB_URL;

//mongoose connection
mongoose.Promise = global.Promise;
mongoose.connect(uri, { useNewUrlParser: true })

// bodyparser setup
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

//JWT setup
app.use((req, res, next) => {
    const [type, token] = (req.headers.authorization || "").split(" ");

    if (type !== "JWT" || !token) {
        req.user = undefined;
        return next();
    }

    jsonwebtoken.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        req.user = err ? undefined : decoded;
        next();
    });
});


//serving static images
app.use(express.static('public'));

routes(app);

app.get('/', (req, res) => res.send(`node express server is runing ${PORT}`))

app.listen(PORT, () => console.log(`your server is runing on ${PORT}`))