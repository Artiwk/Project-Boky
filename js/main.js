/* =========================================================
 * ผังเมือง 3D — Three.js City Plan Viewer (plain JS, offline)
 * พื้น/ถนน/แปลงที่ดิน สร้างอัตโนมัติ | อาคารมีหน้าต่าง+ไฟห้อง
 * ========================================================= */

(function () {
  'use strict';

  // ================= โซนผังเมือง =================
  var ZONES = [
    { id: 'yellow', color: 0xffe14f, label: 'ที่อยู่อาศัย (สีเหลือง)',        floors: [2, 4] },
    { id: 'orange', color: 0xff9a3c, label: 'ที่อยู่อาศัย/ค้าขาย (สีส้ม)',    floors: [2, 3] },
    { id: 'purple', color: 0xb45ce8, label: 'ที่อยู่อาศัย/ร้านค้า (สีม่วง)',  floors: [3, 5] },
    { id: 'red',    color: 0xef5350, label: 'พาณิชยกรรม (สีแดง)',             floors: [4, 8] },
    { id: 'blue',   color: 0x42a5f5, label: 'ค้าขาย/บริการ (สีน้ำเงิน)',      floors: [3, 6] },
    { id: 'brown',  color: 0x8d6e63, label: 'ที่พักอาศัยหนาแน่น (สีน้ำตาล)',  floors: [5, 10] },
    { id: 'green',  color: 0x66bb6a, label: 'พื้นที่สีเขียว/เกษตร (สีเขียว)', floors: [1, 1] },
    { id: 'cyan',   color: 0x26c6da, label: 'ราชการ/สถานศึกษา (สีฟ้า)',       floors: [2, 5] },
  ];

  // ก้อนโซน (x, z, กว้าง w, ลึก d) หน่วย = เมตร บนพื้น 500x500
  var ZONE_BLOCKS = [
    { zone: 'yellow', x: -175, z: -150, w: 130, d: 110 },
    { zone: 'yellow', x: -170, z:  130, w: 120, d: 100 },
    { zone: 'yellow', x:  150, z: -160, w: 140, d:  90 },
    { zone: 'orange', x:   25, z: -175, w: 160, d:  70 },
    { zone: 'purple', x:  175, z:  120, w: 120, d: 110 },
    { zone: 'red',    x:   10, z:   10, w: 150, d: 120 },
    { zone: 'red',    x:  185, z:  -30, w: 100, d: 100 },
    { zone: 'blue',   x: -165, z:   10, w: 110, d: 150 },
    { zone: 'brown',  x:  -35, z:  170, w: 140, d: 110 },
    { zone: 'cyan',   x: -150, z:  185, w: 100, d:  90 },
    { zone: 'green',  x:  165, z: -170, w: 110, d:  70 },
    { zone: 'green',  x:   40, z:  185, w: 120, d:  70 },
  ];

  var GROUND_SIZE = 500;   // พื้น 500x500 หน่วย
  var FLOOR_H = 3.2;       // ความสูงชั้นละ 3.2 ม.
  var ROAD_W = 16;         // ความกว้างถนนหลัก

  // ================= ฉากพื้นฐาน =================
  var canvas = document.getElementById('scene');
  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  var scene = new THREE.Scene();

  var camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.5, 3000);
  camera.position.set(280, 240, 280);

  var controls = new THREE.OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.maxPolarAngle = Math.PI / 2.05;
  controls.minDistance = 20;
  controls.maxDistance = 900;
  controls.target.set(0, 0, 0);

  // ================= แสง =================
  var sun = new THREE.DirectionalLight(0xffffff, 1.15);
  sun.position.set(200, 300, 140);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -320;
  sun.shadow.camera.right = 320;
  sun.shadow.camera.top = 320;
  sun.shadow.camera.bottom = -320;
  sun.shadow.camera.far = 1200;
  sun.shadow.bias = -0.0004;
  scene.add(sun);

  var ambient = new THREE.AmbientLight(0xbfd4e0, 0.55);
  scene.add(ambient);

  var hemi = new THREE.HemisphereLight(0x9fc5e8, 0x3a4a3f, 0.6);
  scene.add(hemi);

  // ================= พื้น: วาดผังบน canvas แล้วใช้เป็น texture =================
  function makeGroundTexture() {
    var S = 2048;                 // ความละเอียด canvas
    var px = S / GROUND_SIZE;     // pixel ต่อเมตร
    var cv = document.createElement('canvas');
    cv.width = cv.height = S;
    var g = cv.getContext('2d');

    // พื้นฐาน: ดิน/หญ้า
    g.fillStyle = '#6d8f56';
    g.fillRect(0, 0, S, S);

    // ความผันผวนของสีหญ้า
    var r = 12345;
    function rnd() { r = (r * 1103515245 + 12345) % 2147483648; return r / 2147483648; }
    for (var i = 0; i < 900; i++) {
      g.fillStyle = 'rgba(' + (90 + Math.floor(rnd() * 40)) + ',' + (120 + Math.floor(rnd() * 40)) + ',' + (60 + Math.floor(rnd() * 30)) + ',0.25)';
      var rr = 20 + rnd() * 90;
      g.beginPath();
      g.arc(rnd() * S, rnd() * S, rr, 0, Math.PI * 2);
      g.fill();
    }

    // แปลงที่ดินตามโซน (พร้อมเส้นเขต)
    ZONE_BLOCKS.forEach(function (b) {
      var zone = null;
      for (var i = 0; i < ZONES.length; i++) if (ZONES[i].id === b.zone) zone = ZONES[i];
      var cx = (b.x + GROUND_SIZE / 2) * px;
      var cy = (b.z + GROUND_SIZE / 2) * px;
      var w = b.w * px, d = b.d * px;

      var hex = '#' + ('00000' + zone.color.toString(16)).slice(-6);
      g.fillStyle = hex + '66'; // โปร่งบนพื้น
      g.fillRect(cx - w / 2, cy - d / 2, w, d);
      g.strokeStyle = hex;
      g.lineWidth = 4;
      g.strokeRect(cx - w / 2, cy - d / 2, w, d);

      // เส้นแบ่งแปลงย่อย
      g.strokeStyle = 'rgba(255,255,255,0.35)';
      g.lineWidth = 2;
      var nx = Math.max(2, Math.round(b.w / 30));
      var nz = Math.max(2, Math.round(b.d / 30));
      for (var ix = 1; ix < nx; ix++) {
        g.beginPath();
        g.moveTo(cx - w / 2 + (w / nx) * ix, cy - d / 2);
        g.lineTo(cx - w / 2 + (w / nx) * ix, cy + d / 2);
        g.stroke();
      }
      for (var iz = 1; iz < nz; iz++) {
        g.beginPath();
        g.moveTo(cx - w / 2, cy - d / 2 + (d / nz) * iz);
        g.lineTo(cx + w / 2, cy - d / 2 + (d / nz) * iz);
        g.stroke();
      }
    });

    // ถนน: แนวตั้งและแนวนอน
    g.fillStyle = '#3a3d42';
    var roadW = ROAD_W * px;
    var roads = [-90, 0, 90]; // ตำแหน่งกึ่งกลางถนน (เมตร)
    roads.forEach(function (pos) {
      g.fillRect((pos + GROUND_SIZE / 2) * px - roadW / 2, 0, roadW, S); // แนวตั้ง
      g.fillRect(0, (pos + GROUND_SIZE / 2) * px - roadW / 2, S, roadW); // แนวนอน
    });
    // ถนนริม
    var edge = GROUND_SIZE / 2 - 20;
    [[-edge, 0], [edge, 0], [0, -edge], [0, edge]].forEach(function (p) {
      g.fillRect((p[0] + GROUND_SIZE / 2) * px - roadW / 2, 0, roadW, S);
      g.fillRect(0, (p[1] + GROUND_SIZE / 2) * px - roadW / 2, S, roadW);
    });

    // เส้นแบ่งเลนสีขาวประ
    g.fillStyle = 'rgba(255,255,255,0.75)';
    roads.forEach(function (pos) {
      var c = (pos + GROUND_SIZE / 2) * px;
      for (var y = 0; y < S; y += 60) {
        g.fillRect(c - 3, y, 6, 30);                 // แนวตั้ง
        g.fillRect(y, c - 3, 30, 6);                 // แนวนอน
      }
    });

    // ทะเลสาบกลางเมือง
    var lg = g.createRadialGradient(S * 0.5, S * 0.5, 10, S * 0.5, S * 0.5, 60 * px);
    lg.addColorStop(0, '#3f7fae');
    lg.addColorStop(1, '#2c5d84');
    g.fillStyle = lg;
    g.beginPath();
    g.ellipse(S * 0.5, S * 0.5, 55 * px, 38 * px, 0, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = '#d9c98a';
    g.lineWidth = 6;
    g.stroke();

    // สวนสาธารณะ
    g.fillStyle = '#4e7a3a';
    g.beginPath();
    g.arc((110 + GROUND_SIZE / 2) * px, (60 + GROUND_SIZE / 2) * px, 45 * px, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = '#e8f0d8';
    g.lineWidth = 5;
    g.stroke();

    var tex = new THREE.CanvasTexture(cv);
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return tex;
  }

  var groundMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(GROUND_SIZE, GROUND_SIZE),
    new THREE.MeshStandardMaterial({ map: makeGroundTexture(), roughness: 0.95, metalness: 0 })
  );
  groundMesh.rotation.x = -Math.PI / 2;
  groundMesh.receiveShadow = true;
  scene.add(groundMesh);

  // ================= อาคาร =================
  var buildingsGroup = new THREE.Group();
  scene.add(buildingsGroup);

  var zoneMeshes = [];
  var windowMats = [];   // วัสดุหน้าต่าง (ไฟดวงคืน)
  var windowTexCache = {};

  function seededRandom(seed) {
    var s = seed;
    return function () {
      s = (s * 1103515245 + 12345) % 2147483648;
      return s / 2147483648;
    };
  }

  // สร้าง texture หน้าต่าง (สุ่มไฟติด/ดับ)
  function windowTexture(floors, cols) {
    var key = floors + 'x' + cols;
    if (windowTexCache[key]) return windowTexCache[key];

    var cv = document.createElement('canvas');
    var cw = cols * 16, ch = floors * 16;
    cv.width = cw; cv.height = ch;
    var g = cv.getContext('2d');
    g.fillStyle = '#1c2733'; // กระจกกลางวัน
    g.fillRect(0, 0, cw, ch);

    var rand = seededRandom(floors * 97 + cols * 31 + 7);
    for (var y = 0; y < floors; y++) {
      for (var x = 0; x < cols; x++) {
        var lit = rand() < 0.42; // 42% ติดไฟ
        g.fillStyle = lit ? '#ffd98a' : '#31404f';
        g.fillRect(x * 16 + 3, y * 16 + 3, 10, 10);
      }
    }
    var tex = new THREE.CanvasTexture(cv);
    windowTexCache[key] = tex;
    return tex;
  }

  function makeBuilding(x, z, w, d, floors, zone) {
    var bh = floors * FLOOR_H;
    var group = new THREE.Group();

    // ตัวอาคาร
    var wallColor = new THREE.Color(zone.color).lerp(new THREE.Color(0xdddddd), 0.55);
    var bodyMat = new THREE.MeshStandardMaterial({
      color: wallColor,
      roughness: 0.75,
      metalness: 0.05,
    });
    var body = new THREE.Mesh(new THREE.BoxGeometry(w, bh, d), bodyMat);
    body.position.y = bh / 2;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    // หน้าต่างทั้ง 4 ด้าน (แผ่นบางครอบด้านข้าง)
    var cols = Math.max(2, Math.round(w / 4));
    var rowsZ = Math.max(2, Math.round(d / 4));
    var winTexX = windowTexture(floors, cols);
    var winTexZ = windowTexture(floors, rowsZ);

    var winMatX = new THREE.MeshBasicMaterial({ map: winTexX, transparent: true, opacity: 0.9 });
    var winMatZ = new THREE.MeshBasicMaterial({ map: winTexZ, transparent: true, opacity: 0.9 });
    windowMats.push(winMatX, winMatZ);

    var eps = 0.06;
    var px1 = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.96, bh * 0.92), winMatX);
    px1.position.set(0, bh / 2, d / 2 + eps);
    var px2 = px1.clone(); px2.rotation.y = Math.PI; px2.position.z = -d / 2 - eps;
    var pz1 = new THREE.Mesh(new THREE.PlaneGeometry(d * 0.96, bh * 0.92), winMatZ);
    pz1.rotation.y = Math.PI / 2; pz1.position.set(w / 2 + eps, bh / 2, 0);
    var pz2 = pz1.clone(); pz2.rotation.y = -Math.PI / 2; pz2.position.x = -w / 2 - eps;
    group.add(px1, px2, pz1, pz2);

    // ดาดฟ้า
    var roof = new THREE.Mesh(
      new THREE.BoxGeometry(w * 0.92, 0.6, d * 0.92),
      new THREE.MeshStandardMaterial({ color: 0x555a60, roughness: 0.9 })
    );
    roof.position.y = bh + 0.3;
    roof.castShadow = true;
    group.add(roof);

    // ถังน้ำบนดาดฟ้า (ถ้าสูงเกิน 4 ชั้น)
    if (floors >= 4) {
      var tank = new THREE.Mesh(
        new THREE.CylinderGeometry(1.1, 1.1, 2, 10),
        new THREE.MeshStandardMaterial({ color: 0x4a6a8a, roughness: 0.6 })
      );
      tank.position.set(w * 0.25, bh + 1.6, -d * 0.25);
      tank.castShadow = true;
      group.add(tank);
    }

    group.position.set(x, 0, z);
    buildingsGroup.add(group);

    // ใช้ body เป็นตัว raycast
    body.userData = { zone: zone, floors: floors };
    zoneMeshes.push(body);
    return group;
  }

  function buildCity() {
    ZONE_BLOCKS.forEach(function (block, bi) {
      var zone = null;
      for (var i = 0; i < ZONES.length; i++) {
        if (ZONES[i].id === block.zone) zone = ZONES[i];
      }
      var rand = seededRandom(bi * 7 + 13);
      var count = 4 + Math.floor(rand() * 5);

      for (var j = 0; j < count; j++) {
        var bw = 10 + rand() * (block.w / 3.5);
        var bd = 10 + rand() * (block.d / 3.5);
        var floors = Math.round(zone.floors[0] + rand() * (zone.floors[1] - zone.floors[0]));

        var ox = (rand() - 0.5) * (block.w - bw);
        var oz = (rand() - 0.5) * (block.d - bd);
        makeBuilding(block.x + ox, block.z + oz, bw, bd, floors, zone);
      }
    });
  }
  buildCity();

  // ================= ต้นไม้ =================
  var treesGroup = new THREE.Group();
  scene.add(treesGroup);

  function makeTree(x, z, scale) {
    var g = new THREE.Group();
    var trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.35, 0.5, 3, 6),
      new THREE.MeshStandardMaterial({ color: 0x6b4a2e, roughness: 0.95 })
    );
    trunk.position.y = 1.5;
    trunk.castShadow = true;

    var leafMat = new THREE.MeshStandardMaterial({ color: 0x3f7d33, roughness: 0.9 });
    var c1 = new THREE.Mesh(new THREE.SphereGeometry(2.2, 8, 6), leafMat);
    c1.position.y = 4.4;
    c1.castShadow = true;
    var c2 = new THREE.Mesh(new THREE.SphereGeometry(1.6, 8, 6), leafMat);
    c2.position.set(0.8, 5.6, 0.5);
    c2.castShadow = true;
    var c3 = new THREE.Mesh(new THREE.SphereGeometry(1.3, 8, 6), leafMat);
    c3.position.set(-0.7, 5.2, -0.6);
    c3.castShadow = true;

    g.add(trunk, c1, c2, c3);
    g.position.set(x, 0, z);
    g.scale.setScalar(scale || 1);
    treesGroup.add(g);
  }

  function plantTrees() {
    var rand = seededRandom(999);
    // ต้นไม้ในสวนสาธารณะ (110, 60)
    for (var i = 0; i < 26; i++) {
      var a = rand() * Math.PI * 2;
      var rr = rand() * 40;
      makeTree(110 + Math.cos(a) * rr, 60 + Math.sin(a) * rr * 0.7, 0.8 + rand() * 0.6);
    }
    // ริมถนน
    var roads = [-90, 0, 90];
    roads.forEach(function (pos) {
      for (var t = -230; t <= 230; t += 24) {
        if (Math.abs(t) < 30 && pos === 0) continue; // เว้นแยกกลาง
        makeTree(pos + 12, t, 0.7 + rand() * 0.4);
        makeTree(t, pos + 12, 0.7 + rand() * 0.4);
        makeTree(pos - 12, t, 0.7 + rand() * 0.4);
        makeTree(t, pos - 12, 0.7 + rand() * 0.4);
      }
    });
  }
  plantTrees();

  // ================= เสาไฟถนน =================
  var lampGroup = new THREE.Group();
  scene.add(lampGroup);

  var poleGeo = new THREE.CylinderGeometry(0.18, 0.25, 7, 6);
  var poleMat = new THREE.MeshStandardMaterial({ color: 0x37414c, roughness: 0.6, metalness: 0.4 });
  var bulbGeo = new THREE.SphereGeometry(0.55, 10, 8);
  var bulbMat = new THREE.MeshBasicMaterial({ color: 0xffd98a });

  function makeLamp(x, z) {
    var pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.set(x, 3.5, z);
    pole.castShadow = true;
    var bulb = new THREE.Mesh(bulbGeo, bulbMat);
    bulb.position.set(x, 7.2, z);
    bulb.visible = false; // เปิดตอนกลางคืน
    lampGroup.add(pole, bulb);
    return bulb;
  }

  var lampBulbs = [];
  var roadsL = [-90, 0, 90];
  roadsL.forEach(function (pos) {
    for (var t = -230; t <= 230; t += 46) {
      lampBulbs.push(makeLamp(pos + 9.5, t));
      lampBulbs.push(makeLamp(t, pos + 9.5));
    }
  });

  // ไฟจุดจริง (PointLight) เฉพาะแยกกลาง เพื่อประหยัด
  var cornerLight = new THREE.PointLight(0xffd98a, 0, 90, 2);
  cornerLight.position.set(0, 9, 0);
  scene.add(cornerLight);

  // ================= รถวิ่งบนถนน =================
  var carsGroup = new THREE.Group();
  scene.add(carsGroup);

  var carBodyGeo = new THREE.BoxGeometry(4.2, 1.5, 2);
  var carTopGeo = new THREE.BoxGeometry(2.4, 1.1, 1.8);
  var carColors = [0xd94f4f, 0x4f7fd9, 0xe8e8e8, 0x3a3a3a, 0xe8b84f, 0x4fae6e];

  function makeCar(axis, laneOffset, dir, speed, start) {
    var color = carColors[Math.floor(Math.random() * carColors.length)];
    var grp = new THREE.Group();
    var body = new THREE.Mesh(carBodyGeo, new THREE.MeshStandardMaterial({ color: color, roughness: 0.4, metalness: 0.3 }));
    body.position.y = 0.9;
    body.castShadow = true;
    var top = new THREE.Mesh(carTopGeo, new THREE.MeshStandardMaterial({ color: 0x223344, roughness: 0.2, metalness: 0.4 }));
    top.position.y = 2;
    grp.add(body, top);

    var headL = new THREE.Mesh(new THREE.SphereGeometry(0.28, 6, 5), new THREE.MeshBasicMaterial({ color: 0xfff2b0 }));
    headL.position.set(2.1, 0.9, 0.6);
    var headR = headL.clone(); headR.position.z = -0.6;
    grp.add(headL, headR);

    carsGroup.add(grp);
    return { grp: grp, axis: axis, lane: laneOffset, dir: dir, speed: speed, pos: start };
  }

  var cars = [];
  var carRand = seededRandom(777);
  roadsL.forEach(function (pos) {
    // 2 เลนต่อทิศ ต่อถนน
    for (var i = 0; i < 3; i++) {
      cars.push(makeCar('x', pos + 4, 1, 14 + carRand() * 10, -230 + carRand() * 460));
      cars.push(makeCar('x', pos - 4, -1, 14 + carRand() * 10, -230 + carRand() * 460));
      cars.push(makeCar('z', pos + 4, 1, 14 + carRand() * 10, -230 + carRand() * 460));
      cars.push(makeCar('z', pos - 4, -1, 14 + carRand() * 10, -230 + carRand() * 4));
    }
  });

  function updateCars(dt) {
    cars.forEach(function (c) {
      c.pos += c.speed * c.dir * dt;
      if (c.pos > 240) c.pos = -240;
      if (c.pos < -240) c.pos = 240;
      if (c.axis === 'x') c.grp.position.set(c.pos, 0, c.lane);
      else c.grp.position.set(c.lane, 0, c.pos);
      // หมุนให้หัวรถไปทางทิศทางวิ่ง
      var yaw = (c.axis === 'x' ? 0 : Math.PI / 2) + (c.dir > 0 ? 0 : Math.PI);
      c.grp.rotation.y = yaw;
    });
  }

  // ================= เครื่องบินเหนือเมือง =================
  var planeGroup = new THREE.Group();
  scene.add(planeGroup);
  var plane = new THREE.Group();
  var pBody = new THREE.Mesh(
    THREE.CapsuleGeometry ? new THREE.CapsuleGeometry(1.2, 8, 4, 8) : new THREE.CylinderGeometry(1.2, 1.2, 8, 8),
    new THREE.MeshStandardMaterial({ color: 0xe8ecf0, roughness: 0.35, metalness: 0.3 })
  );
  pBody.rotation.z = Math.PI / 2;
  plane.add(pBody);
  var wing = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 0.3, 11),
    new THREE.MeshStandardMaterial({ color: 0xdfe5ea, roughness: 0.4, metalness: 0.3 })
  );
  plane.add(wing);
  var tail = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 2.6, 0.3),
    new THREE.MeshStandardMaterial({ color: 0xd94f4f, roughness: 0.4 })
  );
  tail.position.set(-4.2, 1.4, 0);
  plane.add(tail);
  planeGroup.add(plane);

  var planeAngle = 0;
  function updatePlane(dt) {
    planeAngle += dt * 0.06;
    var R = 330;
    planeGroup.position.set(Math.cos(planeAngle) * R, 120 + Math.sin(planeAngle * 2) * 8, Math.sin(planeAngle) * R);
    planeGroup.rotation.y = -planeAngle + Math.PI / 2;
  }

  // ================= ดวงดาว (กลางคืน) =================
  var starGeo = new THREE.BufferGeometry();
  var starVerts = [];
  for (var si = 0; si < 900; si++) {
    var th = Math.random() * Math.PI * 2;
    var ph = Math.random() * Math.PI * 0.42;   // ครึ่งฟากฟ้าบน
    var R2 = 1400;
    starVerts.push(
      Math.cos(th) * Math.sin(ph + 0.15) * R2,
      Math.cos(ph) * R2 * 0.9 + 120,
      Math.sin(th) * Math.sin(ph + 0.15) * R2
    );
  }
  starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starVerts, 3));
  var stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xcfd8ea, size: 2.2, sizeAttenuation: false, transparent: true, opacity: 0 }));
  scene.add(stars);

  // ================= โหมดแสง =================
  var LIGHT_MODES = {
    day:    { sky: 0x8fc7ee, fog: [0xbfd9ea, 500, 1400], sunColor: 0xfff4e0, sunI: 1.15, ambI: 0.55, hemiI: 0.6,  sunPos: [200, 300, 140],   lamps: false, windowEmissive: false, starO: 0 },
    sunset: { sky: 0xe8956a, fog: [0xd98a5f, 420, 1300], sunColor: 0xffb066, sunI: 0.75, ambI: 0.4,  hemiI: 0.35, sunPos: [340, 80, -160],   lamps: true,  windowEmissive: true,  starO: 0.35 },
    night:  { sky: 0x0b1020, fog: [0x0b1020, 380, 1200], sunColor: 0x8fb0ff, sunI: 0.14, ambI: 0.16, hemiI: 0.1,  sunPos: [-160, 220, -120], lamps: true,  windowEmissive: true,  starO: 0.9 },
  };

  function setLightMode(mode) {
    var m = LIGHT_MODES[mode];
    if (!m) return;
    scene.background = new THREE.Color(m.sky);
    scene.fog = new THREE.Fog(m.fog[0], m.fog[1], m.fog[2]);
    sun.color.set(m.sunColor);
    sun.intensity = m.sunI;
    sun.position.set(m.sunPos[0], m.sunPos[1], m.sunPos[2]);
    ambient.intensity = m.ambI;
    hemi.intensity = m.hemiI;
    lampGroup.children.forEach(function (c) { if (c.geometry === bulbGeo) c.visible = m.lamps; });
    cornerLight.intensity = m.lamps ? 1.4 : 0;
    stars.material.opacity = m.starO;
    windowMats.forEach(function (mat) { mat.opacity = m.windowEmissive ? 1 : 0.9; });
  }
  setLightMode('day');

  // ================= UI: legend =================
  var legendList = document.getElementById('legendList');
  ZONES.forEach(function (z) {
    var li = document.createElement('li');
    var hex = '#' + ('00000' + z.color.toString(16)).slice(-6);
    li.innerHTML = '<span class="swatch" style="background:' + hex + '"></span> ' + z.label;
    legendList.appendChild(li);

    li.addEventListener('click', function () {
      var dim = li.classList.toggle('dim');
      zoneMeshes.forEach(function (mesh) {
        if (mesh.userData.zone.id === z.id) mesh.visible = !dim;
      });
    });
  });

  // ================= UI: toggles =================
  document.getElementById('showBuildings').addEventListener('change', function (e) {
    buildingsGroup.visible = e.target.checked;
  });

  var zoneColors = new Map();
  zoneMeshes.forEach(function (m) { zoneColors.set(m, m.material.color.clone()); });
  var neutralColor = new THREE.Color(0xb8bec4);

  document.getElementById('showZones').addEventListener('change', function (e) {
    zoneMeshes.forEach(function (m) {
      m.material.color.copy(e.target.checked ? zoneColors.get(m) : neutralColor);
    });
  });

  // ================= UI: ปุ่มโหมดแสง =================
  var lightButtons = document.querySelectorAll('#lightMode button');
  lightButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      lightButtons.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      setLightMode(btn.dataset.mode);
    });
  });

  // ================= UI: มุมกล้อง =================
  var VIEWS = {
    top:    { pos: [0, 420, 0.01], target: [0, 0, 0] },
    iso:    { pos: [280, 240, 280], target: [0, 0, 0] },
    street: { pos: [0, 10, 200], target: [0, 8, 0] },
  };

  document.querySelectorAll('#viewPresets button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var v = VIEWS[btn.dataset.view];
      if (!v) return;
      camera.position.set(v.pos[0], v.pos[1], v.pos[2]);
      controls.target.set(v.target[0], v.target[1], v.target[2]);
    });
  });

  // ================= คลิกอาคารเพื่อดูข้อมูล =================
  var raycaster = new THREE.Raycaster();
  var pointer = new THREE.Vector2();
  var tooltip = document.getElementById('tooltip');

  canvas.addEventListener('pointerdown', function (e) {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    var hits = raycaster.intersectObjects(zoneMeshes, false);
    if (hits.length > 0) {
      var ud = hits[0].object.userData;
      tooltip.innerHTML =
        '<b>' + ud.zone.label + '</b><br/>' +
        'ความสูง: ' + ud.floors + ' ชั้น (~' + Math.round(ud.floors * FLOOR_H) + ' ม.)<br/>' +
        '<small>คลิกอาคารอื่นเพื่อดูข้อมูล</small>';
      tooltip.classList.remove('hidden');
      clearTimeout(tooltip._t);
      tooltip._t = setTimeout(function () { tooltip.classList.add('hidden'); }, 4000);
    }
  });

  // ================= Auto-rotate =================
  var autoRotateCb = document.getElementById('autoRotate');
  autoRotateCb.addEventListener('change', function () {
    controls.autoRotate = autoRotateCb.checked;
    controls.autoRotateSpeed = 0.8;
  });

  // ================= Resize =================
  window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ================= ซ่อนหน้าโหลด =================
  var loadingEl = document.getElementById('loading');
  if (loadingEl) loadingEl.classList.add('done');

  // ================= Loop =================
  var clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    var dt = Math.min(clock.getDelta(), 0.05);
    updateCars(dt);
    updatePlane(dt);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

})();
