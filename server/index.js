require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const authRouter = require("./routes/auth")
const postRouter = require("./routes/post")

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster1.hzy9k.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
      {
        useNewURLParser: true,
        useUnifiedTopology: true,
      }
    )
    console.log("Mongoose connection")
  } catch (error) {
    console.log(error.message), process.exit(1)
  }
}
connectDB()
const app = express()
app.use(express.json())
app.use(
  cors(
    {
      origin: "*"
    }
  )
)
app.use("/api/auth", authRouter)
app.use("/api/posts", postRouter)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`server stared on port ${PORT}`))
