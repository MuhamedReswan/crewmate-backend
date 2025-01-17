import express from 'express';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello, TypeScript Node Express!');
});

app.use("/service-boy/auth",)

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});