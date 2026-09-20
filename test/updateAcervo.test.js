'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { updateAcervo } = require('../src/updateAcervo');

test('updates existing records and appends new records', () => {
  const currentCollection = [
    { id: '1', titulo: 'Livro A', status: 'disponivel', exemplares: 1 },
    { id: '2', titulo: 'Livro B', status: 'emprestado', exemplares: 1 }
  ];
  const incomingCollection = [
    { id: '2', status: 'disponivel', exemplares: 2 },
    { id: '3', titulo: 'Livro C', status: 'disponivel', exemplares: 1 }
  ];

  assert.deepEqual(updateAcervo(currentCollection, incomingCollection), [
    { id: '1', titulo: 'Livro A', status: 'disponivel', exemplares: 1 },
    { id: '2', titulo: 'Livro B', status: 'disponivel', exemplares: 2 },
    { id: '3', titulo: 'Livro C', status: 'disponivel', exemplares: 1 }
  ]);
});

test('rejects records without an id', () => {
  assert.throws(
    () => updateAcervo([{ id: '1' }], [{ titulo: 'Sem identificador' }]),
    /incomingCollection\[0\] must include a non-empty id\./
  );
});

test('cli prints the merged collection', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'minhoteca-acervo-'));
  const currentPath = path.join(tempDir, 'current.json');
  const incomingPath = path.join(tempDir, 'incoming.json');

  fs.writeFileSync(currentPath, JSON.stringify([{ id: '1', titulo: 'Livro A' }]));
  fs.writeFileSync(
    incomingPath,
    JSON.stringify([
      { id: '1', status: 'disponivel' },
      { id: '2', titulo: 'Livro B', status: 'emprestado' }
    ])
  );

  const stdout = execFileSync(
    process.execPath,
    [path.resolve(__dirname, '../bin/update-acervo.js'), currentPath, incomingPath],
    { encoding: 'utf8' }
  );

  assert.deepEqual(JSON.parse(stdout), [
    { id: '1', titulo: 'Livro A', status: 'disponivel' },
    { id: '2', titulo: 'Livro B', status: 'emprestado' }
  ]);
});
