import express from 'express';
import cors from 'cors';
import { authRouter } from './infrastructure/routes/auth_route';

const app = express()
const port = 3000
app.use(express.json());
app.use('/api', authRouter);
app.use(cors({
  origin: 'http://localhost:5173'
}))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
