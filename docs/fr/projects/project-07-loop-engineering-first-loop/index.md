[English Version →](../../../en/projects/project-07-loop-engineering-first-loop/)

# Projet 07. Construisez votre première boucle automatisée

> Cours associé : [L13. Pourquoi vous devez arrêter de faire du prompting à votre agent](./../../lectures/lecture-13-loop-engineering/index.md)

## Ce que vous allez faire

C'est le projet de transition de « Harness » vers « Boucle ». Vous savez déjà comment configurer un agent avec un environnement, des instructions et un retour appropriés — maintenant vous allez transformer cette configuration en une boucle qui tourne toute seule.

Vous ferez trois expériences progressives : d'abord transformer une tâche de manuel en `/goal`, puis transformer une tâche de surveillance en une minuterie `/loop`, et enfin construire une boucle maker-checker complète pour ressentir ce que c'est que **de sortir de la boucle.**

## Outils que vous allez utiliser

- Claude Code ou Codex
- Git
- Votre harness complet de P06
- Un multiplexeur de terminal (tmux ou screen, pour observer les boucles de longue durée)
- Optionnel : GitHub Actions ou cron (pour des expériences avancées pilotées par événement / programmées)

## Étapes

### Préparation

1. Partez du même commit où vous avez terminé P06.
2. Créez trois branches : `p07-goal-loop`, `p07-timer-loop`, `p07-maker-checker`.
3. Confirmez que votre harness fonctionne : lancez init.sh, vérifiez que le fichier d'état, la liste des fonctionnalités et les docs de transfert sont tous en place.
4. Choisissez une **tâche cible** sur laquelle vous voulez que la boucle travaille de manière répétée. Choisissez quelque chose de taille moyenne avec des critères d'achèvement clairs — par ex., « ajouter des tests unitaires à tous les modules, atteindre 80 % de couverture » ou « ajouter une validation d'entrée à tous les points de terminaison API ».

### Expérience 1 : Boucle de but — De l'exécution manuelle à l'exécution automatique

Basculez sur la branche `p07-goal-loop`.

1. **Écrivez la description du but** : Transformez votre tâche choisie en un fichier `goal.md` contenant :
   - But clair (« ce qui compte comme terminé »)
   - Méthode de vérification (« comment confirmer que c'est terminé » — lancer les tests ? lancer lint ? vérifier la couverture ?)
   - Condition d'arrêt (« quand faut-il s'arrêter » — nombre maximum de tours ? limite de temps ? limite de budget ?)
   - Contraintes (« quoi ne pas toucher » — config de production, schéma de base de données, etc.)

2. **Première exécution manuelle** : Donnez la tâche à l'agent manuellement, vous-même. Enregistrez combien de tours cela a pris, combien de fois vous êtes intervenu, et la qualité du résultat. C'est votre ligne de base.

3. **Exécutez avec `/goal`** : Utilisez le même `goal.md` comme entrée et exécutez-le en mode `/goal`. L'agent boucle tout seul jusqu'à ce que le but soit atteint ou que la condition d'arrêt se déclenche.

4. **Comparez les résultats** :
   - Différence du nombre de tours
   - Différence de votre nombre d'interventions
   - Différence de qualité du résultat (en utilisant le même standard de vérification)
   - Différence du temps que vous avez passé

5. **Itérez sur goal.md** : Si les résultats sont médiocres, révisez la description du but et relancez. Continuez jusqu'à ce que vous soyez satisfait des résultats, ou jusqu'à ce que vous ayez confirmé la limite de ce qu'une boucle de but peut faire sur cette tâche.

### Expérience 2 : Boucle de minuterie — Transformer la surveillance en battement de cœur

Basculez sur la branche `p07-timer-loop`.

1. **Choisissez une tâche de surveillance** : Trouvez une vérification répétitive que vous faites normalement manuellement. Par exemple :
   - Lancer la suite de tests toutes les heures, corriger les échecs
   - Vérifier les mises à jour de sécurité des dépendances chaque matin
   - Vérifier les violations de style de code après chaque commit
   - Scanner périodiquement les commentaires TODO pour voir lesquels sont périmés

2. **Écrivez le prompt/script de surveillance** : Décrivez clairement les étapes de surveillance — quoi vérifier, quoi faire quand des problèmes sont trouvés, et quand appeler un humain.

