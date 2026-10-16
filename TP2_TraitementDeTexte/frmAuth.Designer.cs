namespace TraitementDeTexte
{
    partial class frmAuth
    {
        private System.ComponentModel.IContainer components = null;

        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Code généré par le Concepteur Windows Form

        private void InitializeComponent()
        {
            this.lblLogin = new System.Windows.Forms.Label();
            this.txtLogin = new System.Windows.Forms.TextBox();
            this.lblPass = new System.Windows.Forms.Label();
            this.Txtpass = new System.Windows.Forms.TextBox();
            this.btnOk = new System.Windows.Forms.Button();
            this.btnAnnuler = new System.Windows.Forms.Button();
            this.SuspendLayout();
            //
            // lblLogin
            //
            this.lblLogin.AutoSize = true;
            this.lblLogin.Location = new System.Drawing.Point(60, 40);
            this.lblLogin.Name = "lblLogin";
            this.lblLogin.Text = "Login";
            //
            // txtLogin
            //
            this.txtLogin.Location = new System.Drawing.Point(60, 60);
            this.txtLogin.Name = "txtLogin";
            this.txtLogin.Size = new System.Drawing.Size(180, 23);
            this.txtLogin.TabIndex = 0;
            //
            // lblPass
            //
            this.lblPass.AutoSize = true;
            this.lblPass.Location = new System.Drawing.Point(60, 100);
            this.lblPass.Name = "lblPass";
            this.lblPass.Text = "Mot de passe";
            //
            // Txtpass
            //
            this.Txtpass.Location = new System.Drawing.Point(60, 120);
            this.Txtpass.Name = "Txtpass";
            this.Txtpass.PasswordChar = '*';
            this.Txtpass.Size = new System.Drawing.Size(180, 23);
            this.Txtpass.TabIndex = 1;
            //
            // btnOk
            //
            this.btnOk.Location = new System.Drawing.Point(60, 190);
            this.btnOk.Name = "btnOk";
            this.btnOk.Size = new System.Drawing.Size(85, 30);
            this.btnOk.TabIndex = 2;
            this.btnOk.Text = "&Ok";
            this.btnOk.UseVisualStyleBackColor = true;
            this.btnOk.Click += new System.EventHandler(this.btnOk_Click);
            //
            // btnAnnuler
            //
            this.btnAnnuler.Location = new System.Drawing.Point(155, 190);
            this.btnAnnuler.Name = "btnAnnuler";
            this.btnAnnuler.Size = new System.Drawing.Size(85, 30);
            this.btnAnnuler.TabIndex = 3;
            this.btnAnnuler.Text = "&Annuler";
            this.btnAnnuler.UseVisualStyleBackColor = true;
            this.btnAnnuler.Click += new System.EventHandler(this.btnAnnuler_Click);
            //
            // frmAuth
            //
            this.AcceptButton = this.btnOk;
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.CancelButton = this.btnAnnuler;
            this.ClientSize = new System.Drawing.Size(300, 260);
            this.Controls.Add(this.lblLogin);
            this.Controls.Add(this.txtLogin);
            this.Controls.Add(this.lblPass);
            this.Controls.Add(this.Txtpass);
            this.Controls.Add(this.btnOk);
            this.Controls.Add(this.btnAnnuler);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.Name = "frmAuth";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "Authentification";
            this.ResumeLayout(false);
            this.PerformLayout();
        }

        #endregion

        private System.Windows.Forms.Label lblLogin;
        private System.Windows.Forms.TextBox txtLogin;
        private System.Windows.Forms.Label lblPass;
        private System.Windows.Forms.TextBox Txtpass;
        private System.Windows.Forms.Button btnOk;
        private System.Windows.Forms.Button btnAnnuler;
    }
}
