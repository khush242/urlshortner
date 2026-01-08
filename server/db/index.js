import  Mongoose  from "mongoose"

export const connectDb = async () => {
   try {
    const instance =  await Mongoose.connect(process.env.DB_URI, {dbName:"demo"})
    console.log("mongodb database connected")
   } catch (error) {
      console.error("Error in db connection",error);
      process.exit(1);
   }
}