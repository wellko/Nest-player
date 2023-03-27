import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Track, TrackDocument } from './track.schema';
import { Model } from 'mongoose';
import { CreateTrackDto } from './create-track.dto';
import { TokenAuthGuard } from '../auth/token-auth.guard';
import { AdminGuardGuard } from '../auth/admin-guard.guard';

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

  @UseGuards(TokenAuthGuard)
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

  @UseGuards(TokenAuthGuard, AdminGuardGuard)
  @Delete(':id')
  deleteTrack(@Param('id') id: string) {
    return this.trackModel.deleteOne({ _id: id });
  }
}
