export class JudicialChange {
  constructor(
    public judicialZoneId: number,
    public workflowDescription: string,
    public notaryRequestID: number,
    public date: string,
    public judicialZoneDescription: string,
  ) {}
}
