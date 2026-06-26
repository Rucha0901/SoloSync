/**
 * Lightweight SVG area chart — zero dependencies.
 * Drop-in replacement for recharts if network installs are failing.
 */
import React, { useMemo } from "react";

const PAD = { top: 12, right: 20, bottom: 36, left: 60 };

function lerp(value, inMin, inMax, outMin, outMax) {
  if (inMax === inMin) return outMax;
  return ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
}

export function MiniChart({ data = [], width = "100%", height = 280 }) {
  const values = data.map((d) => d.revenue);
  const max = Math.max(...values, 1);
  const W = 900; // viewBox width
  const H = height;
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const points = data.map((d, i) => {
    const x = PAD.left + (i / Math.max(data.length - 1, 1)) * innerW;
    const y = PAD.top + (1 - d.revenue / max) * innerH;
    return [x, y];
  });

  const linePath = points.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
  const areaPath = points.length
    ? `${linePath} L ${points[points.length - 1][0]} ${PAD.top + innerH} L ${points[0][0]} ${PAD.top + innerH} Z`
    : "";

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => ({
    value: Math.round(max * t),
    y: PAD.top + (1 - t) * innerH,
  }));

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={width}
      height={height}
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {yTicks.map((t, i) => (
        <g key={i}>
          <line
            x1={PAD.left}
            x2={PAD.left + innerW}
            y1={t.y}
            y2={t.y}
            stroke="var(--border-color)"
            strokeDasharray="4 4"
          />
          <text
            x={PAD.left - 8}
            y={t.y + 4}
            textAnchor="end"
            fontSize={11}
            fill="var(--text-secondary)"
          >
            ${t.value.toLocaleString()}
          </text>
        </g>
      ))}

      {/* Area fill */}
      {areaPath && <path d={areaPath} fill="url(#chartGrad)" />}

      {/* Line */}
      {linePath && (
        <path
          d={linePath}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

      {/* Data points + labels */}
      {points.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={4} fill="var(--accent)" />
          <text
            x={x}
            y={PAD.top + innerH + 22}
            textAnchor="middle"
            fontSize={12}
            fill="var(--text-secondary)"
          >
            {data[i].name}
          </text>
          {/* Tooltip text above point */}
          {data[i].revenue > 0 && (
            <text
              x={x}
              y={y - 10}
              textAnchor="middle"
              fontSize={11}
              fill="var(--accent)"
              fontWeight="600"
            >
              ${data[i].revenue.toLocaleString()}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}
