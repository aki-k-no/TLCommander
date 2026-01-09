import React, { useRef, useState, useEffect } from "react";

const CANVAS_SIZE = 400;
const UI_WIDTH = 500;

const PARTICLES = [
  "explode","largeexplode","hugeexplosion","fireworksSpark","bubble",
  "splash","wake","suspended","depthsuspend","crit","magicCrit","smoke",
  "largesmoke","spell","instantSpell","mobSpell","mobSpellAmbient",
  "witchMagic","dripWater","dripLava","angryVillager","happyVillager",
  "townaura","note","portal","enchantmenttable","flame","lava","footstep",
  "cloud","reddust","snowballpoof","snowshovel","slime","heart","barrier",
  "droplet","take","mobappearance"
];

export default function App() {
  const canvasRef = useRef(null);

  const [image, setImage] = useState(null);
  const [dotX, setDotX] = useState(50);
  const [targetWidth, setTargetWidth] = useState(5); // 初期値5、0〜20に変更
  const [threshold, setThreshold] = useState(128);
  const [particle, setParticle] = useState("explode");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [blackCount, setBlackCount] = useState(0); // 黒ドット数

  useEffect(() => {
    if (image) processImage();
  }, [image, dotX, targetWidth, threshold, particle]);

  const handleImageUpload = (e) => {
    const img = new Image();
    img.onload = () => setImage(img);
    img.src = URL.createObjectURL(e.target.files[0]);
  };

  const processImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const cw = canvas.width;
    const ch = canvas.height;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(image, 0, 0, cw, ch);

    const X = image.width;
    const Y = image.height;

    const imgData = ctx.getImageData(0, 0, cw, ch);
    const data = imgData.data;

    // 白黒化（閾値）
    for (let i = 0; i < data.length; i += 4) {
      const gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
      const bw = gray > threshold ? 255 : 0;
      data[i] = data[i + 1] = data[i + 2] = bw;
    }

    ctx.clearRect(0, 0, cw, ch);

    // 論理ドット
    const aspect = Y / X;
    const dotY = Math.round(dotX * aspect);

    const cellW = cw / dotX;
    const cellH = ch / dotY;

    const dots = [];

    for (let dy = 0; dy < dotY; dy++) {
      for (let dx = 0; dx < dotX; dx++) {
        const px = Math.floor(dx * cellW);
        const py = Math.floor(dy * cellH);
        const idx = (py * cw + px) * 4;

        if (data[idx] === 0) {
          dots.push({ dx, dy });

          // 白線を消すために fillRect を少し拡大・整数化
          const drawX = Math.round(dx * cellW);
          const drawY = Math.round(dy * cellH);
          const drawW = Math.ceil(cellW);
          const drawH = Math.ceil(cellH);

          ctx.fillStyle = "black";
          ctx.fillRect(drawX, drawY, drawW, drawH);
        }
      }
    }

    setBlackCount(dots.length);

    // 中央原点座標変換
    let M = targetWidth;
    if (M <= 0) M = 1; // 0防止
    const N = X / M;

    const commands = dots.map(d => {
      const ox = (d.dx / dotX) * X;
      const oy = (d.dy / dotY) * Y;
      const cx = ox - X / 2;
      const cz = oy - Y / 2;
      return `particle ${particle} ${(cx / N).toFixed(2)} 0 ${(cz / N).toFixed(2)} 0 0 0 0 1 force`;
    });

    setOutput(commands.join(" & "));
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div
        style={{
          width: UI_WIDTH,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12
        }}
      >
        <h2>画像 → ドット絵 → Particle 変換</h2>

        <input type="file" accept="image/*" onChange={handleImageUpload} />

        <div style={{ width: "100%" }}>
          <label>横ドット数: {dotX}</label>
          <input
            type="range"
            min="10"
            max="200"
            value={dotX}
            onChange={e => setDotX(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ width: "100%" }}>
          <label>閾値: {threshold}</label>
          <input
            type="range"
            min="0"
            max="255"
            value={threshold}
            onChange={e => setThreshold(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ width: "100%" }}>
          <label>変換後の幅 M: {targetWidth}</label>
          <input
            type="range"
            min="0"
            max="20"
            value={targetWidth}
            onChange={e => setTargetWidth(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ width: "100%" }}>
          <label>Particle:</label>
          <select
            value={particle}
            onChange={e => setParticle(e.target.value)}
            style={{ width: "100%" }}
          >
            {PARTICLES.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          style={{ border: "1px solid black" }}
        />

        <div>黒ドット数: {blackCount}</div>

        <textarea
          readOnly
          value={output}
          rows={8}
          style={{ width: "100%" }}
        />

        <button onClick={copyToClipboard} disabled={!output}>
          クリップボードにコピー
        </button>

        {copied && <div>コピーしました</div>}
      </div>
    </div>
  );
}
