import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Test, TestingModule } from '@nestjs/testing';

import {
  ElasticCountDocumentsResponse,
  ElasticDocumentResponse,
  ElasticTransformStatsResponse,
} from '../interfaces';
import { ElasticControlClientService } from './elastic-control-client.service';

describe('ElasticControlClientService', () => {
  let service: ElasticControlClientService;

  const transportRequestMock = jest.fn();
  const elasticsearchServiceMock = {
    transport: {
      request: transportRequestMock,
    },
  };

  const indexMock = 'indexMock';
  const docIdMock = 'docIdMock';
  const transformIdMock = 'transformIdMock';
  const bodyMock = { foo: 'bar' };
  const docMock = { bar: 'baz' };
  const responseMock = { success: true };

  beforeEach(async () => {
    jest.resetAllMocks();

    transportRequestMock.mockResolvedValue(responseMock);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ElasticControlClientService,
        {
          provide: ElasticsearchService,
          useValue: elasticsearchServiceMock,
        },
      ],
    }).compile();

    service = module.get<ElasticControlClientService>(
      ElasticControlClientService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getIndex', () => {
    it('should call transport.request with correct params', async () => {
      // When
      await service.getIndex(indexMock);

      // Then
      expect(transportRequestMock).toHaveBeenCalledExactlyOnceWith({
        method: 'GET',
        path: `/${indexMock}`,
      });
    });

    it('should return response', async () => {
      // When
      const result = await service.getIndex(indexMock);

      // Then
      expect(result).toBe(responseMock);
    });
  });

  describe('createIndex', () => {
    it('should call transport.request with correct params', async () => {
      // When
      await service.createIndex(indexMock, bodyMock);

      // Then
      expect(transportRequestMock).toHaveBeenCalledExactlyOnceWith({
        method: 'PUT',
        path: `/${indexMock}`,
        body: bodyMock,
      });
    });

    it('should return response', async () => {
      // When
      const result = await service.getIndex(indexMock);

      // Then
      expect(result).toBe(responseMock);
    });
  });

  describe('deleteIndex', () => {
    it('should call transport.request with correct params', async () => {
      // When
      await service.deleteIndex(indexMock);

      // Then
      expect(transportRequestMock).toHaveBeenCalledExactlyOnceWith({
        method: 'DELETE',
        path: `/${indexMock}`,
      });
    });

    it('should return response', async () => {
      // When
      const result = await service.getIndex(indexMock);

      // Then
      expect(result).toBe(responseMock);
    });
  });

  describe('createTransform', () => {
    it('should call transport.request with correct params', async () => {
      // When
      await service.createTransform(transformIdMock, bodyMock);

      // Then
      expect(transportRequestMock).toHaveBeenCalledExactlyOnceWith({
        method: 'PUT',
        path: `/_transform/${transformIdMock}`,
        body: bodyMock,
      });
    });

    it('should return response', async () => {
      // When
      const result = await service.getIndex(indexMock);

      // Then
      expect(result).toBe(responseMock);
    });
  });

  describe('startTransform', () => {
    it('should call transport.request with correct params', async () => {
      // When
      await service.startTransform(transformIdMock);

      // Then
      expect(transportRequestMock).toHaveBeenCalledExactlyOnceWith({
        method: 'POST',
        path: `/_transform/${transformIdMock}/_start`,
      });
    });

    it('should return response', async () => {
      // When
      const result = await service.getIndex(indexMock);

      // Then
      expect(result).toBe(responseMock);
    });
  });

  describe('stopTransform', () => {
    it('should call transport.request with correct params and querystring', async () => {
      // When
      await service.stopTransform(transformIdMock);

      // Then
      expect(transportRequestMock).toHaveBeenCalledExactlyOnceWith({
        method: 'POST',
        path: `/_transform/${transformIdMock}/_stop`,
        querystring: {
          force: true,
          // elastic defined property
          // eslint-disable-next-line @typescript-eslint/naming-convention
          wait_for_completion: true,
        },
      });
    });

    it('should return response', async () => {
      // When
      const result = await service.getIndex(indexMock);

      // Then
      expect(result).toBe(responseMock);
    });
  });

  describe('deleteTransform', () => {
    it('should call transport.request with correct params', async () => {
      // When
      await service.deleteTransform(transformIdMock);

      // Then
      expect(transportRequestMock).toHaveBeenCalledExactlyOnceWith({
        method: 'DELETE',
        path: `/_transform/${transformIdMock}`,
      });
    });

    it('should return response', async () => {
      // When
      const result = await service.getIndex(indexMock);

      // Then
      expect(result).toBe(responseMock);
    });
  });

  describe('getTransformStats', () => {
    it('should call transport.request with correct params', async () => {
      // When
      await service.getTransformStats(transformIdMock);

      // Then
      expect(transportRequestMock).toHaveBeenCalledExactlyOnceWith({
        method: 'GET',
        path: `/_transform/${transformIdMock}/_stats`,
      });
    });

    it('should return response', async () => {
      // When
      const result = await service.getIndex(indexMock);

      // Then
      expect(result).toBe(
        responseMock as unknown as ElasticTransformStatsResponse,
      );
    });
  });

  describe('getDocument', () => {
    it('should call transport.request with correct params', async () => {
      // When
      await service.getDocument(indexMock, docIdMock);

      // Then
      expect(transportRequestMock).toHaveBeenCalledExactlyOnceWith({
        method: 'GET',
        path: `/${indexMock}/_doc/${docIdMock}`,
      });
    });

    it('should return response', async () => {
      // When
      const result = await service.getIndex(indexMock);

      // Then
      expect(result).toBe(responseMock as unknown as ElasticDocumentResponse);
    });
  });

  describe('countDocuments', () => {
    it('should call transport.request with correct params', async () => {
      // When
      await service.countDocuments(indexMock, bodyMock);

      // Then
      expect(transportRequestMock).toHaveBeenCalledExactlyOnceWith({
        method: 'POST',
        path: `/${indexMock}/_count`,
        body: bodyMock,
      });
    });

    it('should return response', async () => {
      // When
      const result = await service.getIndex(indexMock);

      // Then
      expect(result).toBe(
        responseMock as unknown as ElasticCountDocumentsResponse,
      );
    });
  });

  describe('createDocument', () => {
    it('should call transport.request with correct params and querystring', async () => {
      // When
      await service.createDocument(indexMock, docIdMock, bodyMock);

      // Then
      expect(transportRequestMock).toHaveBeenCalledExactlyOnceWith({
        method: 'PUT',
        path: `/${indexMock}/_doc/${docIdMock}`,
        body: bodyMock,
        querystring: {
          refresh: 'wait_for',
        },
      });
    });

    it('should return response', async () => {
      // When
      const result = await service.getIndex(indexMock);

      // Then
      expect(result).toBe(responseMock);
    });
  });

  describe('updateDocument', () => {
    it('should call transport.request with correct params, body wrapper, and querystring', async () => {
      // When
      await service.updateDocument(indexMock, docIdMock, docMock);

      // Then
      expect(transportRequestMock).toHaveBeenCalledExactlyOnceWith({
        method: 'POST',
        path: `/${indexMock}/_update/${docIdMock}`,
        // elastic defined property
        // eslint-disable-next-line @typescript-eslint/naming-convention
        body: { doc: docMock, doc_as_upsert: true },
        querystring: {
          refresh: 'wait_for',
          // elastic defined property
          // eslint-disable-next-line @typescript-eslint/naming-convention
          retry_on_conflict: 3,
        },
      });
    });
    it('should return response', async () => {
      // When
      const result = await service.getIndex(indexMock);

      // Then
      expect(result).toBe(responseMock);
    });
  });

  describe('putIngestPipeline', () => {
    it('should call transport.request with correct params', async () => {
      // When
      await service.putIngestPipeline(docIdMock, bodyMock);

      // Then
      expect(transportRequestMock).toHaveBeenCalledExactlyOnceWith({
        method: 'PUT',
        path: `/_ingest/pipeline/${docIdMock}`,
        body: bodyMock,
      });
    });

    it('should return response', async () => {
      // When
      const result = await service.putIngestPipeline(docIdMock, bodyMock);

      // Then
      expect(result).toBe(responseMock);
    });
  });

  describe('reindex', () => {
    it('should call transport.request with correct params', async () => {
      // When
      await service.reindex(bodyMock);

      // Then
      expect(transportRequestMock).toHaveBeenCalledExactlyOnceWith({
        method: 'POST',
        path: `/_reindex`,
        body: bodyMock,
        querystring: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          wait_for_completion: 'false',
        },
      });
    });

    it('should return response', async () => {
      // When
      const result = await service.reindex(bodyMock);

      // Then
      expect(result).toBe(responseMock);
    });
  });

  describe('getTask', () => {
    it('should call transport.request with correct params', async () => {
      // When
      await service.getTask(docIdMock);

      // Then
      expect(transportRequestMock).toHaveBeenCalledExactlyOnceWith({
        method: 'GET',
        path: `/_tasks/${docIdMock}`,
      });
    });

    it('should return response', async () => {
      // When
      const result = await service.getTask(docIdMock);

      // Then
      expect(result).toBe(responseMock);
    });
  });
});
