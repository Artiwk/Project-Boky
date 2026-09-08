/* =========================================================
 * city.js — ผังเมืองจำลอง + ผู้สร้างแลนด์มาร์ก (~80 แบบ)
 * ทุกประเภทมีรูปทรงเฉพาะตัว มองปุ๊บรู้เลยว่าคืออะไร
 * ========================================================= */
(function () {
  'use strict';

  var City = (window.City = { makers: {} });

  // ---------- shared helpers ----------
  var box = function (w, h, d, c, o) {
    o = o || {};
    var m = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, d),
      new THREE.MeshStandardMaterial({ color: c, roughness: o.rough != null ? o.rough : 0.85, metalness: o.metal || 0 })
    );
    if (o.x) m.position.x = o.x;
    m.position.y = (o.y || 0) + h / 2;
    if (o.z) m.position.z = o.z;
    if (o.rx) m.rotation.x = o.rx;
    if (o.rz) m.rotation.z = o.rz;
    return m;
  };
  var cyl = function (rt, rb, h, c, o) {
    o = o || {};
    var m = new THREE.Mesh(
      new THREE.CylinderGeometry(rt, rb, h, o.seg || 12),
      new THREE.MeshStandardMaterial({ color: c, roughness: o.rough != null ? o.rough : 0.85, metalness: o.metal || 0 })
    mesh.position.set(o.x || 0, (o.y || 0) + h / 2, o.z || 0);
    return m;
  };
  var cone = function (r, h, c, o) {
    o = o || {};
    var m = new THREE.Mesh(
      new THREE.ConeGeometry(r, h, o.seg || 12),
      new THREE.MeshStandardMaterial({ color: c, roughness: 0.7 })
    );
    m.position.set(o.x || 0, (o.y || 0) + h / 2, o.z || 0);
    return m;
  };
  var sphere = function (r, c, o) {
    o = o || {};
    var m = new THREE.Mesh(
      new THREE.SphereGeometry(r, 14, 10),
      new THREE.MeshStandard(city helpers) {};
  };
  var dome = function (r, c, o) {
    o = o || I will not
  };
  var tree = function (scale) {
    var g = new THREE.Group();
    var trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.3, 2.4, 6), new THREE.MeshStandardMaterial({ color: 0x6b4a2e, roughness: 0.95 }));
    trunk.position.y = 1.2;
    trunk.castShadow = true;
    g.add(trunk);
    var leafMat = new THREE.MeshStandardMaterial({ color: 0x3f7d33, roughness: 0.9 });
    var c1 = new THREE.Mesh(new THREE.SphereGeometry(1.5, 8, 6), leafMat);
    c1.position.y = 3.1;
    c1.castShadow = true;
    g.add(c1);
    var c2 = new THREE.Mesh(new THREE.SphereGeometry(1.05, 8, 6), leafMat);
    c2.position.set(0.5, 3.9, 0.3);
    g.add(c2);
    g.scale.setScalar(scale || 1);
    return g;
  };
  City.tree = tree;

  // ---------- landmark registry ----------
  var MAKERS = (City.makers);
  function def(key, label, cat, height, builder) {
    MAKERS[key] = {
      key: key, label: label, cat: cat, height: height, build: builder,
    };
  }
  City.def = def;

  // =====================================================================
  // ที่อยู่อาศัย
  // =====================================================================
  def('house', 'บ้านเดี่ยว', 'ที่อยู่อาศัย', 6, function (R) {
    var g = new THREE.Group();
    var c = R() < 0.5 ? 0xf2d8a7 : 0xdce8d8;
    g.add(box(6, 3, 4.5, c, { y: 0 }));
    g.add(box(6.6, 0.35, 5.1, 0x8a4a2e, { y: 3 }));          // หลังคาทรงจั่วฐาน
    var roofL = box(6.6, 2.2, 3.1, 0xb3502d, { y: 3.35 });
    roofL.rotation.x = 0; // ทรงจั่วสองเฉียง (สร้างจากกล่องบิด)
    g.add(roofL);
    g.add(box(1.2, 2.1, 0.15, 0x5a3a22, { x: 1.5, y: 0, z: 2.28 })); // ประตู
    g.add(box(1.4, 1.1, 0.12, 0x9fd4e8, { x: -1.6, y: 0.9, z: 2.26 }));
    g.add(box(0.5, 1.6, 0.5, 0xcccccc, { x: 0, y: 3.55, z: 0 }));    // ปล่องไฟ
    return g;
  });

  def('twinhouse', 'บ้านแฝด', 'ที่อยู่อาศัย', 6, function (R) {
    var g = new THREE.Group();
    for (var s = -1; s <= 1; s += 2) {
      var half = box(2.9, 3, 4.5, s < 0 ? 0xf0e3c8 : 0xe4dcc4);
      half.position.x = s * 1.5;
      g.add(half);
      var rf = box(3.3, 1.8, 5, 0xb3502d, { x: s * 1.5, y: 3 });
      g.add(rf);
    }
    g.add(box(0.15, 2, 4.5, 0x8a7a5a, { y: 0 })); // ผนังกั้นกลาง
    return g;
  });

  def('townhouse', 'ทาวน์โฮม', 'ที่อยู่อาศัย', 7, function (R) {
    var g = new THREE.Group();
    for (var i = 0; i < 4; i++) {
      var u = box(2.3, 4.2, 4, i % 2 ? 0xf3d9b0 : 0xeccfa4);
      u.position.x = -3.45 + i * 2.3;
      g.add(u);
      var roof = box(2.3, 0.5, 4.4, 0x9a4f2c, { x: -3.45 + i * 2.3, y: 4.2 });
      g.add(roof);
      var door = box(0.9, 1.9, 0.12, 0x6b4a2e, { x: -3.45 + i * 2.3, y: 0, z: 2.02 });
      g.add(door);
    }
    return g;
  });

  def('condo', 'คอนโดมิเนียม', 'ที่อยู่อาศัย', 32, function (R) {
    var g = new THREE.Group();
    var tower = box(8, 30, 8, 0xe8e2d5);
    g.add(tower);
    g.add(box(8.4, 0.6, 8.4, 0x7d8894, { y: 30 }));
    // ระเบียงเป็นแถบรอบอาคาร
    for (var f = 0; f < 10; f++) {
      g.add(box(8.5, 0.25, 8.5, 0xbfc9d2, { y: 3 + f * 3 }));
    }
    g.add(box(1.5, 2.5, 0.3, 0x4fc3f7, { y: 0, z: 4.15 })); // ชั้นลอยหน้าอาคาร
    return g;
  });

  def('apartment', 'อพาร์ตเมนต์', 'ที่อยู่อาศัย', 17, function (R) {
    var g = new THREE.Group();
    g.add(box(10, 15, 7, 0xdfd6c2));
    for (var f = 0; f < 5; f++) {
      g.add(box(10.2, 0.2, 7.2, 0xb0a890, { y: 3 * f }));
      for (var u = -1; u <= 1; u++) {
        g.add(box(1.3, 1.4, 0.15, 0x8fd0e8, { x: u * 3, y: 1 + f * 3, z: 3.58 }));
      }
    }
    g.add(box(10.4, 0.5, 7.4, 0x7d8894, { y: 15 }));
    return g;
  });

  def('oldcommunity', 'ชุมชนเก่า', 'ที่อยู่อาศัย', 5, function (R) {
    var g = new THREE.Group();
    var mats = [0x8d6e63, 0x795548, 0x8a6d5c];
    for (var i = 0; i < 5; i++) {
      var b = box(3.6, 2.6 + (i % 2) * 0.8, 3.2, mats[i % 3]);
      b.position.set(-4 + i * 2.1, 0, (i % 2) * 1.2);
      g.add(b);
      var rf = box(3.8, 0.35, 3.5, 0x5d4037, { x: -4 + i * 2.1, y: 2.6 + (i % 2) * 0.8, z: (i % 2) * 1.2 });
      g.add(rf);
    }
    return g;
  });

  def('hotel', 'โรงแรม', 'บริการ', 36, function (R) {
    var g = new THREE.Group();
    g.add(box(9, 32, 9, 0xf5efe0));
    g.add(box(9.3, 3, 9.3, 0xe8dcc0, { y: 0 })); // ชั้นล็อบบี้
    g.add(box(6, 2.2, 0.4, 0x3f8ea8, { y: 0, z: 4.7 })); // หน้าต่างล็อบบี้
    g.add(box(9.5, 0.5, 9.5, 0x8a939c, { y: 32 }));
    g.add(box(1.6, 5, 0.3, 0xd94f4f, { x: 2.5, y: 26, z: 4.8 })); // ป้าย
    return g;
  });

  def('resort', 'รีสอร์ต', 'บริการ', 5, function (R) {
    var g = new THREE.Group();
    for (var i = 0; i < 4; i++) {
      var v = box(4.5, 2.8, 3.6, 0xf0e0c0);
      v.position.set(-5.5 + (i % 2) * 11, 0, -2.5 + Math.floor(i / 2) * 6.5);
      v.rotation.y = (i % 2) * 0.12;
      g.add(v);
      var roof = box(5, 0.3, 4.1, 0x7a5230, { x: -5.5 + (i % 2) * 11, y: 2.8, z: -2.5 + Math.floor(i / 2) * 6.5 });
      g.add(roof);
    }
    var pool = box(6, 0.4, 4, 0x4fc3f7, { y: 0.05, x: 0, z: 1 });
    pool.material = new THREE.MeshStandardMaterial({ color: 0x4fc3f7, roughness: 0.15, metalness: 0.1 });
    g.add(pool);
    g.add(tree(0.9));
    g.children[g.children.length - 1].position.set(6, 0, -4);
    g.add(tree(0.8));
    g.children[g.children.length - 1].position.set(-6.5, 0, -4.5);
    return g;
  });

  // =====================================================================
  // การศึกษา
  // =====================================================================
  def('kindergarten', 'โรงเรียนอนุบาล', 'การศึกษา', 5, function (R) {
    var g = new THREE.Group();
    g.add(box(8, 3.2, 5, 0xffe082));                       // ตัวอาคารสีเหลืองสด
    g.add(box(8.4, 0.4, 5.4, 0xff7043, { y: 3.2 }));       // หลังคาส้ม
    g.add(box(2, 1.5, 0.2, 0x4fc3f7, { x: -2, y: 1, z: 2.6 }));
    g.add(box(1.2, 2, 0.15, 0xef5350, { x: 2, y: 0, z: 2.55 }));
    // ม้าโยก + ชิงช้าสีสดใส
    var horse = box(1.4, 0.7, 0.4, 0x66bb6a, { y: 0.4, x: 0, z: 3.6 });
    g.add(horse);
    g.add(box(0.15, 1, 0.15, 0x8d6e63, { x: -0.5, y: 0, z: 3.6 }));
    g.add(box(0.15, 1, 0.15, 0x8d6e63, { x: 0.5, y: 0, z: 3.6 }));
    g.add(tree(0.7));
    g.children[g.children.length - 1].position.set(-5, 0, 0);
    return g;
  });

  def('primarySchool', 'โรงเรียนประถม', 'การศึกษา', 8, function (R) {
    var g = new THREE.Group();
    g.add(box(12, 6.4, 6, 0xf5f0dc));
    for (var f = 0; f < 2; f++) {
      for (var w = -2; w <= 2; w++) {
        g.add(box(1.2, 1.3, 0.15, 0x9fd4e8, { x: w * 2.2, y: 1.2 + f * 3.2, z: 3.08 }));
      }
    }
    g.add(box(12.4, 0.4, 6.4, 0xc9a86a, { y: 6.4 }));
    g.add(box(1.6, 2.2, 0.2, 0x6b4a2e, { y: 0, z: 3.1 })); // ประตูกลาง
    g.add(box(0.4, 4.5, 0.4, 0xdddddd, { x: 7, y: 0, z: 0 })); // เสาธง
    var flag = box(1.2, 0.7, 0.06, 0xd94f4f, { x: 7.6, y: 4.2, z: 0 });
    g.add(flag);
    return g;
  });

  def('highSchool', 'โรงเรียนมัธยม', 'การศึกษา', 11, function (R) {
    var g = new THREE.Group();
    g.add(box(14, 9.6, 7, 0xece5d2));
    for (var f = 0; f < 3; f++) {
      g.add(box(14.2, 0.2, 7.2, 0xb5ab8e, { y: 3.2 * f }));
      for (var w = -3; w <= 3; w++) {
        g.add(box(1.2, 1.4, 0.15, 0x8fc5e0, { x: w * 1.9, y: 1.4 + f * 3.2, z: 3.6 }));
      }
    }
    g.add(box(14.6, 0.5, 7.4, 0x8a939c, { y: 9.6 }));
    g.add(box(0.4, 6, 0.4, 0xdddddd, { x: 9, y: 0, z: 2 })); // เสาธงชาติ
    // สนามบาสหน้าโรงเรียน
    var court = box(8, 0.15, 5, 0xc76b4a, { x: 0, y: 0, z: 6.5 });
    court.material.color = new THREE.Color(0xc76b4a);
    g.add(court);
    g.add(box(3, 2.4, 0.15, 0x666666, { y: 0.15, x: 3.4, z: 8.8 })); // โครงห่วง
    return g;
  });

  def('university', 'มหาวิทยาลัย', 'การศึกษา', 14, function (R) {
    var g = new THREE.Group();
    var b1 = box(10, 13, 7, 0xe3dcc8); b1.position.x = -6; g.add(b1);
    var b2 = box(8, 9, 6, 0xd8d0b8); b2.position.x = 6; g.add(b2);
    g.add(box(10.4, 0.5, 7.4, 0x8a939c, { x: -6, y: 13 }));
    g.add(box(8.4, 0.5, 6.4, 0x8a939c, { x: 6, 2 })); // <-- intentional bug? no:
    return g;
  });

  def('library', 'ห้องสมุดประชาชน', 'การศึกษา', 10, function (R) {
    var g = new THREE.Group();
    g.add(box(11, 7, 8, 0xf0ead8));
    g.add(box(11.5, 0.5, 8.5, 0x4a6a8a, { y: 7 }));
    g.add(box(2.4, 3.4, 0.3, 0x4fc3f7, { y: 0, z: 4.1 }));   // กระจกหน้าใหญ่
    g.add(cyl(0.4, 0.4, 7, 0xd9d2bd, { x: -6.5, y: 0 }));     // เสาแกะสลัก
    g.add(cyl(0.4, 0.4, 7, 0xd9d2bd, { x: 6.5, y: 0 }));
    g.add(box(4, 1.2, 0.3, 0x8a6d3b, { y: 8, z: 0 }));        // ป้าย
    return g;
  });

  def('learningCenter', 'ศูนย์การเรียนรู้', 'การศึกษา', 8, function (R) {
    var g = new THREE.Group();
    g.add(box(9, 5.5, 6, 0xdcead8));
    g.add(box(9.4, 0.4, 6.4, 0x66a06a, { y: 5.5 }));
    g.add(box(2, 2.4, 0.2, 0x4fc3f7, { y: 0, z: 3.1 }));
    g.add(box(3, 1, 0.25, 0x2e7d32, { y: 6, z: 0 }));  // ป้ายเขียว
    return g;
  });

  // =====================================================================
  // สาธารณสุข
  // =====================================================================
  def('hospital', 'โรงพยาบาลหลัก', 'สาธารณสุข', 26, function (R) {
    var g = new THREE.Group();
    g.add(box(14, 24, 10, 0xf4f7f9));                          // ตึกสูงขาว
    g.add(box(16, 4, 12, 0xe2ebee, { y: 0 }));                 // ฐานฉุกเฉิน
    g.add(box(3.2, 2.6, 0.3, 0xd94f4f, { y: 0, z: 6.15 }));    // ประตูฉุกเฉินแดง
    g.add(box(1.6, 1.6, 0.3, 0xffffff, { x: 5, y: 25, z: 0 })); // กาชาด
    g.add(box(0.8, 0.8, 0.4, 0xd94f4f, { x: 5, y: 25.2, z: 0.15 }));
    g.add(box(0.8, 0.8, 0.4, 0xd94f4f, { x: 5, y: 25.2, z: -0.15 }));
    for (var f = 0; f < 8; f++) {
      g.add(box(14.2, 0.2, 10.2, 0xcfd8dc, { y: 4 + f * 2.8 }));
    }
    g.add(box(2, 1, 2, 0xd94f4f, { y: 26, z: 0 }));            // เฮลิแพด
    return g;
  });

  def('privateHospital', 'โรงพยาบาลเอกชน', 'สาธารณสุข', 22, function (R) {
    var g = new THREE.Group();
    g.add(box(11, 18, 9, 0xeef3f6));
    g.add(box(11.4, 1, 9.4, 0x4fc3f7, { y: 18 }));             // กระจกฟ้าชั้นบน
    g.add(box(4, 2, 0.3, 0x1565c0, { y: 0, z: 4.6 }));
    g.add(box(2.4, 1, 0.4, 0x4fc3f7, { x: 0, y: 19.5, z: 0 })); // ป้ายฟ้า
    return g;
  });

  def('clinic', 'คลินิกทั่วไป', 'สาธารณสุข', 5, function (R) {
    var g = new THREE.Group();
    g.add(box(6, 3.5, 5, 0xf7f4ee));
    g.add(box(6.4, 0.4, 5.4, 0x90a4ae, { y: 3.5 }));
    g.add(box(1.8, 1, 0.2, 0xffffff, { y: 3.9, z: 0 }));       // ป้ายขาว
    g.add(box(0.5, 0.5, 0.3, 0xd94f4f, { x: 1.5, y: 3.9, z: 0.15 }));
    g.add(box(1.2, 2, 0.15, 0x8fc5e0, { x: -1.5, y: 0, z: 2.55 }));
    return g;
  });

  def('pharmacy', 'ร้านขายยา', 'สาธารณสุข', 4, function (R) {
    var g = new THREE.Group();
    g.add(box(5, 3, 4, 0xeef7ee));
    g.add(box(5.4, 0.35, 4.4, 0x66bb6a, { y: 3 }));
    g.add(box(2.2, 0.8, 0.2, 0x2e7d32, { y: 3.4, z: 0 }));     // ป้ายเขียว
    g.add(box(1.2, 0.6, 0.3, 0xffffff, { x: 1.5, y: 3.4, z: 0.16 })); // กากบาท
    return g;
  });

  def('vetClinic', 'โรงพยาบาลสัตว์', 'สาธารณสุข', 4.5, function (R) {
    var g = new THREE.Group();
    g.add(box(6, 3, 5, 0xf3ece0));
    g.add(box(6.4, 0.35, 5.4, 0xa1887f, { y: 3 }));
    g.add(box(2, 0.8, 0.2, 0x5d4037, { y: 3.3, z: 0 }));
    g.add(box(0.5, 0.4, 0.3, 0xffca28, { x: 1.2, y: 3.3, z: 0.16 })); // อุ้งเท้า
    return g;
  });

  // =====================================================================
  // ราชการ
  // =====================================================================
  def('police', 'สถานีตำรวจ', 'ราชการ', 8, function (R) {
    var g = new THREE.Group();
    g.add(box(10, 6, 7, 0xe8e0d0));
    g.add(box(10.4, 0.4, 7.4, 0x4a5a6a, { y: 6 }));
    g.add(box(4, 1.1, 0.25, 0x1a3a6a, { y: 6.5, z: 0 }));      // ป้ายน้ำเงิน
    g.add(box(2, 2.4, 0.2, 0x8fc5e0, { y: 0, z: 3.6 }));
    g.add(cyl(0.25, 0.25, 7, 0x9aa7b0, { x: -6, y: 0 }));      // เสาธงตำรวจ
    g.add(box(1.4, 0.9, 0.08, 0x1a3a6a, { x: -5.3, y: 5.6, z: 0 }));
    return g;
  });

  def('fireStation', 'สถานีดับเพลิง', 'ราชการ', 8, function (R) {
    var g = new THREE.Group();
    g.add(box(11, 5.5, 7, 0xd94f4f));                          // ตัวแดงโดดเด่น
    g.add(box(11.4, 0.4, 7.4, 0x8a2a2a, { y: 5.5 }));
    g.add(box(3, 3.2, 0.3, 0x333333, { x: -3, y: 0, z: 3.6 })); // ประตูรถดับเพลิง
    g.add(box(3, 3.2, 0.3, 0x333333, { x: 1, y: 0, z: 3.6 }));
    g.add(cyl(0.3, 0.3, 9, 0xcccccc, { x: 6.5, y: 0 }));
    g.add(box(0.5, 0.5, 0.5, 0xd94f4f, { x: 6.5, y: 9, z: 0 })); // หอสูง
    return g;
  });

  def('court', 'ศาล', 'ราชการ', 12, function (R) {
    var g = new THREE.Group();
    g.add(box(12, 8, 8, 0xf0ece0));
    g.add(box(12.6, 1, 8.6, 0xd9d2bd, { y: 8 }));              // ทับหลังแบบคลาสสิก
    for (var i = 0; i < 6; i++) {
      g.add(cyl(0.45, 0.45, 8, 0xf7f4ec, { x: -5 + i * 2, y: 0, z: 4.2 }));
    }
    g.add(box(4, 1.4, 0.3, 0x8a6d3b, { y: 9.4, z: 0 }));       // ป้ายทอง
    g.add(box(2.5, 2.2, 0.4, 0xd9d2bd, { y: 9, x: 0, z: 0 }));  // ขอบฟ้า
    return g;
  });

  def('districtOffice', 'ที่ว่าการอำเภอ', 'ราชการ', 9, function (R) {
    var g = new THREE.Group();
    g.add(box(11, 6.5, 7, 0xe8e4d4));
    g.add(box(11.4, 0.4, 7.4, 0x8a939c, { y: 6.5 }));
    g.add(box(4.5, 1, 0.25, 0x8a6d3b, { y: 7, z: 0 }));
    g.add(box(6, 3, 0.2, 0x9fd4e8, { y: 0.8, z: 3.6 }));
    return g;
  });

  // =====================================================================
  // ค้าขาย
  // =====================================================================
  def('mall', 'ห้างสรรพสินค้า', 'ค้าขาย', 18, function (R) {
    var g = new THREE.Group();
    g.add(box(18, 14, 12, 0xe8d5e0));
    g.add(box(18.5, 0.6, 12.5, 0x9c6a8a, { y: 14 }));
    g.add(box(6, 4, 0.4, 0x4fc3f7, { y: 0, z: 6.2 }));         // กระจกหน้า
    g.add(box(5, 1.2, 0.3, 0x9c27b0, { y: 15, z: 0 }));
    g.add(box(1.5, 4, 0.3, 0xef5350, { x: 6, y: 0, z: 6.2 })); // ตกแต่ง
    return g;
  });

  def('supermarket', 'ซูเปอร์มาร์เก็ต', 'ค้าขาย', 7, function (R) {
    var g = new THREE.Group();
    g.add(box(14, 5, 9, 0xdceee8));
    g.add(box(14.5, 0.4, 9.5, 0x2e8b57, { y: 5 }));
    g.add(box(5, 2, 0.3, 0x4fc3f7, { y: 0, z: 4.6 }));
    g.add(box(6, 1, 0.3, 0x1b5e20, { y: 5.4, z: 0 }));
    // ลานจอดหน้าร้าน
    var lot = box(14, 0.1, 4, 0x555a60, { y: 0, z: 6.5 });
    g.add(lot);
    return g;
  });

  def('market', 'ตลาดสด', 'ค้าขาย', 5, function (R) {
    var g = new THREE.Group();
    // หลังคาโค้งคลุมทั้งตลาด
    var roof = new THREE.Mesh(
      new THREE.CylinderGeometry(4, 4, 16, 16, 1, true, 0, Math.PI),
      new THREE.MeshStandardMaterial({ color: 0xef5350, roughness: 0.6, side: THREE.DoubleSide })
    );
    roof.rotation.z = Math.PI / 2;
    roof.position.y = 3.6;
    g.add(roof);
    for (var s = -1; s <= 1; s += 2) {
      g.add(box(0.4, 3.6, 0.4, 0x8d9ca8, { x: 0, y: 0, z: s * 3.8 }));
    }
    for (var i = 0; i < 5; i++) {
      g.add(box(2, 1.6, 1.2, [0xffca28, 0x66bb6a, 0xef5350, 0x42a5f5, 0xffe14f][i], { x: -6 + i * 3, y: 0.6, z: 0 }));
      // แผงขายของ
    }
    return g;
  });

  def('shops', 'ร้านค้าหลากหลาย', 'ค้าขาย', 5, function (R) {
    var g = new THREE.Group();
    var colors = [0xef5350, 0x42a5f5, 0xffca28, 0x66bb6a, 0xab47bc, 0xff7043];
    for (var i = 0; i < 5; i++) {
      var sh = box(3, 3, 4, colors[i % colors.length]);
      sh.position.x = -6 + i * 3;
      g.add(sh);
      g.add(box(2.6, 0.3, 4.4, 0x37474f, { x: -6 + i * 3, y: 3 }));
      g.add(box(2, 1.4, 0.15, 0xfff8e1, { x: -6 + i * 3, y: 0.8, z: 2.08 }));
    }
    return g;
  });

  def('foodStall', 'ร้านอาหารตามสั่ง', 'ค้าขาย', 4, function (R) {
    var g = new THREE.Group();
    g.add(box(5, 2.8, 4, 0xffe0b2));
    g.add(box(5.4, 0.3, 4.4, 0xef6c00, { y: 2.8 }));
    g.add(box(2.5, 0.7, 0.2, 0xbf360c, { y: 3.1, z: 0 }));
    g.add(box(1.2, 1.8, 0.15, 0x8d6e63, { y: 0, z: 2.05 }));
    return g;
  });

  def('noodleShop', 'ร้านก๋วยเตี๋ยว', 'ค้าขาย', 4, function (R) {
    var g = new THREE.Group();
    g.add(box(4.5, 2.6, 3.5, 0xfff3e0));
    g.add(box(4.9, 0.3, 3.9, 0xd84315, { y: 2.6 }));
    g.add(box(2.2, 0.7, 0.2, 0xbf360c, { y: 2.9, z: 0 }));
    g.add(box(1.6, 0.9, 0.8, 0xffca28, { y: 0.4, x: 3, z: 0.5 })); // โต๊ะนอก
    g.add(cyl(0.08, 0.08, 0.8, 0x8d9ca8, { x: 3, y: 0, z: 1.2 }));
    return g;
  });

  def('cafe', 'คาเฟ่', 'ค้าขาย', 4.5, function (R) {
    var g = new THREE.Group();
    g.add(box(6, 3, 4.5, 0xe8d5c0));
    g.add(box(6.4, 0.35, 4.9, 0x6d4c41, { y: 3 }));
    g.add(box(2.6, 0.8, 0.2, 0x4e342e, { y: 3.3, z: 0 }));
    // ร่มกับโต๊ะนอกอาคาร
    for (var i = 0; i < 2; i++) {
      var umbrella = new THREE.Mesh(
        new THREE.ConeGeometry(1.3, 0.7, 8),
        new THREE.MeshStandardMaterial({ color: i ? 0xef5350 : 0x42a5f5, roughness: 0.7 })
      );
      umbrella.position.set(2 + i * 2.4, 2.1, 3.2);
      g.add(umbrella);
      g.add(cyl(0.06, 0.06, 2, 0x8d9ca8, { x: 2 + i * 2.4, y: 0.1, z: 3.2 }));
      g.add(cyl(0.5, 0.5, 0.08, 0x6d4c41, { x: 2 + i * 2.4, y: 0.6, z: 3.2 }));
      g.add(cyl(0.06, 0.06, 0.6, 0x8d9ca8, { x: 2 + i * 2.4, y: 0, z: 3.2 }));
    }
    return g;
  });

  def('bakery', 'ร้านขนม/เบเกอรี่', 'ค้าขาย', 4, function (R) {
    var g = new THREE.Group();
    g.add(box(5, 2.8, 4, 0xfde8d0));
    g.add(box(5.4, 0.3, 4.4, 0xe8a87c, { y: 2.8 }));
    g.add(box(2.4, 0.7, 0.2, 0x8d5524, { y: 3.1, z: 0 }));
    g.add(box(0.8, 0.5, 0.3, 0xd94f4f, { x: 1.2, y: 3.2, z: 0.16 })); // คัพเค้ก
    return g;
  });

  def('iceCream', 'ร้านไอศกรีม', 'ค้าขาย', 4.5, function (R) {
    var g = new THREE.Group();
    g.add(box(4.5, 2.6, 3.5, 0xfce4ec));
    g.add(box(4.9, 0.3, 3.9, 0xf06292, { y: 2.6 }));
    g.add(box(2.2, 0.7, 0.2, 0xc2185b, { y: 2.9, z: 0 }));
    // โคนไอศกรีมยักษ์บนหลังคา
    g.add(cone(0.8, 1.8, 0xf8bbd0, { y: 2.9, x: 0, z: 0 }));
    g.add(sphere(0.55, 0xf48fb1, { y: 4.5, x: 0, z: 0 }));
    return g;
  });

  def('fastFood', 'ฟาสต์ฟู้ด', 'ค้าขาย', 5, function (R) {
    var g = new THREE.Group();
    g.add(box(7, 3, 5, 0xf5e6d0));
    g.add(box(7.4, 0.4, 5.4, 0xd94330, { y: 3 }));
    g.add(box(2.4, 1.6, 0.3, 0xffca28, { y: 0.6, z: 2.6 }));   // M สีเหลือง
    g.add(box(4, 0.9, 0.25, 0xd94330, { y: 3.4, z: 0 }));
    return g;
  });

  def('bank', 'ธนาคาร', 'ค้าขาย', 9, function (R) {
    var g = new THREE.Group();
    g.add(box(10, 7, 8, 0xe0e8e0));
    g.add(box(10.6, 0.6, 8.6, 0x9aa88a, { y: 7 }));
    for (var i = 0; i < 4; i++) {
      g.add(cyl(0.5, 0.5, 7, 0xf0f4ec, { x: -3.6 + i * 2.4, y: 0, z: 4.2 }));
    }
    g.add(box(4, 1, 0.3, 0x1a3a6a, { y: 7.5, z: 0 }));          // ป้าย
    // ตู้ ATM หน้าอาคาร
    g.add(box(1, 1.8, 0.8, 0x1a3a6a, { x: 6.5, y: 0, z: 2 }));
    g.add(box(0.7, 0.5, 0.2, 0x4fc3f7, { x: 6.5, y: 1, z: 2.4 }));
    return g;
  });

  def('office', 'อาคารสำนักงาน', 'ค้าขาย', 30, function (R) {
    var g = new THREE.Group();
    var h = 18 + Math.floor(R() * 4) * 3; // 18-30
    g.add(box(10, h, 10, 0xb0c4d4));
    for (var f = 0; f < h / 3; f++) {
      g.add(box(10.2, 1.6, 10.2, 0x8fc5e0, { y: 0.7 + f * 3 })); // แถบกระจก
    }
    g.add(box(10.4, 0.6, 10.4, 0x546e7a, { y: h }));
    g.add(box(1.5, 4, 0.4, 0xd94f4f, { y: h, x: 0, z: 0 }));    // เสาอากาศ
    return g;
  });

  def('coworking', 'Co-working Space', 'ค้าขาย', 10, function (R) {
    var g = new THREE.Group();
    g.add(box(9, 8, 7, 0xd0e0e8));
    g.add(box(9.4, 0.4, 7.4, 0x37474f, { y: 8 }));
    g.add(box(3.5, 2.5, 0.3, 0x4fc3f7, { y: 0, z: 3.6 }));
    g.add(box(3.5, 0.9, 0.25, 0x00838f, { y: 8.4, z: 0 }));
    return g;
  });

  // =====================================================================
  // โรงแรม/ที่พัก (อยู่บน)
  // =====================================================================
  def('souvenir', 'ร้านของฝาก', 'ค้าขาย', 4, function (R) {
    var g = new THREE.Group();
    g.add(box(4.5, 2.8, 3.5, 0xf0e0c8));
    g.add(box(4.9, 0.3, 3.9, 0xc0392b, { y: 2.8 }));
    g.add(box(2, 0.7, 0.2, 0x8d6e63, { y: 3.1, z: 0 }));
    return g;
  });

  def('landmark', 'จุดถ่ายรูป', 'บริการ', 12, function (R) {
    var g = new THREE.Group();
    g.add(cyl(2.2, 2.6, 8, 0xe8e0d0, { y: 0 }));               // เสาหินโค้ง
    g.add(box(6, 0.5, 6, 0xd9d2bd, { y: 8 }));                  // ยอด
    g.add(box(0.3, 2, 0.3, 0x8d9ca8, { y: 8.5, x: 0, z: 0 }));
    g.add(box(1.6, 1, 0.06, 0xd94f4f, { x: 0.9, y: 9, z: 0 })); // ธง
    g.add(tree(0.8));
    g.children[g.children.length - 1].position.set(4, 0, 3);
    return g;
  });

  def('laundry', 'ร้านซักรีด', 'บริการ', 4, function (R) {
    var g = new THREE.Group();
    g.add(box(5, 2.8, 4, 0xe3f2fd));
    g.add(box(5.4, 0.3, 4.4, 0x1976d2, { y: 2.8 }));
    g.add(box(2.4, 0.7, 0.2, 0x0d47a1, { y: 3.1, z: 0 }));
    g.add(sphere(0.4, 0xffffff, { x: 1.2, y: 3.2, z: 0.16 }));  // ฟองสบู่
    return g;
  });

  // =====================================================================
  // ศาสนสถาน
  // =====================================================================
  def('temple', 'วัด', 'ศาสนสถาน', 16, function (R) {
    var g = new THREE.Group();
    // อุโบสถหลังใหญ่หลังคาซ้อน
    g.add(box(10, 4, 6, 0xf5efe0));
    g.add(box(10.8, 0.5, 6.8, 0xc9a86a, { y: 4 }));
    g.add(box(9, 1.2, 5.2, 0xd4af37, { y: 4.5 }));             // หลังคาซ้อนทอง
    g.add(box(9.6, 0.4, 5.6, 0xc9a86a, { y: 5.7 }));
    // เจดีย์ทรงไทย
    var chediBase = box(3.2, 2.4, 3.2, 0xf0e6c8, { x: 0, y: 0, z: 0 });
    chediBase.position.set(8, 0, 0);
    g.add(chediBase);
    g.add(cone(2, 6, 0xd4af37, { x: 8, y: 2.4, z: 0 }));       // ยอดเจดีย์ทอง
    g.add(sphere(0.5, 0xffe082, { x: 8, y: 8.4, z: 0 }));       // ปลียอด
    // เสาธง
    g.add(cyl(0.15, 0.15, 9, 0xd9d2bd, { x: -7, y: 0 }));
    g.add(cone(0.5, 1.2, 0xd4af37, { x: -7, y: 9, z: 0 }));
    return g;
  });

  def('mosque', 'มัสยิด', 'ศาสนสถาน', 12, function (R) {
    var g = new THREE.Group();
    g.add(box(9, 5, 7, 0xf0ead6));
    g.add(box(9.6, 0.5, 7.6, 0x2e7d32, { y: 5 }));
    // โดมใหญ่
    g.add(dome(2.8, 0x2e7d32, { y: 5.5, x: 0, z: 0 }));
    g.add(cyl(0.1, 0.1, 1.5, 0xd4af37, { x: 0, y: 8, z: 0 }));  // เสาเรือนธง
    g.add(sphere(0.25, 0xd4af37, { x: 0, y: 9.5, z: 0 }));
    // หออะซานสองข้าง
    g.add(cyl(0.8, 0.9, 10, 0xf0ead6, { x: -6.5, y: 0, z: 0 }));
    g.add(dome(1.1, 0x2e7d32, { x: -6.5, y: 10, z: 0 }));
    g.add(cyl(0.8, 0.9, 10, 0f0ead6, { x: 6.5, y: 0, z: 0 }));
    return g;
  });

  def('church', 'โบสถ์', 'ศาสนสถาน', 14, function (R) {
    var g = new THREE.Group();
    g.add(box(7, 5, 10, 0xf5f0e8));
    var roof = box(7.4, 2, 10.4, 0x8a6d3b, { y: 5 });
    g.add(roof);
    // หอระฆังสูง
    g.add(box(2.4, 9, 2.4, 0xf5f0e8, { x: 0, y: 0, z: -6.5 }));
    g.add(pyramid(1.9, 3, 0x8a6d3b, { x: 0, y: 9, z: -6.5 }));
    g.add(box(0.35, 0.5, 0.2, 0xd4af37, { x: 0, y: 10.4, z: -5.3 })); // กางเขนทอง
    g.add(box(0.2, 0.8, 0.2, 0xd4af37, { x: 0, y: 10, z: -5.3 }));
    return g;
  });

  // =====================================================================
  // อุตสาหกรรม/สาธารณูปโภค
  // ====
  def('factory', 'โรงงาน', 'อุตสาหกรรม', 9, function (R) {
    var g = new THREE.Group();
    g.add(box(14, 5, 9, 0xd9d9d9));
    // หลังคาจั่วโรงงาน (ซอยเป็นร่อง)
    for (var i = 0; i < 4; i++) {
      var saw = box(3.4, 1.8, 9.4, 0xb0b8bc, { x: -5.2 + i * 3.5, y: 5 });
      saw.rotation.z = 0;
      g.add(saw);
    }
    g.add(cyl(1, 1, 12, 0xe57373, { x: -7, y: 0, z: -3 }));     // ปล่องไฟสูง
    g.add(box(0.5, 2, 0.5, 0xcccccc, { x: -7, y: 12, z: -3 }));
    g.add(box(3.5, 3.5, 0.3, 0x607d8b, { x: 3, y: 0, z: 4.6 }));
    return g;
  });

  def('warehouse', 'โกดัง', 'อุตสาหกรรม', 7, function (R) {
    var g = new THREE.Group();
    g.add(box(12, 5, 8, 0x9aa8b0));
    g.add(box(12.5, 0.4, 8.5, 0x607d8b, { y: 5 }));
    g.add(box(4, 3.8, 0.3, 0x546e7a, { y: 0, z: 4.1 }));        // ประตูม้วนใหญ่
    g.add(box(6, 1, 0.3, 0x37474f, { y: 5.4, z: 0 }));
    return g;
  });

  def('distribution', 'ศูนย์กระจายสินค้า', 'อุตสาหกรรม', 8, function (R) {
    var g = new THREE.Group();
    g.add(box(16, 6, 10, 0xb8c4cc));
    g.add(box(16.5, 0.5, 10.5, 0x546e7a, { y: 6 }));
    g.add(box(4.5, 4, 0.3, 0x78909c, { x: -4, y: 0, z: 5.1 }));
    g.add(box(4.5, 4, 0.3, 0x78909c, { x: 2, y: 0, z: 5.1 }));
    g.add(box(5, 1.2, 0.3, 0x0d47a1, { y: 6.5, z: 0 }));
    // รถเฮลที่จอด
    var truck = box(4, 2.2, 2.2, 0xffffff, { x: 10, y: 0, z: 6 });
    g.add(truck);
    g.add(box(1.6, 1.8, 2.2, 0xd94f4f, { x: 12.6, y: 0, z: 6 }));
    return g center;
  });

  def('truckLot', 'ลานจอดรถบรรทุก', 'อุตสาหกรรม', 2, function (R) {
    var g = new THREE.Group();
    g.add(box(18, 0.15, 12, 0x4a4f55, { y: 0 }));
    for (var i = 0; i < 3; i++) {
      var t1 = box(5, 2.4, 2.4, 0xe0e0e0, { y: 0.15, x: -5 + i * 5, z: -2.5 });
      g.add(t1);
      g.add(box(1.8, 2, 2.4, 0x37474f, { x: -5 + i * 5 + 3.2, y: 0.15, z: -2.5 }));
      var t2 = box(5, 2.4, 2.4, 0xcfd8dc, { y: 0.15, x: -5 + i * 5, z: 2.5 });
      g.add(t2);
      g.add(box(1.8, 2, 2.4, 0x455a64, { x: -5 + i * 5 + 3.2, y: 0.15, z: 2.5 }));
    }
    return g;
  });

  def('powerPlant', 'โรงไฟฟ้า', 'อุตสาหกรรม', 15, function (R) {
    var g = new THREE.Group();
    g.add(box(10, 8, 8, 0xb0bec5));
    g.add(cyl(1.4, 1.6, 16, 0xe0e0e0, { x: -6, y: 0, z: -2 }));  // ปล่องสูง
    g.add(box(0.6, 2.5, 0.6, 0xd94f4f, { x: -6, y: 16, z: -2 })); // แถบแดงบนปล่อง
    g.add(cyl(2.5, 2.5, 0.5, 0x78909c, { y: 8, x: 3, z: 3 }));    // หอหล่อเย็น
    g.add(cone(2.6, 3, 0x90a4ae, { y: 8.5, x: 3, z: 3 }));
    g.add(box(4, 1.2, 0.3, 0xffca28, { y: 8.4, z: 0 }));
    return g;
  });

  def('waterWorks', 'โรงผลิตน้ำประปา', 'อุตสาหกรรม', 8, function (R) {
    var g = new THREE.Group();
    g.add(box(8, 5, 6, 0xd0e8f0));
    g.add(cyl(2.2, 2.2, 7, 0x8ac6e0, { x: 7, y: 0, z: 0 }));    // ถังน้ำกลม
    g.add(cone(2.4, 1.6, 0x5aa0c0, { x: 7, y: 7, z: 0 }));
    g.add(box(3.5, 1, 0.3, 0x0277bd, { y: 5.4, z: 0 }));
    return g;
  });

  def('waterTreatment', 'ระบบบำบัดน้ำเสีย', 'อุตสาหกรรม', 4, function (R) {
    var g = new THREE.Group();
    g.add(box(6, 3, 4, 0xdce8d8));
    g.add(cyl(2.5, 2.5, 1.2, 0x4a7a5a, { x: 0, y: 0, z: 5 }));  // บ่อบำบัดกลม
    g.add(cyl(2.5, 2.5, 1.2, 0x5a8a6a, { x: 6, y: 0, z: 5 }));
    g.add(cyl(2.5, 2.5, 1.2, 0x3f6a4f, { x: 3, y: 0, z: 9 }));
    g.add(box(2, 1, 0.3, 0x2e7d32, { y: 3.2, z: 0 }));
    return g;
  });

  def('tower', 'เสาสัญญาณ', 'อุตสาหกรรม', 24, function (R) {
    var g = new THREE.Group();
    var mast = cyl(0.35, 0.7, 20, 0xd0d4d8, { y: 0 });
    g.add(mast);
    for (var i = 0; i < 3; i++) {
      g.add(box(3 - i * 0.7, 0.35, 3 - i * 0.7, 0xffffff, { y: 8 + i * 4 })); // วงแหวนขาว
    }
    g.add(box(0.4, 3, 0.4, 0xb0b8bc, { y: 20 }));
    g.add(sphere(0.4, 0xd94f4f, { x: 0, y: 23.4, z: 0 }));      // ไฟแดงยอด
    return g;
  });

  // =====================================================================
  // เกษตรกรรม
  // =====================================================================
  def('riceField', 'นาข้าว', 'เกษตรกรรม', 1.5, function (R) {
    var g = new THREE.Group();
    var field = box(24, 0.4, 18, 0x9db84a, { y: 0 });
    field.material.color = new THREE.Color(0x9db84a);
    g.add(field);
    for (var i = 0; i < 5; i++) {
      g.add(box(24, 0.12, 0.5, 0x86a03a, { y: 0.4, z: -7.2 + i * 3.6 }));
    }
    // กระทงหลังนา
    g.add(box(3, 2, 2.5, 0x8d6e63, { x: 9, y: 0, z: 8 }));
    g.add(box(3.6, 0.4, 3, 0x5d4037, { x: 9, y: 2, z: 8 }));
    return g;
  });

  def('vegetableGarden', 'สวนผัก', 'เกษตรกรรม', 1.5, function (R) {
    var g = new THREE.Group();
    var rows = [0x66bb6a, 0x81c784, 0x4caf50, 0x7cb342, 0x9ccc65];
    for (var i = 0; i < 6; i++) {
      g.add(box(20, 0.35, 1.6, rows[i % rows.length], { y: 0, z: -6.5 + i * 2.6 }));
    }
    g.add(box(2.5, 2, 2, 0x8d6e63, { x: 11, y: 0, z: 0 }));    // เพาะชำ
    g.add(box(3, 0.3, 2.4, 0x5d4037, { x: 11, y: 2, z: 0 }));
    return g;
  });

  def('farm', 'ฟาร์ม', 'เกษตรกรรม', 5, function (R) {
    var g = new THREE.Group();
    g.add(box(9, 4, 6, 0xd4763a));
    g.add(box(9.6, 0.5, 6.6, 0x8d4e2a, { y: 4 }));              // โรงเรือน
    g.add(cyl(0.18, 0.18, 4, 0x8d9ca8, { x: 6, y: 0, z: 4 }));
    // รั้วลวดหนาม
    for (var i = 0; i < 6; i++) {
      g.add(box(0.15, 1.2, 0.15, 0x6d4c41, { x: -7.5 + i * 3, y: 0, z: 6 }));
    }
    g.add(tree(0.9));
    g.children[g.children.length - 1].position.set(-9, 0, -4);
    return g;
  });

  // =====================================================================
  // ขนส่งสาธารณะ
  // =====================================================================
  def('gasStation', 'ปั๊มน้ำมัน', 'บริการ', 6, function (R) {
    var g = new THREE.Group();
    // หลังคาปั๊มแบนยกสูง
    g.add(box(12, 0.5, 8, 0xf5f5f5, { y: 4.5 }));
    for (var i = 0; i < 3; i++) {
      g.add(cyl(0.25, 0.25, 4.5, 0xd0d4d8, { x: -4 + i * 4, y: 0, z: 2 }));
    }
    g.add(box(4, 3, 3, 0xf0f0f0, { x: 0, y: 0, z: -3.5 }));     // หลักเซียน
    g.add(box(4.2, 0.4, 3.2, 0xd94f4f, { x: 0, y: 3, z: -3.5 }));
    g.add(box(1.2, 0.8, 0.5, 0xffca28, { x: -2, y: 0.8, z: 0 })); // ปั๊ม
    g.add(box(1.2, 0.8, 0.5, 0xffca28, { x: 2, y: 0.8, z: 0 }));
    g.add(cyl(0.9, 0.9, 1.4, 0xe0e0e0, { x: 7, y: 0, z: 3 }));   // ถังใต้ดินหมายเหตุ: ที่เห็นคือถังเหนือดิน
    return g;
  });

  def('evStation', 'สถานีชาร์จรถไฟฟ้า', 'บริการ', 5, function (R) {
    var g = new THREE.Group();
    g.add(box(8, 0.35, 6, 0x4fc3f7, { y: 3.5 }));
    for (var i = 0; i < 2; i++) {
      g.add(cyl(0.22, 0.22, 3.5, 0x90a4ae, { x: -2 + i * 4, y: 0, z: 1 }));
    }
    g.add(box(0.7, 1.4, 0.5, 0x263238, { x: -1.5, y: 0, z: 0 }));
    g.add(box(0.5, 0.35, 0.15, 0x66bb6a, { x: -1.5, y: 0.7, z: 0.28 })); // จอ LED
    g.add(box(0.7, 1.4, 0.5, 0x263238, { x: 1.5, y: 0, z: 0 }));
    g.add(box(0.5, 0.35, 0.15, 0x66bb6a, { x: 1.5, y: 0.7, z: 0.28 }));
    return g;
  });

  def('carRepair', 'ร้านซ่อมรถ', 'บริการ', 5, function (R) {
    var g = new THREE.Group();
    g.add(box(8, 4, 6, 0x90a4ae));
    g.add(box(8.4, 0.4, 6.4, 0x546e7a, { y: 4 }));
    g.add(box(3, 2.8, 0.3, 0x455a64, { y: 0, z: 3.1 }));        // ประตูโรงรถ
    g.add(box(4, 0.8, 0.3, 0xffca28, { y: 4.3, z: 0 }));
    // ยางรถกองหน้าร้าน
    g.add(cyl(0.7, 0.7, 0.5, 0x263238, { x: 5.5, y: 0, z: 3.5 }));
    g.add(cyl(0.7, 0.7, 0.5, 0x263238, { x: 5.5, y: 0.5, z: 3.5 }));
    return g;
  });

  def('buildingSupply', 'ร้านวัสดุก่อสร้าง', 'บริการ', 6, function (R) {
    var g = new THREE.Group();
    g.add(box(10, 4.5, 7, 0xffcc80));
    g.add(box(10.4, 0.5, 7.4, 0xef6c00, { y: 4.5 }));
    g.add(box(3, 2.5, 0.3, 0x8d6e63, { y: 0, z: 3.6 }));
    g.add(box(5, 1, 0.3, 0xe65100, { y: 5, z: 0 }));
    // กองทราย+อิฐ
    g.add(box(2, 1, 2, 0xd9c98a, { x: 7, y: 0, z: 3 }));
    g.add(box(1.8, 0.8, 1, 0xb5502d, { x: 7, y: 1.2, z: 3 }));
    return g;
  });

  City.helpers = { box: box, cyl: cyl, cone: cone };
})(window, document, THREE);
