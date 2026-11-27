# Review package Task 2
**Base:** 7a94630ea0df05a22c4c91206274ab9188a22534
**Head:** WORKING TREE
**Scope:** src/app/page.module.css (Task 2)

## Diff stat
`
 src/app/page.module.css | 117 +++++++++++++++++++-----------------------------
 1 file changed, 45 insertions(+), 72 deletions(-)
`

## Full diff
`diff
diff --git a/src/app/page.module.css b/src/app/page.module.css
index d6b7ecf..bee7545 100644
--- a/src/app/page.module.css
+++ b/src/app/page.module.css
@@ -37,29 +37,29 @@
   color: var(--gray-600);
   max-width: 560px;
   margin: 0 auto;
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
   z-index: 0;
   -webkit-mask-image: linear-gradient(
@@ -78,144 +78,100 @@
   );
 }
 
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
 
 .heroContent {
   position: relative;
   max-width: 560px;
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
   display: inline-block;
   background: var(--accent);
@@ -228,20 +184,37 @@
   transition: background var(--transition), transform var(--transition), box-shadow var(--transition);
   box-shadow: 0 4px 14px rgba(163, 64, 84, 0.35);
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
   text-decoration: none;
   border: 2px solid rgba(255, 255, 255, 0.6);
`
