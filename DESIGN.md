# Motionwind — Design System

## Color Tokens (OKLCH)

### Dark Mode (default)

- **Background**: `oklch(0.06 0 0)` — `#0a0a0f`
- **Surface**: `oklch(0.09 0 0)` — `#111119`
- **Surface Raised**: `oklch(0.11 0 0)` — `#16161f`
- **Surface Overlay**: `oklch(0.13 0 0)` — `#1a1a25`
- **Surface Inset**: `oklch(0.08 0 0)` — `#101017`
- **Foreground**: `oklch(0.98 0 0)` — `#f5f5f7`
- **Text Strong**: `oklch(1 0 0)` — `#ffffff`
- **Text Dim**: `oklch(0.65 0.01 260)` — `#9b9bb0`
- **Text Muted**: `oklch(0.45 0.01 260)` — `#6b6b80`
- **Border Subtle**: `oklch(1 0 0 / 0.04)` — `#ffffff0a`
- **Border Strong**: `oklch(1 0 0 / 0.1)` — `#ffffff1a`
- **Border Accent**: `oklch(0.88 0.28 120 / 0.1)` — `#c8ff2e1a`
- **Accent (Acid Lime)**: `oklch(0.88 0.28 120)` — `#c8ff2e`
- **Accent Dim**: `oklch(0.78 0.22 120)` — `#a3d625`
- **Accent Soft**: `oklch(0.88 0.28 120 / 0.05)` — `#c8ff2e0d`
- **Accent Glow**: `oklch(0.88 0.28 120 / 0.35)` — `rgba(200, 255, 46, 0.35)`
- **Code BG**: `oklch(0.05 0 0)` — `#0d0d14`
- **Code Comment**: `oklch(0.45 0.01 260)` — `#6b6b80`
- **Code Tag**: `oklch(0.7 0.25 330)` — `#f472b6`
- **Code String**: `oklch(0.8 0.15 90)` — `#fbbf24`
- **Code Attr**: `oklch(0.88 0.28 120)` — `#c8ff2e`
- **Grid Line**: `oklch(1 0 0 / 0.03)` — `#ffffff08`
- **Syntax Punct**: `oklch(0.45 0.01 260)` — `#6b7280`

### Light Mode

- **Background**: `oklch(0.98 0.002 260)` — `#f6f6f8`
- **Surface**: `oklch(1 0 0)` — `#ffffff`
- **Surface Raised**: `oklch(1 0 0)` — `#ffffff`
- **Surface Overlay**: `oklch(0.97 0.002 260)` — `#f0f0f4`
- **Surface Inset**: `oklch(0.95 0.002 260)` — `#ebebf0`
- **Foreground**: `oklch(0.12 0.01 260)` — `#1a1a20`
- **Text Strong**: `oklch(0.09 0.01 260)` — `#16161b`
- **Text Dim**: `oklch(0.35 0.01 260)` — `#4a4a58`
- **Text Muted**: `oklch(0.5 0.01 260)` — `#6b6b80`
- **Border Subtle**: `oklch(0.09 0.01 260 / 0.06)` — `#16161b0f`
- **Border Strong**: `oklch(0.09 0.01 260 / 0.12)` — `#16161b1f`
- **Border Accent**: `oklch(0.4 0.18 120 / 0.11)` — `#5b8c001c`
- **Accent (Acid Green)**: `oklch(0.45 0.18 120)` — `#5b8c00`
- **Accent Dim**: `oklch(0.5 0.16 120)` — `#6ea300`
- **Accent Soft**: `oklch(0.45 0.18 120 / 0.05)` — `#5b8c000d`
- **Accent Glow**: `oklch(0.5 0.16 120 / 0.35)` — `rgba(107, 163, 0, 0.35)`
- **Code BG**: `oklch(1 0 0)` — `#ffffff`
- **Code Comment**: `oklch(0.55 0.01 260)` — `#8a8aa0`
- **Code Tag**: `oklch(0.55 0.25 330)` — `#d63384`
- **Code String**: `oklch(0.55 0.15 60)` — `#b45309`
- **Code Attr**: `oklch(0.45 0.18 120)` — `#5b8c00`
- **Grid Line**: `oklch(0.09 0.01 260 / 0.03)` — `#16161b08`
- **Syntax Punct**: `oklch(0.5 0.01 260)` — `#6b6b80`

## Typography

