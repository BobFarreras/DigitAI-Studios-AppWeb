/**
 * @file src/components/landing/v2/ContactField.tsx
 * @updated 2026-08-19
 * @summary Camp de formulari de contacte amb subratllat que s'encen en rebre focus.
 * @scope Landing contact section — label + input/textarea + error.
 */
const fieldCls =
  "peer w-full border-0 border-b border-[var(--dala-border)] bg-transparent px-0 py-3 text-[16px] font-light text-[var(--dala-text)] outline-none transition-colors placeholder:text-[var(--dala-muted)]/60 focus:border-[#8052ff]";
const labelCls =
  "mb-1 block text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--dala-muted)]";

type Props = {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  error?: string;
  required?: boolean;
  minLength?: number;
  rows?: number;
};

export function ContactField({
  label,
  name,
  type = "text",
  placeholder,
  error,
  required,
  minLength,
  rows,
}: Props) {
  return (
    <div className="group relative">
      <label htmlFor={name} className={labelCls}>
        {label}
      </label>
      {rows ? (
        <textarea
          id={name}
          name={name}
          required={required}
          minLength={minLength}
          rows={rows}
          placeholder={placeholder}
          className={`${fieldCls} resize-none`}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          className={fieldCls}
        />
      )}
      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-[#8052ff] to-[#ffb829] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] peer-focus:scale-x-100" />
      {error && <p className="mt-2 text-[11px] text-red-500">{error}</p>}
    </div>
  );
}
