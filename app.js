const express=require('express');
const dotenv=require('dotenv');
const methodOverride=require('method-override');
const mongoose=require('mongoose');

const Song=require('./models/song');
const PORT=3001;

const app=express();
dotenv.config();

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected',()=>{
    console.log(`connected to mongoDB ${mongoose.connection.name} .`)
});

//middleware
app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static('public'));

//get
app.get('/',(req,res)=>{
res.redirect('/songs');
});

//read all the songs 
app.get('/songs',async(req,res)=>{
    try{
        const songs=await Song.find({});
        res.render('songs/index',{songs});
    }catch(err){
        console.log(err);
        res.redirect('/');
    }
});

//create a song 
app.get('/songs/new',(req,res)=>{
    res.render('songs/new');
});

app.post('/songs',async(req,res)=>{
    try{
        const song=new Song(req.body);
        await song.save();
        res.redirect('/songs');
    }catch(err){
        console.log(err);
        res.render('songs/new');
    }
});

//show one song
app.get('/songs/:id',async (req,res)=>{
    try{
        const song=await Song.findById(req.params.id);
        if(!song){
            return res.redirect('/songs');
        }
        res.render('songs/show',{song});
    }catch(err){
        console.log(err);
        res.redirect('/songs');
    }

});

//update
app.get('/songs/:id/edit',async(req,res)=>{
      try {
        const song = await Song.findById(req.params.id);
        if (!song) {
            return res.redirect('/songs');
        }
        res.render('songs/edit', { song });
    } catch (err) {
        console.log(err);
        res.redirect('/songs');
    }
});

app.put('/songs/:id', async (req, res) => {
    try {
        await Song.findByIdAndUpdate(req.params.id, req.body);
        res.redirect(`/songs/${req.params.id}`);
    } catch (err) {
        console.log(err);
        res.redirect('/songs');
    }
});


//delete
app.delete('/songs/:id', async (req, res) => {
    try {
        await Song.findByIdAndDelete(req.params.id);
        res.redirect('/songs');
    } catch (err) {
        console.log(err);
        res.redirect('/songs');
    }
});



app.listen(PORT,()=>{
    console.log(`server running on ${PORT}`);
});

