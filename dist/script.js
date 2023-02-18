if (window.location.pathname !== "/") {
  window.addEventListener("load", () => {
    const preElements = document.querySelectorAll("pre");
    preElements.forEach((pre) => {
      const button = document.createElement("button");
      button.id = "icon";
      button.className = "copy-button";
      button.innerHTML = `<svg width="16" height="16">
            <use href="#svg-copy-button"></use>
          </svg>`;
      pre.insertBefore(button, pre.firstChild);
      button.addEventListener("click", (e) => {
        navigator.clipboard.writeText(pre.innerText);
        let iconEl = e.currentTarget.children[0].children[0];
        iconEl.setAttribute("href", "#svg-checkmark-button");
        setTimeout(() => iconEl.setAttribute("href", "#svg-copy-button"), 2000);
      });
    });
  });
}
