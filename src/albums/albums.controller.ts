import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Album, AlbumDocument } from './album.schema';
import { Model } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateAlbumDto } from './create-album.dto';
import { Track, TrackDocument } from '../tracks/track.schema';

@Controller('albums')
export class AlbumsController {
  constructor(
    @InjectModel(Album.name)
    private albumModel: Model<AlbumDocument>,
    @InjectModel(Track.name)
    private trackModel: Model<TrackDocument>,
  ) {}

  @Get()
  getAllAlbums(@Query('artist') artist: string) {
    if (artist) {
      return this.albumModel.find({ artist });
    }
    return this.albumModel.find();
  }

  @Get(':id')
  getOneAlbum(@Param('id') id: string) {
    return this.albumModel.find({ _id: id });
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('photo', { dest: './public/uploads/albums/' }),
  )
  createAlbum(
    @UploadedFile() file: Express.Multer.File,
    @Body() albumData: CreateAlbumDto,
  ) {
    const album = new this.albumModel({
      name: albumData.name,
      year: albumData.year,
      photo: file ? '/uploads/albums/' + file.filename : null,
      artist: albumData.artist,
    });
    return album.save();
  }

  @Delete(':id')
  async deleteAlbum(@Param('id') id: string) {
    await this.trackModel.deleteMany({ album: id });
    return this.albumModel.deleteOne({ _id: id });
  }
}
