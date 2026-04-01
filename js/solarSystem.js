(() => {
  const canvas = document.getElementById('solarCanvas');
  if (!canvas || !window.THREE) return;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x02040f);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 2400);
  camera.position.set(0, 120, 260);
  camera.lookAt(0, 0, 0);

  const controls = new THREE.OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.maxDistance = 560;
  controls.minDistance = 60;
  controls.target.set(0, 0, 0);

  // Lighting tuned for better planet visibility
  scene.add(new THREE.AmbientLight(0x9fb7ff, 0.58));
  const hemi = new THREE.HemisphereLight(0x7aa6ff, 0x0b1126, 0.42);
  scene.add(hemi);
  const sunLight = new THREE.PointLight(0xfff0c2, 3.4, 1900, 2);
  sunLight.position.set(0, 0, 0);
  scene.add(sunLight);

  const starGeo = new THREE.BufferGeometry();
  const starVertices = [];
  for (let i = 0; i < 2500; i++) {
    starVertices.push((Math.random() - 0.5) * 2600, (Math.random() - 0.5) * 2600, (Math.random() - 0.5) * 2600);
  }
  starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
  scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xeef6ff, size: 1.2 })));

  const texture = new THREE.TextureLoader();
  const sun = new THREE.Mesh(
    new THREE.SphereGeometry(18, 40, 40),
    new THREE.MeshStandardMaterial({
      map: texture.load('https://threejs.org/examples/textures/planets/sun.jpg'),
      emissive: 0xffd17a,
      emissiveIntensity: 0.9
    })
  );
  scene.add(sun);

  // Slight glow shell for visual clarity
  const sunGlow = new THREE.Mesh(
    new THREE.SphereGeometry(22, 30, 30),
    new THREE.MeshBasicMaterial({ color: 0xffc971, transparent: true, opacity: 0.2 })
  );
  scene.add(sunGlow);

  const projectData = [
    ['Mercury', 30, 0.011, '#b1b7be', { title: 'API Gateway', desc: 'High throughput microservice gateway.', tech: 'Node.js, Redis, Docker', gh: '#', demo: '#' }],
    ['Venus', 42, 0.0087, '#e3b36f', { title: 'Design System', desc: 'Token-based UI architecture.', tech: 'Figma, React, Storybook', gh: '#', demo: '#' }],
    ['Earth', 58, 0.0074, '#4d8eff', { title: 'SaaS Dashboard', desc: 'Realtime analytics platform.', tech: 'Next.js, Prisma, Postgres', gh: '#', demo: '#' }],
    ['Mars', 74, 0.0062, '#d7632f', { title: 'IoT Monitor', desc: 'Edge telemetry observability suite.', tech: 'Vue, MQTT, FastAPI', gh: '#', demo: '#' }],
    ['Jupiter', 96, 0.0045, '#debd95', { title: 'Commerce Engine', desc: 'Global storefront and inventory.', tech: 'TypeScript, GraphQL', gh: '#', demo: '#' }],
    ['Saturn', 124, 0.0038, '#edd48f', { title: '3D Product Lab', desc: 'WebGL product configurator.', tech: 'Three.js, GSAP', gh: '#', demo: '#' }],
    ['Uranus', 150, 0.003, '#8ef7ff', { title: 'Mobile Banking', desc: 'Secure fintech super-app.', tech: 'Flutter, Go, GCP', gh: '#', demo: '#' }],
    ['Neptune', 176, 0.0024, '#7f96ff', { title: 'AI Knowledge Hub', desc: 'RAG-powered enterprise assistant.', tech: 'Python, LangChain, Vector DB', gh: '#', demo: '#' }]
  ];

  const planets = [];
  projectData.forEach(([name, orbit, speed, color, details], i) => {
    const radius = name === 'Jupiter' ? 8.6 : name === 'Saturn' ? 7.4 : 4 + i * 0.55;
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 36, 36),
      new THREE.MeshStandardMaterial({ color, roughness: 0.74, metalness: 0.08, emissive: color, emissiveIntensity: 0.08 })
    );
    mesh.userData = { ...details, name, orbit, speed, angle: i + Math.random() * Math.PI * 2 };
    scene.add(mesh);
    planets.push(mesh);

    const orbitRing = new THREE.Mesh(
      new THREE.RingGeometry(orbit - 0.18, orbit + 0.18, 240),
      new THREE.MeshBasicMaterial({ color: 0x4f6996, side: THREE.DoubleSide, transparent: true, opacity: 0.6 })
    );
    orbitRing.rotation.x = Math.PI / 2;
    scene.add(orbitRing);

    if (name === 'Saturn') {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(10, 15, 72),
        new THREE.MeshStandardMaterial({ color: 0xd9c387, side: THREE.DoubleSide, transparent: true, opacity: 0.8 })
      );
      ring.rotation.x = Math.PI / 2.8;
      mesh.add(ring);
    }
  });

  const asteroidGroup = new THREE.Group();
  for (let i = 0; i < 380; i++) {
    const asteroid = new THREE.Mesh(
      new THREE.SphereGeometry(Math.random() * 0.65 + 0.15, 6, 6),
      new THREE.MeshStandardMaterial({ color: 0x8f8f8f, roughness: 0.95 })
    );
    const theta = Math.random() * Math.PI * 2;
    const radius = 108 + Math.random() * 10;
    asteroid.position.set(Math.cos(theta) * radius, (Math.random() - 0.5) * 3.2, Math.sin(theta) * radius);
    asteroidGroup.add(asteroid);
  }
  scene.add(asteroidGroup);

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const modal = document.getElementById('projectModal');
  const fields = {
    title: document.getElementById('projectTitle'),
    desc: document.getElementById('projectDescription'),
    tech: document.getElementById('projectTech'),
    gh: document.getElementById('projectGithub'),
    demo: document.getElementById('projectDemo')
  };

  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const hit = raycaster.intersectObjects(planets)[0];
    if (!hit) return;

    const p = hit.object.userData;
    gsap.to(camera.position, {
      duration: 1,
      x: hit.object.position.x + 20,
      y: hit.object.position.y + 12,
      z: hit.object.position.z + 22
    });
    gsap.to(controls.target, {
      duration: 1,
      x: hit.object.position.x,
      y: hit.object.position.y,
      z: hit.object.position.z
    });

    fields.title.textContent = `${p.name}: ${p.title}`;
    fields.desc.textContent = p.desc;
    fields.tech.textContent = p.tech;
    fields.gh.href = p.gh;
    fields.demo.href = p.demo;
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');

    const hint = document.getElementById('chatHint');
    if (hint) hint.textContent = `${p.name} selected. Mission details uploaded.`;
  });

  document.getElementById('closeModal')?.addEventListener('click', () => {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    gsap.to(controls.target, { duration: 0.9, x: 0, y: 0, z: 0 });
  });

  function resize() {
    const w = Math.max(1, canvas.clientWidth);
    const h = Math.max(1, canvas.clientHeight);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  window.addEventListener('resize', resize);
  if (window.ResizeObserver) {
    const observer = new ResizeObserver(() => resize());
    observer.observe(canvas);
  }
  resize();

  (function animate() {
    requestAnimationFrame(animate);
    sun.rotation.y += 0.002;
    sunGlow.rotation.y -= 0.001;

    planets.forEach((planet) => {
      planet.userData.angle += planet.userData.speed;
      planet.position.x = Math.cos(planet.userData.angle) * planet.userData.orbit;
      planet.position.z = Math.sin(planet.userData.angle) * planet.userData.orbit;
      planet.position.y = Math.sin(planet.userData.angle * 0.5) * 0.6;
      planet.rotation.y += 0.012;
    });

    asteroidGroup.rotation.y += 0.001;
    controls.update();
    renderer.render(scene, camera);
  })();
})();
