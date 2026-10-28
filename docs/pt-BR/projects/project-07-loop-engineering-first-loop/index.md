[English Version →](../../../en/projects/project-07-loop-engineering-first-loop/)

# Projeto 07. Construa Seu Primeiro Loop Automatizado

> Aula relacionada: [L13. Por Que Você Precisa Parar de Dar Prompt no Seu Agente](./../../lectures/lecture-13-loop-engineering/index.md)

## O Que Você Fará

Este é o projeto de transição do "Harness" para o "Loop". Você já sabe como configurar um agente com ambiente, instruções e feedback adequados — agora você transformará essa configuração em um loop que roda sozinho.

Você fará três experimentos progressivos: primeiro transformar uma tarefa de manual para `/goal`, depois transformar uma tarefa de monitoramento em um temporizador `/loop`, e finalmente construir um loop completo maker-checker para experimentar como é quando **você sai do loop.**

## Ferramentas Que Você Usará

- Claude Code ou Codex
- Git
- Seu harness completo do P06
- Um multiplexador de terminal (tmux ou screen, para observar loops de longa duração)
- Opcional: GitHub Actions ou cron (para experimentos avançados orientados a eventos / agendados)

## Passos

### Preparação

1. Comece do mesmo commit onde você terminou o P06.
2. Crie três branches: `p07-goal-loop`, `p07-timer-loop`, `p07-maker-checker`.
3. Confirme que seu harness funciona: rode init.sh, verifique se arquivo de estado, lista de funcionalidades e docs de transferência estão todos no lugar.
4. Escolha uma **tarefa alvo** que você quer que o loop trabalhe repetidamente. Escolha algo de tamanho médio com critérios de conclusão claros — ex: "adicionar testes unitários a todos os módulos, atingindo 80% de cobertura" ou "adicionar validação de entrada a todos os endpoints da API".

### Experimento 1: Loop de Objetivo — Da Execução Manual para Execução Automática

Mude para a branch `p07-goal-loop`.

1. **Escreva a descrição do objetivo**: Transforme sua tarefa escolhida em um arquivo `goal.md` contendo:
   - Objetivo claro ("o que conta como pronto")
   - Método de verificação ("como confirmar que está pronto" — rodar testes? rodar lint? verificar cobertura?)
   - Condição de parada ("quando deve parar" — máximo de turnos? limite de tempo? limite de orçamento?)
   - Restrições ("o que não tocar" — config de produção, schema do banco de dados, etc.)

2. **Primeira execução manual**: Dê a tarefa ao agente manualmente, você mesmo. Registre quantos turnos levou, quantas vezes você interveio e a qualidade do resultado. Este é seu baseline.

3. **Rode com `/goal`**: Use o mesmo `goal.md` como entrada e rode no modo `/goal`. O agente repete sozinho até que o objetivo seja atingido ou a condição de parada dispare.

4. **Compare os resultados**:
   - Diferença na contagem de turnos
   - Diferença na sua contagem de intervenções
   - Diferença na qualidade do resultado (usando o mesmo padrão de verificação)
   - Diferença no tempo que você gastou

5. **Itere no goal.md**: Se os resultados forem ruins, revise a descrição do objetivo e rode novamente. Continue até que você esteja satisfeito com os resultados, ou até que tenha confirmado o limite do que um loop de objetivo consegue fazer nesta tarefa.

### Experimento 2: Loop de Temporizador — Transforme Monitoramento em Batimento Cardíaco

Mude para a branch `p07-timer-loop`.

1. **Escolha uma tarefa de monitoramento**: Encontre uma verificação repetitiva que você normalmente faz manualmente. Por exemplo:
   - Rodar a suíte de testes a cada hora, corrigir falhas
   - Verificar atualizações de segurança de dependências todas as manhãs
   - Verificar violações de estilo de código após cada commit
   - Periodicamente escanear comentários TODO para ver quais estão obsoletos

2. **Escreva o prompt/script de monitoramento**: Descreva os passos de monitoramento claramente — o que verificar, o que fazer quando forem encontrados problemas e quando chamar um humano.

3. **Rode com `/loop` (ou Codex Thread automation)**:
   - Defina um intervalo razoável (10-30 minutos recomendado — muito curto e você ficará irritado, muito longo e você não verá o efeito)
   - Deixe rodar por pelo menos 2 horas (ou vá fazer outra coisa e volte depois)

4. **Registre os resultados**:
   - Quantos problemas ele encontrou?
   - Quantos ele consertou sozinho?
   - Quantos foram falsos positivos?
   - Quantos ele piorou?
   - Quanto tempo você gastou acompanhando seus resultados?

