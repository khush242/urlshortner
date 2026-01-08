import mongoose ,{model} from "mongoose";
import bcrypt from "bcrypt"
import jwt  from "jsonwebtoken";
const userSchema = new mongoose.Schema({
    email: {
        type:String,
        required:true, 
        unique:true,
        trim:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:true,
    },
    fullName:{
        type:String,
        required:true,
        index:true,
        trim:true,
    },
    refreshToken:{
        type : String,
    },

},{
    timestamps:true
})

userSchema.pre("save" , async function (){

  if(!this.isModified("password")) return ;

  this.password = await bcrypt.hash(this.password,14);

})


userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
};

userSchema.methods.generateAccessToken = async function () {
    
   return  jwt.sign({
            _id : this._id,
            email:this.email,
            fullName:this.fullName
          },
            process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
          }
        )
}

userSchema.methods.generateRefreshToken = async function () {
    
   return  jwt.sign({
            _id : this._id,
          },
            process.env.REFRESH_TOKEN_SECRET,
          {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
          }
        )
}

export const User = model("User", userSchema)