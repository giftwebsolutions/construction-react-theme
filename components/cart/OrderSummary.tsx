import type { CartTotals } from "@/lib/utils/cart";
import { formatAED } from "@/lib/utils/format";

/** Price breakdown shared by cart and checkout. */
export function OrderSummary({ totals, placeOfSupply, children }: { totals: CartTotals; placeOfSupply: string; children?: React.ReactNode }) {
  const g = totals.vat;
  const row = "flex justify-between gap-4";
  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-card">
      <h2 className="text-lg font-bold text-foreground">Order Summary</h2>
      <dl className="mt-4 space-y-2.5 text-sm">
        <div className={row}>
          <dt className="text-muted-foreground">MRP total ({totals.itemCount.toLocaleString("en-AE")} units)</dt>
          <dd className="tabular-nums text-muted-foreground line-through">{formatAED(totals.mrpTotal)}</dd>
        </div>
        <div className={row}>
          <dt className="text-muted-foreground">Price after discounts</dt>
          <dd className="tabular-nums text-foreground">{formatAED(totals.subtotal)}</dd>
        </div>
        {totals.tierSavings > 0 && (
          <div className={row}>
            <dt className="text-success">Bulk tier savings</dt>
            <dd className="tabular-nums text-success">included</dd>
          </div>
        )}
        {totals.couponDiscount > 0 && (
          <div className={row}>
            <dt className="text-success">Coupon ({totals.coupon?.code})</dt>
            <dd className="tabular-nums text-success">−{formatAED(totals.couponDiscount)}</dd>
          </div>
        )}
        {totals.groups.map((gr) => (
          <div key={gr.type} className={row}>
            <dt className="text-muted-foreground">{gr.type === "truck" ? "Truck delivery" : "Parcel delivery"}</dt>
            <dd className="tabular-nums text-foreground">{gr.charge ? formatAED(gr.charge) : <span className="font-semibold text-success">FREE</span>}</dd>
          </div>
        ))}
      </dl>
      <details className="mt-3 rounded-lg bg-surface-muted p-3 text-xs">
        <summary className="cursor-pointer font-semibold text-foreground">VAT breakup · {formatAED(g.totalTax)}</summary>
        <dl className="mt-2 space-y-1.5 text-muted-foreground">
          <div className={row}><dt>Taxable value</dt><dd className="tabular-nums">{formatAED(g.taxable)}</dd></div>
          {g.byRate.map((r) => (
            <div key={r.rate} className={row}><dt>VAT @ {r.rate}% on {formatAED(r.taxable)}</dt><dd className="tabular-nums">{formatAED(r.tax)}</dd></div>
          ))}
          <p className="pt-1">Place of supply: {placeOfSupply}, UAE. Prices shown include 5% VAT.</p>
        </dl>
      </details>
      <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
        <span className="font-semibold text-foreground">Grand Total</span>
        <span className="font-display text-2xl font-extrabold tabular-nums text-foreground">{formatAED(totals.grandTotal)}</span>
      </div>
      {totals.mrpSavings + totals.couponDiscount > 0 && (
        <p className="mt-3 rounded-lg bg-success-50 px-3 py-2 text-center text-sm font-semibold text-green-800 dark:bg-green-900/30 dark:text-green-200">
          You save {formatAED(totals.mrpSavings + totals.couponDiscount)} on this order
        </p>
      )}
      {children}
    </div>
  );
}
