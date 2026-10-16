using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.IO;
using System.Text.RegularExpressions;
using System.Windows.Forms;

namespace TraitementDeTexte
{
    public partial class Frmedit : Form
    {
        // Un mot = une suite de lettres (accents compris) ou de chiffres.
        // Tout le reste (espaces, ponctuation, retours à la ligne...) est un séparateur.
        private static readonly Regex regexMot = new Regex(@"[\p{L}\p{M}\p{N}]+");

        public Frmedit()
        {
            InitializeComponent();
        }

        private void Frmedit_Load(object sender, EventArgs e)
        {
            AfficherNombreDeMots();
            MettreAJourDictionnaire();
        }

        // ---------- Nombre de mots (mis à jour au fur et à mesure de la saisie) ----------
        private void Txt_saisir_TextChanged(object sender, EventArgs e)
        {
            AfficherNombreDeMots();
        }

        private void AfficherNombreDeMots()
        {
            int nb = regexMot.Matches(Txt_saisir.Text).Count;
            lblNbMots.Text = "Nombre de mots : " + nb;
        }

        // ---------- Boutons du 1er GroupBox ----------
        private void btn_effacer_Click(object sender, EventArgs e)
        {
            Txt_saisir.Clear();
            Txt_saisir.Focus();
        }

        private void btn_enregistrer_Click(object sender, EventArgs e)
        {
            saveFileDialog1.Filter = "txt files (*.txt)|*.txt";

            if (saveFileDialog1.ShowDialog() == System.Windows.Forms.DialogResult.OK
                && saveFileDialog1.FileName.Length > 0)
            {
                StreamWriter sr = File.CreateText(saveFileDialog1.FileName);
                sr.Write(Txt_saisir.Text);
                sr.Close();
                MessageBox.Show("Texte enregistré dans :\n" + saveFileDialog1.FileName, "Enregistrer",
                    MessageBoxButtons.OK, MessageBoxIcon.Information);
            }
        }

        private void btn_quitter_Click(object sender, EventArgs e)
        {
            this.Close();
        }

        // ---------- Dictionnaire (2ème GroupBox) ----------
        private void btn_maj_Click(object sender, EventArgs e)
        {
            MettreAJourDictionnaire();
        }

        private void MettreAJourDictionnaire()
        {
            // Compte les répétitions de chaque mot (en minuscules : "Le" et "le" = même mot).
            // SortedDictionary garde les mots triés dans l'ordre alphabétique français.
            SortedDictionary<string, int> dico = new SortedDictionary<string, int>(StringComparer.CurrentCulture);

            foreach (Match m in regexMot.Matches(Txt_saisir.Text))
            {
                string mot = m.Value.ToLower();
                if (dico.ContainsKey(mot))
                    dico[mot]++;
                else
                    dico[mot] = 1;
            }

            lstDictionnaire.BeginUpdate();
            lstDictionnaire.Items.Clear();
            foreach (KeyValuePair<string, int> entree in dico)
            {
                lstDictionnaire.Items.Add(entree.Key + "  " + entree.Value);
            }
            lstDictionnaire.EndUpdate();
        }

        // ---------- Menu contextuel "Mnu" : copier / couper / coller ----------
        private void Mnu_Opening(object sender, CancelEventArgs e)
        {
            bool selection = Txt_saisir.SelectionLength > 0;
            mnuCopier.Enabled = selection;
            mnuCouper.Enabled = selection;
            mnuColler.Enabled = !string.IsNullOrEmpty(Clipboard.copier);
        }

        private void mnuCopier_Click(object sender, EventArgs e)
        {
            Clipboard.copier = Txt_saisir.SelectedText;
        }

        private void mnuCouper_Click(object sender, EventArgs e)
        {
            Clipboard.copier = Txt_saisir.SelectedText;
            Txt_saisir.SelectedText = "";
        }

        private void mnuColler_Click(object sender, EventArgs e)
        {
            // Remplace la sélection (ou insère à la position du curseur)
            Txt_saisir.SelectedText = Clipboard.copier;
        }
    }
}
