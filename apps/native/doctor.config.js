/**
 * React Doctor config for the native demo app.
 *
 * `rn-prefer-pressable-over-gesture-detector` is disabled here on purpose. This
 * demo drives every press animation on the UI thread via `<GestureDetector>`,
 * which is exactly what the companion rule `rn-pressable-shared-value-mutation`
 * recommends — mutating Reanimated shared values inside a `Pressable`'s
 * JS-thread `onPress`/`onPressIn` handlers causes jank. The two rules directly
 * conflict for this gesture-animation showcase, so we keep the UI-thread
 * approach and silence the Pressable preference rather than reintroduce the
 * jank the other rule warns about.
 */
module.exports = {
  $schema: "https://react.doctor/schema/config.json",
  rules: {
    "react-doctor/rn-prefer-pressable-over-gesture-detector": "off",
  },
};
