import * as mongoose from 'mongoose';

export const BlogSchema = new mongoose.Schema({
  title: String,
  description: String,
  authorId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  imageUrl: String
},
{
  timestamps: true,
});