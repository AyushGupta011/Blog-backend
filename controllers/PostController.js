import Post from "../models/Post.js";

export const createPost = async (req, res) => {
  const { title, content } = req.body;
    try {
        const newPost = new Post({ title, content, author:req.user.id });
        await newPost.save();
        res.status(201).json({ message: "Post created successfully", post: newPost });
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'username email');
        res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const getPostById = async (req, res) => {
  const { id } = req.params;
    try {
        const post = await Post.findById(id).populate('author', 'username email');

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json(post);
    }
    catch (error) {
        console.error("Error fetching post:", error);
        res.status(500).json({ message: "Internal server error" });
    }   
};
export const deletePost = async (req, res) => {
  const { id } = req.params;    
    try {
        const post = await Post.findByIdAndDelete(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

