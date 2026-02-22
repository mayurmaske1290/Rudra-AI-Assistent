(() => {
  const universeCanvas = document.getElementById('universeCanvas');
  if (universeCanvas && window.THREE) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1200);
    camera.position.z = 120;

    const renderer = new THREE.WebGLRenderer({ canvas: universeCanvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));

    const pointsGeometry = new THREE.BufferGeometry();
    const pointArray = [];
    for (let i = 0; i < 4500; i++) {
      pointArray.push((Math.random() - 0.5) * 900, (Math.random() - 0.5) * 900, (Math.random() - 0.5) * 900);
    }
    pointsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(pointArray, 3));

    const stars = new THREE.Points(
      pointsGeometry,
      new THREE.PointsMaterial({ color: 0xcfe8ff, size: 1.1, transparent: true, opacity: 0.9 })
    );
    scene.add(stars);

    const nebula = new THREE.Mesh(
      new THREE.SphereGeometry(38, 42, 42),
      new THREE.MeshPhongMaterial({ color: 0x7d40ff, transparent: true, opacity: 0.14, emissive: 0x2a0f6a })
    );
    scene.add(nebula);

    scene.add(new THREE.AmbientLight(0x334488, 0.9));
    const pLight = new THREE.PointLight(0x67d9ff, 1.4, 450);
    pLight.position.set(30, 25, 45);
    scene.add(pLight);

    const mouse = { x: 0, y: 0 };
    window.addEventListener('mousemove', (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    const resize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', resize);
    resize();

    (function animate() {
      requestAnimationFrame(animate);
      stars.rotation.y += 0.00035;
      stars.rotation.x += 0.00008;
      nebula.rotation.y += 0.001;
      camera.position.x += (mouse.x * 9 - camera.position.x) * 0.03;
      camera.position.y += (-mouse.y * 6 - camera.position.y) * 0.03;
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    })();
  }

  gsap.registerPlugin(ScrollTrigger);
  gsap.from('.hero-content', { opacity: 0, y: 50, duration: 1.2, delay: 0.2 });
  gsap.utils.toArray('.section-block').forEach((section) => {
    gsap.from(section, {
      opacity: 0,
      y: 70,
      duration: 0.8,
      scrollTrigger: { trigger: section, start: 'top 82%' }
    });
  });

  document.getElementById('themeToggle')?.addEventListener('click', () => {
    document.body.classList.toggle('light');
  });

  const ambientAudio = document.getElementById('ambientAudio');
  const musicToggle = document.getElementById('musicToggle');
  musicToggle?.addEventListener('click', async () => {
    if (!ambientAudio) return;
    if (ambientAudio.paused) {
      try {
        await ambientAudio.play();
        musicToggle.textContent = '🔇';
      } catch {
        musicToggle.textContent = '🎵';
      }
    } else {
      ambientAudio.pause();
      musicToggle.textContent = '🎵';
    }
  });

  const cursor = document.getElementById('customCursor');
  window.addEventListener('mousemove', (e) => {
    if (!cursor) return;
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
  });

  window.addEventListener('scroll', () => {
    const fill = document.getElementById('fuelFill');
    if (!fill) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const percent = max > 0 ? (window.scrollY / max) * 100 : 0;
    fill.style.height = `${percent}%`;
  });

  setTimeout(() => document.getElementById('loader')?.classList.add('hidden'), 1200);

  // Earth model in contact section
  const earthCanvas = document.getElementById('earthCanvas');
  if (earthCanvas && window.THREE) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, earthCanvas.clientWidth / earthCanvas.clientHeight, 0.1, 1000);
    camera.position.z = 3;
    const renderer = new THREE.WebGLRenderer({ canvas: earthCanvas, alpha: true, antialias: true });
    const light = new THREE.PointLight(0xffffff, 1.8);
    light.position.set(3, 2, 3);
    scene.add(new THREE.AmbientLight(0x7799ff, 0.4), light);

    const globe = new THREE.Mesh(
      new THREE.SphereGeometry(1, 64, 64),
      new THREE.MeshStandardMaterial({ map: new THREE.TextureLoader().load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg') })
    );
    scene.add(globe);

    const resize = () => {
      const w = earthCanvas.clientWidth;
      const h = earthCanvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', resize);
    resize();

    (function animateEarth() {
      requestAnimationFrame(animateEarth);
      globe.rotation.y += 0.004;
      renderer.render(scene, camera);
    })();
  }
})();
