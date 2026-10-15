# TP 1 — Programmation Avancée : Calculatrice (VB.NET Windows Forms)

Projet **Windows Forms (VB.NET, .NET 8)** nommé `Calculatrice`.

| Formulaire | Rôle |
|---|---|
| `frmMenu` | Menu principal (FixedDialog, ControlBox = False) : ouvre les deux calculatrices, bouton **Fermer** avec icône au-dessus du texte |
| `Frmcalc1` | Calculatrice simple : 2 nombres (`txtC1`, `txtC2`), opération choisie par boutons radio (`optPlus`, `optMoins`, `optMult`, `optDiv`) dans un GroupBox, résultat dans `txtRes` (lecture seule). La saisie est filtrée par l'événement `KeyPress` (chiffres, une virgule, Retour arrière) |
| `Frmcalc2` | Calculatrice standard : chiffres, virgule, +/-, Retour arrière, CE, C, `+ - * /`, `^` (puissance), `Rac` (racine carrée), `1/x`, `=`. Gère la division par zéro et la saisie au clavier |

## Ouvrir / exécuter

- **Visual Studio 2022** : ouvrir `Calculatrice.vbproj`, puis `F5`.
- **Ligne de commande** (Windows, SDK .NET 8) :
  ```
  dotnet run --project Calculatrice.vbproj
  ```

> Pour un ancien Visual Studio / .NET Framework : créer un projet « Application Windows Forms (VB) » nommé Calculatrice, puis ajouter les fichiers `.vb` (sauf `Program.vb`) et définir `frmMenu` comme formulaire de démarrage.
