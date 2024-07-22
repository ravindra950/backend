const express = require('express')
const app=express();
const mongoose = require('mongoose')
app.use(express.json());
const bcrypt=require('bcryptjs')
const mongoUrl="mongodb+srv://ravi123:admin@cluster0.2rzu4cw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const jwt=require("jsonwebtoken");
const JWT_SECRET="hbhcmkmieenkcmcwekckmckcikmckmckeeii7673309u9jncjdhcbhcbjcnh";
mongoose.connect(mongoUrl).then(()=>{
    console.log("Database Connected!")
}).catch((e)=>{
    console.log(e);
})

require("./UserDetails");

const User=mongoose.model("UserInfo");

app.get("/",(req,res)=>{
     res.send({status:"Started"})
})


app.post('/register',async(req,res)=>{
    const {name,email,password}=req.body;
    console.log(req.body);
    const oldUser=await User.findOne({email:email})
    if(oldUser)
    {
        return res.send({data:'User already exits!'});
    }

    const encryptedPassword=await bcrypt.hash(password,10)
    try{
await User.create({
    name:name,
    email:email,
    password:encryptedPassword,
});
res.send({status:'ok',data:'User created'})
    }
    catch(e){
        res.send({status:'e',data:e})

    }
})


app.post("/login-user",async(req,res)=>{
    const {email,password}=req.body;
    console.log(req.body);

    const oldUser=await User.findOne({email:email});

    if(!oldUser){
        return  res.send({data:"User doesn't exitsts!!"})
    }

    if(await bcrypt.compare(password,oldUser.password))
    {
const token=jwt.sign({email:oldUser.email},JWT_SECRET);
if(res.status(201))
{
    return res.send({status:"ok",data:token})
}
else
{
    return res.send({error:"error"});
}
    }

})

app.listen(5001,()=>{
    console.log("Nodejs server started..")
})

