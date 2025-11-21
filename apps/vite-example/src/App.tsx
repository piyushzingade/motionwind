export default function App() {
    return (
        <div className="p-4">
            <h1 className="text-lg">MotionWind — Minimal Example</h1>

            <div className="p-2">
                <button
                    className="p-2 bg-black text-white rounded-md transition"
                    style={{ cursor: "pointer" }}
                >
                    Simple Button
                </button>
            </div>

            <div className="p-4">
                <p className="text-base">Transform utilities (CSS-only for now):</p>
                <div className="p-4 bg-white" style={{ border: "1px solid #ddd", marginTop: "0.5rem" }}>
                    <div className="translate-x-4 opacity-50 p-2" style={{ border: "1px solid #aaa" }}>
                        Translated & faded
                    </div>
                    <div className="scale-105 p-2" style={{ border: "1px solid #aaa", marginTop: "0.5rem" }}>
                        Scaled up
                    </div>
                    <div className="rotate-45 p-2" style={{ border: "1px solid #aaa", marginTop: "0.5rem", display: "inline-block" }}>
                        Rotated 45°
                    </div>
                </div>
            </div>

            <div style={{ marginTop: "1.5rem", padding: "1rem", backgroundColor: "#f5f5f5", borderRadius: "0.375rem" }}>
                <p className="text-sm">
                    <strong>Note:</strong> This is the MotionWind v1 MVP. The <code>animate-*</code> classes and
                    advanced transform combinations will come in v2 with the compiler.
                </p>
                <p className="text-sm" style={{ marginTop: "0.5rem" }}>
                    Current utilities: spacing, typography, layout, colors, opacity, transforms, border-radius, and transition helpers.
                </p>
                <p className="text-sm" style={{ marginTop: "0.5rem" }}>
                    <strong>Workspace Imports:</strong> Clean package imports enabled via <code>motionwind-core</code> and <code>motionwind-tailwind-css</code>
                </p>
            </div>
        </div>
    );
}
