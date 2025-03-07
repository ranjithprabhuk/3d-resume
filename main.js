// main.js - Main file for the 3D interactive resume
// import resumeData from './data.js';

// Global variables
let camera, scene, renderer;
let particles,
  skillSpheres = [];
let currentSection = 'intro';
let controls;
let raycaster, mouse;
let clock = new THREE.Clock();
let mixer;
let currentIntersect = null;
let particleGroup;
let experienceCards = [];
let projectCards = [];
let educationCards = [];
let cameraTargets = {};

// Initialize the application
init();
animate();

// Initialize the 3D scene and components
function init() {
  // Initialize the scene, camera, and renderer
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;

  // Set initial camera position
  camera.position.set(0, 0, 5);

  // Setup lighting
  setupLighting();

  // Create background
  createBackground();

  // Initialize raycaster for interaction
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  // Setup camera targets for each section
  setupCameraTargets();

  // Load content sections
  loadContent();

  // Setup event listeners
  setupEventListeners();

  // Hide loading screen when everything is loaded
  setTimeout(() => {
    document.getElementById('loading-screen').style.display = 'none';
  }, 2000);
}

// Setup scene lighting
function setupLighting() {
  const ambientLight = new THREE.AmbientLight(0x404040, 1);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  const bluePointLight = new THREE.PointLight(0x0a84ff, 1, 50);
  bluePointLight.position.set(5, 5, 5);
  scene.add(bluePointLight);

  const cyanPointLight = new THREE.PointLight(0x00ffff, 1, 50);
  cyanPointLight.position.set(-5, -5, 5);
  scene.add(cyanPointLight);
}

