import { MarkdownGenerator } from './markdown-generator';

describe('MarkdownGenerator', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  describe('generate', () => {
    const envMapMock = {
      instance2: {
        envVar3: 'boolean',
      },
      instance1: {
        envVar1: 'string',
        envVar2: 'number',
      },
    };

    const sortedInstancesMock = [
      {
        instanceName: 'instance1',
        envVars: [
          { name: 'envVar1', type: 'string' },
          { name: 'envVar2', type: 'number' },
        ],
      },
      {
        instanceName: 'instance2',
        envVars: [{ name: 'envVar3', type: 'boolean' }],
      },
    ];

    beforeEach(() => {
      jest
        .spyOn(MarkdownGenerator, 'sortInstances')
        .mockReturnValue(sortedInstancesMock);

      jest.spyOn(MarkdownGenerator, 'generateMarkdownContent');
    });

    it('should sort the instances', () => {
      // When
      MarkdownGenerator.generate(envMapMock);

      // Then
      expect(MarkdownGenerator.sortInstances).toHaveBeenCalledTimes(1);
      expect(MarkdownGenerator.sortInstances).toHaveBeenCalledWith(envMapMock);
    });

    it('should generate the markdown content for each instance', () => {
      // When
      MarkdownGenerator.generate(envMapMock);

      // Then
      expect(MarkdownGenerator.generateMarkdownContent).toHaveBeenCalledTimes(
        2,
      );
      expect(MarkdownGenerator.generateMarkdownContent).toHaveBeenNthCalledWith(
        1,
        sortedInstancesMock[0],
        0,
        sortedInstancesMock,
      );
      expect(MarkdownGenerator.generateMarkdownContent).toHaveBeenNthCalledWith(
        2,
        sortedInstancesMock[1],
        1,
        sortedInstancesMock,
      );
    });

    it('should return the markdown content', () => {
      // Given
      const expected = [
        {
          instanceName: 'instance1',
          content: '| envVar1 | string |\n| envVar2 | number |',
        },
        {
          instanceName: 'instance2',
          content: '| envVar3 | boolean |',
        },
      ];

      // When
      const markdown = MarkdownGenerator.generate(envMapMock);

      // Then
      expect(markdown).toEqual(expected);
    });
  });

  describe('sortInstances', () => {
    const envMapMock = {
      instance2: {
        envVar3: 'boolean',
      },
      instance1: {
        envVar1: 'string',
        envVar2: 'number',
      },
    };

    const sortedInstancesMock = [
      {
        instanceName: 'instance1',
        envVars: [
          { name: 'envVar1', type: 'string' },
          { name: 'envVar2', type: 'number' },
        ],
      },
      {
        instanceName: 'instance2',
        envVars: [{ name: 'envVar3', type: 'boolean' }],
      },
    ];

    beforeEach(() => {
      jest.spyOn(MarkdownGenerator, 'sortInstancesEnvVars');
    });

    it('should sort the env variables for each instance', () => {
      // When
      MarkdownGenerator.sortInstances(envMapMock);

      // Then
      expect(MarkdownGenerator.sortInstancesEnvVars).toHaveBeenCalledTimes(2);
      expect(MarkdownGenerator.sortInstancesEnvVars).toHaveBeenNthCalledWith(
        1,
        ['envVar1', 'envVar2'],
        envMapMock.instance1,
      );
      expect(MarkdownGenerator.sortInstancesEnvVars).toHaveBeenNthCalledWith(
        2,
        ['envVar3'],
        envMapMock.instance2,
      );
    });

    it('should return the sorted instances', () => {
      // When
      const sortedInstances = MarkdownGenerator.sortInstances(envMapMock);

      // Then
      expect(sortedInstances).toEqual(sortedInstancesMock);
    });
  });

  describe('sortInstancesEnvVars', () => {
    const envVarsNamesMock = ['envVar1', 'envVar2'];
    const envVarsMock = {
      envVar2: 'number',
      envVar1: 'string',
    };

    const sortedEnvVarsMock = [
      { name: 'envVar1', type: 'string' },
      { name: 'envVar2', type: 'number' },
    ];

    it('should sort the env variables', () => {
      // When
      const sortedEnvVars = MarkdownGenerator.sortInstancesEnvVars(
        envVarsNamesMock,
        envVarsMock,
      );

      // Then
      expect(sortedEnvVars).toEqual(sortedEnvVarsMock);
    });
  });

  describe('generateMarkdownContent', () => {
    it('should format the markdown content', () => {
      // Given
      const instanceMock = {
        instanceName: 'instance1',
        envVars: [
          { name: 'envVar1', type: 'string' },
          { name: 'envVar2', type: 'number' },
        ],
      };

      const expected = {
        content: '| envVar1 | string |\n| envVar2 | number |',
        instanceName: 'instance1',
      };

      // When
      const markdownContent =
        MarkdownGenerator.generateMarkdownContent(instanceMock);

      // Then
      expect(markdownContent).toEqual(expected);
    });
  });
});
