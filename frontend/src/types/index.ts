export interface Command {
  title: string;
  command: string;
  description: string;
}

export interface Tool {
  name: string;
  description: string;
  commands: Command[];
}

export interface PortMatch {
  port: number;
  protocol: string;
  service: string;
  description: string;
  tools: Tool[];
}

export interface ParseResponse {
  ip: string;
  open_ports: number[];
  matched_ports: PortMatch[];
  unmatched_ports: number[];
}

export interface PortSummary {
  port: number;
  protocol: string;
  service: string;
  description: string;
  tool_count: number;
}

export interface PortListResponse {
  count: number;
  ports: PortSummary[];
}
