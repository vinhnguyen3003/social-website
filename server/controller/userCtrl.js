const Users = require('../models/userModel');
const mongoose = require('mongoose');

const userCtrl = {
    getUser: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id).populate("followers following", "-password");//req.user.id : params of jwt return
            if(!user) return res.json({success: false, message: "Account does not exist"})
            res.json({success: true, user})
        } catch (error) {
            res.status(500).json({success: false, message: "Internal Server Error"});
        }
    },
    getUserById: async (req, res) => {
        try {
            if(!mongoose.Types.ObjectId.isValid(req.params.id))
            return res.json({success: false})

            const user = await Users.findById(req.params.id).select('-password')
            .populate("friends followers following", "-password");
            
            if(!user) return res.json({message: "User does not exist."})
            res.json({success: true, user})
        } catch (error) {
            res.status(500).json({success: false, message: error.message});
        }
    },
    searchUser: async (req, res) => {
        try {
            const users = await Users.find({username: {$regex: req.query.username, $options: 'i'}}).limit(10).select("username nickname avatar following");         //$options: 'i' : uppercase, lowercase
            
            res.json({success: true, users})
        } catch (err) {
            return res.status(500).json({message: err.message})
        }
    },
    follow: async (req, res) => {
        try {
            const user = await Users.find({_id: req.params.id, followers: req.user.id})
            if(user.length > 0) return res.status(500).json({success: false, message: "You followed this user."})

            const newUser = await Users.findOneAndUpdate({_id: req.params.id}, { 
                $push: {followers: req.user.id}
            }, {new: true}).populate("followers following", "-password")

            await Users.findOneAndUpdate({_id: req.user.id}, {
                $push: {following: req.params.id}
            }, {new: true})

            res.json({success: true, newUser})

        } catch (err) {
            return res.status(500).json({message: err.message})
        }
    },
    unfollow: async (req, res) => {
        try {

            const newUser = await Users.findOneAndUpdate({_id: req.params.id}, { 
                $pull: {followers: req.user.id}
            }, {new: true}).populate("followers following", "-password")

            await Users.findOneAndUpdate({_id: req.user.id}, {
                $pull: {following: req.params.id}
            }, {new: true})

            res.json({success: true, newUser})

        } catch (err) {
            return res.status(500).json({success: false, message: err.message})
        }
    },
    updateUser: async (req, res) => {
        try {
            const { username, nickname, avatar, gender, mobile, address } = req.body
            if(!username) return res.status(400).json({success: false, msg: "Please add your username."})

            await Users.findOneAndUpdate({_id: req.user.id}, {
                username, nickname, avatar, gender, mobile, address
            })

            res.json({success: true, message: "Update Successfully!"})

        } catch (err) {
            return res.status(500).json({message: err.message})
        }
    },
    suggestedUser: async (req, res) => {
        try {
            const userObject = await Users.findById(req.user.id).select('-password')
            const newArr = [...userObject.following, userObject._id]

            const num  = req.query.num || 3

            const users = await Users.aggregate([
                { $match: { _id: { $nin: newArr } } }, //$nin: l???y ra c??c gi?? tr??? kh??ng c?? ch???a trong m???ng
                { $sample: { size: Number(num) } }, //$sample: random ng???u nhi??n gi?? tr??? v???i ????? r???ng ???????c truy???n v??o 
                { $lookup: { from: 'users', localField: 'followers', foreignField: '_id', as: 'followers' } }, //$lookup: n???i d??? li???u gi???a Users v?? users ??ang t???o b???ng vi???c l???y d??? li???u ??? field followers c???a Users sao cho gi?? tr??? c???a field n??y b???ng gi?? tr??? c???a field _id trong users
                { $lookup: { from: 'users', localField: 'following', foreignField: '_id', as: 'following' } },
            ]).project("-password")

            return res.json({
                success: true,
                users,
                result: users.length
            })

        } catch (err) {
            return res.status(500).json({message: err.message})
        }
    }
}

module.exports = userCtrl