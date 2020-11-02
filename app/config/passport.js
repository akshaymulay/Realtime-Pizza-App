const LocalStratagy=require('passport-local').Strategy
const User=require('../models/user')
const bcrypt=require('bcrypt')
function init(passport){
	passport.use(new LocalStratagy({ usernameField:'email'},async (email,password,done)=>{
		//login
		//check if email exist
		const user=await User.findOne({email:email})
		if(!user){
			return done(null,false,{message:'No User With This Email'})
		}
		bcrypt.compare(password,user.password).then(match=>{
			if(match){
				return done(null,user,{message:'Logged in Succesfully'})
			}
			return done(null,false,{message:'Wrong Username or password'})
		}).catch(err=>{
			return done(null,false,{message:'Something went Wrong'})
		})
	}))
	passport.serializeUser((user,done)=>{
		done(null,user._id)
	})
	passport.deserializeUser((id,done)=>{
		User.findById(id,(err,user)=>{
			done(err,user)
		})

	})
	
}
module.exports=init