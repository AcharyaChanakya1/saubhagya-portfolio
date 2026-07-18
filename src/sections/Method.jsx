import WordReveal from '../components/WordReveal.jsx'

/** Chapter 04 · The Method — principles with spotlight text (spec §5.4). */
const PRINCIPLES = [
  {
    title: 'Research before rupees.',
    copy: "I study your market, your competitors, and your customer's psychology before a single rupee of your budget moves.",
  },
  {
    title: 'Strategy gives the orders.',
    copy: 'Content calendars, ad campaigns, SEO — none of them freelance. Everything executes one written plan, on a timeline.',
  },
  {
    title: 'Psychology does the selling.',
    copy: "Frameworks like 5A, audience research, buying behaviour — ads don't convince people. Understanding them does.",
  },
  {
    title: 'Data closes the loop.',
    copy: "Monthly and quarterly reports I read, understand, and present myself. You'll always know what worked, what didn't, and what happens next.",
  },
]

export default function Method() {
  return (
    <section className="section method-section" id="method">
      <div className="chapter-label">Chapter 04 · The Method</div>
      <p className="method-intro">The same method, every client. That's why the results repeat.</p>

      {PRINCIPLES.map((p, i) => (
        <div className="principle" key={p.title}>
          <div className="principle-num">Principle 0{i + 1}</div>
          <h3 className="principle-title">{p.title}</h3>
          <WordReveal className="principle-copy" text={p.copy} />
        </div>
      ))}

      <div className="toolkit">
        <div className="toolkit-label">The toolkit</div>
        <p className="toolkit-items">
          <b>Meta Ads</b> · <b>Google Ads</b> · <b>SEO & Google My Business</b> ·
          Market & competitor research · Content strategy & calendars ·
          Static creatives · Analytics & reporting
        </p>
        <p className="toolkit-note">Video production isn't my craft — I direct it, I don't edit it.</p>
      </div>
    </section>
  )
}
