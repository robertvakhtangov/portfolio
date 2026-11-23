import { useEffect, useRef, useState } from "react";
import "./ScrollIndicator.css";

const MIN_THUMB = 48; // px; keeps the thumb easy to grab on long pages

// A custom overlay scrollbar for mouse/trackpad devices (the native one is
// hidden in index.css). No visible rail: just a dark thumb that rests nearly
// invisible and reveals itself when the pointer is near the right edge.
// Writes position straight to the DOM to avoid re-rendering on every scroll.
export default function ScrollIndicator() {
  const railRef = useRef(null);
  const thumbRef = useRef(null);
  const geom = useRef({ h: 0, maxTop: 0, range: 0 });
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    // Touch devices keep the native indicator (rail hidden in CSS): skip the
    // per-scroll and per-resize work entirely
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const rail = railRef.current;
    const thumb = thumbRef.current;
    let raf = 0;

    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const total = document.documentElement.scrollHeight;
      const range = total - vh;
      if (range <= 1) {
        rail.hidden = true;
        return;
      }
      rail.hidden = false;
      const track = rail.clientHeight;
      const h = Math.max(MIN_THUMB, (track * vh) / total);
      const maxTop = track - h;
      const top = (window.scrollY / range) * maxTop;
      geom.current = { h, maxTop, range };
      thumb.style.height = `${h}px`;
      thumb.style.transform = `translateY(${top}px)`;
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    // page height changes (e.g. expanding Projects) without a scroll event
    const ro = new ResizeObserver(schedule);
    ro.observe(document.body);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  // Drag the thumb: map pointer movement on the track to page scroll
  function onThumbDown(e) {
    e.preventDefault();
    e.stopPropagation();
    const thumb = thumbRef.current;
    thumb.setPointerCapture(e.pointerId);
    const startY = e.clientY;
    const startScroll = window.scrollY;
    const { maxTop, range } = geom.current;
    const ratio = maxTop > 0 ? range / maxTop : 0;
    setDragging(true);

    const move = (ev) =>
      window.scrollTo({ top: startScroll + (ev.clientY - startY) * ratio, behavior: "instant" });
    const up = () => {
      thumb.removeEventListener("pointermove", move);
      thumb.removeEventListener("pointerup", up);
      thumb.removeEventListener("pointercancel", up);
      setDragging(false);
    };
    thumb.addEventListener("pointermove", move);
    thumb.addEventListener("pointerup", up);
    thumb.addEventListener("pointercancel", up);
  }

  // Click the empty track: jump so the thumb centres on the click
  function onRailDown(e) {
    const rail = railRef.current.getBoundingClientRect();
    const { h, maxTop, range } = geom.current;
    if (maxTop <= 0) return;
    const top = Math.min(Math.max(e.clientY - rail.top - h / 2, 0), maxTop);
    window.scrollTo({ top: (top / maxTop) * range, behavior: "smooth" });
  }

  return (
    <div
      ref={railRef}
      className={`scroll-rail${dragging ? " is-dragging" : ""}`}
      aria-hidden="true"
      onPointerDown={onRailDown}
    >
      <div ref={thumbRef} className="scroll-thumb" onPointerDown={onThumbDown} />
    </div>
  );
}
