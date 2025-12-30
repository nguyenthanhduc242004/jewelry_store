export type CustomerInfoProps = {
  avatarUrl: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  birthday: string;
};

type CustomerInfoComponentProps = {
  customer: CustomerInfoProps;
};

export default function CustomerInfo({
  customer,
}: CustomerInfoComponentProps) {
  const { avatarUrl, name, address, phone, email, birthday } =
    customer;

  // Format birthday as DD/MM/YYYY
  function formatBirthday(dateStr: string) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-GB");
  }

  return (
    <div className="w-full flex justify-center mt-2">
      <div className="max-w-5xl w-full flex gap-16">
        {/* Left: form */}
        <div className="flex-1">
          <div className="space-y-3 text-sm">
            {/* Row */}
            <InfoRow label="Name:">
              <input
                className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-sky-500"
                value={name}
                readOnly
              />
            </InfoRow>

            <InfoRow label="Address:">
              <textarea
                className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-sky-500 resize-y min-h-[40px] max-h-40"
                value={address}
                readOnly
                rows={2}
                style={{ overflowWrap: "break-word" }}
              />
            </InfoRow>

            <InfoRow label="Phone number:">
              <input
                className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-sky-500"
                value={phone}
                readOnly
              />
            </InfoRow>

            <InfoRow label="Email:">
              <input
                className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-sky-500"
                value={email}
                readOnly
              />
            </InfoRow>

            <InfoRow label="Birthday:">
              <input
                className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-sky-500"
                value={formatBirthday(birthday)}
                readOnly
              />
            </InfoRow>
          </div>
        </div>

        {/* Right: avatar */}
        <div className="flex items-start justify-center flex-1">
          <div className="h-64 w-64 rounded-full overflow-hidden border border-slate-200">
            <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Row helper component cho phần label + input */
function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-32 text-right text-sm text-slate-700 pr-2 whitespace-nowrap">{label}</div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
