# Motionwind for VS Code

IntelliSense for [motionwind](https://github.com/piyushzingade/motionwind) animation classes. Get autocomplete, hover docs, diagnostics, and color swatches for all `animate-*` classes.

## Features

### Autocomplete

Contextual completions for gesture prefixes, animatable properties, transition config, viewport, drag, and layout keywords.

- Type `animate-` to see gesture prefixes (`hover`, `tap`, `focus`, `inview`, `drag`, `initial`, `enter`, `exit`)
- After a gesture prefix (e.g., `animate-hover:`), get property completions with snippet placeholders
- Transition config completions (`animate-duration-`, `animate-spring`, `animate-ease-in`, etc.)

### Hover Documentation

Hover over any motionwind class to see the compiled Motion output:

```
animate-hover:scale-110
```

Shows:

```jsx
<motion.div
  whileHover={{ scale: 1.1 }}
/>
```

### Diagnostics

Warns on invalid `animate-*` classes and flags unknown gesture prefixes as errors. Tailwind's built-in `animate-spin`, `animate-pulse`, `animate-ping`, `animate-bounce`, and `animate-none` are allowed.

### Color Decorators

Color swatches for hex color classes like `animate-hover:bg-#ff0000`, `animate-hover:text-#333`, and `animate-hover:border-#00ff00`.

## Supported Languages

- TypeScript React (`.tsx`)
- JavaScript React (`.jsx`)
- HTML (`.html`)
- TypeScript (`.ts`)
- JavaScript (`.js`)

## Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `motionwind.enable` | `true` | Enable/disable the extension |
| `motionwind.validate` | `true` | Enable/disable diagnostics |
| `motionwind.classAttributes` | `["className", "class"]` | Attributes to scan for motionwind classes |

## What is motionwind?

Motionwind transforms Tailwind-like animation classes into Motion (Framer Motion) component props at build time:

```jsx
{/* Write this */}
<div className="animate-hover:scale-110 animate-duration-300 animate-ease-out" />

{/* Compiles to */}
<motion.div
  whileHover={{ scale: 1.1 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
/>
```

Learn more at [github.com/piyushzingade/motionwind](https://github.com/piyushzingade/motionwind).

## License

MIT
