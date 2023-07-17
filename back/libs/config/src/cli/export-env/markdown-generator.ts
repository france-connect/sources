export class MarkdownGenerator {
  static generate(envMap: object): object[] {
    const sortedInstances = MarkdownGenerator.sortInstances(envMap);

    const markdown = sortedInstances.map(
      MarkdownGenerator.generateMarkdownContent,
    );

    return markdown;
  }

  static sortInstances(envMap: object): object[] {
    const sortedInstancesNames = Object.keys(envMap).sort();

    return sortedInstancesNames.map((instanceName: string) => {
      const envVars = envMap[instanceName];
      const sortedEnvVarsNames = Object.keys(envVars).sort();

      const sortedEnvVars = MarkdownGenerator.sortInstancesEnvVars(
        sortedEnvVarsNames,
        envVars,
      );

      return {
        instanceName,
        envVars: sortedEnvVars,
      };
    });
  }

  static sortInstancesEnvVars(envVarsNames: string[], envVars: object): object {
    return envVarsNames.map((name) => ({
      name,
      type: envVars[name],
    }));
  }

  static generateMarkdownContent({ instanceName, envVars }): object {
    let content = '';

    envVars.forEach(({ name, type }) => {
      content += `| ${name} | ${type} |\n`;
    });

    content = content.slice(0, -1);

    return { instanceName, content };
  }
}
