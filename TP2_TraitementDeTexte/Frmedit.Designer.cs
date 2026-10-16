namespace TraitementDeTexte
{
    partial class Frmedit
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
            this.components = new System.ComponentModel.Container();
            this.tableLayoutPanel1 = new System.Windows.Forms.TableLayoutPanel();
            this.groupBox1 = new System.Windows.Forms.GroupBox();
            this.Txt_saisir = new System.Windows.Forms.TextBox();
            this.Mnu = new System.Windows.Forms.ContextMenuStrip(this.components);
            this.mnuCopier = new System.Windows.Forms.ToolStripMenuItem();
            this.mnuCouper = new System.Windows.Forms.ToolStripMenuItem();
            this.mnuColler = new System.Windows.Forms.ToolStripMenuItem();
            this.lblNbMots = new System.Windows.Forms.Label();
            this.btn_effacer = new System.Windows.Forms.Button();
            this.btn_enregistrer = new System.Windows.Forms.Button();
            this.btn_quitter = new System.Windows.Forms.Button();
            this.groupBox2 = new System.Windows.Forms.GroupBox();
            this.lstDictionnaire = new System.Windows.Forms.ListBox();
            this.btn_maj = new System.Windows.Forms.Button();
            this.saveFileDialog1 = new System.Windows.Forms.SaveFileDialog();
            this.tableLayoutPanel1.SuspendLayout();
            this.groupBox1.SuspendLayout();
            this.Mnu.SuspendLayout();
            this.groupBox2.SuspendLayout();
            this.SuspendLayout();
            //
            // tableLayoutPanel1 : 2 colonnes (58 % / 42 %) qui suivent la taille de la fenêtre
            //
            this.tableLayoutPanel1.ColumnCount = 2;
            this.tableLayoutPanel1.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 58F));
            this.tableLayoutPanel1.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 42F));
            this.tableLayoutPanel1.Controls.Add(this.groupBox1, 0, 0);
            this.tableLayoutPanel1.Controls.Add(this.groupBox2, 1, 0);
            this.tableLayoutPanel1.Dock = System.Windows.Forms.DockStyle.Fill;
            this.tableLayoutPanel1.Location = new System.Drawing.Point(6, 6);
            this.tableLayoutPanel1.Name = "tableLayoutPanel1";
            this.tableLayoutPanel1.RowCount = 1;
            this.tableLayoutPanel1.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 100F));
            this.tableLayoutPanel1.Size = new System.Drawing.Size(665, 392);
            this.tableLayoutPanel1.TabIndex = 0;
            //
            // groupBox1
            //
            this.groupBox1.Controls.Add(this.Txt_saisir);
            this.groupBox1.Controls.Add(this.lblNbMots);
            this.groupBox1.Controls.Add(this.btn_effacer);
            this.groupBox1.Controls.Add(this.btn_enregistrer);
            this.groupBox1.Controls.Add(this.btn_quitter);
            this.groupBox1.Dock = System.Windows.Forms.DockStyle.Fill;
            this.groupBox1.Location = new System.Drawing.Point(3, 3);
            this.groupBox1.Name = "groupBox1";
            this.groupBox1.Size = new System.Drawing.Size(380, 386);
            this.groupBox1.TabIndex = 0;
            this.groupBox1.TabStop = false;
            this.groupBox1.Text = "Texte à saisir";
            //
            // Txt_saisir
            //
            this.Txt_saisir.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) | System.Windows.Forms.AnchorStyles.Left) | System.Windows.Forms.AnchorStyles.Right)));
            this.Txt_saisir.ContextMenuStrip = this.Mnu;
            this.Txt_saisir.Location = new System.Drawing.Point(10, 22);
            this.Txt_saisir.Multiline = true;
            this.Txt_saisir.Name = "Txt_saisir";
            this.Txt_saisir.ScrollBars = System.Windows.Forms.ScrollBars.Vertical;
            this.Txt_saisir.Size = new System.Drawing.Size(360, 296);
            this.Txt_saisir.TabIndex = 0;
            this.Txt_saisir.Text = "Ce texte est un exemple. Cet exemple vous servira de modèle. Le modèle contient des mots et des séparateurs. Le dictionnaire ne devra contenir que les mots.";
            this.Txt_saisir.TextChanged += new System.EventHandler(this.Txt_saisir_TextChanged);
            //
            // Mnu
            //
            this.Mnu.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.mnuCopier,
            this.mnuCouper,
            this.mnuColler});
            this.Mnu.Name = "Mnu";
            this.Mnu.Size = new System.Drawing.Size(120, 70);
            this.Mnu.Opening += new System.ComponentModel.CancelEventHandler(this.Mnu_Opening);
            //
            // mnuCopier
            //
            this.mnuCopier.Name = "mnuCopier";
            this.mnuCopier.Size = new System.Drawing.Size(119, 22);
            this.mnuCopier.Text = "Copier";
            this.mnuCopier.Click += new System.EventHandler(this.mnuCopier_Click);
            //
            // mnuCouper
            //
            this.mnuCouper.Name = "mnuCouper";
            this.mnuCouper.Size = new System.Drawing.Size(119, 22);
            this.mnuCouper.Text = "Couper";
            this.mnuCouper.Click += new System.EventHandler(this.mnuCouper_Click);
            //
            // mnuColler
            //
            this.mnuColler.Name = "mnuColler";
            this.mnuColler.Size = new System.Drawing.Size(119, 22);
            this.mnuColler.Text = "Coller";
            this.mnuColler.Click += new System.EventHandler(this.mnuColler_Click);
            //
            // lblNbMots
            //
            this.lblNbMots.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Left)));
            this.lblNbMots.AutoSize = true;
            this.lblNbMots.Location = new System.Drawing.Point(10, 326);
            this.lblNbMots.Name = "lblNbMots";
            this.lblNbMots.Text = "Nombre de mots : 0";
            //
            // btn_effacer
            //
            this.btn_effacer.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Right)));
            this.btn_effacer.Location = new System.Drawing.Point(115, 348);
            this.btn_effacer.Name = "btn_effacer";
            this.btn_effacer.Size = new System.Drawing.Size(80, 28);
            this.btn_effacer.TabIndex = 1;
            this.btn_effacer.Text = "&Effacer";
            this.btn_effacer.UseVisualStyleBackColor = true;
            this.btn_effacer.Click += new System.EventHandler(this.btn_effacer_Click);
            //
            // btn_enregistrer
            //
            this.btn_enregistrer.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Right)));
            this.btn_enregistrer.Location = new System.Drawing.Point(202, 348);
            this.btn_enregistrer.Name = "btn_enregistrer";
            this.btn_enregistrer.Size = new System.Drawing.Size(80, 28);
            this.btn_enregistrer.TabIndex = 2;
            this.btn_enregistrer.Text = "E&nregistrer";
            this.btn_enregistrer.UseVisualStyleBackColor = true;
            this.btn_enregistrer.Click += new System.EventHandler(this.btn_enregistrer_Click);
            //
            // btn_quitter
            //
            this.btn_quitter.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Right)));
            this.btn_quitter.Location = new System.Drawing.Point(290, 348);
            this.btn_quitter.Name = "btn_quitter";
            this.btn_quitter.Size = new System.Drawing.Size(80, 28);
            this.btn_quitter.TabIndex = 3;
            this.btn_quitter.Text = "&Quitter";
            this.btn_quitter.UseVisualStyleBackColor = true;
            this.btn_quitter.Click += new System.EventHandler(this.btn_quitter_Click);
            //
            // groupBox2
            //
            this.groupBox2.Controls.Add(this.lstDictionnaire);
            this.groupBox2.Controls.Add(this.btn_maj);
            this.groupBox2.Dock = System.Windows.Forms.DockStyle.Fill;
            this.groupBox2.Location = new System.Drawing.Point(389, 3);
            this.groupBox2.Name = "groupBox2";
            this.groupBox2.Size = new System.Drawing.Size(273, 386);
            this.groupBox2.TabIndex = 1;
            this.groupBox2.TabStop = false;
            this.groupBox2.Text = "Dictionnaire";
            //
            // lstDictionnaire
            //
            this.lstDictionnaire.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) | System.Windows.Forms.AnchorStyles.Left) | System.Windows.Forms.AnchorStyles.Right)));
            this.lstDictionnaire.FormattingEnabled = true;
            this.lstDictionnaire.IntegralHeight = false;
            this.lstDictionnaire.ItemHeight = 15;
            this.lstDictionnaire.Location = new System.Drawing.Point(10, 22);
            this.lstDictionnaire.Name = "lstDictionnaire";
            this.lstDictionnaire.Size = new System.Drawing.Size(253, 316);
            this.lstDictionnaire.TabIndex = 0;
            //
            // btn_maj
            //
            this.btn_maj.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Left | System.Windows.Forms.AnchorStyles.Right)));
            this.btn_maj.Location = new System.Drawing.Point(36, 348);
            this.btn_maj.Name = "btn_maj";
            this.btn_maj.Size = new System.Drawing.Size(200, 28);
            this.btn_maj.TabIndex = 1;
            this.btn_maj.Text = "&Mettre à jour le dictionnaire";
            this.btn_maj.UseVisualStyleBackColor = true;
            this.btn_maj.Click += new System.EventHandler(this.btn_maj_Click);
            //
            // Frmedit
            //
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(677, 404);
            this.Controls.Add(this.tableLayoutPanel1);
            this.MinimumSize = new System.Drawing.Size(600, 360);
            this.Name = "Frmedit";
            this.Padding = new System.Windows.Forms.Padding(6);
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "Editeur";
            this.Load += new System.EventHandler(this.Frmedit_Load);
            this.tableLayoutPanel1.ResumeLayout(false);
            this.groupBox1.ResumeLayout(false);
            this.groupBox1.PerformLayout();
            this.Mnu.ResumeLayout(false);
            this.groupBox2.ResumeLayout(false);
            this.ResumeLayout(false);
        }

        #endregion

        private System.Windows.Forms.TableLayoutPanel tableLayoutPanel1;
        private System.Windows.Forms.GroupBox groupBox1;
        private System.Windows.Forms.TextBox Txt_saisir;
        private System.Windows.Forms.ContextMenuStrip Mnu;
        private System.Windows.Forms.ToolStripMenuItem mnuCopier;
        private System.Windows.Forms.ToolStripMenuItem mnuCouper;
        private System.Windows.Forms.ToolStripMenuItem mnuColler;
        private System.Windows.Forms.Label lblNbMots;
        private System.Windows.Forms.Button btn_effacer;
        private System.Windows.Forms.Button btn_enregistrer;
        private System.Windows.Forms.Button btn_quitter;
        private System.Windows.Forms.GroupBox groupBox2;
        private System.Windows.Forms.ListBox lstDictionnaire;
        private System.Windows.Forms.Button btn_maj;
        private System.Windows.Forms.SaveFileDialog saveFileDialog1;
    }
}
