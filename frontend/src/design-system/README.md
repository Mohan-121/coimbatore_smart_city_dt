# Civic Atlas Design System
## Coimbatore Smart City Digital Twin

The **Civic Atlas** design system is an editorial, cartographic design language tailored for municipal command centers, civic decision-makers, and evaluators. Inspired by printed cartographic atlases and the textile/industrial heritage of **Coimbatore, Tamil Nadu**, it prioritizes clarity, data provenance, and spatial legibility over neon decoration.

---

## 1. Color Palette Tokens

The design system enforces a **90% light dominant** aesthetic. Dark surfaces are strictly limited to at most 10% of any viewport (specifically the status ticker, demo mode banner, and small chips).

| Token | Hex Value | Purpose / Civic Rationale |
| :--- | :--- | :--- |
| `--paper` | `#F7F5F0` | Warm cotton-paper background (Coimbatore's textile identity) |
| `--surface` | `#FFFFFF` | Primary card and drawer surfaces |
| `--surface-sunken` | `#EFEDE6` | Input fields, table stripes, nested control trays |
| `--line` | `#E1DDD2` | Hairline dividers and survey-grid lines |
| `--ink-hi` | `#14213D` | High-contrast headings and primary labels (deep indigo ink) |
| `--ink-mid` | `#4A5568` | Secondary labels, descriptions, and metadata |
| `--ink-lo` | `#8A94A6` | Placeholder text, borders, and subtle hints |
| `--indigo` | `#1F3A8A` | Primary brand color: navigation, buttons, and active states |
| `--ghats` | `#0E7C66` | Western Ghats green: healthy, free-flow, energy efficiency |
| `--terracotta` | `#C2512D` | Brick/terracotta accent: highlights, simulated metrics, alerts |
| `--turmeric` | `#E8A317` | Warning, caution, peak load windows |
| `--crimson` | `#C62839` | Critical alerts, severe bottlenecks, emergency conditions |
| `--sky` | `#2B7FD1` | Live external telemetry streams, information |
| `--ticker-bg` | `#0F172A` | The 10% dark: top status ticker and demo scenario banner only |

### Congestion Scale
* **Free Flow** ($0 \le C < 30$): Emerald `#10B981`
* **Moderate** ($30 \le C < 60$): Amber `#F59E0B`
* **Heavy** ($60 \le C < 85$): Orange `#F97316`
* **Gridlock** ($85 \le C \le 100$): Crimson `#DC2626`

---

## 2. Typography

* **Headings**: `Sora` (600/700) — Modern, civic, geometric.
* **Body / UI**: `Inter` (400/500) — High legibility at small sizes.
* **Numbers / Telemetry**: `IBM Plex Mono` with `font-variant-numeric: tabular-nums` for rock-solid tabular data.
* **Civic Subtitle**: `Noto Sans Tamil` (`கோயம்புத்தூர் ஸ்மார்ட் சிட்டி`).

---

## 3. Creative Motifs

1. **Highway Route Shields**: All corridor references are styled as Indian National Highway green signboards with white lettering (e.g., `NH 544 Avinashi Road`).
2. **Provenance Seals**: Mandatory visual stamps on every metric:
   * `[LIVE API]`: Verified live external stream (Open-Meteo) with a pulsing green dot.
   * `[HISTORICAL]`: Empirical baseline with a clock icon.
   * `[SIMULATED]`: Physics simulation or ML projection with a terracotta dashed outline.
3. **Survey Grid Background**: Subtle 40px grid pattern at ~3.5% opacity across pages.
4. **Contour Textures**: Soft topographic contour gradients in hero cards referencing the Noyyal basin.
5. **Transit-Line Cause Ribbon**: Horizontal 4-segment stacked ribbon with station dots for TreeSHAP explainability.
6. **Train-Timetable Horizon Selector**: Timetable strip for 15m, 30m, 60m, and 120m forecast horizons.
7. **Zero-Emoji Policy**: All icons are custom inline SVGs in `src/components/icons/`.

---

## 4. Component Inventory (`src/components/ui/`)

* `Card`: Base panel with index-card tab label (e.g. `TRAFFIC / LIVE`) and contour support.
* `ProvenanceBadge`: Reusable trust badge with `LIVE API`, `HISTORICAL`, and `SIMULATED` variants.
* `RouteShield`: Indian Highway green signboard badge.
* `SeverityBadge`: Status tag with mandatory icon + text for `INFO`, `WARNING`, `SEVERE`, `CRITICAL`.
* `CongestionLegend`: Cartographic legend card with color swatches and score ranges.
* `AtlasGauge`: Semi-circle dial gauge with indicator.
* `CauseRibbon`: Four-cause stacked transit ribbon with percentages and station dots.
* `HorizonSelector`: Multi-horizon forecast strip.
* `CompareSlider`: Interactive draggable divider for baseline vs. simulated split view.
* `DataTable`: Striped, bordered table with mono headers.
* `Drawer`: Slide-out right panel with keyboard navigation (`Esc`).
* `StatusTicker`: 32px slim dark ticker strip with live city aggregates.
* `CommandPalette`: `Ctrl+K` searchable command bar.
