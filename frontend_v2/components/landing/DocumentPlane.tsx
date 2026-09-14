"use client";

import React, { useEffect, useRef } from "react";

/*
 * The one WebGL element on the page: a textured plane showing the current
 * sample document. Three is imported on demand so the landing bundle stays
 * small until this section is close to the viewport.
 *
 * The shader does two things, each tied to a pipeline stage:
 *   scan   a horizontal line sweeps the image while quality is measured
 *   mix    the current document dissolves into the next modality
 */

export interface PlaneState {
  from: number;
  to: number;
  mix: number;
  scan: number;
  reveal: number;
}

const VERT = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const FRAG = `
precision highp float;
uniform sampler2D tFrom;
uniform sampler2D tTo;
uniform float uMix;
uniform float uScan;
uniform float uReveal;
uniform vec2 uFitFrom;
uniform vec2 uFitTo;
uniform vec3 uSignal;
uniform vec3 uPaper;
varying vec2 vUv;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

// Contain-fit: each document keeps its own aspect inside the plane and the
// remainder is paper, so an ECG strip is never stretched into a portrait.
vec4 fitted(sampler2D t, vec2 fit, vec2 uv) {
  vec2 p = (uv - 0.5) / fit + 0.5;
  float inside = step(0.0, p.x) * step(p.x, 1.0) * step(0.0, p.y) * step(p.y, 1.0);
  return mix(vec4(uPaper, 1.0), texture2D(t, p), inside);
}

void main() {
  vec4 a = fitted(tFrom, uFitFrom, vUv);
  vec4 b = fitted(tTo, uFitTo, vUv);
  // Dissolve top to bottom with a blocky noise edge. The threshold runs
  // 0 to 1.34 so every cell, noise included, is covered when uMix is 1.
  float n = hash(floor(vUv * 96.0)) * 0.18;
  float v = (1.0 - vUv.y) + n;
  float m = smoothstep(v, v + 0.16, uMix * 1.34);
  vec4 c = mix(a, b, m);

  // Document enters from below as a hard reveal, not a fade.
  float r = step(1.0 - uReveal, 1.0 - vUv.y);
  c = mix(vec4(uPaper, 1.0), c, r);

  // Quality scan: a one pixel line with a faint wake beneath it.
  float d = vUv.y - (1.0 - uScan);
  float line = smoothstep(0.004, 0.0, abs(d)) * step(0.001, uScan) * step(uScan, 0.999);
  float wake = smoothstep(0.12, 0.0, d) * step(0.0, d) * 0.12 * step(0.001, uScan) * step(uScan, 0.999);
  c.rgb = mix(c.rgb, uSignal, line + wake);
  gl_FragColor = c;
}`;

export function DocumentPlane({ sources, state, className }: { sources: string[]; state: React.MutableRefObject<PlaneState>; className?: string }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};
    const el = host.current;
    if (!el) return;

    const io = new IntersectionObserver(
      async (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const THREE = await import("three");
        if (disposed) return;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        el.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0, 10);
        camera.position.z = 1;

        const loader = new THREE.TextureLoader();
        const textures = sources.map((s) => {
          const t = loader.load(s);
          t.colorSpace = THREE.SRGBColorSpace;
          t.minFilter = THREE.LinearFilter;
          return t;
        });
        const css = getComputedStyle(el);
        const signal = new THREE.Color(css.getPropertyValue("--l-signal").trim());
        const paper = new THREE.Color(css.getPropertyValue("--l-bg").trim());

        const material = new THREE.ShaderMaterial({
          vertexShader: VERT,
          fragmentShader: FRAG,
          uniforms: {
            tFrom: { value: textures[0] },
            tTo: { value: textures[1] ?? textures[0] },
            uMix: { value: 0 },
            uScan: { value: 0 },
            uReveal: { value: 0 },
            uFitFrom: { value: new THREE.Vector2(1, 1) },
            uFitTo: { value: new THREE.Vector2(1, 1) },
            uSignal: { value: signal },
            uPaper: { value: paper },
          },
        });
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
        scene.add(mesh);

        const fits = sources.map(() => new THREE.Vector2(1, 1));
        const refit = () => {
          const { clientWidth: w, clientHeight: h } = el;
          const plane = w / Math.max(1, h);
          textures.forEach((t, i) => {
            const img = t.image as { width?: number; height?: number } | undefined;
            if (!img?.width || !img?.height) return;
            const tex = img.width / img.height;
            if (tex > plane) fits[i].set(1, plane / tex);
            else fits[i].set(tex / plane, 1);
          });
        };
        textures.forEach((t) => {
          const img = t.image as { addEventListener?: (n: string, f: () => void) => void; complete?: boolean } | undefined;
          img?.addEventListener?.("load", refit);
        });
        const resize = () => {
          const { clientWidth: w, clientHeight: h } = el;
          renderer.setSize(w, h, false);
          refit();
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(el);

        let raf = 0;
        const frame = () => {
          raf = requestAnimationFrame(frame);
          const s = state.current;
          material.uniforms.tFrom.value = textures[s.from] ?? textures[0];
          material.uniforms.tTo.value = textures[s.to] ?? textures[0];
          material.uniforms.uMix.value = s.mix;
          material.uniforms.uScan.value = s.scan;
          material.uniforms.uReveal.value = s.reveal;
          refit();
          material.uniforms.uFitFrom.value.copy(fits[s.from] ?? fits[0]);
          material.uniforms.uFitTo.value.copy(fits[s.to] ?? fits[0]);
          renderer.render(scene, camera);
        };
        frame();

        cleanup = () => {
          cancelAnimationFrame(raf);
          ro.disconnect();
          textures.forEach((t) => t.dispose());
          material.dispose();
          mesh.geometry.dispose();
          renderer.dispose();
          renderer.domElement.remove();
        };
      },
      { rootMargin: "600px" }
    );
    io.observe(el);

    return () => {
      disposed = true;
      io.disconnect();
      cleanup();
    };
  }, [sources, state]);

  return <div ref={host} className={className} aria-hidden="true" />;
}
