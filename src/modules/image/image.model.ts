import mongoose, { Schema } from "mongoose";

interface ITransformation {
  type: string;
  value: Record<string, any>;
}

interface IDerivedImage {
  url: string;
  fileName: string;
  transformations: ITransformation[];
  createdAt?: Date;
  fingerPrint: string;
}

export interface IImage {
  userId: mongoose.Types.ObjectId;

  original: {
    name: string;
    fileName: string;
    url: string;
    size: number;
    mimetype: string;
  };

  derivedImages: IDerivedImage[];

  status: "pending" | "processing" | "completed";
}

const imageSchema = new mongoose.Schema<IImage>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    original: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      fileName: {
        type: String,
        required: true,
        unique: true,
      },
      url: {
        type: String,
        required: true,
      },
      size: {
        type: Number,
        required: true,
        min: 0,
      },
      mimetype: {
        type: String,
        required: true,
      },
    },

    derivedImages: [
      {
        url: { type: String, required: true },
        fileName: { type: String, required: true },

        transformations: [
          {
            type: { type: String, required: true },
            value: { type: Schema.Types.Mixed },
          },
        ],

        createdAt: {
          type: Date,
          default: Date.now,
        },

        fingerPrint: {
          type: String,
          required: true
        }
      },
    ],

    status: {
      type: String,
      enum: ["pending", "processing", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Image = mongoose.model<IImage>("Image", imageSchema);

export default Image;