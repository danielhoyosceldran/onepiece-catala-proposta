export default function LogPose({ size = 64 }) {
  return (
    <svg
      className="log-pose"
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label="Log Pose, brúixola pirata"
    >
      <circle cx="50" cy="50" r="46" fill="#0d2038" stroke="#e8b23d" strokeWidth="3" />
      <circle cx="50" cy="50" r="38" fill="none" stroke="#e8b23d" strokeWidth="1" opacity="0.5" />
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i * 360) / 16;
        const long = i % 4 === 0;
        return (
          <line
            key={i}
            x1="50"
            y1={long ? "8" : "12"}
            x2="50"
            y2="16"
            stroke="#e8b23d"
            strokeWidth={long ? 2 : 1}
            transform={`rotate(${angle} 50 50)`}
          />
        );
      })}
      <g className="log-pose-needle">
        <polygon points="50,18 45,52 50,58 55,52" fill="#c1272d" />
        <polygon points="50,82 45,52 50,46 55,52" fill="#f4e8c9" />
      </g>
      <circle cx="50" cy="50" r="4" fill="#e8b23d" />
    </svg>
  );
}
