import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type TrackDocument = Track & Document;

@Schema()
export class Track {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  duration: string;
  @Prop({ required: true })
  numberInAlbum: number;
  @Prop({ ref: 'Album', required: true })
  album: mongoose.Schema.Types.ObjectId;
}

export const TrackSchema = SchemaFactory.createForClass(Track);
