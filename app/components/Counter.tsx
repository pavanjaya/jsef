export default function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  return (
    <span className="stat-n">
      {target}
      {suffix}
    </span>
  );
}
