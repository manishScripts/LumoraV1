import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(401).json({
                message: "Something is missing, please check!",
                success: false,
            });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(401).json({
                message: "Try different email",
                success: false,
            });
        };
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            username,
            email,
            password: hashedPassword
        });
        return res.status(201).json({
            message: "Account created successfully.",
            success: true,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
}
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                message: "Something is missing, please check!",
                success: false,
            });
        }
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false,
            });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false,
            });
        };

        const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });

        // populate each post if in the posts array
        const populatedPosts = await Promise.all(
            (user.posts || []).map( async (postId) => {
                const post = await Post.findById(postId);
                if(post && post.author && post.author.equals(user._id)){
                    return post;
                }
                return null;
            })
        );
        
        // Filter out any null values from missing or invalid posts
        const activePosts = populatedPosts.filter(post => post !== null);

        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            posts: activePosts
        }
        console.log(`User ${user.username} logged in successfully`);
        return res.cookie('token', token, { httpOnly: true, sameSite: 'lax', secure: false, maxAge: 1 * 24 * 60 * 60 * 1000 }).json({
            message: `Welcome back ${user.username}`,
            success: true,
            user
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
};
export const logout = async (_, res) => {
    try {
        return res.cookie("token", "", { maxAge: 0 }).json({
            message: 'Logged out successfully.',
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
};
export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        let user = await User.findById(userId).populate({path:'posts', options: { sort: { createdAt: -1 } }}).populate('bookmarks').populate('followers').populate('following');
        return res.status(200).json({
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
};

export const editProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { bio, gender } = req.body;
        const profilePicture = req.file;
        console.log('Received profilePicture:', profilePicture); // Log the received file
        let cloudResponse;

        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);
            console.log('File URI created:', fileUri.substring(0, 50) + '...'); // Log part of the data URI
            try {
                cloudResponse = await cloudinary.uploader.upload(fileUri);
                console.log('Cloudinary upload response:', cloudResponse); // Log Cloudinary response
            } catch (cloudinaryError) {
                console.error('Cloudinary upload failed:', cloudinaryError); // Log Cloudinary specific errors
                return res.status(500).json({
                    message: 'Profile picture upload failed.',
                    success: false
                });
            }
        }

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({
                message: 'User not found.',
                success: false
            });
        };
        if (bio) user.bio = bio;
        if (gender && (gender === 'male' || gender === 'female')) user.gender = gender;
        if (req.body.highlights) {
            try {
                user.highlights = JSON.parse(req.body.highlights);
            } catch (e) {
                console.error("Error parsing highlights:", e);
            }
        }
        if (profilePicture) user.profilePicture = cloudResponse.secure_url;

        await user.save();
        console.log('User saved successfully with new profilePicture:', user.profilePicture); // Log after save

        return res.status(200).json({
            message: 'Profile updated.',
            success: true,
            user
        });

    } catch (error) {
        console.error('Error in editProfile:', error);
        return res.status(500).json({
            message: error.message || 'Internal server error',
            success: false
        });
    }
};
export const getSuggestedUsers = async (req, res) => {
    try {
        const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");
        if (!suggestedUsers) {
            return res.status(400).json({
                message: 'Currently do not have any users',
            })
        };
        return res.status(200).json({
            success: true,
            users: suggestedUsers
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
};
export const followOrUnfollow = async (req, res) => {
    try {
        const followKrneWala = req.id; 
        const jiskoFollowKrunga = req.params.id; 
        if (followKrneWala === jiskoFollowKrunga) {
            return res.status(400).json({
                message: 'You cannot follow/unfollow yourself',
                success: false
            });
        }

        let user = await User.findById(followKrneWala);
        let targetUser = await User.findById(jiskoFollowKrunga);

        if (!user || !targetUser) {
            return res.status(400).json({
                message: 'User not found',
                success: false
            });
        }
        const isFollowing = user.following.includes(jiskoFollowKrunga);
        if (isFollowing) {
            await Promise.all([
                User.updateOne({ _id: followKrneWala }, { $pull: { following: jiskoFollowKrunga } }),
                User.updateOne({ _id: jiskoFollowKrunga }, { $pull: { followers: followKrneWala } }),
            ])
        } else {
            await Promise.all([
                User.updateOne({ _id: followKrneWala }, { $push: { following: jiskoFollowKrunga } }),
                User.updateOne({ _id: jiskoFollowKrunga }, { $push: { followers: followKrneWala } }),
            ])
        }
        user = await User.findById(followKrneWala).populate('posts').populate('bookmarks');
        targetUser = await User.findById(jiskoFollowKrunga).populate('posts').populate('bookmarks');

        return res.status(200).json({
            message: isFollowing ? 'Unfollowed successfully' : 'followed successfully',
            success: true,
            user,
            targetUser
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
}