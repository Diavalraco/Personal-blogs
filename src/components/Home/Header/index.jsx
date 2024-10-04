import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import * as THREE from "three";

const mockGrpcClient = {
  getThemePreference: () =>
    new Promise((resolve) =>
      setTimeout(() => resolve({ darkMode: true }), 500)
    ),
  setThemePreference: (preference) =>
    new Promise((resolve) => setTimeout(() => resolve({ success: true }), 500)),
};

const ParticleField = ({ isDarkMode }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 100;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        dx: (Math.random() - 0.5) * 2,
        dy: (Math.random() - 0.5) * 2,
      });
    }

    const animate = () => {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.dx;
        particle.y += particle.dy;

        if (particle.x < 0 || particle.x > canvas.width) particle.dx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.dy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDarkMode
          ? "rgba(255, 255, 255, 0.5)"
          : "rgba(0, 0, 0, 0.5)";
        ctx.fill();
      });
    };

    animate();

    return () => cancelAnimationFrame(animate);
  }, [isDarkMode]);

  return <canvas ref={canvasRef} className="particle-field" />;
};
const initThreeJs = () => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  threeJsRef.current.appendChild(renderer.domElement);
  const cubeGeometry = new THREE.BoxGeometry(10, 10, 10);
  const cubeMaterial = new THREE.LineBasicMaterial({
    color: isDarkMode ? 0x4d94ff : 0x0f52ba,
  });

  const edges = new THREE.EdgesGeometry(cubeGeometry);
  const cubeLines = new THREE.LineSegments(edges, cubeMaterial);
  scene.add(cubeLines);

  camera.position.z = 30;

  const originalVertices = cubeGeometry.vertices.map((v) => v.clone());
  const animate = () => {
    requestAnimationFrame(animate);
    cubeGeometry.vertices.forEach((vertex, i) => {
      const originalVertex = originalVertices[i];
      const time = Date.now() * 0.001;
      const waveAmplitude = 0.5;
      const waveFrequency = 2;

      vertex.y =
        originalVertex.y +
        Math.sin(time * waveFrequency + originalVertex.x) * waveAmplitude;
      vertex.x =
        originalVertex.x +
        Math.sin(time * waveFrequency + originalVertex.y) * waveAmplitude;
    });

    cubeGeometry.verticesNeedUpdate = true;
    cubeLines.geometry.verticesNeedUpdate = true;

    cubeLines.rotation.x += 0.01;
    cubeLines.rotation.y += 0.01;

    renderer.render(scene, camera);
  };

  animate();

  return () => {
    renderer.dispose();
    cubeGeometry.dispose();
    cubeMaterial.dispose();
  };
};

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const threeJsRef = useRef(null);
  const titleControls = useAnimation();
  const subtitleControls = useAnimation();

  useEffect(() => {
    mockGrpcClient.getThemePreference().then(({ darkMode }) => {
      setIsDarkMode(darkMode);
      document.body.classList.toggle("dark-mode", darkMode);
      setIsLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (isLoaded) initThreeJs();
  }, [isLoaded]);

  const initThreeJs = () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    threeJsRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
    const material = new THREE.MeshBasicMaterial({
      color: isDarkMode ? 0x4d94ff : 0x0f52ba,
      wireframe: true,
    });
    const torusKnot = new THREE.Mesh(geometry, material);
    scene.add(torusKnot);

    camera.position.z = 30;

    const animate = () => {
      requestAnimationFrame(animate);
      torusKnot.rotation.x += 0.01;
      torusKnot.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  };

  const toggleTheme = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.body.classList.toggle("dark-mode", newMode);
    await mockGrpcClient.setThemePreference({ darkMode: newMode });
  };

  const animateTitle = async () => {
    await titleControls.start({
      scale: [1, 1.2, 1],
      transition: { duration: 0.5 },
    });
  };

  const animateSubtitle = async () => {
    await subtitleControls.start({
      y: [0, -10, 0],
      transition: { duration: 0.5 },
    });
  };

  return (
    <motion.header
      className={`home-header ${isDarkMode ? "dark-mode" : ""}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <ParticleField isDarkMode={isDarkMode} />
      <div ref={threeJsRef} className="three-js-background" />
      <AnimatePresence mode="wait">
        <motion.div
          key={isDarkMode ? "dark" : "light"}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="theme-toggle"
        >
          <motion.button
            onClick={toggleTheme}
            className="theme-toggle-button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
          </motion.button>
        </motion.div>
      </AnimatePresence>
      <motion.h1
        className="animated-title"
        style={{ color: isDarkMode ? "#b0c4de" : "#0f52ba" }}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
        onHoverStart={animateTitle}
      >
        <motion.span
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, delay: 1 }}
        >
          "
        </motion.span>{" "}
        <motion.span className="letter-animation">
          {"The Coded Narrative".split("").map((letter, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              style={{ color: isDarkMode ? "#ffffff" : "#333333" }}
            >
              {letter}
            </motion.span>
          ))}
        </motion.span>{" "}
        <motion.span
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, delay: 1 }}
        >
          "
        </motion.span>
      </motion.h1>

      <motion.h2
        className="animated-subtitle"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
        onHoverStart={animateSubtitle}
      >
        An inspiring space for stories, blogs, thoughts, and poems.
      </motion.h2>
    </motion.header>
  );
};

export default Header;

const styles = `
.home-header {
  text-align: center;
  padding: 20px;
  position: relative;
  transition: background-color 0.5s, color 0.5s;
  overflow: hidden;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.particle-field,
.three-js-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.home-header h2 {
  color: #0080ff;
  font-size: 2rem;
  margin-top: 1rem;
}

.home-header h1 {
  font-size: 3rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.dark-mode h1 {
  --primary-color: #b0c4de; /* Light color for dark mode */
}

.light-mode h1 {
  --primary-color: #0f52ba; /* Dark color for light mode */
}

.letter-animation span {
  color: var(--text-color);
}

.dark-mode .letter-animation span {
  --text-color: #ffffff; /* Bright text color for dark mode */
}

.light-mode .letter-animation span {
  --text-color: #333333; /* Dark text color for light mode */
}


.home-header h1 span {
  color: #b0c4de;
  display: inline-block;
}

.theme-toggle {
  position: absolute;
  top: 20px;
  right: 20px;
}

.theme-toggle-button {
  background: rgba(0, 0, 0, 0.1);
  border: none;
  cursor: pointer;
  padding: 12px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
}

.theme-toggle-button svg {
  color: #333;
}

.dark-mode {
  background-color: rgba(26, 26, 26, 0.8);
  color: #ffffff;
}

.dark-mode h2 {
  color: #66b3ff;
}

.dark-mode h1 {
  color: #4d94ff;
}

.dark-mode h1 span {
  color: #99c2ff;
}

.dark-mode .theme-toggle-button {
  background: rgba(255, 255, 255, 0.2);
}

.dark-mode .theme-toggle-button svg {
  color: #fff;
}

body.dark-mode {
  background-color: #1a1a1a;
  color: #ffffff;
}

.letter-animation {
  display: inline-block;
}

.letter-animation span {
  display: inline-block;
  white-space: pre;
}
`;

const styleSheet = new CSSStyleSheet();
styleSheet.replaceSync(styles);
document.adoptedStyleSheets = [styleSheet];
