import "./mipay-admin.scss";

// Detail body for Mi-Pay Admin. No screenshots survived, so the content is
// prose plus a marked-up URL — a detail body can be whatever fits the project.
export default function MipayAdmin() {
  return (
    <div className="nsc-project-mipay-admin">
      <p className="lede">Admin dashboard for fraud screening, tracking customers, orders and transactions across the payment platform.</p>

      <p>Built as a single-page app on .NET Core and Angular 2. Search and filtering run live against the database, with client-scoped access control deciding who sees which customers.</p>

      <h3 className="heading">Shareable state</h3>
      <p>The filter state lives in the query string. That sounds like a detail until you are investigating a case and need to hand a colleague the exact view:</p>

      <pre className="url"><code>/orders?status=<span className="v">flagged</span>&amp;risk=<span className="v">high</span>&amp;from=<span className="v">2017-04-01</span>&amp;client=<span className="v">42</span></code></pre>

      <p>Every filter round-trips through the URL, so a screenshot in a ticket became a link that reproduced the screen.</p>

      <p className="note">No screens survived the archive — the product was internal.</p>
    </div>
  );
}
