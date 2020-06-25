export class LogStep {
  name: string;
  description: string;

  static create(name: string, description: string): LogStep {
    const logStep = new LogStep();
    logStep.name = name;
    logStep.description = description;
    return logStep;
  }
}
