/**
 * Show some informations into the document title and remove it after 3000ms
 * @param text
 */
function titleIndications(text: string) {
  const backTitle = document.title;
  document.title = text;
  setTimeout(() => (document.title = backTitle), 3000);
}

export default titleIndications;
