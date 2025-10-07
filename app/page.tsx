"use client";

import Spiral from "@/app/ui/spiral";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const text =
    "Love is the quiet force that binds our lives together, often revealed in the smallest gestures — a gentle word, a patient silence, a hand that stays when everything else feels uncertain. It is the warmth that lingers in the memory of a shared smile, the comfort that comes from knowing someone truly sees you, even in your most flawed moments. Love transcends distance and time, existing in the spaces between words and in the unspoken understanding that two hearts can hold each other even when they are apart. It teaches us empathy, guiding us to feel another’s pain as our own, and patience, as we learn that relationships, like life itself, require care, attention, and gentle tending. \
    True love is not about possession or perfection, nor is it about controlling another person’s path. Instead, it is about embracing another’s entirety — their strengths, weaknesses, dreams, and fears — and choosing to remain connected despite the inevitable challenges. It is in the quiet sacrifice, the small acts of kindness, and the willingness to forgive that love reveals its depth. Love is the steady hand that holds us when our own resolve falters, the voice that whispers encouragement when doubt clouds our minds, and the anchor that keeps us grounded when life threatens to sweep us away in its chaos. \
    It transforms ordinary moments into something sacred. A shared meal becomes a memory; a simple walk turns into a journey of hearts; even silence is imbued with meaning when it is accompanied by mutual understanding and trust. Love encourages growth, not just for ourselves but for those we care about, fostering resilience and inspiring courage to face life’s inevitable storms. It is not a fleeting passion or a superficial thrill, but a deep, enduring connection that evolves with time, weathering mistakes, misunderstandings, and the passing of seasons. \
    Moreover, love is a mirror, reflecting both the beauty and the darkness within us. Through love, we confront our vulnerabilities, our fears of rejection, and our insecurities, and in doing so, we are offered the rare opportunity to transform and heal. It teaches humility, showing us that no one is perfect and that true intimacy comes from the willingness to reveal one’s authentic self. Love also teaches gratitude, reminding us to cherish those who walk alongside us, who hold space for our dreams, and who lend strength when we feel weak. \
    Moreover, love is a mirror, reflecting both the beauty and the darkness within us. Through love, we confront our vulnerabilities, our fears of rejection, and our insecurities, and in doing so, we are offered the rare opportunity to transform and heal. It teaches humility, showing us that no one is perfect and that true intimacy comes from the willingness to reveal one’s authentic self. Love also teaches gratitude, reminding us to cherish those who walk alongside us, who hold space for our dreams, and who lend strength when we feel weak. \
    Moreover, love is a mirror, reflecting both the beauty and the darkness within us. Through love, we confront our vulnerabilities, our fears of rejection, and our insecurities, and in doing so, we are offered the rare opportunity to transform and heal. It teaches humility, showing us that no one is perfect and that true intimacy comes from the willingness to reveal one’s authentic self. Love also teaches gratitude, reminding us to cherish those who walk alongside us, who hold space for our dreams, and who lend strength when we feel weak. \
    Moreover, love is a mirror, reflecting both the beauty and the darkness within us. Through love, we confront our vulnerabilities, our fears of rejection, and our insecurities, and in doing so, we are offered the rare opportunity to transform and heal. It teaches humility, showing us that no one is perfect and that true intimacy comes from the willingness to reveal one’s authentic self. Love also teaches gratitude, reminding us to cherish those who walk alongside us, who hold space for our dreams, and who lend strength when we feel weak. \
    Moreover, love is a mirror, reflecting both the beauty and the darkness within us. Through love, we confront our vulnerabilities, our fears of rejection, and our insecurities, and in doing so, we are offered the rare opportunity to transform and heal. It teaches humility, showing us that no one is perfect and that true intimacy comes from the willingness to reveal one’s authentic self. Love also teaches gratitude, reminding us to cherish those who walk alongside us, who hold space for our dreams, and who lend strength when we feel weak. \
    Moreover, love is a mirror, reflecting both the beauty and the darkness within us. Through love, we confront our vulnerabilities, our fears of rejection, and our insecurities, and in doing so, we are offered the rare opportunity to transform and heal. It teaches humility, showing us that no one is perfect and that true intimacy comes from the willingness to reveal one’s authentic self. Love also teaches gratitude, reminding us to cherish those who walk alongside us, who hold space for our dreams, and who lend strength when we feel weak. \
    Moreover, love is a mirror, reflecting both the beauty and the darkness within us. Through love, we confront our vulnerabilities, our fears of rejection, and our insecurities, and in doing so, we are offered the rare opportunity to transform and heal. It teaches humility, showing us that no one is perfect and that true intimacy comes from the willingness to reveal one’s authentic self. Love also teaches gratitude, reminding us to cherish those who walk alongside us, who hold space for our dreams, and who lend strength when we feel weak. \
    Moreover, love is a mirror, reflecting both the beauty and the darkness within us. Through love, we confront our vulnerabilities, our fears of rejection, and our insecurities, and in doing so, we are offered the rare opportunity to transform and heal. It teaches humility, showing us that no one is perfect and that true intimacy comes from the willingness to reveal one’s authentic self. Love also teaches gratitude, reminding us to cherish those who walk alongside us, who hold space for our dreams, and who lend strength when we feel weak. \
    Ultimately, love is the thread that weaves meaning into the fabric of human existence. It is the force that inspires art, music, poetry, and countless acts of kindness. It gives depth to our joys and softens the pain of our sorrows. To love and to be loved is to touch something beyond ourselves, to experience a connection that affirms our shared humanity. It is both a refuge and a challenge, a constant invitation to grow, to forgive, and to embrace life in all its beauty and complexity. In every sense, love is the heartbeat of our existence, quietly persistent, endlessly patient, and infinitely transformative.";

  const [playing, setPlaying] = useState(false);
  const svgRef = useRef<any>(null);

  const handleReplay = (text: string) => {
    setPlaying(true);

    setTimeout(() => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.rate = 1;
        u.pitch = 1;
        window.speechSynthesis.speak(u);
      }
    }, 50);
  };

  useEffect(() => {
    // Initialize the speech
    handleReplay(text);
  }, []);

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      {/* Fullscreen SVG */}
      <svg
        ref={svgRef}
        className="w-full h-full"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <Spiral text={text.slice(0, 1000)} svgRef={svgRef} />
        <Spiral text={text.slice(0, 2000)} svgRef={svgRef} />
        <Spiral text={text.slice(0, 3000)} svgRef={svgRef} />
        <Spiral text={text.slice(0, 4000)} svgRef={svgRef} />
        <Spiral text={text.slice(0, 6000)} svgRef={svgRef} />
        <Spiral text={text.slice(0, 6000)} svgRef={svgRef} />
        <Spiral text={text.slice(0, 6000)} svgRef={svgRef} />
        <Spiral text={text.slice(0, 6000)} svgRef={svgRef} />
      </svg>

      <div className="absolute bottom-5 right-5 flex items-center gap-2 text-sm font-medium text-white">
        <div className="bg-white/10 px-3 py-1.5 rounded-md backdrop-blur-sm">
          {playing ? "Playing" : "Stopped"}
        </div>
        <button
          onClick={() => handleReplay(text)}
          className="bg-white/10 border border-white/20 hover:bg-white/20 text-white px-3 py-1.5 rounded-md transition"
        >
          Replay
        </button>
      </div>
    </div>
  );
}
