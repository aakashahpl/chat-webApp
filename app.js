import express from "express";
import multer from "multer";
import { Server } from "socket.io";
const app = express();
app.use(express.static("public"));
const PORT = 3000;

let connectedSockets = new Set();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("inside multer code ");
        cb(null, "./public");
    },
    filename: (req, file, cb) => {
        const fileName = Date.now() + "-" + file.originalname;
        req.body.fileName = fileName;
        cb(null, fileName);
    },
});

const upload = multer({ storage: storage });

const server = app.listen(PORT, () => {
    console.log(`server is listening on PORT ${PORT}`);
});

app.post('/upload', upload.single('file'), (req, res) => {
    try {

        if (req.file) {
            const filePath = `localhost:3000/${req.body.fileName}`;
            console.log('Upload Successful', filePath);
            const message = {
                name: req.body.name,
                message: req.body.message,
                dateTime: new Date(),
                filePath: filePath
            };
            io.emit("chatMessage", message);
            res.send({ status: 'success', url: filePath });
        } else {
            const message = {
                name: req.body.name,
                message: req.body.message,
                dateTime: new Date(),
            }
            io.emit("chatMessage", message);
        }
    } catch (error) {
        res.status(500).send({ status: 'fail', message: 'File upload failed' });
    }
});

const io = new Server(server);
io.on("connection", (socket) => {
    console.log(socket.id);
    connectedSockets.add(socket.id);
    io.emit("client-total", connectedSockets.size);
    socket.on('message', (data) => {
        console.log(data);
        socket.broadcast.emit("chatMessage", data);
    })
    socket.on("disconnect", () => {
        console.log(`disconneted socket : ${socket.id}`);
        connectedSockets.delete(socket.id);
        io.emit("client-total", connectedSockets.size);
    });
});
