import { Document } from 'mongoose';

export interface Blog extends Document {
  readonly title: string;
  readonly description: number;
  readonly authorId: string;
  readonly imageUrl:string;
}