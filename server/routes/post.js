const express =require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth')
const Post = require('../models/Post')

//@route GET api/post      
//@desc GET  post
//@access Private

router.get('/', verifyToken, async(req, res) =>{
    try{
        const posts = await Post.find({user: req.userId }).populate('user',['username'])
        res.json({success: true, posts})
    }
    catch(error){
        console.log(error)
        res.status(500).json({success: false, message: 'Internal server error'})
    }

})

//@route POST api/post      
//@desc Create post
//@access Private

router.post('/', verifyToken, async (req, res) => {
    const{title, description, url, status} = req.body

    //simple validation
    if(!title)
    return res.status(400).json({success: false, message: "Title is required"})
    try{
        const newPost = new Post({
            title,
            description,
            url: url.startsWith('https://') ? url : `https://${url}`,
            status: status || 'TO LEARN',  
            user :  req.userId    
        })
        await newPost.save()
        res.json({success: true, message : 'Happy Learning!', post: newPost})
    }
    catch(error){
        console.log(error)
        res.status(500).json({success: false, message: 'Internal server error'})
    }

})

//@route PUT api/post      
//@desc Update post
//@access Private


router.put('/:id', verifyToken, async(req, res)=>{
    const {title, description , url , status} = req.body

    if(!title)
    return res.status(400).json({success: false, message: "Title is required"})
    try{
        let  updatePost ={
            title,
            description : description || '',
            url: url.startsWith('https://') ? url : `https://${url}` || '',
            status: status || 'TO LEARN'      
        }

        const postUpdateCondition = { _id: req.params.id, user: req.userId} 

        updatePost = await Post.findOneAndUpdate(postUpdateCondition, updatePost, {new :true})
        // User not authorized to update post or not found post
        if(!updatePost)
        return res.status(401).json({success: false, message: 'Post not found  or user not authorized to update post'})
        
        res.json({success: true, message:'Excellent progress', post: updatePost})
    
    }
    catch(error){
        console.log(error)
        res.status(500).json({success: false, message: 'Internal server error'})
    }
})

//@route DELETE api/posts
//@desc delete post
//@access private

router.delete('/:id', verifyToken, async(req, res)=>{

    try{
        const postDeleteCondition = {_id: req.params.id , user: req.userId}
        const deletePost = await Post.findOneAndDelete(postDeleteCondition)
        //User not authorized or Post not found
        if(!deletePost)
        res.status(401).json({success: false, message: 'User not authorized or Post not found'})
        res.json({success: true, post:  deletePost})
    }
    
    catch(error){
        console.log(error)
        res.status(500).json({success: false, message: 'Internal server error'})        
    }
})

module.exports = router