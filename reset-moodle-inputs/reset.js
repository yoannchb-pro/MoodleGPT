//to try in real moodle env

for (const option of document.querySelectorAll("option")) {
  option.selected = false;
}

for (const input of document.querySelectorAll(
  'input[type="radio"], input[type="checkbox"]'
)) {
  input.checked = false;
}

for (const icon of document.querySelectorAll(".text-danger, .text-success")) {
  icon.remove();
}
