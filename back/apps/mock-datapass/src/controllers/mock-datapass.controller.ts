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

import { PostWebhookBodyDto } from '../dto';
import { MockDatapassRoutes } from '../enums';
import { MockDatapassService, PayloadPreset } from '../services';

@Injectable()
@Controller()
export class MockDatapassController {
  constructor(private readonly mockDatapassService: MockDatapassService) {}

  @Get(MockDatapassRoutes.INDEX)
  @Render('index')
  getIndex(): { payloadPresets: PayloadPreset[]; defaultPayload: string } {
    const payloadPresets = this.mockDatapassService.getPayloadPresets();

    return {
      payloadPresets,
      defaultPayload: payloadPresets[0]?.payload ?? '',
    };
  }

  @Post(MockDatapassRoutes.WEBHOOK)
  @UsePipes(ValidationPipe)
  @Render('result')
  async postWebhook(
    @Body() body: PostWebhookBodyDto,
  ): Promise<AxiosResponse<unknown>> {
    const { payload } = body;

    const response = await this.mockDatapassService.handleWebhook(payload);

    return response;
  }
}
