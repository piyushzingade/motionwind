type VueLogoIconProps = {
  size?: number | string;
  className?: string;
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
};

/**
 * Vue.js "V" logomark drawn in `currentColor` so it inherits the tab's
 * active/inactive color like the Phosphor icons beside it. Accepts the same
 * `size` / `className` / `weight` props the framework tabs pass (weight is
 * accepted for compatibility and ignored — the mark has a single weight).
 */
export function VueLogoIcon({
  size = 16,
  className,
  weight: _weight,
  ...rest
}: VueLogoIconProps & Omit<React.SVGProps<SVGSVGElement>, "width" | "height">) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 261.76 226.69"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <path d="M161.096.001l-30.225 52.351L100.647.001H-.005l130.877 226.688L261.749.001z" />
    </svg>
  );
}
