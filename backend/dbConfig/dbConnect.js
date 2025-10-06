import mongoose from 'mongoose'

const dbConnect=async()=>{
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log('DB connected succesfully');
        
    } catch (error) {
        console.log("Errro while connecting to Database");
        return 
        
    }
}
export default dbConnect;