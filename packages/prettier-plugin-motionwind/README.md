# prettier-plugin-motionwind

Sorts [motionwind](https://github.com/piyushzingade/motionwind) `animate-*` classes into a
consistent, canonical order — like `prettier-plugin-tailwindcss`, but for motion classes.

## Install

```bash
npm install -D prettier-plugin-motionwind
```

## Usage

```json
// .prettierrc
{
  "plugins": ["prettier-plugin-motionwind"]
}
```

Composes with `prettier-plugin-tailwindcss` — list motionwind **after** it:

```json
{ "plugins": ["prettier-plugin-tailwindcss", "prettier-plugin-motionwind"] }
```

## Order

`variant defs → gestures → transition → viewport → scroll → drag → layout → unknown → tailwind`

Only static `className` string literals are sorted. Classes without `animate-*` are left
untouched.
