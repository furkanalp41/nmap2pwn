interface Props {
  port: number;
  service?: string;
  variant?: 'matched' | 'unmatched';
}

export default function PortBadge({ port, service, variant = 'matched' }: Props) {
  const colors =
    variant === 'matched'
      ? 'border-accent/30 text-accent bg-accent/5'
      : 'border-amber/30 text-amber bg-amber/5';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border font-mono text-xs ${colors}`}
    >
      <span className="font-semibold">{port}</span>
      {service && (
        <>
          <span className="opacity-40">/</span>
          <span className="opacity-80">{service}</span>
        </>
      )}
    </span>
  );
}