5. **Reflita**: Vale a pena automatizar esta tarefa de monitoramento? Compare o tempo que você economizou vs. o tempo que gastou acompanhando. Se não vale a pena, você escolheu a tarefa errada, ou o loop está mal projetado?

### Experimento 3: Loop Maker-Checker — Tire Você Mesmo do Loop

Mude para a branch `p07-maker-checker`.

Este é o mais importante dos três experimentos. Você construirá um **loop completo que não precisa de você lá:**

1. **Projete a estrutura do loop**:
   - **Agente Maker**: implementa, escreve código, modifica arquivos
   - **Agente Checker**: verifica, roda testes, faz revisão de código, aprova / reprova
   - **Arquivo de estado** (`loop-state.md`): registra rodada atual, o que foi feito, resultados da verificação, o que vem a seguir
   - **Condição de parada**: N aprovações consecutivas, ou máximo de rodadas atingido

2. **Escreva três prompts**:
   - Instruções do Maker (o que fazer, como fazer, o que não tocar)
   - Instruções do Checker (o que verificar, como verificar, o que conta como aprovação, como dar feedback)
   - Lógica de controle do loop (quem vai primeiro, como funciona a transferência, como começar a próxima rodada)

3. **Rode pelo menos 5 rodadas**:
   - Rodada 1: Maker implementa → Checker verifica → Reprova → Feedback para o Maker
   - Rodada 2: Maker revisa com base no feedback → Checker verifica → ...
   - ...
   - Até aprovação consecutiva, ou você encerra

4. **Registre o estado de cada rodada**:
   - Número da rodada
   - O que o Maker fez
   - Quais problemas o Checker encontrou
   - Aprovou / reprovou
   - Você interviu? (se sim, por quê?)

5. **Retrospectiva final**:
   - Quantas vezes você interviu? Por quê?
   - O que teria acontecido se você não tivesse intervido?
   - O Checker deixou passar algum problema?
   - O Maker continuou cometendo o mesmo erro?
   - Onde está o teto de qualidade deste loop? Capacidade do Maker, ou capacidade do Checker?

## Como Medir Resultados

| Métrica | Exp 1 (Objetivo) | Exp 2 (Temporizador) | Exp 3 (Maker-Checker) |
|---------|-----------------|---------------------|----------------------|
| Taxa de conclusão da tarefa | O objetivo foi atingido? | Quantos ciclos de monitoramento rodaram? | Quantas rodadas até aprovar? |
| Intervenções humanas | Quantas vezes você interveio? | Quanto tempo você gastou acompanhando? | Quantas vezes você interviu? |
| Qualidade do resultado | Como se compara ao manual? | Taxa de falsos positivos? Problemas perdidos? | Quantos problemas o Checker encontrou que você não teria? |
| Tempo economizado | Quanto tempo você economizou? | Vale a pena automatizar? | Tempo gasto projetando o loop vs. tempo economizado |
| Confiabilidade | A condição de parada era confiável? | Ele fugiu do controle? | O loop consegue ficar preso no mesmo lugar? |

## O Que Entregar

- `goal.md` (descrição do objetivo do Experimento 1, pelo menos duas iterações)
- Notas de comparação do Experimento 1: manual vs. loop de objetivo
- Prompt de monitoramento do Experimento 2 + log de execução de 2 horas
- Três prompts do Experimento 3 (Maker / Checker / Controle do loop)
- `loop-state.md` do Experimento 3 (pelo menos 5 rodadas registradas)
- Retrospectiva final: lições dos três experimentos, como sua compreensão de engenharia de loops mudou, quais coisas são boas candidatas para loop-ificação e quais não são

## Aulas Relacionadas

- [Aula 13 — Por Que Você Precisa Parar de Dar Prompt no Seu Agente](../../lectures/lecture-13-loop-engineering/index.md)
- [Aula 12 — Por Que Toda Sessão Deve Deixar um Estado Limpo](../../lectures/lecture-12-why-every-session-must-leave-a-clean-state/index.md) (cada rodada de um loop precisa de estado limpo)
- [Aula 11 — Por Que a Observabilidade Pertence ao Harness](../../lectures/lecture-11-why-observability-belongs-inside-the-harness/index.md) (você precisa ver o que está acontecendo dentro do loop)
- [Aula 05 — Por Que Arquivos de Estado São a Espinha Dorsal da Continuidade](../../lectures/lecture-05-why-long-running-tasks-lose-continuity/index.md) (arquivos de estado de loop são uma extensão dos arquivos de estado)
