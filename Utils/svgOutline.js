export default function highlightPathById(pathId) {
  let pathElement = document.getElementById(pathId);
  console.log(pathElement);
  if (pathElement) {
    pathElement.style.fill = "#C8C8C8"; // Change fill to white
  } else {
    console.error(`Path with id '${pathId}' not found.`);
  }
}
