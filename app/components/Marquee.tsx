const ITEMS = ["Sports", "Education", "Culture", "Community", "Environment", "Heritage", "Nashik", "Jangid"];

export default function Marquee() {
  return (
    <div className="marquee-wrap">
      <div className="marquee-track">
        {ITEMS.concat(ITEMS).map((item, i) => (
          <span className="marquee-item" key={i}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
