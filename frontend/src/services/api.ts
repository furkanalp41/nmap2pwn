import type { ParseResponse, PortListResponse, PortMatch } from '../types';

const BASE = '/api';

export async function parseNmap(rawOutput: string): Promise<ParseResponse> {
  const res = await fetch(`${BASE}/parse`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ raw_output: rawOutput }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to parse Nmap output');
  }

  return res.json();
}

export async function getAllPorts(): Promise<PortListResponse> {
  const res = await fetch(`${BASE}/ports`);
  if (!res.ok) throw new Error('Failed to fetch ports');
  return res.json();
}

export async function getPort(id: number): Promise<PortMatch> {
  const res = await fetch(`${BASE}/ports/${id}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error(`Port ${id} not found`);
    throw new Error('Failed to fetch port data');
  }
  return res.json();
}
