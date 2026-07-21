import React, { useEffect, useRef } from 'react';

interface BackgroundShaderProps {
  isDarkMode: boolean;
  lowPowerMode?: boolean;
}

export const BackgroundShader: React.FC<BackgroundShaderProps> = ({ isDarkMode, lowPowerMode = false }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || lowPowerMode) return;

    let animId: number;
    const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;

    if (!gl) {
      // Fallback 2D canvas ambient render
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let t = 0;
      const render2D = () => {
        t += 0.01;
        const w = canvas.width = canvas.clientWidth || 1280;
        const h = canvas.height = canvas.clientHeight || 720;
        
        ctx.fillStyle = isDarkMode ? '#121414' : '#f5f7f8';
        ctx.fillRect(0, 0, w, h);

        const grad = ctx.createRadialGradient(
          w * (0.5 + 0.2 * Math.sin(t * 0.5)),
          h * (0.4 + 0.2 * Math.cos(t * 0.3)),
          10,
          w / 2,
          h / 2,
          Math.max(w, h)
        );

        if (isDarkMode) {
          grad.addColorStop(0, 'rgba(0, 219, 233, 0.12)');
          grad.addColorStop(0.5, 'rgba(119, 1, 208, 0.08)');
          grad.addColorStop(1, 'rgba(18, 20, 20, 1)');
        } else {
          grad.addColorStop(0, 'rgba(0, 150, 200, 0.08)');
          grad.addColorStop(0.5, 'rgba(120, 50, 200, 0.05)');
          grad.addColorStop(1, 'rgba(245, 247, 248, 1)');
        }

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
        animId = requestAnimationFrame(render2D);
      };
      render2D();
      return () => cancelAnimationFrame(animId);
    }

    // WebGL Shader setup
    const vs = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fsDark = `
      precision highp float;
      varying vec2 v_texCoord;
      uniform float u_time;
      uniform vec2 u_resolution;

      void main() {
        vec2 uv = v_texCoord;
        float noise = sin(uv.x * 4.0 + u_time * 0.25) * cos(uv.y * 4.0 + u_time * 0.35);
        float glow = 0.5 + 0.5 * sin(u_time * 0.15);

        vec3 baseColor = vec3(0.06, 0.07, 0.08); // Dark Charcoal
        vec3 accentColor1 = vec3(0.0, 0.86, 0.95) * 0.18; // Cyan glow
        vec3 accentColor2 = vec3(0.48, 0.0, 0.85) * 0.12; // Violet glow

        vec3 color = baseColor + accentColor1 * noise + accentColor2 * glow;
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const fsLight = `
      precision highp float;
      varying vec2 v_texCoord;
      uniform float u_time;
      uniform vec2 u_resolution;

      void main() {
        vec2 uv = v_texCoord;
        float noise = sin(uv.x * 3.5 + u_time * 0.2) * cos(uv.y * 3.5 + u_time * 0.25);
        float glow = 0.5 + 0.5 * sin(u_time * 0.1);

        vec3 baseColor = vec3(0.96, 0.97, 0.98);
        vec3 accentColor1 = vec3(0.0, 0.6, 0.8) * 0.08;
        vec3 accentColor2 = vec3(0.5, 0.2, 0.8) * 0.05;

        vec3 color = baseColor + accentColor1 * noise + accentColor2 * glow;
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const compileShader = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };

    const vertShader = compileShader(gl.VERTEX_SHADER, vs);
    const fragShader = compileShader(gl.FRAGMENT_SHADER, isDarkMode ? fsDark : fsLight);
    if (!vertShader || !fragShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const pos = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, 'u_time');
    const uRes = gl.getUniformLocation(program, 'u_resolution');

    const resize = () => {
      if (!canvas) return;
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };
    resize();
    window.addEventListener('resize', resize);

    let startTime = performance.now();
    const render = (now: number) => {
      resize();
      const elapsed = (now - startTime) * 0.001;
      if (uTime) gl.uniform1f(uTime, elapsed);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, [isDarkMode, lowPowerMode]);

  if (lowPowerMode) {
    return (
      <div className={`fixed inset-0 pointer-events-none z-0 transition-colors duration-500 ${isDarkMode ? 'bg-[#121414]' : 'bg-[#f5f7f8]'}`} />
    );
  }

  return (
    <div className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-700">
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div className={`absolute inset-0 pointer-events-none ${isDarkMode ? 'bg-gradient-to-t from-[#121414] via-transparent to-[#121414]/50' : 'bg-gradient-to-t from-[#f5f7f8] via-transparent to-[#f5f7f8]/50'}`} />
    </div>
  );
};
