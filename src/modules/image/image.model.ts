import { required } from "joi";
import mongoose, { Schema } from "mongoose";


interface IImage {
    userId: mongoose.Types.ObjectId;
    name: String;
    fileName: String;
    size: Number;
    transformation: Array<String>;
}

const imageSchema = new mongoose.Schema<IImage>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    fileName: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    size: {
        type: Number,
        required: true,
        min: 0
    },
    transformation: {
        type: [String],
        default: [],
    }
}, {
    timestamps: true
})


const Image = mongoose.model<IImage>("Image", imageSchema);

export default Image;