# Review package Task 3
**Base:** 7a94630ea0df05a22c4c91206274ab9188a22534
**Head:** WORKING TREE

## Diff stat
`
 src/app/page.module.css | 274 +++++++++++++++++++-----------------------------
 src/app/page.tsx        |  59 ++---------
 2 files changed, 116 insertions(+), 217 deletions(-)
`

## Full diff
`diff
diff --git a/src/app/page.module.css b/src/app/page.module.css
index d6b7ecf..8f70556 100644
--- a/src/app/page.module.css
+++ b/src/app/page.module.css
@@ -15,49 +15,51 @@
   padding: 80px 0;
 }
 
 .sectionAlt {
   background: var(--primary-xlight);
 }
 
 .sectionHeader {
-  text-align: center;
-  margin-bottom: 56px;
+  text-align: left;
+  margin-bottom: 40px;
+  max-width: 560px;
 }
 
 .sectionHeader h2 {
-  font-size: clamp(26px, 4vw, 38px);
-  font-weight: 800;
+  font-size: clamp(24px, 3.5vw, 34px);
+  font-weight: 700;
   color: var(--primary-dark);
-  margin-bottom: 12px;
-  letter-spacing: -0.5px;
+  margin-bottom: 10px;
+  letter-spacing: -0.03em;
 }
 
 .sectionHeader p {
-  font-size: 17px;
+  font-size: 16px;
   color: var(--gray-600);
-  max-width: 560px;
-  margin: 0 auto;
+  max-width: 520px;
+  margin: 0;
+  line-height: 1.6;
 }
 
 /* ========================================
    HERO
 ======================================== */
 .hero {
   position: relative;
-  min-height: clamp(560px, 88vh, 820px);
+  min-height: clamp(520px, 82vh, 760px);
   display: flex;
   align-items: center;
   background:
-    radial-gradient(ellipse 80% 55% at 78% 40%, rgba(237, 158, 89, 0.22), transparent 58%),
-    radial-gradient(ellipse 45% 40% at 12% 70%, rgba(163, 64, 84, 0.16), transparent 55%),
-    linear-gradient(148deg, #1b1931 0%, #44174e 28%, #662249 52%, #a34054 78%, #ed9e59 100%);
+    radial-gradient(ellipse 70% 50% at 85% 35%, rgba(237, 158, 89, 0.28), transparent 55%),
+    radial-gradient(ellipse 50% 45% at 10% 80%, rgba(163, 64, 84, 0.35), transparent 60%),
+    linear-gradient(160deg, #1b1931 0%, #2f1f34 38%, #662249 100%);
   overflow: hidden;
-  padding: 96px 0 64px;
+  padding: 96px 0 72px;
 }
 
 .heroScene {
   position: absolute;
   top: 0;
   right: 0;
   bottom: 0;
   left: 28%;
@@ -80,31 +82,33 @@
 
 .heroScrim {
   position: absolute;
   inset: 0;
   z-index: 1;
   pointer-events: none;
   background: linear-gradient(
     to right,
-    rgba(47, 31, 52, 0.97) 0%,
-    rgba(47, 31, 52, 0.92) 26%,
-    rgba(47, 31, 52, 0.55) 48%,
-    rgba(47, 31, 52, 0.18) 68%,
-    rgba(47, 31, 52, 0.04) 84%,
+    rgba(47, 31, 52, 0.94) 0%,
+    rgba(47, 31, 52, 0.88) 26%,
+    rgba(47, 31, 52, 0.48) 48%,
+    rgba(47, 31, 52, 0.14) 68%,
+    rgba(47, 31, 52, 0.03) 84%,
     transparent 100%
   );
 }
 
 .heroOverlay {
   position: absolute;
   inset: 0;
   z-index: 1;
-  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
   pointer-events: none;
+  background:
+    radial-gradient(ellipse 90% 70% at 50% 100%, rgba(27, 25, 49, 0.35), transparent 55%),
+    linear-gradient(180deg, rgba(27, 25, 49, 0.12) 0%, transparent 40%);
 }
 
 .heroInner {
   position: relative;
   z-index: 2;
   width: min(1120px, calc(100% - 48px));
   margin: 0 auto;
 }
@@ -115,105 +119,59 @@
 }
 
 .heroBrand {
   margin: 0 0 14px;
   animation: heroRise 0.65s ease both;
   filter: drop-shadow(0 8px 28px rgba(0, 0, 0, 0.28));
 }
 
-.heroBadge {
-  display: inline-flex;
-  align-items: center;
-  gap: 6px;
-  background: rgba(255, 255, 255, 0.1);
-  border: 1px solid rgba(255, 255, 255, 0.26);
-  color: rgba(255, 255, 255, 0.92);
-  font-size: 11px;
-  font-weight: 600;
-  letter-spacing: 0.08em;
-  text-transform: uppercase;
-  padding: 5px 12px;
-  border-radius: 100px;
-  margin-bottom: 16px;
-  animation: heroRise 0.65s ease both 0.06s;
-}
-
 .heroTitle {
-  font-size: clamp(28px, 4.2vw, 46px);
-  font-weight: 800;
+  font-size: clamp(32px, 5vw, 52px);
+  font-weight: 700;
   color: #fff;
-  line-height: 1.12;
+  line-height: 1.08;
   letter-spacing: -0.03em;
-  margin-bottom: 14px;
-  animation: heroRise 0.7s ease both 0.12s;
-}
-
-.heroTitle span {
-  display: block;
-  color: var(--accent);
-  margin-top: 4px;
+  margin-bottom: 16px;
+  animation: heroRise 0.7s ease both 0.1s;
 }
 
 .heroDesc {
-  font-size: clamp(14px, 1.55vw, 17px);
-  color: rgba(255, 255, 255, 0.9);
-  max-width: 480px;
-  line-height: 1.65;
-  margin-bottom: 24px;
-  animation: heroRise 0.7s ease both 0.18s;
+  font-size: clamp(15px, 1.6vw, 18px);
+  color: rgba(255, 255, 255, 0.88);
+  max-width: 440px;
+  line-height: 1.6;
+  margin-bottom: 28px;
+  animation: heroRise 0.7s ease both 0.16s;
 }
 
 .heroActions {
   display: flex;
-  gap: 12px;
-  flex-wrap: wrap;
-  animation: heroRise 0.7s ease both 0.24s;
-}
-
-.heroSteps {
-  list-style: none;
-  display: flex;
+  align-items: center;
+  gap: 20px;
   flex-wrap: wrap;
-  gap: 8px;
-  margin: 22px 0 0;
-  padding: 0;
-  animation: heroRise 0.7s ease both 0.3s;
-}
-
-.heroSteps li {
-  font-size: 12px;
-  font-weight: 700;
-  letter-spacing: 0.04em;
-  text-transform: uppercase;
-  color: rgba(255, 255, 255, 0.88);
-  background: rgba(255, 255, 255, 0.08);
-  border: 1px solid rgba(255, 255, 255, 0.16);
-  padding: 6px 12px;
-  border-radius: 999px;
+  animation: heroRise 0.7s ease both 0.22s;
 }
 
 @keyframes heroRise {
   from {
     opacity: 0;
     transform: translateY(16px);
   }
   to {
     opacity: 1;
     transform: translateY(0);
   }
 }
 
 @media (prefers-reduced-motion: reduce) {
   .heroBrand,
-  .heroBadge,
   .heroTitle,
   .heroDesc,
-  .heroActions,
-  .heroSteps {
+  .heroActions {
     animation: none;
   }
 }
 
 /* ========================================
    BUTTONS
 ======================================== */
 .btnPrimary {
@@ -230,16 +188,33 @@
 }
 
 .btnPrimary:hover {
   background: var(--accent-dark);
   transform: translateY(-2px);
   box-shadow: 0 6px 20px rgba(163, 64, 84, 0.45);
 }
 
+.btnText {
+  display: inline-flex;
+  align-items: center;
+  color: rgba(255, 255, 255, 0.92);
+  font-weight: 600;
+  font-size: 15px;
+  text-decoration: none;
+  border-bottom: 1px solid rgba(255, 255, 255, 0.45);
+  padding-bottom: 2px;
+  transition: color var(--transition), border-color var(--transition);
+}
+
+.btnText:hover {
+  color: #fff;
+  border-color: #fff;
+}
+
 .btnOutline {
   display: inline-block;
   background: transparent;
   color: #fff;
   padding: 14px 30px;
   border-radius: 8px;
   font-weight: 600;
   font-size: 15px;
@@ -287,144 +262,113 @@
   background: rgba(255, 255, 255, 0.1);
 }
 
 /* ========================================
    CATEGORY GRID
 ======================================== */
 .categoryGrid {
   display: grid;
-  grid-template-columns: repeat(3, 1fr);
-  gap: 20px;
+  grid-template-columns: repeat(2, minmax(0, 1fr));
+  gap: 0;
+  border-top: 1px solid rgba(27, 25, 49, 0.1);
 }
 
 .categoryCard {
   display: flex;
   flex-direction: column;
-  position: relative;
-  background: linear-gradient(180deg, #fff 0%, var(--primary-xlight) 160%);
-  border: 1px solid rgba(27, 25, 49, 0.1);
-  border-radius: 18px;
-  padding: 28px 26px 24px;
+  padding: 28px 8px 28px 0;
+  margin-right: 32px;
   text-decoration: none;
   color: inherit;
-  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
-  overflow: hidden;
+  background: transparent;
+  border: none;
+  border-bottom: 1px solid rgba(27, 25, 49, 0.1);
+  border-radius: 0;
+  box-shadow: none;
+  transition: transform 0.25s ease;
 }
 
 .categoryCard::before {
-  content: "";
-  position: absolute;
-  left: 0;
-  top: 0;
-  bottom: 0;
-  width: 3px;
-  background: linear-gradient(180deg, var(--accent), var(--primary));
-  opacity: 0;
-  transition: opacity 0.25s ease;
+  display: none;
 }
 
 .categoryCard:hover {
-  transform: translateY(-3px);
-  border-color: rgba(27, 25, 49, 0.22);
-  box-shadow: 0 16px 40px rgba(27, 25, 49, 0.1);
-}
-
-.categoryCard:hover::before {
-  opacity: 1;
-}
-
-.categoryIcon {
-  display: flex;
-  align-items: center;
-  justify-content: center;
-  width: 52px;
-  height: 52px;
-  margin-bottom: 18px;
-  border-radius: 14px;
-  background: #fff;
-  color: var(--primary-dark);
-  border: 1px solid rgba(27, 25, 49, 0.08);
-  box-shadow: 0 4px 14px rgba(27, 25, 49, 0.06);
+  transform: translateX(4px);
+  box-shadow: none;
+  border-color: rgba(27, 25, 49, 0.1);
 }
 
 .categoryCard h3 {
   font-size: 18px;
-  font-weight: 800;
+  font-weight: 700;
   color: var(--primary-dark);
   margin-bottom: 8px;
-  letter-spacing: -0.02em;
 }
 
 .categoryCard p {
   font-size: 14px;
   color: var(--gray-600);
-  line-height: 1.65;
+  line-height: 1.6;
   flex: 1;
 }
 
 .categoryArrow {
   display: inline-flex;
   align-items: center;
   gap: 6px;
-  margin-top: 18px;
+  margin-top: 14px;
   font-size: 13px;
   font-weight: 700;
   color: var(--accent);
   transition: gap 0.2s ease;
 }
 
 .categoryCard:hover .categoryArrow {
   gap: 10px;
 }
 
 /* ========================================
    WHY GRID
 ======================================== */
 .whyGrid {
   display: grid;
-  grid-template-columns: repeat(4, 1fr);
-  gap: 18px;
+  grid-template-columns: repeat(2, minmax(0, 1fr));
+  gap: 36px 48px;
 }
 
 .whyCard {
   background: transparent;
-  border-radius: 0;
-  padding: 8px 12px 4px;
-  text-align: left;
-  box-shadow: none;
   border: none;
-  border-top: 2px solid var(--accent);
+  border-top: none;
+  padding: 0;
+  box-shadow: none;
 }
 
-.whyIcon {
-  display: inline-flex;
-  align-items: center;
-  justify-content: center;
-  width: 44px;
-  height: 44px;
-  margin-bottom: 16px;
-  border-radius: 50%;
-  background: #fff;
-  color: var(--primary-dark);
-  border: 1px solid rgba(27, 25, 49, 0.1);
+.whyIndex {
+  display: block;
+  font-size: 12px;
+  font-weight: 700;
+  letter-spacing: 0.12em;
+  color: var(--accent);
+  margin-bottom: 10px;
 }
 
 .whyCard h3 {
   font-size: 17px;
-  font-weight: 800;
+  font-weight: 700;
   color: var(--primary-dark);
-  margin-bottom: 10px;
-  letter-spacing: -0.02em;
+  margin-bottom: 8px;
 }
 
 .whyCard p {
   font-size: 14px;
   color: var(--gray-600);
   line-height: 1.65;
+  max-width: 360px;
 }
 
 /* ========================================
    CTA BANNER
 ======================================== */
 .ctaBanner {
   background: linear-gradient(135deg, var(--primary-dark), var(--primary));
   padding: 80px 0;
@@ -451,18 +395,18 @@
   justify-content: center;
   flex-wrap: wrap;
 }
 
 /* ========================================
    INFO STRIP
 ======================================== */
 .infoStrip {
-  background: var(--gray-50);
-  padding: 60px 0;
+  background: #fff;
+  padding: 48px 0;
   border-top: 1px solid var(--gray-100);
 }
 
 .infoGrid {
   display: grid;
   grid-template-columns: repeat(2, 1fr);
   gap: 40px;
 }
@@ -472,22 +416,23 @@
   gap: 16px;
   align-items: flex-start;
 }
 
 .infoIcon {
   display: flex;
   align-items: center;
   justify-content: center;
-  width: 44px;
-  height: 44px;
+  width: 36px;
+  height: 36px;
   flex-shrink: 0;
-  border-radius: 10px;
-  background: var(--primary-xlight);
-  color: var(--primary-dark);
+  border-radius: 0;
+  background: transparent;
+  color: var(--accent);
+  padding: 0;
 }
 
 .infoItem strong {
   display: block;
   font-size: 14px;
   font-weight: 700;
   color: var(--primary-dark);
   margin-bottom: 4px;
@@ -567,22 +512,16 @@
 .formGroup textarea:focus {
   outline: none;
   border-color: var(--primary);
 }
 
 /* ========================================
    RESPONSIVE
 ======================================== */
-@media (max-width: 1024px) {
-  .whyGrid {
-    grid-template-columns: repeat(2, 1fr);
-  }
-}
-
 @media (max-width: 768px) {
   .hero {
     min-height: auto;
     padding: 92px 0 48px;
   }
 
   .heroInner {
     width: min(100% - 40px, 1120px);
@@ -615,40 +554,37 @@
       transparent 0%,
       rgba(0, 0, 0, 0.45) 28%,
       #000 55%,
       #000 100%
     );
   }
 
   .categoryGrid {
-    grid-template-columns: repeat(2, 1fr);
+    grid-template-columns: 1fr;
+  }
+
+  .whyGrid {
+    grid-template-columns: 1fr;
   }
 
   .infoGrid {
     grid-template-columns: 1fr;
     gap: 24px;
   }
 
   .contactGrid {
     grid-template-columns: 1fr;
     gap: 40px;
   }
 }
 
 @media (max-width: 540px) {
-  .categoryGrid {
-    grid-template-columns: 1fr;
-  }
-
-  .whyGrid {
-    grid-template-columns: 1fr;
-  }
-
   .heroActions {
     flex-direction: column;
+    align-items: flex-start;
   }
 
-  .btnPrimary,
-  .btnOutline {
+  .btnPrimary {
     text-align: center;
+    width: 100%;
   }
 }
\ No newline at end of file
diff --git a/src/app/page.tsx b/src/app/page.tsx
index 8458453..e227091 100644
--- a/src/app/page.tsx
+++ b/src/app/page.tsx
@@ -1,31 +1,21 @@
 import type { Metadata } from "next";
 import styles from "./page.module.css";
 import Link from "next/link";
-import PromoMarquee from "./components/PromoMarquee";
-import PromoBannerSlider from "./components/PromoBannerSlider";
 import FeedbackSection from "./components/FeedbackSection";
 import HeroFulfillmentScene from "./components/HeroFulfillmentScene";
 import HomeScrollEffects from "./components/HomeScrollEffects";
 import BrandWordmark from "./components/BrandWordmark";
 import {
   IconArrowRight,
-  IconBento,
-  IconCheck,
   IconClock,
-  IconFactory,
-  IconList,
   IconMail,
   IconMapPin,
-  IconPackage,
   IconPhone,
-  IconSushi,
-  IconTray,
-  IconTruck,
 } from "./components/Icons";
 import { SITE, SITE_SITELINKS, getSiteOrigin } from "@/data/site";
 
 export const metadata: Metadata = {
   title: {
     absolute: `${SITE.name} | Buy Food Packaging Philippines Nationwide`,
   },
   description:
@@ -49,65 +39,56 @@ export const metadata: Metadata = {
     images: ["/logo-512.png"],
   },
 };
 
 const categories = [
   {
     name: "Hard Bento Clear",
     desc: "Clear hard bento boxes with lids â€” 2 to 5 divisions, 1000ml.",
-    Icon: IconBento,
     href: "/products/hard-bento-clear",
   },
   {
     name: "Bento Boxes",
     desc: "Red outside, black inside bento boxes with clear lids for everyday takeout.",
-    Icon: IconPackage,
     href: "/products/bento-boxes",
   },
   {
     name: "Hard Bento Black",
     desc: "Black hard bento boxes with lids â€” premium meal presentation.",
-    Icon: IconBento,
     href: "/products/hard-bento-black",
   },
   {
     name: "Round Sushi Trays",
     desc: "Round black sushi trays with gold pattern and lids â€” multiple sizes.",
-    Icon: IconSushi,
     href: "/products/round-sushi-trays",
   },
   {
     name: "Rectangular Sushi Trays",
     desc: "RE-ST series rectangular sushi trays with lids for plated sets.",
-    Icon: IconTray,
     href: "/products/rectangular-sushi-trays",
   },
 ];
 
 const whyUs = [
   {
     title: "Food-Grade Quality",
     desc: "Packaging chosen for safe food contact â€” so your brand ships with confidence.",
-    Icon: IconCheck,
   },
   {
     title: "Wide Product Range",
     desc: "From disposable trays to reusable containers â€” stock what your menu needs.",
-    Icon: IconList,
   },
   {
     title: "Bulk & Retail Orders",
     desc: "Flexible ordering for small kitchens, home businesses, and high-volume operations.",
-    Icon: IconFactory,
   },
   {
     title: "Nationwide Delivery",
     desc: "We serve food businesses across the Philippines â€” not just Metro Manila.",
-    Icon: IconTruck,
   },
 ];
 
 export default function Home() {
   const origin = getSiteOrigin();
   const localBusinessLd = {
     "@context": "https://schema.org",
     "@type": "LocalBusiness",
@@ -223,87 +204,69 @@ export default function Home() {
         </div>
         <div className={styles.heroScrim} aria-hidden="true" />
         <div className={styles.heroOverlay} aria-hidden="true" />
         <div className={styles.heroInner}>
           <div className={styles.heroContent} data-reveal>
             <div className={styles.heroBrand}>
               <BrandWordmark variant="onDark" size="lg" />
             </div>
-            <div className={styles.heroBadge}>Pasay City Â· Nationwide PH</div>
-            <h1 className={styles.heroTitle}>
-              Buy Food Packaging{" "}
-              <span>Nationwide in the Philippines</span>
-            </h1>
+            <h1 className={styles.heroTitle}>Buy Food Packaging</h1>
             <p className={styles.heroDesc}>
               Food-grade bento boxes, sushi trays, and wholesale takeout packaging â€”
-              from our Pasay City store to kitchens across the country.
+              from our Pasay City store to kitchens nationwide across the Philippines.
             </p>
             <div className={styles.heroActions}>
               <Link href="/products" className={styles.btnPrimary}>
                 Shop Products
               </Link>
-              <Link href="/quote" className={styles.btnOutline}>
+              <Link href="/quote" className={styles.btnText}>
                 Get a Quote
               </Link>
             </div>
           </div>
         </div>
       </section>
 
-      <div data-reveal>
-        <PromoBannerSlider />
-      </div>
-
-      <div data-reveal>
-        <PromoMarquee />
-      </div>
-
       <section className={styles.section} data-reveal>
         <div className={styles.container}>
           <div className={styles.sectionHeader}>
-            <h2>Shop Food Packaging by Category</h2>
+            <h2>Shop by Category</h2>
             <p>
-              Find disposable bento boxes and sushi trays for takeout, meal prep, catering,
-              and retail â€” ready for food businesses nationwide across the Philippines.
+              Bento boxes and sushi trays for takeout, meal prep, and wholesale.
             </p>
           </div>
           <div className={styles.categoryGrid}>
             {categories.map((cat) => (
               <Link key={cat.name} href={cat.href} className={styles.categoryCard}>
-                <div className={styles.categoryIcon}>
-                  <cat.Icon size={24} />
-                </div>
                 <h3>{cat.name}</h3>
                 <p>{cat.desc}</p>
                 <span className={styles.categoryArrow}>
                   Shop <IconArrowRight size={14} />
                 </span>
               </Link>
             ))}
           </div>
         </div>
       </section>
 
       <section className={`${styles.section} ${styles.sectionAlt}`} data-reveal>
         <div className={styles.container}>
           <div className={styles.sectionHeader}>
-            <h2>Why Food Businesses Buy from Ziyah Packaging Supplies</h2>
+            <h2>Why food businesses choose Ziyah</h2>
             <p>
-              We help restaurants, caterers, and home kitchens choose food-grade packaging
-              that fits the menu â€” with clear wholesale options and delivery across the
-              Philippines.
+              Food-grade packaging, flexible orders, and delivery across the Philippines.
             </p>
           </div>
           <div className={styles.whyGrid}>
-            {whyUs.map((item) => (
+            {whyUs.map((item, index) => (
               <div key={item.title} className={styles.whyCard}>
-                <div className={styles.whyIcon}>
-                  <item.Icon size={24} />
-                </div>
+                <span className={styles.whyIndex} aria-hidden="true">
+                  {String(index + 1).padStart(2, "0")}
+                </span>
                 <h3>{item.title}</h3>
                 <p>{item.desc}</p>
               </div>
             ))}
           </div>
         </div>
       </section>
 
`
