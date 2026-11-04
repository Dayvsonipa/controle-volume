# Bunker Sonoro
Painel de monitoramento de conversa excessiva na sala de aula, inspirado em um bunker militar. HTML, CSS e JavaScript sem dependências e sem serviços de áudio externos.

## Operação
Abra o site por HTTPS. Clique em **Iniciar mic**, autorize o microfone e use **Calibrar** com a turma em silêncio durante 5 segundos. Ajuste a sensibilidade conforme o dispositivo. O índice de 0 a 100 é relativo, não é dB SPL. O painel mede o nível geral de som: não reconhece falas nem distingue conversa de outros ruídos. Os alertas usam a média dos últimos 5 segundos e uma margem de retorno de 4 pontos. O áudio não é gravado nem enviado. Pausar ou sair da página libera o microfone.

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

## Efeitos de avaria
Com efeitos ativados, o amarelo aquece a central e inicia uma fumaça leve. Um alerta vermelho contínuo acumula avaria: fumaça mais densa, faíscas, brilho de superaquecimento, interferência suave nas telas e fissuras visuais. A pane crítica começa após aproximadamente 14 segundos de vermelho. O retorno ao normal resfria o sistema e dissipa os efeitos; pausa, calibração e nova sessão zeram a avaria. Os efeitos nunca alteram o nível medido ou bloqueiam os controles.

Na demonstração, o botão **Testar pane** seleciona um nível simulado de 95 e mostra a pane imediatamente. Reduza o controle para acompanhar a recuperação. Em **Ajustes**, é possível desligar os efeitos; essa preferência fica salva no navegador. A preferência do sistema por movimento reduzido desativa fumaça animada, faíscas, tremor e interferência, preservando a indicação estática de estado.

O arquivo `effects.js` deve acompanhar `app.js`, `style.css` e `index.html` na raiz. Para testar a progressão e a recuperação da pane: `node tests/damage.cjs`.