3. **Exécutez avec `/loop` (ou Codex Thread automation)** :
   - Réglez un intervalle raisonnable (10-30 minutes recommandé — trop court et vous serez ennuyé, trop long et vous ne verrez pas l'effet)
   - Laissez tourner pendant au moins 2 heures (ou allez faire autre chose et revenez plus tard)

4. **Enregistrez les résultats** :
   - Combien de problèmes a-t-il trouvés ?
   - Combien en a-t-il corrigés tout seul ?
   - Combien étaient de faux positifs ?
   - Combien en a-t-il empirés ?
   - Combien de temps avez-vous passé à faire le suivi de ses résultats ?

5. **Réfléchissez** : Cette tâche de surveillance vaut-elle la peine d'être automatisée ? Comparez le temps que vous avez gagné vs. le temps que vous avez passé à faire le suivi. Si ça n'en vaut pas la peine, avez-vous choisi la mauvaise tâche, ou la boucle est-elle mal conçue ?

### Expérience 3 : Boucle Maker-Checker — Sortez de la boucle

Basculez sur la branche `p07-maker-checker`.

C'est la plus importante des trois expériences. Vous allez construire **une boucle complète qui n'a pas besoin de vous pour être là :**

1. **Concevez la structure de la boucle** :
   - **Agent maker** : implémente, écrit du code, modifie des fichiers
   - **Agent checker** : vérifie, lance les tests, fait de la revue de code, passe / échoue
   - **Fichier d'état** (`loop-state.md`) : enregistre le tour actuel, ce qui a été fait, les résultats de vérification, la suite
   - **Condition d'arrêt** : N passes consécutives, ou nombre maximum de tours atteint

2. **Écrivez trois prompts** :
   - Instructions maker (quoi faire, comment le faire, quoi ne pas toucher)
   - Instructions checker (quoi vérifier, comment vérifier, ce qui compte comme réussite, comment donner le feedback)
   - Logique de contrôle de boucle (qui commence en premier, comment fonctionne le transfert, comment démarrer le tour suivant)

3. **Exécutez au moins 5 tours** :
   - Tour 1 : Maker implémente → Checker vérifie → Échec → Feedback au Maker
   - Tour 2 : Maker révise en fonction du feedback → Checker vérifie → ...
   - ...
   - Jusqu'à la passe consécutive, ou vous l'arrêtez

4. **Enregistrez l'état de chaque tour** :
   - Numéro du tour
   - Ce que le Maker a fait
   - Quels problèmes le Checker a trouvés
   - Réussi / échoué
   - Êtes-vous intervenu ? (si oui, pourquoi ?)

5. **Rétrospective finale** :
   - Combien de fois êtes-vous intervenu ? Pourquoi ?
   - Qu'est-ce qui se serait passé si vous n'étiez pas intervenu ?
   - Le Checker a-t-il raté des problèmes ?
   - Le Maker a-t-il continué à faire la même erreur ?
   - Où est le plafond de qualité de cette boucle ? Capacité du Maker, ou capacité du Checker ?

## Comment mesurer les résultats

| Métrique | Exp 1 (But) | Exp 2 (Minuterie) | Exp 3 (Maker-Checker) |
|--------|-------------|--------------|----------------------|
| Taux d'achèvement de la tâche | Le but a-t-il été atteint ? | Combien de cycles de surveillance se sont exécutés ? | Combien de tours jusqu'à la réussite ? |
| Interventions humaines | Combien de fois êtes-vous intervenu ? | Combien de temps avez-vous passé à faire le suivi ? | Combien de fois êtes-vous intervenu ? |
| Qualité du résultat | Comment ça se compare au manuel ? | Taux de faux positifs ? Problèmes ratés ? | Combien de problèmes le Checker a-t-il trouvés que vous n'auriez pas trouvés ? |
| Temps gagné | Combien de temps avez-vous gagné ? | Ça vaut la peine d'être automatisé ? | Temps passé à concevoir la boucle vs. temps gagné |
| Fiabilité | La condition d'arrêt était-elle digne de confiance ? | Est-ce que ça a dérapé ? | La boucle peut-elle se bloquer au même endroit ? |

## Ce qu'il faut soumettre

- `goal.md` (description du but de l'Expérience 1, au moins deux itérations)
- Notes de comparaison de l'Expérience 1 : manuel vs. boucle de but
- Prompt de surveillance de l'Expérience 2 + journal d'exécution de 2 heures
- Les trois prompts de l'Expérience 3 (Maker / Checker / Contrôle de boucle)
- `loop-state.md` de l'Expérience 3 (au moins 5 tours enregistrés)
- Rétrospective finale : enseignements des trois expériences, comment votre compréhension de l'ingénierie des boucles a changé, quelles choses sont de bons candidats à la bouclisation et lesquelles ne le sont pas

## Cours associés

- [Cours 13 — Pourquoi vous devez arrêter de faire du prompting à votre agent](../../lectures/lecture-13-loop-engineering/index.md)
- [Cours 12 — Pourquoi chaque session doit laisser un état propre](../../lectures/lecture-12-why-every-session-must-leave-a-clean-state/index.md) (chaque tour d'une boucle a besoin d'un état propre)
- [Cours 11 — Pourquoi l'observabilité appartient à l'intérieur du harness](../../lectures/lecture-11-why-observability-belongs-inside-the-harness/index.md) (vous avez besoin de voir ce qui se passe à l'intérieur de la boucle)
- [Cours 05 — Pourquoi les fichiers d'état sont l'épine dorsale de la continuité](../../lectures/lecture-05-why-long-running-tasks-lose-continuity/index.md) (les fichiers d'état de boucle sont une extension des fichiers d'état)
