# Bytes

Utilities to deal with sized Uint8Array

```bash
npm i @hazae41/bytes
```

[**Node Package 📦**](https://www.npmjs.com/package/@hazae41/bytes)

## Features
- 100% TypeScript and ESM
- Rust-like patterns
- Strongly typed Uint8Array and ArrayLike size
- Zero-cost abstraction over Uint8Array and ArrayLike
- Zero-copy conversion from ArrayBufferView
- Use native Buffer for faster execution on Node
- Unit-tested

## Usage

#### Sized bytes

```tsx
const bytes8 = Bytes.alloc(8) // Bytes<8>
```

#### Unsafe-allocated sized bytes

```tsx
const bytes8 = Bytes.allocUnsafe(8) // Bytes<8>
```

#### Random sized bytes

```tsx
const bytes8 = Bytes.random(8) // Bytes<8>
```

#### Unknown-sized bytes

```tsx
const bytesX = new Uint8Array(8) // Bytes<number>
```

#### Runtime type-guarding

```tsx
if (Bytes.is(bytesX, 8))
  bytesX // Bytes<8>
else
  bytesX // Bytes<number>
```

#### Type-guarded runtime equality check

```tsx
if (Bytes.equals(bytesX, bytes8))
  bytesX // Bytes<8>
else
  bytesX // Bytes<number>
```

#### Runtime casting with Result pattern

```tsx
const bytes16 = Bytes.tryCast(bytesX, 16).unwrap() // Bytes<16>
```

#### Conversion from sized arrays

```tsx
const sized4 = Sized.cast([1, 2, 3, 4], 4).unwrap() // Sized<4>
const bytes4 = Bytes.from(sized4) // Bytes<4>
```

#### Utf8, Hex, Base64, Ascii encoding

```tsx
Bytes.fromUtf8(Bytes.toUtf8(bytesX))
```

```tsx
Bytes.fromHex(Bytes.toHex(bytesX))
```

```tsx
Bytes.fromBase64(Bytes.toBase64(bytesX))
```

```tsx
Bytes.fromAscii(Bytes.toAscii(bytesX))
```

#### BigInt conversion

```tsx
Bytes.fromBigInt(Bytes.toBigInt(bytesX))
```

#### Sized slicing and padding

```tsx
const bytes8 = Bytes.sliceOrPadStart(bytesX, 8) // Bytes<8>
```