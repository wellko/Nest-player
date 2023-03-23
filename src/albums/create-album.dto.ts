import { Schema } from 'mongoose';

export class CreateAlbumDto {
  name: string;
  year: number;
  artist: Schema.Types.ObjectId;
  photo: string | null;
}
