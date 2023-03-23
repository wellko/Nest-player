import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Artist, ArtistDocument } from './artist.schema';
import { Model } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateArtistDto } from './create-artist.dto';
import { Album, AlbumDocument } from '../albums/album.schema';
import { Track, TrackDocument } from '../tracks/track.schema';

@Controller('artists')
export class ArtistsController {
  constructor(
    @InjectModel(Artist.name)
    private artistModel: Model<ArtistDocument>,
    @InjectModel(Album.name)
    private albumModel: Model<AlbumDocument>,
    @InjectModel(Track.name)
    private trackModel: Model<TrackDocument>,
  ) {}

  @Get()
  getAllArtists() {
    return this.artistModel.find();
  }

  @Get(':id')
  getOneArtist(@Param('id') id: string) {
    return this.artistModel.find({ _id: id });
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('photo', { dest: './public/uploads/artists/' }),
  )
  createArtist(
    @UploadedFile() file: Express.Multer.File,
    @Body() artistData: CreateArtistDto,
  ) {
    const artist = new this.artistModel({
      name: artistData.name,
      info: artistData.info,
      photo: file ? '/uploads/artists/' + file.filename : null,
    });
    return artist.save();
  }

  @Delete(':id')
  async deleteArtist(@Param('id') id: string) {
    const albums = await this.albumModel.find({ artist: id });
    albums.map(
      async (el) => await this.trackModel.deleteMany({ album: el._id }),
    );
    await this.albumModel.deleteMany({ artist: id });
    return this.artistModel.deleteOne({ _id: id });
  }
}
