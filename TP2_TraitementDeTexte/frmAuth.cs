using System;
using System.Windows.Forms;

namespace TraitementDeTexte
{
    public partial class frmAuth : Form
    {
        // Login et mot de passe attendus
        private const string LOGIN = "admin";
        private const string MOT_DE_PASSE = "1234";

        public frmAuth()
        {
            InitializeComponent();
        }

        // Ok : vérifie le login et le mot de passe avant de charger Frmedit
        private void btnOk_Click(object sender, EventArgs e)
        {
            if (txtLogin.Text == LOGIN && Txtpass.Text == MOT_DE_PASSE)
            {
                this.Hide();
                using (Frmedit f = new Frmedit())
                {
                    f.ShowDialog();
                }
                this.Close();   // quand l'éditeur se ferme, l'application se termine
            }
            else
            {
                MessageBox.Show("Login ou mot de passe incorrect.", "Erreur",
                    MessageBoxButtons.OK, MessageBoxIcon.Error);
                Txtpass.Clear();
                Txtpass.Focus();
            }
        }

        // Annuler : quitte l'application
        private void btnAnnuler_Click(object sender, EventArgs e)
        {
            Application.Exit();
        }
    }
}
