# Bunker Sonoro
Painel de monitoramento de conversa excessiva na sala de aula, inspirado em um bunker militar. HTML, CSS e JavaScript sem dependências e sem serviços de áudio externos.

## Operação
Abra o site por HTTPS. Clique em **Iniciar mic**, autorize o microfone e use **Calibrar** com a turma em silêncio durante 5 segundos. Ajuste a sensibilidade conforme o dispositivo. O índice de 0 a 100 é relativo, não é dB SPL. O painel mede o nível geral de som: não reconhece falas nem distingue conversa de outros ruídos. Os alertas usam a média dos últimos 5 segundos arredondada, como exibida no medidor, e cinco faixas fixas a partir de 50. O áudio não é gravado nem enviado. Pausar ou sair da página libera o microfone.

A demonstração usa um controle manual de nível, sem captar áudio. O relatório CSV contém uma amostra numérica por segundo ativo e identifica a fonte. Iniciar uma nova sessão limpa o relatório anterior; pausar e retomar o preserva. Exporte antes de começar outra sessão. Ajustes e calibração ficam no armazenamento local do navegador.

## Arquivos
- `index.html`: estrutura do painel.
- `style.css`: visual responsivo e instrumentos.
- `app.js`: microfone, demonstração, calibração, alertas, relatório.
- `tests/audio-lifecycle.cjs`: testes de comportamento com microfone simulado.

## Validação
`node --check app.js`
`node tests/audio-lifecycle.cjs`

Interface verificada no navegador em desktop, quadro 800 × 600 e celular 390 px. Verificados os estados normal, atenção e alerta, pausa/retomada e validação dos limites. Microfone real e acústica da sala dependem de teste no dispositivo do professor.

## Publicação
Sirva a raiz do repositório como site estático em HTTPS. Não exige banco de dados, credenciais de API ou instalação de pacotes. Para desenvolvimento local, use um servidor em localhost. A permissão de microfone pode ser bloqueada em prévias embutidas: nesse caso, abra o site em uma aba própria.

## Enviar ao GitHub
1. Extraia este ZIP no computador.
2. Abra ou crie o repositório no GitHub.
3. Envie os arquivos extraídos para a raiz do repositório: index.html, style.css, app.js, README.md e a pasta tests. Não envie apenas o ZIP.
4. Confirme o envio (commit).

O arquivo index.html já está na raiz para facilitar a hospedagem estática. Não há etapa de compilação, variáveis de ambiente ou banco de dados.

## Níveis de alerta
As faixas seguem a média dos últimos 5 segundos arredondada (0–100, índice relativo). Nível atual e média são exibidos separadamente. A sensibilidade e a calibração permitem ajustar o microfone à sala.

| Faixa | Estado | Reação |
|---|---|---|
| 0–49 | Normal | Luzes verdes e recuperação da central |
| 50–59 | N1 · Atenção | Mensagem para a turma, luzes amarelas e destaque do painel |
| 60–69 | N2 · Conversa alta | Uma luz superior âmbar pulsa suavemente; fumaça leve |
| 70–79 | N3 · Alerta | Duas luzes superiores laranja pulsam alternadamente; fumaça mais densa |
| 80–89 | N4 · Sobrecarga | Luzes vermelhas piscando alternadamente, indicador lateral intermitente, faíscas e interferência nas telas |
| 90–100 | N5 · Pane crítica | Luzes superiores e lateral intermitentes, mais quatro pequenos indicadores dos módulos; fumaça máxima, fissuras e tremor discreto |

A mensagem e a cor mudam quando a média entra na faixa. Os efeitos de avaria crescem suavemente até o limite da faixa (no máximo cerca de 5 segundos) e recuam quando o volume cai. Uma conversa moderada não causa pane crítica apenas pela duração. Pausa, calibração e nova sessão limpam a avaria. Os efeitos não alteram as medições e não bloqueiam os controles.

O botão **Testar pane** seleciona 95 no modo de demonstração e mostra a pane imediatamente. Reduza o controle para acompanhar a recuperação. Em **Ajustes**, consulte a tabela e ative ou desative os efeitos; a preferência fica salva neste navegador. A preferência do sistema por movimento reduzido desativa fumaça animada, faíscas, tremor e interferência, mantendo indicadores estáticos.

Envie também `levels.js` e `effects.js` junto com `app.js`, `style.css` e `index.html`. O relatório CSV identifica cada uma das seis condições.

Testes: `node tests/damage.cjs` e `node tests/audio-lifecycle.cjs`.

A quantidade de luzes intermitentes aumenta com as faixas: nenhuma em 50–59, uma em 60–69, duas em 70–79, três em 80–89 e sete em 90–100. As últimas quatro são pequenos indicadores discretos, preservando a legibilidade e a aparência de equipamento.
