# minhoteca-fn-adualizador-acervo
Atualizador de acervo da Minhoteca

Ferramenta Node.js para atualizar um acervo em JSON a partir de uma carga incremental.

## Uso

```bash
node bin/update-acervo.js caminho/atual.json caminho/novidades.json [caminho/saida.json]
```

Cada arquivo deve conter um array JSON de itens com `id`. Itens existentes são atualizados por `id`, novos itens são adicionados ao final e registros sem atualização são preservados.

## Testes

```bash
npm test
```
