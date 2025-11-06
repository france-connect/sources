import { AxiosResponse } from 'axios';

import {
  Body,
  Controller,
  Get,
  Injectable,
  Post,
  Render,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { DatapassEvents } from '@fc/datapass';

import { PostWebhookBodyDto } from '../dto';
import { MockDatapassRoutes } from '../enums';
import { MockDatapassService } from '../services';

@Injectable()
@Controller()
export class MockDatapassController {
  constructor(private readonly mockDatapassService: MockDatapassService) {}

  @Get(MockDatapassRoutes.INDEX)
  @Render('index')
  getIndex(): void {}

  @Post(MockDatapassRoutes.WEBHOOK)
  @UsePipes(ValidationPipe)
  @Render('result')
  async postWebhook(
    @Body() body: PostWebhookBodyDto,
  ): Promise<AxiosResponse<unknown>> {
    const { event } = body;

    const result = await this.mockDatapassService.handleWebhook(
      event as DatapassEvents,
    );

    return result;
  }
}
