import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

import {
  ElasticCountDocumentsResponse,
  ElasticDocumentResponse,
  ElasticReindexResponse,
  ElasticTaskResponse,
  ElasticTransformStatsResponse,
} from '../interfaces';

@Injectable()
export class ElasticControlClientService {
  constructor(private readonly elastic: ElasticsearchService) {}

  getIndex(index: string): Promise<void> {
    return this.elastic.transport.request({
      method: 'GET',
      path: `/${encodeURIComponent(index)}`,
    });
  }

  createIndex(index: string, body: unknown): Promise<void> {
    return this.elastic.transport.request({
      method: 'PUT',
      path: `/${encodeURIComponent(index)}`,
      body,
    });
  }

  deleteIndex(index: string): Promise<void> {
    return this.elastic.transport.request({
      method: 'DELETE',
      path: `/${encodeURIComponent(index)}`,
    });
  }

  createTransform(transformId: string, body: unknown): Promise<void> {
    return this.elastic.transport.request({
      method: 'PUT',
      path: `/_transform/${encodeURIComponent(transformId)}`,
      body,
    });
  }

  startTransform(transformId: string): Promise<void> {
    return this.elastic.transport.request({
      method: 'POST',
      path: `/_transform/${encodeURIComponent(transformId)}/_start`,
    });
  }

  stopTransform(transformId: string): Promise<void> {
    return this.elastic.transport.request({
      method: 'POST',
      path: `/_transform/${encodeURIComponent(transformId)}/_stop`,
      querystring: {
        force: true,
        // elastic defined property
        // eslint-disable-next-line @typescript-eslint/naming-convention
        wait_for_completion: true,
      },
    });
  }

  deleteTransform(transformId: string): Promise<void> {
    return this.elastic.transport.request({
      method: 'DELETE',
      path: `/_transform/${encodeURIComponent(transformId)}`,
    });
  }

  getTransformStats(
    transformId: string,
  ): Promise<ElasticTransformStatsResponse> {
    return this.elastic.transport.request({
      method: 'GET',
      path: `/_transform/${encodeURIComponent(transformId)}/_stats`,
    });
  }

  getDocument(index: string, id: string): Promise<ElasticDocumentResponse> {
    return this.elastic.transport.request({
      method: 'GET',
      path: `/${encodeURIComponent(index)}/_doc/${encodeURIComponent(id)}`,
    });
  }

  countDocuments(
    index: string,
    body: unknown,
  ): Promise<ElasticCountDocumentsResponse> {
    return this.elastic.transport.request({
      method: 'POST',
      path: `/${encodeURIComponent(index)}/_count`,
      body,
    });
  }

  createDocument(index: string, id: string, body: unknown): Promise<void> {
    return this.elastic.transport.request({
      method: 'PUT',
      path: `/${encodeURIComponent(index)}/_doc/${encodeURIComponent(id)}`,
      body,
      querystring: {
        refresh: 'wait_for',
      },
    });
  }

  updateDocument(index: string, id: string, doc: unknown): Promise<void> {
    return this.elastic.transport.request({
      method: 'POST',
      path: `/${encodeURIComponent(index)}/_update/${encodeURIComponent(id)}`,
      // elastic defined property
      // eslint-disable-next-line @typescript-eslint/naming-convention
      body: { doc, doc_as_upsert: true },
      querystring: {
        refresh: 'wait_for',
        // elastic defined property
        // eslint-disable-next-line @typescript-eslint/naming-convention
        retry_on_conflict: 3,
      },
    });
  }

  putIngestPipeline(pipelineId: string, body: unknown): Promise<void> {
    return this.elastic.transport.request({
      method: 'PUT',
      path: `/_ingest/pipeline/${encodeURIComponent(pipelineId)}`,
      body,
    });
  }

  reindex(body: unknown): Promise<ElasticReindexResponse> {
    return this.elastic.transport.request({
      method: 'POST',
      path: '/_reindex',
      body,
      querystring: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        wait_for_completion: 'false',
      },
    });
  }

  getTask(taskId: string): Promise<ElasticTaskResponse> {
    return this.elastic.transport.request({
      method: 'GET',
      path: `/_tasks/${encodeURIComponent(taskId)}`,
    });
  }
}
