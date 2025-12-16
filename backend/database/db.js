import mongoose from 'mongoose'


const connectDB = async () => {

  try {
    await mongoose.connect(`${process.env.MONGO_URI}/ecomm`);
    console.log('mongo db connected successfully')
  } catch (error) {
    console.log("Mongo BD connection Failed", error)
  }
}

export default connectDB


