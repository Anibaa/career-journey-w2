<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()>
Partial Class Frmcalc1
    Inherits System.Windows.Forms.Form

    <System.Diagnostics.DebuggerNonUserCode()>
    Protected Overrides Sub Dispose(ByVal disposing As Boolean)
        Try
            If disposing AndAlso components IsNot Nothing Then
                components.Dispose()
            End If
        Finally
            MyBase.Dispose(disposing)
        End Try
    End Sub

    Private components As System.ComponentModel.IContainer

    <System.Diagnostics.DebuggerStepThrough()>
    Private Sub InitializeComponent()
        Me.lblNombre1 = New System.Windows.Forms.Label()
        Me.lblNombre2 = New System.Windows.Forms.Label()
        Me.lblResultat = New System.Windows.Forms.Label()
        Me.txtC1 = New System.Windows.Forms.TextBox()
        Me.txtC2 = New System.Windows.Forms.TextBox()
        Me.txtRes = New System.Windows.Forms.TextBox()
        Me.grpOperations = New System.Windows.Forms.GroupBox()
        Me.optPlus = New System.Windows.Forms.RadioButton()
        Me.optMoins = New System.Windows.Forms.RadioButton()
        Me.optDiv = New System.Windows.Forms.RadioButton()
        Me.optMult = New System.Windows.Forms.RadioButton()
        Me.btncalculer = New System.Windows.Forms.Button()
        Me.btnclose = New System.Windows.Forms.Button()
        Me.grpOperations.SuspendLayout()
        Me.SuspendLayout()
        '
        'lblNombre1
        '
        Me.lblNombre1.AutoSize = True
        Me.lblNombre1.Location = New System.Drawing.Point(40, 30)
        Me.lblNombre1.Name = "lblNombre1"
        Me.lblNombre1.Text = "Nombre 1"
        '
        'txtC1
        '
        Me.txtC1.Location = New System.Drawing.Point(125, 27)
        Me.txtC1.Name = "txtC1"
        Me.txtC1.Size = New System.Drawing.Size(105, 23)
        Me.txtC1.TabIndex = 0
        Me.txtC1.Text = "0"
        Me.txtC1.TextAlign = System.Windows.Forms.HorizontalAlignment.Right
        '
        'lblNombre2
        '
        Me.lblNombre2.AutoSize = True
        Me.lblNombre2.Location = New System.Drawing.Point(40, 70)
        Me.lblNombre2.Name = "lblNombre2"
        Me.lblNombre2.Text = "Nombre 2"
        '
        'txtC2
        '
        Me.txtC2.Location = New System.Drawing.Point(125, 67)
        Me.txtC2.Name = "txtC2"
        Me.txtC2.Size = New System.Drawing.Size(105, 23)
        Me.txtC2.TabIndex = 1
        Me.txtC2.Text = "0"
        Me.txtC2.TextAlign = System.Windows.Forms.HorizontalAlignment.Right
        '
        'grpOperations
        '
        Me.grpOperations.Controls.Add(Me.optPlus)
        Me.grpOperations.Controls.Add(Me.optMoins)
        Me.grpOperations.Controls.Add(Me.optDiv)
        Me.grpOperations.Controls.Add(Me.optMult)
        Me.grpOperations.Location = New System.Drawing.Point(30, 105)
        Me.grpOperations.Name = "grpOperations"
        Me.grpOperations.Size = New System.Drawing.Size(220, 55)
        Me.grpOperations.TabIndex = 2
        Me.grpOperations.TabStop = False
        Me.grpOperations.Text = "Opérations"
        '
        'optPlus
        '
        Me.optPlus.AutoSize = True
        Me.optPlus.Checked = True
        Me.optPlus.Location = New System.Drawing.Point(15, 23)
        Me.optPlus.Name = "optPlus"
        Me.optPlus.TabIndex = 0
        Me.optPlus.TabStop = True
        Me.optPlus.Text = "+"
        '
        'optMoins
        '
        Me.optMoins.AutoSize = True
        Me.optMoins.Location = New System.Drawing.Point(65, 23)
        Me.optMoins.Name = "optMoins"
        Me.optMoins.TabIndex = 1
        Me.optMoins.Text = "-"
        '
        'optDiv
        '
        Me.optDiv.AutoSize = True
        Me.optDiv.Location = New System.Drawing.Point(115, 23)
        Me.optDiv.Name = "optDiv"
        Me.optDiv.TabIndex = 2
        Me.optDiv.Text = "/"
        '
        'optMult
        '
        Me.optMult.AutoSize = True
        Me.optMult.Location = New System.Drawing.Point(165, 23)
        Me.optMult.Name = "optMult"
        Me.optMult.TabIndex = 3
        Me.optMult.Text = "*"
        '
        'lblResultat
        '
        Me.lblResultat.AutoSize = True
        Me.lblResultat.Location = New System.Drawing.Point(40, 180)
        Me.lblResultat.Name = "lblResultat"
        Me.lblResultat.Text = "Résultat"
        '
        'txtRes
        '
        Me.txtRes.Location = New System.Drawing.Point(125, 177)
        Me.txtRes.Name = "txtRes"
        Me.txtRes.ReadOnly = True
        Me.txtRes.Size = New System.Drawing.Size(105, 23)
        Me.txtRes.TabIndex = 5
        Me.txtRes.TabStop = False
        Me.txtRes.Text = "0"
        Me.txtRes.TextAlign = System.Windows.Forms.HorizontalAlignment.Right
        '
        'btncalculer
        '
        Me.btncalculer.Location = New System.Drawing.Point(40, 225)
        Me.btncalculer.Name = "btncalculer"
        Me.btncalculer.Size = New System.Drawing.Size(85, 28)
        Me.btncalculer.TabIndex = 3
        Me.btncalculer.Text = "&Calculer"
        Me.btncalculer.UseVisualStyleBackColor = True
        '
        'btnclose
        '
        Me.btnclose.Location = New System.Drawing.Point(145, 225)
        Me.btnclose.Name = "btnclose"
        Me.btnclose.Size = New System.Drawing.Size(85, 28)
        Me.btnclose.TabIndex = 4
        Me.btnclose.Text = "&Fermer"
        Me.btnclose.UseVisualStyleBackColor = True
        '
        'Frmcalc1
        '
        Me.AcceptButton = Me.btncalculer
        Me.AutoScaleDimensions = New System.Drawing.SizeF(7.0!, 15.0!)
        Me.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font
        Me.ClientSize = New System.Drawing.Size(280, 280)
        Me.Controls.Add(Me.lblNombre1)
        Me.Controls.Add(Me.txtC1)
        Me.Controls.Add(Me.lblNombre2)
        Me.Controls.Add(Me.txtC2)
        Me.Controls.Add(Me.grpOperations)
        Me.Controls.Add(Me.lblResultat)
        Me.Controls.Add(Me.txtRes)
        Me.Controls.Add(Me.btncalculer)
        Me.Controls.Add(Me.btnclose)
        Me.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle
        Me.MaximizeBox = False
        Me.MinimizeBox = False
        Me.Name = "Frmcalc1"
        Me.StartPosition = System.Windows.Forms.FormStartPosition.CenterParent
        Me.Text = "Calculatrice simple"
        Me.grpOperations.ResumeLayout(False)
        Me.grpOperations.PerformLayout()
        Me.ResumeLayout(False)
        Me.PerformLayout()

    End Sub

    Friend WithEvents lblNombre1 As System.Windows.Forms.Label
    Friend WithEvents lblNombre2 As System.Windows.Forms.Label
    Friend WithEvents lblResultat As System.Windows.Forms.Label
    Friend WithEvents txtC1 As System.Windows.Forms.TextBox
    Friend WithEvents txtC2 As System.Windows.Forms.TextBox
    Friend WithEvents txtRes As System.Windows.Forms.TextBox
    Friend WithEvents grpOperations As System.Windows.Forms.GroupBox
    Friend WithEvents optPlus As System.Windows.Forms.RadioButton
    Friend WithEvents optMoins As System.Windows.Forms.RadioButton
    Friend WithEvents optDiv As System.Windows.Forms.RadioButton
    Friend WithEvents optMult As System.Windows.Forms.RadioButton
    Friend WithEvents btncalculer As System.Windows.Forms.Button
    Friend WithEvents btnclose As System.Windows.Forms.Button

End Class
