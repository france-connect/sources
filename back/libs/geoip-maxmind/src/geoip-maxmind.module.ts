import { Module } from '@nestjs/common';

import { GeoipMaxmindService } from './geoip-maxmind.service';

@Module({
  imports: [],
  controllers: [],
  providers: [GeoipMaxmindService],
  exports: [GeoipMaxmindService],
})
export class GeoipMaxmindModule {}
