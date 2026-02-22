(() => {
  const canvas = document.getElementById('solarCanvas');
  if (!canvas || !window.THREE) return;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x02040f);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  const camera = new THREE.PerspectiveCamera(55, canvas.clientWidth / canvas.clientHeight, 0.1, 2000);
  camera.position.set(0, 90, 250);

  const controls = new THREE.OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.maxDistance = 500;
  controls.minDistance = 65;

  const ambient = new THREE.AmbientLight(0x446688, 0.6);
  scene.add(ambient);
  const sunLight = new THREE.PointLight(0xffddaa, 2.2, 1400);
  scene.add(sunLight);

  const starGeo = new THREE.BufferGeometry();
  const starVertices = [];
  for (let i = 0; i < 2000; i++) {
    starVertices.push((Math.random() - 0.5) * 2200, (Math.random() - 0.5) * 2200, (Math.random() - 0.5) * 2200);
  }
  starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
  scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 1.1 })));

  const texture = new THREE.TextureLoader();
  const sun = new THREE.Mesh(
    new THREE.SphereGeometry(18, 36, 36),
    new THREE.MeshBasicMaterial({ map: texture.load('https://threejs.org/examples/textures/planets/sun.jpg') })
  );
  scene.add(sun);

  const projectData = [
    ['Mercury', 28, 0.01, '#9aa0a6', { title: 'API Gateway', desc: 'High throughput microservice gateway.', tech: 'Node.js, Redis, Docker', gh: '#', demo: '#' }],
    ['Venus', 40, 0.008, '#c9964a', { title: 'Design System', desc: 'Token-based UI architecture.', tech: 'Figma, React, Storybook', gh: '#', demo: '#' }],
    ['Earth', 56, 0.007, '#4d8eff', { title: 'SaaS Dashboard', desc: 'Realtime analytics platform.', tech: 'Next.js, Prisma, Postgres', gh: '#', demo: '#' }],
    ['Mars', 70, 0.006, '#c1440e', { title: 'IoT Monitor', desc: 'Edge telemetry observability suite.', tech: 'Vue, MQTT, FastAPI', gh: '#', demo: '#' }],
    ['Jupiter', 92, 0.004, '#d2b48c', { title: 'Commerce Engine', desc: 'Global storefront and inventory.', tech: 'TypeScript, GraphQL', gh: '#', demo: '#' }],
    ['Saturn', 120, 0.0035, '#e3c16f', { title: '3D Product Lab', desc: 'WebGL product configurator.', tech: 'Three.js, GSAP', gh: '#', demo: '#' }],
    ['Uranus', 145, 0.0028, '#7fffd4', { title: 'Mobile Banking', desc: 'Secure fintech super-app.', tech: 'Flutter, Go, GCP', gh: '#', demo: '#' }],
    ['Neptune', 168, 0.0023, '#5f7fff', { title: 'AI Knowledge Hub', desc: 'RAG-powered enterprise assistant.', tech: 'Python, LangChain, Vector DB', gh: '#', demo: '#' }]
  ];

  const planets = [];
  projectData.forEach(([name, orbit, speed, color, details], i) => {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(name === 'Jupiter' ? 8 : name === 'Saturn' ? 7 : 4 + i * 0.5, 32, 32),
      new THREE.MeshStandardMaterial({ color, roughness: 0.8, metalness: 0.1 })
    );
    mesh.userData = { ...details, name, orbit, speed, angle: i };
    scene.add(mesh);
    planets.push(mesh);

    const orbitRing = new THREE.Mesh(
      new THREE.RingGeometry(orbit - 0.2, orbit + 0.2, 180),
      new THREE.MeshBasicMaterial({ color: 0x2f4670, side: THREE.DoubleSide, transparent: true, opacity: 0.45 })
    );
    orbitRing.rotation.x = Math.PI / 2;
    scene.add(orbitRing);

    if (name === 'Saturn') {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(9, 14, 64),
        new THREE.MeshBasicMaterial({ color: 0xd7c08a, side: THREE.DoubleSide, transparent: true, opacity: 0.65 })
      );
      ring.rotation.x = Math.PI / 2.8;
      mesh.add(ring);
    }
  });

  const asteroidGroup = new THREE.Group();
  for (let i = 0; i < 350; i++) {
    const asteroid = new THREE.Mesh(
      new THREE.SphereGeometry(Math.random() * 0.6 + 0.15, 6, 6),
      new THREE.MeshStandardMaterial({ color: 0x808080 })
    );
    const theta = Math.random() * Math.PI * 2;
    const radius = 106 + Math.random() * 8;
    asteroid.position.set(Math.cos(theta) * radius, (Math.random() - 0.5) * 3, Math.sin(theta) * radius);
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
      x: hit.object.position.x + 16,
      y: hit.object.position.y + 10,
      z: hit.object.position.z + 16
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
  });

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  (function animate() {
    requestAnimationFrame(animate);
    sun.rotation.y += 0.002;
    planets.forEach((planet) => {
      planet.userData.angle += planet.userData.speed;
      planet.position.x = Math.cos(planet.userData.angle) * planet.userData.orbit;
      planet.position.z = Math.sin(planet.userData.angle) * planet.userData.orbit;
      planet.rotation.y += 0.01;
    });
    asteroidGroup.rotation.y += 0.0008;
    controls.update();
    renderer.render(scene, camera);
  })();
})();
