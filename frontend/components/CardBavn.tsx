export function CardNav() {
  return (
    <div style={{ width: "1080px", height: "1080px", position: "relative" }}>
      <Prism
        height={3.5}
        baseWidth={5.5}
        animationType="rotate"
        glow={1}
        noise={0.2}
        transparent
        scale={3.6}
        hueShift={75}
        colorFrequency={0.6}
        hoverStrength={2}
        inertia={0.05}
        bloom={0.9}
        timeScale={0.5}
      />
    </div>
  );
}
