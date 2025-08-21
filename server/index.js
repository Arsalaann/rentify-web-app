const express = require('express')
const mongoose = require('mongoose');
const nodemailer=require('nodemailer');
const config=require('config');
const path=require('path');

const app = express();
app.use(express.json());


let transporter;

	try{
		transporter =nodemailer.createTransport({
  			service: 'gmail',
  			auth: {
    			user: 'dforwebapps@gmail.com',
    			pass: 'sxze zgzl qaky gepo'//config.get('mail.MAIL_PASSWORD')
  			}
  		})
  		console.log("Mail server connected");
  	}
  	catch(err){
  		console.log("Password needed for mail server: mail server connection failure")
  	}


const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
//const d_pass=config.get('database.DATABASE_PASSWORD');

mongoose.connect(`mongodb+srv://databaseformongodb:JAHcKSZgZtAl9v2I@cluster0.2wu77hr.mongodb.net/rentify?retryWrites=true&w=majority&appName=Cluster0`,clientOptions)
	.then(()=>mongoose.connection.db.admin().command({ ping: 1 }))
    .then(() => console.log("Database Connected Successfully"))
    .catch((err) => console.error("Database connection failure ", err));

const propertySchema = new mongoose.Schema({
    name: String,
    lastName: String,
    password: String,
    email: {type:String,unique:true},
    mobile: String,
    postLiked:[String],
    posts: [{
        desc: String,
        areaSize: String,
        price: Number,
        bedrooms: Number,
        bathroom: Number,
        likes: {type:Number,default:0},
        address: String
    }]
});

const User = mongoose.model('User', propertySchema);

const addUser = async (data) => {
    let result = await User.find({ email: data.email });
    if (result.length == 0) {
        const user = new User({
            name: data.name,
            lastName: data.lastName,
            password: data.password,
            email: data.email,
            mobile: data.mobile,
            posts: []
        });
        await user.save();
        console.log("user added")
        return [];
    } 
    else{
        console.log("user not added")
        return result;
    }
}



const addUserObj= {
     name:"abcds",
     lastName:"asdsad",
     password:"1",
     email:"1",
     mobile:"123122414",
     postLiked:[],
     posts:[{
         desc:"Its a good property", 
         areaSize:"10X10",
         price:300,
         bedrooms:2,
         bathroom:2,
         likes:0,
         address:"Bhoond,46203124"
     }]
 };
//addUser(addUserObj);





//if user not logged-in

app.get('/all-posts', async (req, res) => {
    const result = await User.find();
    res.json({ data: result });
});

app.post('/users/add-user', async (req, res) => {
    const result=await addUser(req.body);
    res.json({ data: result });
})
  
app.post('/users', async (req, res) => {
    const result =await User.findOne({ email: req.body.email, password: req.body.password });
    if(result!=null)
        res.json({data: result});
    else
        res.json({data:""});
})




//if user logged-in 
app.post('/users/send-mail',async(req,res)=>{

	const sendMail=(mailBody)=>{
		transporter.sendMail(mailBody, (error, info)=>{
  			if (error){
    			console.log("err: ",error);
  			}else{ 
    			console.log('Email sent to '+req.body.mailBody.email+' : ' + info.response);
			}
		});
	}

	if(req.body.userInterested.email===req.body.postOwner.email)
		return;
	
	const postInterestedUser = {
  		from: 'dforwebapps@gmail.com',
  		to: req.body.userInterested.email,
  		subject: 'Here is Details of property Owner you showed interest on Rentify',
  		text:`Dont shy just contact them
  			name: ${req.body.postOwner.name} 
  			email: ${req.body.postOwner.email} 
  			mobile: ${req.body.postOwner.mobile}` 
	};
	
	

	const postOwner = {
  		from: 'dforwebapps@gmail.com',
  		to: req.body.postOwner.email,
  		subject: 'Someone shows interest on your property on Rentify',
  		text: `Here is person details
  				name: ${req.body.userInterested.name} 
  				email: ${req.body.userInterested.email} 
  				mobile: ${req.body.userInterested.mobile}`
	};

	sendMail(postInterestedUser);
	sendMail(postOwner);

});


app.post('/users/posts/toggle-likes',async(req,res)=>{
    const doc=await User.findOne({'posts._id':req.body.id});
    for(let i=0;i<doc.posts.length;i++){
        if(doc.posts[i]._id==req.body.id){
            doc.posts[i].likes+=parseInt(req.body.update);
            break;
        }
    }
    await doc.save();

    const doc1=await User.findOne({email:req.body.email});
    if(parseInt(req.body.update)===1){
        doc1.postLiked.push(req.body.id);
        await doc1.save();
    }else{
        for(let i=0;i<doc1.postLiked.length;i++){
            if(doc1.postLiked[i]===req.body.id){
                doc1.postLiked.splice(i,1);
                await doc1.save();
                break;
            }
        }
    }
    
    
    res.json({data:doc1});
})





