type InfoRowProps ={
  label: string;
  children: React.ReactNode;
};

export default function InfoRow({
  label,
  children,
}: InfoRowProps) {
  return (
    <div className="flex items-center gap-3 mb-1">
      <div className="w-28 text-left text-xs text-slate-700">{label}:</div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
