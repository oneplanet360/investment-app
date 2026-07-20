const fs = require('fs');
const path = require('path');

function walkSync(dir, callback) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filepath = path.join(dir, file);
    const stats = fs.statSync(filepath);
    if (stats.isDirectory()) {
      walkSync(filepath, callback);
    } else if (stats.isFile() && (filepath.endsWith('.tsx') || filepath.endsWith('.ts'))) {
      callback(filepath);
    }
  }
}

function replaceCurrency(filepath) {
  let content = fs.readFileSync(filepath, 'utf8');
  let newContent = content;

  // Amount ($) -> Amount (Rs.)
  newContent = newContent.replace(/\(\$\)/g, "(Rs.)");
  
  // `$${ -> `Rs.${
  newContent = newContent.replace(/`\$\$\{/g, "`Rs.${");

  // >${ -> >Rs.{
  newContent = newContent.replace(/>\$\{/g, ">Rs.{");

  // +${ -> +Rs.{
  newContent = newContent.replace(/\+\$\{/g, "+Rs.{");
  
  // -${ -> -Rs.{
  newContent = newContent.replace(/-\$\{/g, "-Rs.{");
  
  // >$number -> >Rs.number
  newContent = newContent.replace(/>\$(\d)/g, ">Rs.$1");
  
  // +$number -> +Rs.number
  newContent = newContent.replace(/\+\$(\d)/g, "+Rs.$1");
  
  // -$number -> -Rs.number
  newContent = newContent.replace(/-\$(\d)/g, "-Rs.$1");

  // " $ " -> " Rs. "
  newContent = newContent.replace(/ "\$" /g, " \"Rs.\" ");
  
  // ' $ ' -> ' Rs. '
  newContent = newContent.replace(/ '\$' /g, " 'Rs.' ");

  //  $${ -> Rs.${ (with spaces before)
  newContent = newContent.replace(/ \$\$\{/g, " Rs.${");
  
  // \n$${ -> \nRs.${ 
  newContent = newContent.replace(/\n\s*\$\$\{/g, (match) => match.replace("$$", "Rs.$"));

  if (content !== newContent) {
    console.log(`Updated ${filepath}`);
    fs.writeFileSync(filepath, newContent, 'utf8');
  }
}

walkSync('./frontend-react/src/pages/client', replaceCurrency);
walkSync('./frontend-react/src/components/client', replaceCurrency);

console.log("Done");
