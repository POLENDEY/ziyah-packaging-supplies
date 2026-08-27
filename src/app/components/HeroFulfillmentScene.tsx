"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import styles from "./HeroFulfillmentScene.module.css";

/**
 * Full-bleed looping 3D scene:
 * delivery car → store pickup → customer home delivery.
 */
export default function HeroFulfillmentScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let renderer: THREE.WebGLRenderer | null = null;
    let frameId = 0;
    let alive = true;
    let visible = true;
    let startTimer = 0;
    const cleanupFns: Array<() => void> = [];

    const makeStoreSignTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1024;
      canvas.height = 256;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      ctx.fillStyle = "#241c28";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#ed9e59";
      ctx.fillRect(0, canvas.height - 18, canvas.width, 18);
      ctx.fillStyle = "#ffffff";
      ctx.font = "700 58px Segoe UI, Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Ziyah Packaging Supplies", canvas.width / 2, canvas.height / 2 - 6);
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      return tex;
    };

    const makeDeliverySideTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 256;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#ffffff";
      ctx.font = "800 72px Segoe UI, Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("DELIVERY", canvas.width / 2, canvas.height / 2);
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      return tex;
    };

    const boot = () => {
      if (!alive || !mount) return;

      const width = mount.clientWidth || 960;
      const height = mount.clientHeight || 560;

      const scene = new THREE.Scene();
      scene.fog = new THREE.Fog(0x1b1931, 16, 48);

      const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
      camera.position.set(1.8, 7.6, 15.5);
      camera.lookAt(1.2, 1.4, 0);

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.setSize(width, height, false);
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      mount.appendChild(renderer.domElement);

      scene.add(new THREE.HemisphereLight(0xe9bcb9, 0x1b1931, 0.85));
      const key = new THREE.DirectionalLight(0xfff5ec, 1.35);
      key.position.set(7, 16, 9);
      scene.add(key);
      const rim = new THREE.DirectionalLight(0xed9e59, 0.42);
      rim.position.set(-10, 6, -4);
      scene.add(rim);
      const storeLamp = new THREE.PointLight(0xffb08a, 1.4, 10, 2);
      storeLamp.position.set(-7, 2.4, 1.4);
      scene.add(storeLamp);
      const homeLamp = new THREE.PointLight(0xffd4a8, 1.1, 9, 2);
      homeLamp.position.set(7.8, 2.5, -3.5);
      scene.add(homeLamp);

      const matPlum = new THREE.MeshStandardMaterial({
        color: 0x662249,
        roughness: 0.42,
        metalness: 0.22,
      });
      const matPlumDeep = new THREE.MeshStandardMaterial({
        color: 0x1b1931,
        roughness: 0.5,
        metalness: 0.18,
      });
      const matCoral = new THREE.MeshStandardMaterial({
        color: 0xed9e59,
        roughness: 0.38,
        metalness: 0.2,
        emissive: 0xed9e59,
        emissiveIntensity: 0.08,
      });
      const matCream = new THREE.MeshStandardMaterial({
        color: 0xfff7f2,
        roughness: 0.48,
        metalness: 0.06,
      });
      const matSand = new THREE.MeshStandardMaterial({
        color: 0xe8d5c4,
        roughness: 0.72,
        metalness: 0.04,
      });
      const matDark = new THREE.MeshStandardMaterial({
        color: 0x1c141f,
        roughness: 0.55,
        metalness: 0.35,
      });
      const matGlass = new THREE.MeshStandardMaterial({
        color: 0xb8d4ef,
        roughness: 0.12,
        metalness: 0.65,
        transparent: true,
        opacity: 0.72,
      });
      const matGold = new THREE.MeshStandardMaterial({
        color: 0xf0c27a,
        roughness: 0.35,
        metalness: 0.45,
      });

      // Ground plaza
      const ground = new THREE.Mesh(
        new THREE.CircleGeometry(18, 64),
        new THREE.MeshStandardMaterial({
          color: 0x1b1931,
          roughness: 0.92,
          metalness: 0.05,
        })
      );
      ground.rotation.x = -Math.PI / 2;
      scene.add(ground);

      const plaza = new THREE.Mesh(
        new THREE.RingGeometry(5.5, 11.5, 64),
        new THREE.MeshStandardMaterial({
          color: 0x2a1838,
          roughness: 0.88,
          metalness: 0.08,
        })
      );
      plaza.rotation.x = -Math.PI / 2;
      plaza.position.y = 0.01;
      scene.add(plaza);

      // Road (darker asphalt so yards read clearly beside it)
      const road = new THREE.Mesh(
        new THREE.PlaneGeometry(24, 2.2),
        new THREE.MeshStandardMaterial({
          color: 0x0e0c18,
          roughness: 0.88,
          metalness: 0.1,
        })
      );
      road.rotation.x = -Math.PI / 2;
      road.position.set(0, 0.025, 0.75);
      scene.add(road);

      const curbL = new THREE.Mesh(
        new THREE.PlaneGeometry(24, 0.18),
        matGold
      );
      curbL.rotation.x = -Math.PI / 2;
      curbL.position.set(0, 0.03, -0.25);
      const curbR = curbL.clone();
      curbR.position.z = 1.75;
      scene.add(curbL, curbR);

      for (let i = 0; i < 13; i++) {
        const dash = new THREE.Mesh(
          new THREE.PlaneGeometry(0.85, 0.12),
          new THREE.MeshBasicMaterial({
            color: 0xed9e59,
            transparent: true,
            opacity: 0.75,
          })
        );
        dash.rotation.x = -Math.PI / 2;
        dash.position.set(-10.5 + i * 1.75, 0.035, 0.75);
        scene.add(dash);
      }

      // Trees / accents
      const makeTree = (x: number, z: number) => {
        const g = new THREE.Group();
        const trunk = new THREE.Mesh(
          new THREE.CylinderGeometry(0.12, 0.16, 0.7, 8),
          matSand
        );
        trunk.position.y = 0.35;
        g.add(trunk);
        const canopy = new THREE.Mesh(
          new THREE.SphereGeometry(0.55, 12, 12),
          new THREE.MeshStandardMaterial({
            color: 0x662249,
            roughness: 0.7,
            metalness: 0.05,
          })
        );
        canopy.position.y = 1.05;
        g.add(canopy);
        g.position.set(x, 0, z);
        return g;
      };
      scene.add(makeTree(-3.8, -2.6), makeTree(2.6, -3.2), makeTree(5.0, -4.8));

      // Store
      const store = new THREE.Group();
      const storeBody = new THREE.Mesh(
        new THREE.BoxGeometry(3.6, 2.6, 2.4),
        matPlum
      );
      storeBody.position.y = 1.3;
      store.add(storeBody);
      const storeBase = new THREE.Mesh(
        new THREE.BoxGeometry(3.9, 0.2, 2.7),
        matPlumDeep
      );
      storeBase.position.y = 0.1;
      store.add(storeBase);
      const awning = new THREE.Mesh(
        new THREE.BoxGeometry(3.9, 0.16, 1.05),
        matCoral
      );
      awning.position.set(0, 2.2, 1.25);
      store.add(awning);
      const storeWindow = new THREE.Mesh(
        new THREE.BoxGeometry(1.7, 1.05, 0.08),
        new THREE.MeshStandardMaterial({
          color: 0xffe0c8,
          emissive: 0xff9a60,
          emissiveIntensity: 0.45,
          roughness: 0.25,
        })
      );
      storeWindow.position.set(0.35, 1.35, 1.22);
      store.add(storeWindow);
      const door = new THREE.Mesh(
        new THREE.BoxGeometry(0.75, 1.35, 0.08),
        matDark
      );
      door.position.set(-1.15, 0.7, 1.22);
      store.add(door);
      const signTex = makeStoreSignTexture();
      const signBoard = new THREE.Mesh(
        new THREE.PlaneGeometry(3.2, 0.72),
        signTex
          ? new THREE.MeshBasicMaterial({ map: signTex })
          : matDark
      );
      signBoard.position.set(0.15, 2.78, 1.23);
      store.add(signBoard);
      if (signTex) cleanupFns.push(() => signTex.dispose());
      store.position.set(-7.5, 0, -0.9);
      scene.add(store);

      // Home — improved cottage with porch, framed windows, chimney
      const matWall = new THREE.MeshStandardMaterial({
        color: 0xf4f1ec,
        roughness: 0.62,
        metalness: 0.04,
      });
      const matWallShade = new THREE.MeshStandardMaterial({
        color: 0xe4ddd4,
        roughness: 0.68,
        metalness: 0.04,
      });
      const matRoof = new THREE.MeshStandardMaterial({
        color: 0xed9e59,
        roughness: 0.42,
        metalness: 0.12,
        emissive: 0xed9e59,
        emissiveIntensity: 0.04,
      });
      const matRoofTrim = new THREE.MeshStandardMaterial({
        color: 0xf7fff8,
        roughness: 0.4,
        metalness: 0.08,
      });
      const matBrick = new THREE.MeshStandardMaterial({
        color: 0x8a6a62,
        roughness: 0.78,
        metalness: 0.05,
      });
      const matFrame = new THREE.MeshStandardMaterial({
        color: 0x44174e,
        roughness: 0.48,
        metalness: 0.15,
      });
      const matWarmWin = new THREE.MeshBasicMaterial({
        color: 0xffc98a,
        toneMapped: false,
        polygonOffset: true,
        polygonOffsetFactor: -2,
        polygonOffsetUnits: -2,
      });
      const matWinMullion = new THREE.MeshBasicMaterial({
        color: 0xf7ecea,
      });
      const matPorch = new THREE.MeshStandardMaterial({
        color: 0xd9cfc2,
        roughness: 0.7,
        metalness: 0.04,
      });
      const matPath = new THREE.MeshStandardMaterial({
        color: 0xc4b8a8,
        roughness: 0.82,
        metalness: 0.03,
      });

      const home = new THREE.Group();
      const HOME_BODY_W = 2.75;
      const HOME_BODY_D = 2.15;
      const HOME_HALF_W = HOME_BODY_W / 2;
      const HOME_HALF_D = HOME_BODY_D / 2;

      // Foundation plinth
      const foundation = new THREE.Mesh(
        new THREE.BoxGeometry(3.05, 0.22, 2.55),
        matBrick
      );
      foundation.position.y = 0.11;
      home.add(foundation);

      // Main body + slight rear offset wing for depth
      const homeBody = new THREE.Mesh(
        new THREE.BoxGeometry(HOME_BODY_W, 1.85, HOME_BODY_D),
        matWall
      );
      homeBody.position.y = 1.15;
      home.add(homeBody);
      const homeWing = new THREE.Mesh(
        new THREE.BoxGeometry(1.15, 1.45, 0.95),
        matWallShade
      );
      homeWing.position.set(-0.95, 0.95, -0.85);
      home.add(homeWing);

      // Eave band under roof
      const eaveBand = new THREE.Mesh(
        new THREE.BoxGeometry(2.95, 0.1, 2.35),
        matFrame
      );
      eaveBand.position.y = 2.1;
      home.add(eaveBand);

      // Main pyramid roof with overhang
      const roof = new THREE.Mesh(new THREE.ConeGeometry(2.15, 1.15, 4), matRoof);
      roof.position.y = 2.72;
      roof.rotation.y = Math.PI / 4;
      home.add(roof);

      // Wing roof
      const wingRoof = new THREE.Mesh(
        new THREE.ConeGeometry(1.05, 0.7, 4),
        matRoof
      );
      wingRoof.position.set(-0.95, 1.95, -0.85);
      wingRoof.rotation.y = Math.PI / 4;
      home.add(wingRoof);

      // Ridge / hip trim lines on main roof
      const ridgeGeo = new THREE.BoxGeometry(0.06, 0.06, 2.35);
      for (let i = 0; i < 4; i++) {
        const ridge = new THREE.Mesh(ridgeGeo, matRoofTrim);
        ridge.position.y = 2.55;
        ridge.rotation.y = (Math.PI / 2) * i + Math.PI / 4;
        ridge.position.x = Math.sin((Math.PI / 2) * i) * 0.55;
        ridge.position.z = Math.cos((Math.PI / 2) * i) * 0.55;
        home.add(ridge);
      }
      const peakCap = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 8, 8),
        matRoofTrim
      );
      peakCap.position.y = 3.28;
      home.add(peakCap);

      // Chimney
      const chimney = new THREE.Mesh(
        new THREE.BoxGeometry(0.38, 0.85, 0.38),
        matBrick
      );
      chimney.position.set(0.85, 2.95, -0.35);
      home.add(chimney);
      const chimneyCap = new THREE.Mesh(
        new THREE.BoxGeometry(0.48, 0.08, 0.48),
        matFrame
      );
      chimneyCap.position.set(0.85, 3.4, -0.35);
      home.add(chimneyCap);
      const chimneyTop = new THREE.Mesh(
        new THREE.BoxGeometry(0.28, 0.12, 0.28),
        matDark
      );
      chimneyTop.position.set(0.85, 3.5, -0.35);
      home.add(chimneyTop);

      // Front porch platform + step
      const porch = new THREE.Mesh(
        new THREE.BoxGeometry(1.85, 0.14, 0.85),
        matPorch
      );
      porch.position.set(0, 0.28, 1.5);
      home.add(porch);
      const porchStep = new THREE.Mesh(
        new THREE.BoxGeometry(1.1, 0.12, 0.38),
        matSand
      );
      porchStep.position.set(0, 0.14, 1.95);
      home.add(porchStep);

      // Porch posts + beam
      const postGeo = new THREE.CylinderGeometry(0.05, 0.06, 1.55, 8);
      const postL = new THREE.Mesh(postGeo, matFrame);
      postL.position.set(-0.75, 1.05, 1.8);
      home.add(postL);
      const postR = new THREE.Mesh(postGeo, matFrame);
      postR.position.set(0.75, 1.05, 1.8);
      home.add(postR);
      const porchBeam = new THREE.Mesh(
        new THREE.BoxGeometry(1.7, 0.1, 0.12),
        matFrame
      );
      porchBeam.position.set(0, 1.82, 1.8);
      home.add(porchBeam);
      const porchRoof = new THREE.Mesh(
        new THREE.BoxGeometry(1.95, 0.08, 0.95),
        matRoof
      );
      porchRoof.position.set(0, 1.92, 1.55);
      porchRoof.rotation.x = -0.12;
      home.add(porchRoof);

      // Doormat (package drop visual)
      const doormat = new THREE.Mesh(
        new THREE.BoxGeometry(0.72, 0.035, 0.42),
        matCoral
      );
      doormat.position.set(0, 0.37, 1.62);
      home.add(doormat);

      // Door frame + hinged door
      const doorFrame = new THREE.Mesh(
        new THREE.BoxGeometry(0.78, 1.35, 0.1),
        matFrame
      );
      doorFrame.position.set(0, 1.0, HOME_HALF_D + 0.02);
      home.add(doorFrame);
      const homeDoorPivot = new THREE.Group();
      homeDoorPivot.position.set(-0.3, 0.98, HOME_HALF_D + 0.08);
      const homeDoor = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, 1.22, 0.07),
        matDark
      );
      homeDoor.position.set(0.3, 0, 0);
      homeDoorPivot.add(homeDoor);
      const doorPanel = new THREE.Mesh(
        new THREE.BoxGeometry(0.42, 0.45, 0.02),
        matPlumDeep
      );
      doorPanel.position.set(0.3, 0.22, 0.045);
      homeDoorPivot.add(doorPanel);
      const doorPanelLow = doorPanel.clone();
      doorPanelLow.position.y = -0.28;
      homeDoorPivot.add(doorPanelLow);
      const doorKnob = new THREE.Mesh(
        new THREE.SphereGeometry(0.045, 10, 10),
        matGold
      );
      doorKnob.position.set(0.5, 0, 0.06);
      homeDoorPivot.add(doorKnob);
      home.add(homeDoorPivot);

      // Windows recessed into walls (no floating panes / z-fight shimmer)
      const addWindow = (
        x: number,
        y: number,
        z: number,
        w: number,
        h: number,
        rotY = 0
      ) => {
        const group = new THREE.Group();
        group.position.set(x, y, z);
        group.rotation.y = rotY;

        // Carve a shallow recess so the pane sits inside the wall
        const recess = new THREE.Mesh(
          new THREE.BoxGeometry(w + 0.14, h + 0.14, 0.08),
          matFrame
        );
        recess.position.z = -0.04;
        group.add(recess);

        const frame = new THREE.Mesh(
          new THREE.BoxGeometry(w + 0.08, h + 0.08, 0.04),
          matFrame
        );
        frame.position.z = -0.01;
        group.add(frame);

        const glass = new THREE.Mesh(
          new THREE.BoxGeometry(w * 0.88, h * 0.88, 0.02),
          matWarmWin
        );
        glass.position.z = 0.005;
        glass.renderOrder = 1;
        group.add(glass);

        const mullionV = new THREE.Mesh(
          new THREE.BoxGeometry(0.03, h * 0.85, 0.02),
          matWinMullion
        );
        mullionV.position.z = 0.018;
        group.add(mullionV);
        const mullionH = new THREE.Mesh(
          new THREE.BoxGeometry(w * 0.85, 0.03, 0.02),
          matWinMullion
        );
        mullionH.position.z = 0.018;
        group.add(mullionH);

        const sill = new THREE.Mesh(
          new THREE.BoxGeometry(w + 0.14, 0.05, 0.08),
          matSand
        );
        sill.position.set(0, -(h / 2) - 0.04, 0.01);
        group.add(sill);
        home.add(group);
      };

      // Inset past the wall face so panes never float in front
      const winInset = 0.06;
      addWindow(0.78, 1.35, HOME_HALF_D - winInset, 0.58, 0.5);
      addWindow(-0.9, 1.38, HOME_HALF_D - winInset, 0.46, 0.4);
      addWindow(HOME_HALF_W - winInset, 1.35, 0.2, 0.52, 0.46, Math.PI / 2);
      addWindow(-(HOME_HALF_W - winInset), 1.3, 0.15, 0.48, 0.42, -Math.PI / 2);

      // Front walkway stays on the yard (does not cross the road)
      const path = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.04, 0.7),
        matPath
      );
      path.position.set(0, 0.04, 2.05);
      home.add(path);

      // Planter boxes flanking porch
      const planterGeo = new THREE.BoxGeometry(0.35, 0.28, 0.35);
      const planterL = new THREE.Mesh(planterGeo, matBrick);
      planterL.position.set(-1.15, 0.28, 1.55);
      home.add(planterL);
      const planterR = planterL.clone();
      planterR.position.x = 1.15;
      home.add(planterR);
      const bushGeo = new THREE.SphereGeometry(0.22, 10, 10);
      const bushL = new THREE.Mesh(bushGeo, matCoral);
      bushL.position.set(-1.15, 0.55, 1.55);
      home.add(bushL);
      const bushR = bushL.clone();
      bushR.position.x = 1.15;
      home.add(bushR);

      // Soft porch light
      const porchLight = new THREE.PointLight(0xffd4a8, 0.55, 4, 2);
      porchLight.position.set(0, 1.7, 1.7);
      home.add(porchLight);

      // Yard pad under the house so it clearly sits off the road
      const yard = new THREE.Mesh(
        new THREE.BoxGeometry(5.2, 0.05, 4.2),
        new THREE.MeshStandardMaterial({
          color: 0x4a3050,
          roughness: 0.94,
          metalness: 0.04,
        })
      );
      yard.position.set(0, 0.015, 0.35);
      home.add(yard);

      // House on the lawn, well behind the road (road ≈ z -0.35 → 1.85)
      home.position.set(7.8, 0, -4.35);
      scene.add(home);

      // Drop target: doormat at front door (local 0, 0.37, 1.62)
      const homeDropWorld = new THREE.Vector3(7.8, 0.42, -2.73);
      // Brand plum delivery van
      const matVan = new THREE.MeshStandardMaterial({
        color: 0x662249,
        roughness: 0.48,
        metalness: 0.18,
      });
      const matVanDeep = new THREE.MeshStandardMaterial({
        color: 0x1b1931,
        roughness: 0.45,
        metalness: 0.22,
      });
      const matTrim = new THREE.MeshStandardMaterial({
        color: 0x2a2a2e,
        roughness: 0.45,
        metalness: 0.25,
      });
      const matChrome = new THREE.MeshStandardMaterial({
        color: 0xd8dde6,
        roughness: 0.22,
        metalness: 0.85,
      });
      const matSkin = new THREE.MeshStandardMaterial({
        color: 0xf0c4a8,
        roughness: 0.7,
        metalness: 0.05,
      });
      const matShirt = new THREE.MeshStandardMaterial({
        color: 0xed9e59,
        roughness: 0.55,
        metalness: 0.08,
      });
      const matTail = new THREE.MeshStandardMaterial({
        color: 0x662249,
        roughness: 0.4,
        metalness: 0.2,
        emissive: 0x662249,
        emissiveIntensity: 0.25,
      });

      const truck = new THREE.Group();

      // Lower body / rocker (dark trim)
      const rocker = new THREE.Mesh(
        new THREE.BoxGeometry(3.35, 0.38, 1.35),
        matTrim
      );
      rocker.position.set(0.05, 0.42, 0);
      truck.add(rocker);

      // Coral accent stripe
      const accentStripe = new THREE.Mesh(
        new THREE.BoxGeometry(3.1, 0.1, 1.34),
        matCoral
      );
      accentStripe.position.set(0.05, 0.62, 0);
      truck.add(accentStripe);

      // Main yellow body — cabin + cargo shell with open rear
      const cabinBody = new THREE.Mesh(
        new THREE.BoxGeometry(1.35, 1.35, 1.32),
        matVan
      );
      cabinBody.position.set(0.95, 1.15, 0);
      truck.add(cabinBody);

      // Cargo shell (open at back)
      const cargoRoof = new THREE.Mesh(
        new THREE.BoxGeometry(1.85, 0.1, 1.28),
        matVan
      );
      cargoRoof.position.set(-0.55, 1.8, 0);
      truck.add(cargoRoof);
      const cargoSideL = new THREE.Mesh(
        new THREE.BoxGeometry(1.85, 1.25, 0.1),
        matVan
      );
      cargoSideL.position.set(-0.55, 1.15, 0.61);
      truck.add(cargoSideL);
      const cargoSideR = cargoSideL.clone();
      cargoSideR.position.z = -0.61;
      truck.add(cargoSideR);
      const cargoFrontWall = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 1.25, 1.2),
        matVanDeep
      );
      cargoFrontWall.position.set(0.35, 1.15, 0);
      truck.add(cargoFrontWall);

      // Sloped nose / hood
      const nose = new THREE.Mesh(
        new THREE.BoxGeometry(0.55, 0.55, 1.28),
        matVanDeep
      );
      nose.position.set(1.72, 0.78, 0);
      truck.add(nose);

      // Cabin roof bulge
      const cabinTop = new THREE.Mesh(
        new THREE.BoxGeometry(1.05, 0.35, 1.28),
        matVan
      );
      cabinTop.position.set(1.05, 1.95, 0);
      truck.add(cabinTop);

      // Windshield
      const windshield = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.72, 1.08),
        matGlass
      );
      windshield.position.set(1.58, 1.45, 0);
      truck.add(windshield);

      // Side window (cabin)
      const sideWin = new THREE.Mesh(
        new THREE.BoxGeometry(0.55, 0.48, 0.06),
        matGlass
      );
      sideWin.position.set(1.05, 1.45, 0.66);
      truck.add(sideWin);
      const sideWinR = sideWin.clone();
      sideWinR.position.z = -0.66;
      truck.add(sideWinR);

      // Cartoon driver (visible in cabin)
      const driver = new THREE.Group();
      driver.position.set(1.15, 1.15, 0.22);
      const torso = new THREE.Mesh(
        new THREE.BoxGeometry(0.28, 0.35, 0.22),
        matShirt
      );
      torso.position.y = 0.22;
      driver.add(torso);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), matSkin);
      head.position.y = 0.5;
      driver.add(head);
      const cap = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.16, 0.08, 12),
        matShirt
      );
      cap.position.set(0, 0.6, 0);
      driver.add(cap);
      const brim = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.03, 0.12),
        matShirt
      );
      brim.position.set(0.08, 0.56, 0);
      driver.add(brim);
      const wheelSteer = new THREE.Mesh(
        new THREE.TorusGeometry(0.12, 0.025, 8, 16),
        matTrim
      );
      wheelSteer.rotation.y = Math.PI / 2;
      wheelSteer.position.set(0.22, 0.28, 0);
      driver.add(wheelSteer);
      truck.add(driver);

      // Headlights
      const headL = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 12, 12),
        new THREE.MeshStandardMaterial({
          color: 0xfff8e8,
          emissive: 0xffe8a8,
          emissiveIntensity: 1.1,
          roughness: 0.2,
        })
      );
      headL.scale.set(0.55, 1, 1);
      headL.position.set(2.02, 0.78, 0.42);
      const headR = headL.clone();
      headR.position.z = -0.42;
      truck.add(headL, headR);

      // Rear taillight (vertical)
      const tailL = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.45, 0.14),
        matTail
      );
      tailL.position.set(-1.62, 1.15, 0.55);
      const tailR = tailL.clone();
      tailR.position.z = -0.55;
      truck.add(tailL, tailR);

      // "DELIVERY" side label
      const deliveryTex = makeDeliverySideTexture();
      if (deliveryTex) {
        const label = new THREE.Mesh(
          new THREE.PlaneGeometry(1.6, 0.42),
          new THREE.MeshBasicMaterial({
            map: deliveryTex,
            transparent: true,
          })
        );
        label.position.set(-0.25, 1.25, 0.67);
        truck.add(label);
        const labelR = label.clone();
        labelR.position.z = -0.67;
        labelR.rotation.y = Math.PI;
        truck.add(labelR);
        cleanupFns.push(() => deliveryTex.dispose());
      }

      // Open cargo interior (rear hollow)
      const cargoFloor = new THREE.Mesh(
        new THREE.BoxGeometry(1.7, 0.06, 1.15),
        matVanDeep
      );
      cargoFloor.position.set(-0.45, 0.55, 0);
      truck.add(cargoFloor);

      // Twin rear barn doors (hinge left/right) — package exits here
      const rearDoorL = new THREE.Group();
      rearDoorL.position.set(-1.6, 1.15, 0.58);
      const rearDoorLMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 1.2, 0.58),
        matVan
      );
      rearDoorLMesh.position.set(0, 0, -0.29);
      rearDoorL.add(rearDoorLMesh);
      const handleL = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 0.18, 0.08),
        matChrome
      );
      handleL.position.set(-0.05, 0, -0.08);
      rearDoorL.add(handleL);
      truck.add(rearDoorL);

      const rearDoorR = new THREE.Group();
      rearDoorR.position.set(-1.6, 1.15, -0.58);
      const rearDoorRMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 1.2, 0.58),
        matVan
      );
      rearDoorRMesh.position.set(0, 0, 0.29);
      rearDoorR.add(rearDoorRMesh);
      const handleR = handleL.clone();
      handleR.position.set(-0.05, 0, 0.08);
      rearDoorR.add(handleR);
      truck.add(rearDoorR);

      // Exit point between open rear doors (local to truck)
      const doorExitLocal = new THREE.Vector3(-1.85, 0.95, 0);
      const cargoHoldLocal = new THREE.Vector3(-0.35, 1.0, 0);
      const tmpWorld = new THREE.Vector3();
      const tmpCargo = new THREE.Vector3();
      const tmpStart = new THREE.Vector3();
      const tmpEnd = homeDropWorld.clone();
      const tmpMid = new THREE.Vector3();
      const tmpA = new THREE.Vector3();
      const tmpB = new THREE.Vector3();
      const tmpP = new THREE.Vector3();

      const wheels: THREE.Group[] = [];
      const wheelPositions: Array<[number, number, number]> = [
        [1.2, 0.34, 0.72],
        [1.2, 0.34, -0.72],
        [-0.95, 0.34, 0.72],
        [-0.95, 0.34, -0.72],
      ];
      for (const [wx, wy, wz] of wheelPositions) {
        const wheelUnit = new THREE.Group();
        wheelUnit.position.set(wx, wy, wz);
        const tire = new THREE.Mesh(
          new THREE.CylinderGeometry(0.34, 0.34, 0.28, 24),
          matTrim
        );
        tire.rotation.x = Math.PI / 2;
        wheelUnit.add(tire);
        // Chrome star rim
        const hub = new THREE.Mesh(
          new THREE.CylinderGeometry(0.12, 0.12, 0.3, 16),
          matChrome
        );
        hub.rotation.x = Math.PI / 2;
        wheelUnit.add(hub);
        for (let s = 0; s < 5; s++) {
          const spoke = new THREE.Mesh(
            new THREE.BoxGeometry(0.22, 0.05, 0.04),
            matChrome
          );
          spoke.position.z = 0.02;
          spoke.rotation.z = (s / 5) * Math.PI * 2;
          wheelUnit.add(spoke);
        }
        truck.add(wheelUnit);
        wheels.push(wheelUnit);
      }
      scene.add(truck);

      const makePackage = (scale = 1) => {
        const g = new THREE.Group();
        const box = new THREE.Mesh(
          new THREE.BoxGeometry(0.55 * scale, 0.4 * scale, 0.45 * scale),
          matSand
        );
        box.position.y = 0.2 * scale;
        g.add(box);
        const tape = new THREE.Mesh(
          new THREE.BoxGeometry(0.58 * scale, 0.07 * scale, 0.47 * scale),
          matCoral
        );
        tape.position.y = 0.22 * scale;
        g.add(tape);
        const label = new THREE.Mesh(
          new THREE.BoxGeometry(0.22 * scale, 0.16 * scale, 0.02),
          matCream
        );
        label.position.set(0, 0.22 * scale, 0.24 * scale);
        g.add(label);
        return g;
      };

      const orderPkg = makePackage(1);
      const waitingPkg = makePackage(1.05);
      waitingPkg.position.set(-6.4, 0.35, 0.7);
      scene.add(orderPkg, waitingPkg);

      const pathAt = (t: number) => {
        // Extended past the house so the van parks after the home
        const x = THREE.MathUtils.lerp(-5.6, 10.2, t);
        const z = 0.75 + Math.sin(t * Math.PI) * -0.28;
        return new THREE.Vector3(x, 0, z);
      };

      const loopStart = performance.now() / 1000;
      const LOOP = 12;
      let prevX = 0;
      let scrollParallax = 0;
      const baseCam = { x: 1.8, y: 7.6, z: 15.5 };

      const onScroll = () => {
        const hero = mount.closest("section");
        if (!hero) return;
        const rect = hero.getBoundingClientRect();
        const progress = THREE.MathUtils.clamp(
          -rect.top / Math.max(rect.height, 1),
          -0.2,
          1.2
        );
        scrollParallax = progress;
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      cleanupFns.push(() => window.removeEventListener("scroll", onScroll));
      onScroll();

      const renderFrame = (elapsed: number) => {
        if (!renderer) return;
        const t = (elapsed % LOOP) / LOOP;

        let truckT = 0;
        let packageInTruck = false;
        let dropping = false;
        waitingPkg.visible = t < 0.32;

        if (t < 0.24) {
          truckT = THREE.MathUtils.lerp(0.58, 0.07, t / 0.24);
        } else if (t < 0.34) {
          truckT = 0.07;
          packageInTruck = true;
          waitingPkg.visible = t < 0.29;
        } else if (t < 0.76) {
          truckT = THREE.MathUtils.lerp(0.07, 0.88, (t - 0.34) / 0.42);
          packageInTruck = true;
          waitingPkg.visible = false;
        } else {
          // Park just past the house before dropping
          truckT = 0.88;
          dropping = true;
          waitingPkg.visible = false;
        }

        const ease = truckT * truckT * (3 - 2 * truckT);
        const pos = pathAt(ease);
        truck.position.set(pos.x, 0, pos.z);

        const facingStore = t < 0.34;
        const ahead = pathAt(
          THREE.MathUtils.clamp(ease + (facingStore ? -0.05 : 0.05), 0, 1)
        );
        const dx = ahead.x - pos.x;
        const dz = ahead.z - pos.z;
        truck.rotation.set(0, Math.atan2(-dz, dx), 0);

        const speed = Math.abs(pos.x - prevX) * 40;
        prevX = pos.x;
        for (const wheel of wheels) {
          wheel.rotation.z += speed * (facingStore ? 1 : -1);
        }

        // Drop-off: open rear doors → package flies to home doorstep
        if (dropping) {
          const d = (t - 0.76) / 0.24;

          // Twin barn doors swing open (Y axis)
          const doorOpen = THREE.MathUtils.smoothstep(
            THREE.MathUtils.clamp(d / 0.22, 0, 1),
            0,
            1
          );
          rearDoorL.rotation.y = -doorOpen * (Math.PI / 2.1);
          rearDoorR.rotation.y = doorOpen * (Math.PI / 2.1);

          // Home door opens slightly to receive the package
          const homeOpen = THREE.MathUtils.smoothstep(
            THREE.MathUtils.clamp((d - 0.35) / 0.35, 0, 1),
            0,
            1
          );
          homeDoorPivot.rotation.y = -homeOpen * 0.85;

          truck.updateMatrixWorld(true);
          tmpCargo.copy(cargoHoldLocal);
          truck.localToWorld(tmpCargo);
          tmpWorld.copy(doorExitLocal);
          truck.localToWorld(tmpWorld);
          tmpEnd.copy(homeDropWorld);

          orderPkg.visible = true;
          if (d < 0.22) {
            // Hold in cargo while doors open
            orderPkg.position.copy(tmpCargo);
            orderPkg.rotation.set(0, truck.rotation.y, 0);
          } else if (d < 0.36) {
            // Slide out rear doors
            const u = THREE.MathUtils.smoothstep((d - 0.22) / 0.14, 0, 1);
            orderPkg.position.lerpVectors(tmpCargo, tmpWorld, u);
            orderPkg.rotation.set(0, truck.rotation.y, u * 0.2);
          } else if (d < 0.88) {
            // Arc from van rear → home door / doormat
            const u = (d - 0.36) / 0.52;
            const fall = u * u;
            tmpStart.copy(tmpWorld);
            tmpMid.set(
              THREE.MathUtils.lerp(tmpStart.x, tmpEnd.x, 0.5),
              Math.max(tmpStart.y, tmpEnd.y) + 1.15,
              THREE.MathUtils.lerp(tmpStart.z, tmpEnd.z, 0.45)
            );
            tmpA.lerpVectors(tmpStart, tmpMid, fall);
            tmpB.lerpVectors(tmpMid, tmpEnd, fall);
            tmpP.lerpVectors(tmpA, tmpB, fall);
            tmpP.y -= fall * fall * 0.35;
            tmpP.y = Math.max(tmpP.y, tmpEnd.y);
            orderPkg.position.copy(tmpP);
            orderPkg.rotation.set(
              fall * 0.7,
              truck.rotation.y + fall * Math.PI * 0.6,
              fall * 0.4
            );
          } else {
            // Settle on doormat at home door
            const settle = (d - 0.88) / 0.12;
            const bounce =
              Math.abs(Math.sin(settle * Math.PI * 1.5)) * (1 - settle) * 0.1;
            orderPkg.position.set(
              homeDropWorld.x,
              homeDropWorld.y + bounce,
              homeDropWorld.z
            );
            orderPkg.rotation.set(0, 0.35, 0);
            // Doors begin to close after drop
            const close = THREE.MathUtils.clamp(settle * 0.4, 0, 0.35);
            rearDoorL.rotation.y = -((Math.PI / 2.1) * (1 - close));
            rearDoorR.rotation.y = (Math.PI / 2.1) * (1 - close);
          }
        } else if (packageInTruck) {
          rearDoorL.rotation.y = 0;
          rearDoorR.rotation.y = 0;
          homeDoorPivot.rotation.y = 0;
          orderPkg.visible = true;
          orderPkg.position.set(
            truck.position.x + (facingStore ? 0.15 : -0.35),
            1.0,
            truck.position.z
          );
          orderPkg.rotation.set(0, truck.rotation.y, 0);
        } else {
          rearDoorL.rotation.y = 0;
          rearDoorR.rotation.y = 0;
          homeDoorPivot.rotation.y = 0;
          orderPkg.visible = false;
        }

        store.position.y = Math.sin(elapsed * 0.65) * 0.02;
        // Keep home planted (no bob) so windows stay flush with the walls
        home.position.y = 0;
        storeLamp.intensity = 1.25 + Math.sin(elapsed * 2.2) * 0.2;
        homeLamp.intensity = 1.0 + Math.sin(elapsed * 1.8 + 0.5) * 0.15;

        // Scroll parallax on camera
        camera.position.x = baseCam.x + scrollParallax * 1.4;
        camera.position.y = baseCam.y - scrollParallax * 1.8;
        camera.position.z = baseCam.z - scrollParallax * 2.2;
        camera.lookAt(1.2 + scrollParallax * 0.4, 1.4 - scrollParallax * 0.3, 0);

        renderer.render(scene, camera);
      };

      const onResize = () => {
        if (!renderer || !mount) return;
        const w = mount.clientWidth;
        const h = mount.clientHeight;
        if (w < 2 || h < 2) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
      };
      const ro = new ResizeObserver(onResize);
      ro.observe(mount);
      cleanupFns.push(() => ro.disconnect());

      const io = new IntersectionObserver(
        ([entry]) => {
          visible = entry?.isIntersecting ?? true;
        },
        { threshold: 0.05 }
      );
      io.observe(mount);
      cleanupFns.push(() => io.disconnect());

      if (reduceMotion) {
        renderFrame(4.5);
        return;
      }

      const animate = () => {
        if (!alive) return;
        frameId = requestAnimationFrame(animate);
        if (!visible) return;
        renderFrame(performance.now() / 1000 - loopStart);
      };
      animate();

      cleanupFns.push(() => {
        cancelAnimationFrame(frameId);
        scene.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            obj.geometry.dispose();
            const mat = obj.material;
            if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
            else mat.dispose();
          }
        });
        renderer?.dispose();
        if (renderer?.domElement.parentElement === mount) {
          mount.removeChild(renderer.domElement);
        }
        renderer = null;
      });
    };

    startTimer = window.setTimeout(boot, 100);

    return () => {
      alive = false;
      window.clearTimeout(startTimer);
      cleanupFns.forEach((fn) => fn());
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={styles.stage}
      role="img"
      aria-label="Animated 3D scene: a Ziyah delivery truck picks up packaging from the store and drops it at a customer home"
    />
  );
}
