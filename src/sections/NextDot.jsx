/** The Next Dot — contact. WhatsApp primary (spec + truth file). */
const WA_LINK =
  'https://wa.me/918736860717?text=Hi%20Saubhagya%2C%20I%20saw%20your%20portfolio.%20Let%27s%20talk%20about%20growing%20my%20business.'
const LINKEDIN =
  'https://www.linkedin.com/in/saubhagya-dubey-%E0%A4%B8%E0%A5%8C%E0%A4%AD%E0%A4%BE%E0%A4%97%E0%A5%8D%E0%A4%AF-%E0%A4%A6%E0%A5%81%E0%A4%AC%E0%A5%87-6b5241166'

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.39c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.9-4.44 9.9-9.9S17.5 2 12.04 2zm0 18.1c-1.48 0-2.94-.4-4.2-1.15l-.3-.18-3.12.82.83-3.05-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 4.54 0 8.24 3.7 8.24 8.24 0 4.55-3.7 8.25-8.24 8.25zm4.52-6.16c-.25-.13-1.47-.72-1.7-.8-.22-.09-.39-.13-.55.12-.17.25-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.13-1.05-.39-2-1.23-.73-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.13-.55-1.34-.76-1.84-.2-.48-.4-.42-.55-.42h-.47c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.13.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.29z" />
    </svg>
  )
}

export default function NextDot() {
  return (
    <section className="section nextdot" id="contact">
      <div className="chapter-label">The Next Dot</div>
      <h2 className="nextdot-head">You've built something worth marketing properly.</h2>
      <p className="nextdot-sub">
        Your business could be the next dot on this map. One conversation —
        no deck, no pitch, just a director-level look at your marketing.
      </p>

      <a className="cta-wa" href={WA_LINK} target="_blank" rel="noopener noreferrer">
        <WhatsAppIcon />
        Message me on WhatsApp
      </a>

      <div className="contact-alt">
        <a href="mailto:saubhagya.dubey98@gmail.com">saubhagya.dubey98@gmail.com</a>
        <a href={LINKEDIN} target="_blank" rel="noopener noreferrer">LinkedIn</a>
      </div>

      {/* Lucknow skyline — the maker's mark: Rumi Darwaza · Bara Imambara · Husainabad clock tower */}
      <svg className="skyline" viewBox="0 0 300 64" aria-label="Lucknow skyline">
        <path d="M 6 58 H 294" />
        <path d="M 26 58 V 34 Q 26 18 46 14 Q 66 18 66 34 V 58" />
        <path d="M 34 58 V 40 Q 34 30 46 27 Q 58 30 58 40 V 58" />
        <path d="M 46 14 V 8" />
        <path className="sky-gold" d="M 46 2 l 1.6 4.4 4.4 1.6 -4.4 1.6 -1.6 4.4 -1.6 -4.4 -4.4 -1.6 4.4 -1.6z" />
        <path d="M 96 58 V 44 H 206 V 58" />
        <path d="M 118 58 V 50 Q 118 46 122 46 Q 126 46 126 50 V 58 M 146 58 V 50 Q 146 46 150 46 Q 154 46 154 50 V 58 M 174 58 V 50 Q 174 46 178 46 Q 182 46 182 50 V 58" />
        <path d="M 138 44 Q 138 30 151 27 Q 164 30 164 44" />
        <path d="M 151 27 V 21" />
        <path d="M 250 58 V 20 H 262 V 58 M 250 20 L 256 10 L 262 20 M 253 30 H 259" />
      </svg>

      <footer className="site-footer">
        <span>Saubhagya Dubey · 26.85° N, 80.95° E</span>
        <span>Built with strategy, obviously. © 2026</span>
      </footer>
    </section>
  )
}
