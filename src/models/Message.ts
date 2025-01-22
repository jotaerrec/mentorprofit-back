import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  ip: string;
  userAgent: string;
  messages: {
    text: string;
    response: string;
    timestamp: Date;
  }[];
}

const MessageSchema: Schema = new Schema({
  ip: { type: String, required: true },
  userAgent: { type: String, required: true },
  messages: [
    {
      text: { type: String, required: true },
      response: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

export default mongoose.model<IMessage>('Message', MessageSchema);
