
const elements = Array.from(document.querySelectorAll('*'));
const offenders = [];
const winWidth = window.innerWidth;
elements.forEach(el => {
  const rect = el.getBoundingClientRect();
  if (rect.right > winWidth + 1 || el.scrollWidth > winWidth + 1) {
    offenders.push({
      tag: el.tagName,
      className: el.className,
      id: el.id,
      right: rect.right,
      scrollWidth: el.scrollWidth,
      width: rect.width
    });
  }
});
console.log('WIN_WIDTH:' + winWidth);
console.log('OFFENDERS:' + JSON.stringify(offenders.slice(0, 15)));
