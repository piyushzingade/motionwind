"use client";

import { useEffect, useRef } from "react";

export type FluidTextureProps = React.HTMLAttributes<HTMLCanvasElement> & {
  color?: string;
  maskText?: string;
};

const VERTEX_SHADER = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 u_color;
uniform sampler2D u_text_mask;
uniform float u_has_mask;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.6;
  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(p);
    p *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  float time = u_time * 0.18;
  vec2 drift = vec2(
    sin(time) + 0.6 * sin(time * 1.7 + 1.3),
    cos(time * 0.8) + 0.6 * cos(time * 1.3 + 2.1)
  );
  vec2 point = vec2(uv.x * aspect * 0.7, uv.y * 1.25) + drift * 0.45;
  vec2 warp = vec2(fbm(point + drift), fbm(point + vec2(3.2, 1.5) - drift));
  float field = fbm(point + 1.2 * warp);
  float lower = smoothstep(0.26, 0.84, uv.y + (field - 0.5) * 0.7);
  vec3 pale = vec3(0.96, 1.0, 0.93);
  vec3 color = mix(pale, u_color, lower);
  float text_alpha = texture2D(u_text_mask, vec2(uv.x, 1.0 - uv.y)).a;
  float alpha = mix(1.0, text_alpha, u_has_mask);
  gl_FragColor = vec4(color, alpha);
}
`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function hexToRgb(hex: string): [number, number, number] {
  const value = hex.replace("#", "").trim();
  const normalized =
    value.length === 3
      ? value
          .split("")
          .map((part) => part + part)
          .join("")
      : value;
  const parsed = Number.parseInt(normalized, 16);
  if (normalized.length !== 6 || Number.isNaN(parsed)) {
    return [0.32, 0.78, 0.18];
  }
  return [
    ((parsed >> 16) & 255) / 255,
    ((parsed >> 8) & 255) / 255,
    (parsed & 255) / 255,
  ];
}

export function FluidTexture({
  color = "#22c55e",
  maskText,
  className,
  ...props
}: FluidTextureProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: true, antialias: true });
    if (!gl) return;

    const program = gl.createProgram();
    const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!program || !vertex || !fragment) return;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const position = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const resolution = gl.getUniformLocation(program, "u_resolution");
    const time = gl.getUniformLocation(program, "u_time");
    const textMask = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textMask);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.uniform1i(gl.getUniformLocation(program, "u_text_mask"), 0);
    gl.uniform1f(
      gl.getUniformLocation(program, "u_has_mask"),
      maskText ? 1 : 0,
    );
    gl.uniform3f(gl.getUniformLocation(program, "u_color"), ...hexToRgb(color));

    const maskCanvas = document.createElement("canvas");
    const maskContext = maskCanvas.getContext("2d");

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(bounds.width * ratio));
      const height = Math.max(1, Math.round(bounds.height * ratio));
      canvas.width = width;
      canvas.height = height;
      if (maskText && maskContext) {
        maskCanvas.width = width;
        maskCanvas.height = height;
        maskContext.clearRect(0, 0, width, height);
        maskContext.fillStyle = "white";
        let fontSize = height;
        maskContext.font = `900 ${fontSize}px Inter, Arial, sans-serif`;
        const measured = maskContext.measureText(maskText).width;
        if (measured > width * 0.96) {
          fontSize *= (width * 0.96) / measured;
          maskContext.font = `900 ${fontSize}px Inter, Arial, sans-serif`;
        }
        maskContext.textAlign = "center";
        maskContext.textBaseline = "middle";
        maskContext.fillText(maskText, width / 2, height / 2);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, textMask);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          maskCanvas,
        );
      }
      gl.viewport(0, 0, width, height);
      gl.uniform2f(resolution, width, height);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const started = performance.now();
    let frame = 0;
    const render = (now: number) => {
      gl.uniform1f(time, reduced ? 0 : (now - started) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      if (!reduced) frame = requestAnimationFrame(render);
    };
    render(started);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      gl.deleteTexture(textMask);
    };
  }, [color, maskText]);

  return (
    <canvas
      {...props}
      ref={canvasRef}
      className={className}
      aria-hidden="true"
    />
  );
}
