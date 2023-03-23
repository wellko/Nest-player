import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type AlbumDocument = Album & Document;

@Schema()
export class Album {
  @Prop({ required: true })
  name: string;
  @Prop()
  photo: string;
  @Prop({ required: true, min: 1800, max: 2023 })
  year: number;
  @Prop({ ref: 'Artist', required: true })
  artist: mongoose.Schema.Types.ObjectId;
}

export const AlbumSchema = SchemaFactory.createForClass(Album);
