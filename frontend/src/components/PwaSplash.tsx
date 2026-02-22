/**
 * PWA splash ekranini yopish. index.html dagi #pwa-splash elementini
 * animatsiya bilan yashiradi va keyin DOM dan olib tashlaydi.
 */
export function hidePwaSplash(): void {
  const splash = document.getElementById("pwa-splash");
  if (!splash) return;
  splash.classList.add("hidden");
  splash.ontransitionend = () => {
    splash.remove();
  };
  // Agar transitionend ishlamasa (ba'zi brauzerlar)
  setTimeout(() => splash.remove(), 500);
}