// Create particle background
function createBackground() {
  // Create particle system for background
  const particleGeometry = new THREE.BufferGeometry();
  const particleCount = 2000;

  const posArray = new Float32Array(particleCount * 3);
  const scaleArray = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    // Position
    const i3 = i * 3;
    posArray[i3] = (Math.random() - 0.5) * 50;
    posArray[i3 + 1] = (Math.random() - 0.5) * 50;
    posArray[i3 + 2] = (Math.random() - 0.5) * 50;

    // Scale (size variation)
    scaleArray[i] = Math.random();
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  particleGeometry.setAttribute('scale', new THREE.BufferAttribute(scaleArray, 1));

  // Create particle material
  const particleMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      color1: { value: new THREE.Color(0x0a84ff) },
      color2: { value: new THREE.Color(0x00ffff) },
    },
    vertexShader: `
            attribute float scale;
            uniform float time;
            
            void main() {
                vec3 pos = position;
                
                // Subtle movement based on time
                pos.x += sin(pos.y * 0.1 + time * 0.2) * 0.1;
                pos.y += cos(pos.x * 0.1 + time * 0.2) * 0.1;
                pos.z += sin(pos.z * 0.1 + time * 0.3) * 0.1;
                
                vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                gl_PointSize = scale * 2.0 * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
    fragmentShader: `
            uniform vec3 color1;
            uniform vec3 color2;
            uniform float time;
            
            void main() {
                float dist = length(gl_PointCoord - vec2(0.5, 0.5));
                if(dist > 0.5) discard;
                
                // Gradient based on position and time
                float colorMix = sin(time * 0.2) * 0.5 + 0.5;
                vec3 color = mix(color1, color2, colorMix);
                
                // Add glow effect
                float glow = 1.0 - dist * 2.0;
                glow = pow(glow, 1.5);
                
                gl_FragColor = vec4(color, glow);
            }
        `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  // Create grid floor (subtle reference grid)
  const gridHelper = new THREE.GridHelper(50, 50, 0x0a84ff, 0x000519);
  gridHelper.position.y = -10;
  gridHelper.material.opacity = 0.1;
  gridHelper.material.transparent = true;
  scene.add(gridHelper);
}

// Setup camera targets for each section
function setupCameraTargets() {
  cameraTargets = {
    intro: { position: new THREE.Vector3(0, 0, 5), lookAt: new THREE.Vector3(0, 0, 0) },
    about: { position: new THREE.Vector3(-3, 0, 5), lookAt: new THREE.Vector3(-3, 0, 0) },
    experience: { position: new THREE.Vector3(0, 3, 8), lookAt: new THREE.Vector3(0, 0, 0) },
    skills: { position: new THREE.Vector3(5, 0, 8), lookAt: new THREE.Vector3(5, 0, 0) },
    projects: { position: new THREE.Vector3(0, -3, 8), lookAt: new THREE.Vector3(0, -3, 0) },
    education: { position: new THREE.Vector3(-5, 0, 8), lookAt: new THREE.Vector3(-5, 0, 0) },
    contact: { position: new THREE.Vector3(0, 0, 5), lookAt: new THREE.Vector3(0, 0, 0) },
  };
}

// Load content sections with data
function loadContent() {
  // Load About section
  document.querySelector('#about .about-content').textContent = resumeData.personal.about;

  // Load Experience section
  const timelineContainer = document.querySelector('.timeline-container');
  resumeData.experience.forEach((exp, index) => {
    const expCard = document.createElement('div');
    expCard.className = 'experience-card';
    expCard.dataset.index = index;

    expCard.innerHTML = `
            <h3 class="experience-title">${exp.title}</h3>
            <div class="experience-company">${exp.company}</div>
            <div class="experience-timeline">${exp.timeline}</div>
            <div class="experience-description">${exp.description[0]}</div>
            <div class="experience-skills">
                ${exp.skills
                  .slice(0, 5)
                  .map((skill) => `<span class="skill-tag">${skill}</span>`)
                  .join('')}
                ${exp.skills.length > 5 ? `<span class="skill-tag">+${exp.skills.length - 5}</span>` : ''}
            </div>
        `;

    expCard.addEventListener('click', () => showExperienceDetails(exp));
    timelineContainer.appendChild(expCard);

    // Create 3D card for this experience
    createExperienceCard(exp, index);
  });

  // Load Skills section
  initializeSkillSpheres();

  // Load Projects section
  const projectsContainer = document.querySelector('.projects-container');
  resumeData.projects.forEach((project, index) => {
    const projectCard = document.createElement('div');
    projectCard.className = 'project-card';
    projectCard.dataset.index = index;

    projectCard.innerHTML = `
            <h3 class="project-name">${project.name}</h3>
            <div class="project-duration">${project.duration}</div>
            <div class="project-description">${project.description}</div>
        `;

    projectCard.addEventListener('click', () => showProjectDetails(project));
    projectsContainer.appendChild(projectCard);

    // Create 3D card for this project
    createProjectCard(project, index);
  });

  // Load Education section
  const educationContainer = document.querySelector('.education-container');
  resumeData.education.forEach((edu, index) => {
    const eduCard = document.createElement('div');
    eduCard.className = 'education-card';
    eduCard.dataset.index = index;

    eduCard.innerHTML = `
            <h3 class="education-degree">${edu.degree}</h3>
            <div class="education-field">${edu.field}</div>
            <div class="education-university">${edu.university}</div>
            <div class="education-timeline">${edu.timeline}</div>
            <div class="education-cgpa">CGPA: ${edu.cgpa}</div>
            <div class="education-achievements">
                <ul>
                    ${edu.achievements.map((achievement) => `<li>${achievement}</li>`).join('')}
                </ul>
            </div>
        `;

    eduCard.addEventListener('click', () => showEducationDetails(edu));
    educationContainer.appendChild(eduCard);

    // Create 3D card for this education
    createEducationCard(edu, index);
  });

  // Load Contact section
  document.getElementById('email-link').href = `mailto:${resumeData.personal.email}`;
  document.getElementById('linkedin-link').href = resumeData.personal.linkedin;
  document.getElementById('github-link').href = resumeData.personal.github;
  document.getElementById('website-link').href = resumeData.personal.website;
  document.getElementById('phone-link').href = `tel:${resumeData.personal.phone}`;
}

// Create 3D experience card
function createExperienceCard(exp, index) {
  const geometry = new THREE.BoxGeometry(2, 2, 0.2);
  const material = new THREE.MeshStandardMaterial({
    color: 0x0a84ff,
    metalness: 0.7,
    roughness: 0.2,
    emissive: 0x0a84ff,
    emissiveIntensity: 0.2,
  });

  const card = new THREE.Mesh(geometry, material);

  // Position card in a circular pattern
  const angle = (index / resumeData.experience.length) * Math.PI * 2;
  const radius = 5;

  card.position.x = Math.cos(angle) * radius;
  card.position.z = Math.sin(angle) * radius;
  card.position.y = 0;

  card.rotation.y = -angle; // Rotate to face center

  card.userData = { type: 'experience', index: index };

  experienceCards.push(card);
  scene.add(card);
}

// Create 3D project card
function createProjectCard(project, index) {
  const geometry = new THREE.BoxGeometry(2, 1.5, 0.2);
  const material = new THREE.MeshStandardMaterial({
    color: 0x8a2be2,
    metalness: 0.7,
    roughness: 0.2,
    emissive: 0x8a2be2,
    emissiveIntensity: 0.2,
  });

  const card = new THREE.Mesh(geometry, material);

  // Position card in a circular pattern
  const angle = (index / resumeData.projects.length) * Math.PI * 2;
  const radius = 5;

  card.position.x = Math.cos(angle) * radius;
  card.position.z = Math.sin(angle) * radius;
  card.position.y = -3; // Position projects section below

  card.rotation.y = -angle; // Rotate to face center

  card.userData = { type: 'project', index: index };

  projectCards.push(card);
  scene.add(card);
}

// Create 3D education card
function createEducationCard(edu, index) {
  const geometry = new THREE.BoxGeometry(2.2, 2.6, 0.2);
  const material = new THREE.MeshStandardMaterial({
    color: 0x00ffff,
    metalness: 0.7,
    roughness: 0.2,
    emissive: 0x00ffff,
    emissiveIntensity: 0.2,
  });

  const card = new THREE.Mesh(geometry, material);

  // Position education cards
  const offset = index * 3 - (resumeData.education.length - 1) * 1.5;
  card.position.x = -5;
  card.position.y = offset;
  card.position.z = 0;

  card.userData = { type: 'education', index: index };

  educationCards.push(card);
  scene.add(card);
}

// Initialize skill spheres
function initializeSkillSpheres() {
  // Create spheres for programming languages
  createSkillGroup('programming_languages', 5, 0, 0);

  // Create spheres for frontend
  createSkillGroup('frontend', 7, 3, 0);

  // Create spheres for backend
  createSkillGroup('backend', 5, 0, 0);

  // Create spheres for databases
  createSkillGroup('databases', 3, -3, 0);

  // Create spheres for cloud computing
  createSkillGroup('cloud_computing', 2, -5, 0);

  // Create spheres for others
  createSkillGroup('others', 7, 5, 0);
}

// Create a group of skill spheres
function createSkillGroup(groupName, count, xOffset, yOffset) {
  let skills = [];

  // Get skills based on group
  if (groupName === 'programming_languages') {
    skills = [
      ...resumeData.skills.programming_languages.expert,
      ...resumeData.skills.programming_languages.intermediate,
      ...resumeData.skills.programming_languages.beginner,
    ];
  } else if (groupName === 'frontend') {
    skills = [...resumeData.skills.frontend.expert, ...resumeData.skills.frontend.intermediate];
  } else {
    skills = resumeData.skills[groupName];
  }

  // Limit to count
  skills = skills.slice(0, count);

  // Create spheres
  skills.forEach((skill, index) => {
    const geometry = new THREE.SphereGeometry(0.4, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: getSkillColor(groupName),
      metalness: 0.7,
      roughness: 0.2,
      emissive: getSkillColor(groupName),
      emissiveIntensity: 0.2,
    });

    const sphere = new THREE.Mesh(geometry, material);

    // Position in circular pattern
    const angle = (index / skills.length) * Math.PI * 2;
    const radius = 1.5;

    sphere.position.x = Math.cos(angle) * radius + 5 + xOffset;
    sphere.position.z = Math.sin(angle) * radius;
    sphere.position.y = yOffset;

    sphere.userData = {
      type: 'skill',
      group: groupName,
      skill: skill,
      originalPosition: sphere.position.clone(),
      originalScale: new THREE.Vector3(1, 1, 1),
    };

    skillSpheres.push(sphere);
    scene.add(sphere);
  });
}

// Get color based on skill group
function getSkillColor(group) {
  const colors = {
    programming_languages: 0x0a84ff,
    frontend: 0x00ffff,
    backend: 0x8a2be2,
    databases: 0xff9500,
    cloud_computing: 0x30d158,
    others: 0xff375f,
  };

  return colors[group] || 0xffffff;
}

// Show experience details in modal
function showExperienceDetails(exp) {
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modal-body');

  modalBody.innerHTML = `
        <h2>${exp.title}</h2>
        <h3>${exp.company} | ${exp.location}</h3>
        <p class="modal-timeline">${exp.timeline}</p>
        <div class="modal-description">
            ${exp.description.map((desc) => `<p>${desc}</p>`).join('')}
        </div>
        <div class="modal-skills">
            <h4>Skills</h4>
            <div class="skill-tags">
                ${exp.skills.map((skill) => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
        </div>
        <div class="modal-projects">
            <h4>Projects</h4>
            <div class="project-tags">
                ${exp.projects.map((project) => `<span class="project-tag">${project}</span>`).join('')}
            </div>
        </div>
    `;

  modal.style.display = 'block';
}

// Show project details in modal
function showProjectDetails(project) {
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modal-body');

  modalBody.innerHTML = `
        <h2>${project.name}</h2>
        <p class="modal-timeline">Duration: ${project.duration}</p>
        <div class="modal-description">
            <p>${project.description}</p>
        </div>
        ${project.url ? `<a href="${project.url}" target="_blank" class="modal-link">Visit Project</a>` : ''}
    `;

  modal.style.display = 'block';
}

// Show education details in modal
function showEducationDetails(edu) {
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modal-body');

  modalBody.innerHTML = `
        <h2>${edu.degree}</h2>
        <h3>${edu.field}</h3>
        <h4>${edu.university}</h4>
        <p class="modal-timeline">${edu.timeline}</p>
        <p>CGPA: ${edu.cgpa}</p>
        <div class="modal-achievements">
            <h4>Achievements</h4>
            <ul>
                ${edu.achievements.map((achievement) => `<li>${achievement}</li>`).join('')}
            </ul>
        </div>
    `;

  modal.style.display = 'block';
}

// Setup event listeners
function setupEventListeners() {
  // Navigation event listeners
  document.querySelectorAll('.nav-item').forEach((navItem) => {
    navItem.addEventListener('click', function () {
      const section = this.dataset.section;
      navigateToSection(section);
    });
  });

  // Close modal button
  document.querySelector('.close-modal').addEventListener('click', function () {
    document.getElementById('modal').style.display = 'none';
  });

  // Mouse move for raycasting
  document.addEventListener('mousemove', onMouseMove);

  // Click event for 3D objects
  document.addEventListener('click', onMouseClick);

  // Window resize event
  window.addEventListener('resize', onWindowResize);
}

// Handle mouse move for raycasting
function onMouseMove(event) {
  // Calculate mouse position in normalized device coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

// Handle mouse click on 3D objects
function onMouseClick() {
  if (currentIntersect) {
    const object = currentIntersect.object;

    if (object.userData.type === 'experience') {
      showExperienceDetails(resumeData.experience[object.userData.index]);
    } else if (object.userData.type === 'project') {
      showProjectDetails(resumeData.projects[object.userData.index]);
    } else if (object.userData.type === 'education') {
      showEducationDetails(resumeData.education[object.userData.index]);
    } else if (object.userData.type === 'skill') {
      // Could display skill info
    }
  }
}

// Handle window resize
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Navigate to a specific section
function navigateToSection(section) {
  if (section === currentSection) return;

  // Update navigation
  document.querySelectorAll('.nav-item').forEach((navItem) => {
    navItem.classList.remove('active');
  });
  document.querySelector(`.nav-item[data-section="${section}"]`).classList.add('active');

  // Update sections
  document.querySelectorAll('.section').forEach((sectionEl) => {
    sectionEl.classList.remove('active');
  });
  document.getElementById(section).classList.add('active');

  // Animate camera to new position
  const target = cameraTargets[section];

  gsap.to(camera.position, {
    x: target.position.x,
    y: target.position.y,
    z: target.position.z,
    duration: 1.5,
    ease: 'power2.inOut',
  });

  // Record current section
  currentSection = section;
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  const elapsedTime = clock.getElapsedTime();

  // Update shader time uniform for particle effect
  if (particles && particles.material.uniforms) {
    particles.material.uniforms.time.value = elapsedTime;
  }

  // Rotate skill spheres
  skillSpheres.forEach((sphere) => {
    sphere.rotation.y += 0.01;

    // Add slight floating effect
    sphere.position.y = sphere.userData.originalPosition.y + Math.sin(elapsedTime * 0.5 + sphere.position.x) * 0.1;
  });

  // Rotate experience cards
  experienceCards.forEach((card, index) => {
    card.rotation.y = -((index / experienceCards.length) * Math.PI * 2) + elapsedTime * 0.1;
  });

  // Rotate project cards
  projectCards.forEach((card, index) => {
    card.rotation.y = -((index / projectCards.length) * Math.PI * 2) + elapsedTime * 0.1;
  });

  // Handle raycasting
  raycaster.setFromCamera(mouse, camera);

  const interactiveObjects = [...skillSpheres, ...experienceCards, ...projectCards, ...educationCards];
  const intersects = raycaster.intersectObjects(interactiveObjects);

  if (intersects.length > 0) {
    if (currentIntersect === null) {
      // Mouse enter
      document.body.style.cursor = 'pointer';
    }

    currentIntersect = intersects[0];

    // Scale up hovered object
    const hoveredObject = intersects[0].object;
    gsap.to(hoveredObject.scale, {
      x: 1.2,
      y: 1.2,
      z: 1.2,
      duration: 0.3,
    });
  } else {
    if (currentIntersect) {
      // Mouse leave
      document.body.style.cursor = 'default';

      // Scale back object
      gsap.to(currentIntersect.object.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.3,
      });
    }

    currentIntersect = null;
  }

  // Slight rotation of particles
  if (particles) {
    particles.rotation.y = elapsedTime * 0.02;
  }

  renderer.render(scene, camera);
}
