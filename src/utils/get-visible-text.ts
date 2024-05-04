/**
 * Get only the visible text of an element
 * @param element
 * @returns
 */
function getVisibleText(element: HTMLElement): string {
  function traverse(node: Node): string {
    let text = '';

    for (const child of node.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        if (isVisible(child.parentNode as HTMLElement)) {
          text += (child as Text).textContent;
        }
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        text += traverse(child);
      }
    }
    return text;
  }

  function isVisible(el: HTMLElement): boolean {
    const style = window.getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
  }

  return traverse(element);
}

export default getVisibleText;