app.post('/users/add-post',async(req,res) => {
    const doc=await User.findOne({email:req.body.email});
    doc.posts.push({
        ...req.body.userInput,
        bedrooms:parseInt(req.body.userInput.bedrooms),
        bathroom:parseInt(req.body.userInput.bathroom)
    });
    await doc.save();
    res.json({data:doc});
})

app.post('/users/delete-post',async(req,res)=>{
    const doc=await User.findOne({'posts._id':req.body.id});
    for(let i=0;i<doc.posts.length;i++){
        if(doc.posts[i]._id==req.body.id){
            doc.posts.splice(i,1);
            await doc.save();
            break;
        }
    }
    res.json({data:doc});
})

//login logout doesnt matter
app.post('/users/posts/filter',async(req,res)=>{
	const result=[];
	const docs=await User.find();
	if(req.body.filter.price!=="" && req.body.filter.bedrooms!=="" && req.body.filter.bathroom!==""){
		await docs.forEach((doc)=>{
			let dummy={...doc,'posts':[]};
			for(let i=0;i<doc.posts.length;i++){
				if(doc.posts[i].price<=parseInt(req.body.filter.price) && 
				doc.posts[i].bedrooms<=parseInt(req.body.filter.bedrooms) && 
				doc.posts[i].bathroom<=parseInt(req.body.filter.bathroom))	
					dummy.posts.push(doc.posts[i]);
			}
			if(dummy.posts.length>0)
				result.push(dummy);
		})
		res.json({data:result});
	}
	
	else if(req.body.filter.price!==""){
		if(req.body.filter.bedrooms==="" && req.body.filter.bathroom===""){
			await docs.forEach((doc)=>{
			let dummy={...doc,'posts':[]};
			for(let i=0;i<doc.posts.length;i++)
				if(doc.posts[i].price<=parseInt(req.body.filter.price))	
					dummy.posts.push(doc.posts[i]);

			if(dummy.posts.length>0)
				result.push(dummy);
			})
			res.json({data:result});
    	} 
   		else if(req.body.filter.bedrooms!==""){
    		await docs.forEach((doc)=>{
			let dummy={...doc,"posts":[]};
			for(let i=0;i<doc.posts.length;i++){
				if(doc.posts[i].price<=parseInt(req.body.filter.price) && 
				doc.posts[i].bedrooms<=parseInt(req.body.filter.bedrooms))	
					dummy.posts.push(doc.posts[i]);
			}
			if(dummy.posts.length>0)
				result.push(dummy);
			})
			res.json({data:result});
    	}
    	else{
    		const x=await docs.forEach((doc)=>{
			let dummy={...doc,'posts':[]};
			for(let i=0;i<doc.posts.length;i++){
				if(doc.posts[i].price<=parseInt(req.body.filter.price) && 
				doc.posts[i].bathroom<=parseInt(req.body.filter.bathroom))	
					dummy.posts.push(doc.posts[i]);
			}
			if(dummy.posts.length>0)
				result.push(dummy);
			})
			res.json({data:result});
    	}
		
	}
    	
    
    //if we are here it means price is null
    else if(req.body.filter.bedrooms!==""){
    	if(req.body.filter.bathroom!==""){
    		const x=await docs.forEach((doc)=>{
			let dummy={...doc,'posts':[]};
			for(let i=0;i<doc.posts.length;i++){
				if(doc.posts[i].bedrooms<=parseInt(req.body.filter.bedrooms) && 
				doc.posts[i].bathroom<=parseInt(req.body.filter.bathroom))	
					dummy.posts.push(doc.posts[i]);
			}
			if(dummy.posts.length>0)
				result.push(dummy);
			})
			res.json({data:result});
    	}else{
    		const x=await docs.forEach((doc)=>{
			let dummy={...doc,'posts':[]};
			for(let i=0;i<doc.posts.length;i++)
				if(doc.posts[i].bedrooms<=parseInt(req.body.filter.bedrooms))	
					dummy.posts.push(doc.posts[i]);
			
			if(dummy.posts.length>0)
				result.push(dummy);
			})
			res.json({data:result});
    	}
    	
    }
    
    //if we are here means price and bedrooms are null
    else{
    		const x=await docs.forEach((doc)=>{
			let dummy={...doc,'posts':[]};
			for(let i=0;i<doc.posts.length;i++)
				if(doc.posts[i].bathroom<=parseInt(req.body.filter.bathroom))	
					dummy.posts.push(doc.posts[i]);
			
			if(dummy.posts.length>0)
				result.push(dummy);
			})
			res.json({data:result});
    	}
    
})

app.use(express.static(path.join(__dirname, '../client/build')));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log("Listening on Port ", port));

