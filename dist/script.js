document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname !== "/") {
    addIconSwapEvent();
  }
});

const addIconSwapEvent = () => {
  document.querySelectorAll("use.visible").forEach((el) => {
    el.closest("button").addEventListener("click", () => {
      navigator.clipboard.writeText(el.closest("pre").innerText);
      el.setAttribute("href", "#svg-checkmark-button");
      setTimeout(() => el.setAttribute("href", "#svg-copy-button"), 2000);
    });
  });
};
