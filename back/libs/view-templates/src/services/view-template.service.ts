import { Response } from 'express';

import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import { Instantiable } from '@fc/common';

import { TemplateMethod } from '../decorators';
import { ViewTemplateServiceNotFoundException } from '../exceptions/view-template-service-not-found.exception';
import { HELPERS_PREFIX } from '../tokens';

@Injectable()
export class ViewTemplateService {
  constructor(private moduleRef: ModuleRef) {}

  bindMethodsToResponse(res: Response): void {
    const helpers = TemplateMethod.getList();

    helpers.forEach(({ alias, provider, methodName }) => {
      const helper = this.getHelper(provider, methodName);

      this.exposeHelper(res.locals, alias, helper);
    });
  }

  private exposeHelper(
    list: Record<string, Function>,
    alias: string,
    helper: Function,
  ): void {
    list[`${HELPERS_PREFIX}${alias}`] = helper;
  }

  private getHelper(
    provider: Instantiable | object,
    methodName: string,
  ): Function {
    if (typeof provider === 'object') {
      return this.getInstanceMethod(provider, methodName);
    }
    return this.getStaticMethod(provider, methodName);
  }

  private getInstanceMethod(provider: object, methodName: string): Function {
    try {
      const service = this.moduleRef.get(provider.constructor, {
        strict: false,
      });
      return service[methodName].bind(service);
    } catch (error) {
      throw new ViewTemplateServiceNotFoundException(provider, methodName);
    }
  }

  private getStaticMethod(
    provider: Instantiable,
    methodName: string,
  ): Function {
    return provider[methodName];
  }
}
