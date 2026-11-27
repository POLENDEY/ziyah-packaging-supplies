# Review package Task 1
**Base:** 7a94630ea0df05a22c4c91206274ab9188a22534
**Head:** WORKING TREE (no commits)

## Status
`
## feature/home-minimalist-editorial
 M src/app/page.tsx
?? .github/
?? .superpowers/
?? docs/superpowers/plans/2026-09-10-home-minimalist-editorial.md
?? docs/superpowers/specs/2026-09-10-home-minimalist-editorial-design.md
`

## Diff stat
`
 src/app/page.tsx | 48 +++++++-----------------------------------------
 1 file changed, 7 insertions(+), 41 deletions(-)
`

## Full diff
`diff
diff --git a/src/app/page.tsx b/src/app/page.tsx
index 8458453..92fbaf3 100644
--- a/src/app/page.tsx
+++ b/src/app/page.tsx
@@ -1,33 +1,23 @@
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
     "Buy food packaging in the Philippines from Ziyah Packaging Supplies â€” bento boxes, sushi trays, and wholesale takeout containers. Pickup in Pasay City or delivery nationwide.",
   keywords: [...SITE.seoKeywords],
@@ -47,69 +37,60 @@ export const metadata: Metadata = {
     description:
       "Food-grade bento boxes and sushi trays for restaurants and home businesses nationwide.",
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
     "@id": `${origin}/#localbusiness`,
     name: SITE.name,
@@ -221,64 +202,49 @@ export default function Home() {
         <div className={styles.heroScene} aria-hidden="true">
           <HeroFulfillmentScene />
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
             <h2>Shop Food Packaging by Category</h2>
             <p>
               Find disposable bento boxes and sushi trays for takeout, meal prep, catering,
               and retail â€” ready for food businesses nationwide across the Philippines.
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
@@ -287,25 +253,25 @@ export default function Home() {
         <div className={styles.container}>
           <div className={styles.sectionHeader}>
             <h2>Why Food Businesses Buy from Ziyah Packaging Supplies</h2>
             <p>
               We help restaurants, caterers, and home kitchens choose food-grade packaging
               that fits the menu â€” with clear wholesale options and delivery across the
               Philippines.
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
 
       <div data-reveal>
         <FeedbackSection />
`
