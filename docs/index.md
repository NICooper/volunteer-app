# App Communautaire

> **Thèmes**: Génie logiciel  
> **Superviseur**: Louis Édouard Lafontant

## Équipe
Nicholas Cooper

## Description du projet
Une application mobile pour faciliter la recherche de quarts de bénévolat et connecter les bénévoles.

### Contexte
Ce projet vise le bénévolat et la création de communautés.

Les organisations ont besoin de bénévoles pour accomplir leurs travaux communautaires. Les opportunités de bénévolat peuvent être permanentes ou offertes par quart de travail. Ce projet porte sur le bénévolat par quart. Les organisations doivent gérer les quarts, gérer leurs bénévoles et recruter de nouveaux bénévoles.

Toute organisation semble avoir un système différent pour la gestion des quarts. Pour l’inscription des bénévoles, certaines organisations utilisent des formulaires Google, d’autres des formulaires en ligne, et d'autres exigent l’envoi d’un courriel. La confirmation et gestion des quarts est souvent faite par une application de gestion payante ou par simple courriel. Il n’y a pas de cohérence d’une organisation à l’autre.

Pour que les gens s’engagent, il faut qu’ils soient informés des opportunités de bénévolat. C’est surprenant comment ça peut être difficile. Certaines plateformes comme Kijiji proposent des annonces de bénévolat, mais peu d’organisations y publient. Le site accesbenevolat.org offre de nombreux postes permanents et quarts récurrents, mais peu de quarts ponctuels. D’après mon expérience personnelle, j’ai surtout entendu parler des opportunités de bénévolat par bouche-à-oreille. Parfois je voulais faire du bénévolat mais trouver des opportunités en ligne s’avère trop difficile.

### Problématique ou motivations
Le nombre de personnes faisant du bénévolat au Canada a fortement diminué au cours de la dernière décennie, et les adultes savent qu’il peut être difficile de se faire des amis après l’université. L’objectif de cette application est de réduire les obstacles à la recherche d’opportunités de bénévolat ponctuelles et d’encourager les connexions sociales entre bénévoles. Pour atteindre ces objectifs, l’application doit être utile à de nombreuses organisations, ce qui nécessite d’intégrer plusieurs fonctionnalités de gestion des quarts de travail et de bénévoles.

### Proposition et objectifs
Un projet de cette ampleur dépasse ce qu’une seule personne peut réaliser en une session alors ce projet sera davantage un produit minimum viable qu’un produit fini. Côté client, j’utiliserai React Native avec Expo pour créer une application Android et iOS. Côté serveur, ce serait Node.js, Express.js et PostgreSQL. La maquette sera réalisée avec Figma.

Les organisations devraient pouvoir: créer un compte et profil, gérer les quarts, approuver/retirer des bénévoles d’un quart, faire le check-in/out des bénévoles via code QR et sélection manuelle, et créer un formulaire pour un quart.

Les bénévoles devrait pouvoir: créer un compte, voirs leurs quarts, rechercher des organisations, rechercher et filtrer des quarts disponibles, s’inscrire/désinscrire des quarts, remplir un formulaire de quart, faire un check-in/out par code QR, se connecter à d’autres bénévoles par code QR, voir les quarts auxquels leurs contacts sont inscrits et consulter leurs propres statistiques de bénévolat.


## Échéancier

!!! info
    Le suivi complet est disponible dans la page [Suivi de projet](suivi.md).

| Jalon (*Milestone*)            | Date prévue   | Livrable                            | Statut      |
|--------------------------------|---------------|-------------------------------------|-------------|
| Ouverture de projet            | 23 septembre  | Proposition de projet               | ✅ Terminé  |
| Vérification de nouveauté      | 30 septembre  | Document de services existants      | ✅ Terminé  |
| Analyse des exigences          | 30 septembre  | Liste des exigences                 | ✅ Terminé  |
| Architecture                   | 30 septembre  | Diagramme UML ou modèle C4          | ⏳ À venir  |
| Modèle de donneés              | 6 octobre     | Maquette + diagramme de données     | 🔄 En cours |
| Conception                     | 6 octobre     | Maquette Figma                      | ⏳ À venir  |
| Implémentation v1              | 20 octobre    | Application v1                      | ⏳ À venir  |
| Implémentation v2 + tests      | 11 novembre   | Application v2 + Tests              | ⏳ À venir  |
| Implémentation v3              | 1 décembre    | Version avec toute les fonctionalités| ⏳ À venir  |
| Création de serveur            | 8 décembre    | Version qui roule dans le nuage     | ⏳ À venir  |
| Évaluation finale              | 8 décembre    | Analyse des résultats + Discussion  | ⏳ À venir  |
| Présentation + Rapport         | 15 décembre   | Présentation + Rapport              | ⏳ À venir  |