- **UI Font**: `Geist Variable` (system fallback: `system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif`)
- **Mono Font**: `Geist Mono Variable` (system fallback: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`)
- **Scale (fixed rem, ratio 1.125)**:
  - `--text-xs`: `0.75rem` (12px)
  - `--text-sm`: `0.875rem` (14px)
  - `--text-base`: `1rem` (16px)
  - `--text-lg`: `1.125rem` (18px)
  - `--text-xl`: `1.265rem` (20px)
  - `--text-2xl`: `1.42rem` (23px)
  - `--text-3xl`: `1.6rem` (26px)
  - `--text-4xl`: `1.8rem` (29px)
  - `--text-5xl`: `2.02rem` (32px)
  - `--text-6xl`: `2.27rem` (36px)

## Spacing Scale (4px base)

- `--space-1`: `0.25rem` (4px)
- `--space-2`: `0.5rem` (8px)
- `--space-3`: `0.75rem` (12px)
- `--space-4`: `1rem` (16px)
- `--space-5`: `1.25rem` (20px)
- `--space-6`: `1.5rem` (24px)
- `--space-8`: `2rem` (32px)
- `--space-10`: `2.5rem` (40px)
- `--space-12`: `3rem` (48px)
- `--space-16`: `4rem` (64px)
- `--space-20`: `5rem` (80px)
- `--space-24`: `6rem` (96px)

## Border Radius

- `--radius-sm`: `4px`
- `--radius-md`: `8px`
- `--radius-lg`: `12px`
- `--radius-xl`: `16px`
- `--radius-2xl`: `24px`
- `--radius-full`: `9999px`

## Shadows

- **Elevation 1**: `0 1px 2px oklch(0 0 0 / 0.05)`
- **Elevation 2**: `0 4px 8px -2px oklch(0 0 0 / 0.1)`
- **Elevation 3**: `0 12px 24px -8px oklch(0 0 0 / 0.15)`
- **Elevation 4**: `0 20px 40px -12px oklch(0 0 0 / 0.2)`
- **Accent Glow**: `0 0 30px var(--accent-glow)`

## Motion Tokens

- **Fast**: `150ms ease-out`
- **Base**: `200ms ease-out`
- **Slow**: `300ms ease-out`
- **Spring Default**: `stiffness: 300, damping: 20, mass: 1`
- **Spring Gentle**: `stiffness: 180, damping: 18, mass: 1`
- **Spring Bouncy**: `stiffness: 200, damping: 10, mass: 1`
- **Reduced Motion**: `0ms` (instant) or crossfade only

## Z-Index Scale

- **Dropdown**: `100`
- **Sticky Header**: `200`
- **Modal Backdrop**: `300`
- **Modal**: `400`
- **Toast**: `500`
- **Tooltip**: `600`
- **Code Drawer**: `500`

## Breakpoints

- **sm**: `640px`
- **md**: `768px`
- **lg**: `1024px`
- **xl**: `1280px`
- **2xl**: `1536px`

## Component State Vocabulary

Every interactive element must have:

- **Default**
- **Hover** (pointer)
- **Focus** (keyboard) — visible ring, 2px offset
- **Active** (press)
- **Disabled** — 40% opacity, not-interactive cursor
- **Loading** — skeleton or spinner
- **Error** — red accent ring + message

## Layout Primitives

- **Container**: `max-w-[72rem]` (1152px), centered, `px-4 sm:px-6 lg:px-8`
- **Section**: `py-20 sm:py-24 lg:py-28`
- **Grid**: `repeat(auto-fit, minmax(280px, 1fr))` for cards
- **Stack**: `space-y-6 sm:space-y-8`

## Code Blocks

- **Font**: Geist Mono, `0.875rem` (14px), `line-height: 1.7`
- **Padding**: `1.5rem`
- **Radius**: `12px`
- **Tab size**: 2 spaces

## Form Controls

- **Height**: `40px` (comfortable touch target)
- **Padding**: `0 1rem`
- **Radius**: `8px`
- **Border**: `1px solid var(--border-strong)`
- **Focus Ring**: `2px solid var(--accent)`, `2px offset`
- **Placeholder**: `var(--text-muted)`

## Buttons

- **Primary**: `bg-accent text-black font-semibold` — accent background, dark text
- **Secondary**: `bg-surface-raised border-border-strong text-foreground`
- **Ghost**: `text-text-dim hover:text-foreground hover:bg-surface-overlay`
- **Height**: `40px` (sm), `44px` (base), `48px` (lg)
- **Padding X**: `1.25rem` (sm), `1.5rem` (base), `2rem` (lg)
