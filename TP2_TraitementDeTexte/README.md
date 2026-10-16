# TP 2 — Programmation Avancée : Traitement de texte (C# Windows Forms)

Projet **Windows Forms (C#, .NET 8)** nommé `TraitementDeTexte`.

## Ouvrir / exécuter

Double-cliquer sur **`TraitementDeTexte.sln`** (Visual Studio 2022), puis `F5`.

**Identifiants :** login `admin`, mot de passe `1234` (modifiables dans `frmAuth.cs`).

## Contenu

| Fichier | Rôle |
|---|---|
| `frmAuth` | Authentification : `FixedDialog`, sans boutons Réduire/Agrandir. `Txtpass` a `PasswordChar = *`. **Ok** vérifie login/mot de passe puis ouvre `Frmedit`, sinon message d'erreur. **Annuler** quitte. |
| `Frmedit` | Éditeur (titre « Editeur ») avec 2 GroupBox. **Texte à saisir** : zone `Txt_saisir` multiligne, label du nombre de mots (mis à jour par `TextChanged`), boutons Effacer / Enregistrer / Quitter. **Dictionnaire** : ListBox des mots triés avec leur nombre de répétitions, bouton « Mettre à jour le dictionnaire ». |
| `Clipboard.cs` | Classe avec la variable `public static string copier` utilisée par le menu contextuel. |
| `Program.cs` | Point d'entrée : culture fr-FR (tri des mots accentués) puis ouvre `frmAuth`. |

## Partie optionnelle (faite)

- **Enregistrer** : `SaveFileDialog` + `StreamWriter` (code de l'énoncé, `using System.IO;`).
- **Menu contextuel `Mnu`** (clic droit dans la zone de texte) : Copier, Couper, Coller via `Clipboard.copier`. Copier/Couper sont grisés sans sélection, Coller est grisé tant que rien n'a été copié.
