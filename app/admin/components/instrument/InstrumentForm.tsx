"use client";

import { Instrument } from "@/types/instrument";
import PremiumInput from "../ui/PremiumInput";
import Toggle from "../ui/Toggle";

export default function InstrumentForm({
  values,
  onChange,
}: {
  values: Partial<Instrument>;
  onChange: (v: Partial<Instrument>) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <PremiumInput label="Code" value={values.code || ""} onChange={(v) => onChange({ ...values, code: v })} />
      <PremiumInput label="Name" value={values.name || ""} onChange={(v) => onChange({ ...values, name: v })} />

      <PremiumInput label="Segment" value={values.segment || ""} onChange={(v) => onChange({ ...values, segment: v })} />
      <PremiumInput label="Lot Size" type="number" value={values.lotSize ?? ""} onChange={(v) => onChange({ ...values, lotSize: Number(v) })} />

      <PremiumInput label="Min Qty" type="number" value={values.minQty ?? ""} onChange={(v) => onChange({ ...values, minQty: Number(v) })} />
      <PremiumInput label="Max Qty" type="number" value={values.maxQty ?? ""} onChange={(v) => onChange({ ...values, maxQty: Number(v) })} />

      <PremiumInput label="Qty Precision" type="number" value={values.qtyPrecision ?? ""} onChange={(v) => onChange({ ...values, qtyPrecision: Number(v) })} />
      <PremiumInput label="Price Precision" type="number" value={values.pricePrecision ?? ""} onChange={(v) => onChange({ ...values, pricePrecision: Number(v) })} />

      <Toggle label="Swap Enabled" value={!!values.swapEnabled} onChange={(v) => onChange({ ...values, swapEnabled: v })} />
      <Toggle label="Tradeable" value={!!values.isTradeable} onChange={(v) => onChange({ ...values, isTradeable: v })} />
    </div>
  );
}
