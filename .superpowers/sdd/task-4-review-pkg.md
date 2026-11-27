# Review package Task 4
**Base:** 7a94630ea0df05a22c4c91206274ab9188a22534

## Diff
`diff
diff --git a/src/app/components/FeedbackSection.module.css b/src/app/components/FeedbackSection.module.css
index 3a52a57..9785eb5 100644
--- a/src/app/components/FeedbackSection.module.css
+++ b/src/app/components/FeedbackSection.module.css
@@ -1,74 +1,75 @@
 .section {
-  padding: 72px 0;
-  background: linear-gradient(180deg, #fff 0%, var(--primary-xlight) 100%);
+  padding: 80px 0;
+  background: #fff;
 }
 
 .container {
   max-width: 1100px;
   margin: 0 auto;
   padding: 0 24px;
 }
 
 .header {
   text-align: center;
   max-width: 560px;
   margin: 0 auto 36px;
 }
 
 .header h2 {
-  font-size: clamp(26px, 4vw, 34px);
-  font-weight: 800;
+  font-size: clamp(24px, 3.5vw, 32px);
+  font-weight: 700;
   color: var(--primary-dark);
   margin-bottom: 10px;
 }
 
 .header p {
   color: var(--gray-600);
   font-size: 15px;
   line-height: 1.6;
 }
 
 .grid {
   display: grid;
   grid-template-columns: repeat(2, minmax(0, 1fr));
-  gap: 20px;
+  gap: 8px 40px;
 }
 
 .card {
-  background: #fff;
-  border: 1px solid rgba(27, 25, 49, 0.08);
-  border-radius: 18px;
-  padding: 22px;
-  box-shadow: var(--shadow);
+  background: transparent;
+  border: none;
+  border-top: 1px solid rgba(27, 25, 49, 0.1);
+  border-radius: 0;
+  padding: 24px 0;
+  box-shadow: none;
   opacity: 0;
-  transform: translateY(18px);
+  transform: translateY(14px);
 }
 
 .visible .card {
   animation: cardIn 0.55s ease forwards;
 }
 
 .top {
   display: flex;
   align-items: center;
   gap: 12px;
   margin-bottom: 12px;
 }
 
 .photo {
-  width: 56px;
-  height: 56px;
+  width: 48px;
+  height: 48px;
   border-radius: 50%;
   overflow: hidden;
   flex-shrink: 0;
-  border: 2px solid var(--accent-light);
+  border: none;
 }
 
 .photo img {
   width: 100%;
   height: 100%;
   object-fit: cover;
 }
 
 .card h3 {
   font-size: 16px;
`
