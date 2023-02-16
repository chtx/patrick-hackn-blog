import fs from "fs";
import path from "path";
import matter from "gray-matter"; //extracts front matter from .md (meta data)
import { marked } from "marked";
import { mkdirp } from "mkdirp"; // makes a directory, but if it exists, it's not going to fail
import glob from "glob"; // searches for patterns in files, like
import hljs from "highlight.js/lib/common";

//✅ read markdown file
//✅ process the front matter
//✅ read the content
//✅ return all as an object.
//✅ inject it into the themplate (html)
//✅ save file
//✅ enumerate all md files in src

const saveFile = (fileName, contents) => {
  const dir = path.dirname(fileName);
  mkdirp.sync(dir);
  fs.writeFileSync(fileName, contents);
};

const injectToTemplate = (template, { date, title, content }) =>
  template
    .replace(/{{html-content}}/g, content)
    .replace(/{{title}}/g, title)
    .replace(/{{date}}/g, date);
// g - global, if there's more than one

const getOutputFileName = (fileName, outPath) => {
  const baseName = path.basename(fileName); // strips out directory, and gives just the file name, incl. extension
  const newBaseName = baseName.substring(0, baseName.length - 3) + ".html"; // strip .md & append .html extension
  const outFileName = path.join(outPath, newBaseName);
  return [outFileName, newBaseName];
}; //outPath - /dist, fileName - full path, incl. source

// Read .md file then parse with 'matter' and 'marked'
const readFile = (fileName) => {
  const rawFile = fs.readFileSync(fileName, "utf8");
  const parsed = matter(rawFile);

  // 'highligh' option is a function to run on code blocks in marked
  // Documentation: https://marked.js.org/using_advanced
  marked.setOptions({
    highlight: function (code, lang) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      return hljs.highlight(code, { language }).value;
    },
  });
  const html = marked.parse(parsed.content);

  return { ...parsed, html };
};

const processFile = (fileName, template, outPath) => {
  const mdFile = readFile(fileName);
  const outFileName = getOutputFileName(fileName, outPath);

  const newContentHTML = injectToTemplate(template, {
    date: mdFile.data.date,
    title: mdFile.data.title,
    content: mdFile.html,
  });

  frontPagePosts.push({
    dateCreated: mdFile.data.date,
    title: mdFile.data.title,
    preview: mdFile.data.preview,
    url: outFileName[1],
  });

  saveFile(outFileName[0], newContentHTML);
};

// 'fileName' - refers to full file path (dir + name)
// later only name is refered to as 'baseName'
const generateArticlePages = () => {
  const pageTemplate = fs.readFileSync(
    path.join(srcPath, postTemplate),
    "utf8"
  );
  const fileNames = glob.sync(
    path.join(srcPath, "/pages/**/**.md").replace(/\\/g, "/")
  ); // .replace() is for glob to work on Windows for dynamic paths

  fileNames.forEach((fileName) => {
    processFile(fileName, pageTemplate, outPath);
  });
};

const postTemplate = "post-template.html";
const indxTemplate = "index-template.html";
const postSnippet = "post-snippet.html";
const srcPath = path.join(path.resolve(), "src"); // path.resolve() gives current directory
const outPath = path.join(path.resolve(), "dist");
const frontPagePosts = [];

generateArticlePages();

// Generate index page - To dos:
//✅ import index template and snippet template
//✅ build html snippets for each article
//✅ inject snippets to the index page template

const generateFrontPage = (pageTemplate, snippets) =>
  pageTemplate.replace(/{{snippets}}/, snippets.reverse().join(""));

const generateSnippets = (snippetTemplate) => {
  const snippets = [];
  frontPagePosts.forEach((el) => {
    const day = el.dateCreated.substring(0, 2);
    const mthYr = el.dateCreated.substring(3);
    const newSnippet = snippetTemplate
      .replace(/{{dd}}/g, day)
      .replace(/{{mm-yy}}/g, mthYr)
      .replace(/{{url}}/g, el.url)
      .replace(/{{title}}/g, el.title)
      .replace(/{{preview}}/g, el.preview);
    //console.log(el.title);
    snippets.push(newSnippet);
  });
  return snippets;
};

const buildIndexPage = () => {
  const pageTemplate = fs.readFileSync(
    path.join(srcPath, indxTemplate),
    "utf8"
  );
  const snippetTemplate = fs.readFileSync(
    path.join(srcPath, postSnippet),
    "utf8"
  );
  const snippets = generateSnippets(snippetTemplate);
  const newFrontPageHTML = generateFrontPage(pageTemplate, snippets);
  saveFile("dist/index.html", newFrontPageHTML);
};

buildIndexPage();

// Reamining Todos:

// Separate out header & footer into its own templates and then build using them.

// images - just copy from src to dist

//create folders for posts to not have .html extension
