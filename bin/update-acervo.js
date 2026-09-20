#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { updateAcervo } = require('../src/updateAcervo');

function readCollection(filePath) {
  const absolutePath = path.resolve(process.cwd(), filePath);
  const content = fs.readFileSync(absolutePath, 'utf8');

  return JSON.parse(content);
}

function main(argv) {
  const [currentPath, incomingPath, outputPath] = argv;

  if (!currentPath || !incomingPath) {
    console.error('Usage: update-acervo <current.json> <incoming.json> [output.json]');
    process.exitCode = 1;
    return;
  }

  const updatedCollection = updateAcervo(
    readCollection(currentPath),
    readCollection(incomingPath)
  );
  const output = `${JSON.stringify(updatedCollection, null, 2)}\n`;

  if (!outputPath) {
    process.stdout.write(output);
    return;
  }

  const absoluteOutputPath = path.resolve(process.cwd(), outputPath);
  fs.writeFileSync(absoluteOutputPath, output, 'utf8');
}

main(process.argv.slice(2));
