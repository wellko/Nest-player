import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Track, TrackDocument } from './track.schema';
import { Model } from 'mongoose';
import { CreateTrackDto } from './create-track.dto';

@Controller('tracks')
export class TracksController {
  constructor(
    @InjectModel(Track.name)
    private trackModel: Model<TrackDocument>,
  ) {}

  @Get()
  getAllTracks(@Query('album') album: string) {
    if (album) {
      return this.trackModel.find({ album });
    }
    return this.trackModel.find();
  }

  @Post()
  createTrack(@Body() trackData: CreateTrackDto) {
    const track = new this.trackModel({
      name: trackData.name,
      duration: trackData.duration,
      album: trackData.album,
      numberInAlbum: trackData.numberInAlbum,
    });
    return track.save();
  }

  @Delete('id')
  deleteTrack(@Param('id') id: string) {
    return this.trackModel.deleteOne({ _id: id });
  }
}
