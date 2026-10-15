<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()>
Partial Class frmMenu
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
        Me.Btncalc1 = New System.Windows.Forms.Button()
        Me.Btncalc2 = New System.Windows.Forms.Button()
        Me.BtnClose = New System.Windows.Forms.Button()
        Me.SuspendLayout()
        '
        'Btncalc1
        '
        Me.Btncalc1.Location = New System.Drawing.Point(45, 25)
        Me.Btncalc1.Name = "Btncalc1"
        Me.Btncalc1.Size = New System.Drawing.Size(210, 40)
        Me.Btncalc1.TabIndex = 0
        Me.Btncalc1.Text = "&Calculatrice simple"
        Me.Btncalc1.UseVisualStyleBackColor = True
        '
        'Btncalc2
        '
        Me.Btncalc2.Location = New System.Drawing.Point(45, 80)
        Me.Btncalc2.Name = "Btncalc2"
        Me.Btncalc2.Size = New System.Drawing.Size(210, 40)
        Me.Btncalc2.TabIndex = 1
        Me.Btncalc2.Text = "Calculatrice &standard"
        Me.Btncalc2.UseVisualStyleBackColor = True
        '
        'BtnClose
        '
        Me.BtnClose.Location = New System.Drawing.Point(45, 135)
        Me.BtnClose.Name = "BtnClose"
        Me.BtnClose.Size = New System.Drawing.Size(210, 60)
        Me.BtnClose.TabIndex = 2
        Me.BtnClose.Text = "&Fermer"
        Me.BtnClose.TextImageRelation = System.Windows.Forms.TextImageRelation.ImageAboveText
        Me.BtnClose.UseVisualStyleBackColor = True
        '
        'frmMenu
        '
        Me.AutoScaleDimensions = New System.Drawing.SizeF(7.0!, 15.0!)
        Me.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font
        Me.ClientSize = New System.Drawing.Size(300, 220)
        Me.Controls.Add(Me.Btncalc1)
        Me.Controls.Add(Me.Btncalc2)
        Me.Controls.Add(Me.BtnClose)
        Me.ControlBox = False
        Me.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedDialog
        Me.Name = "frmMenu"
        Me.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen
        Me.Text = "Menu principal"
        Me.ResumeLayout(False)

    End Sub

    Friend WithEvents Btncalc1 As System.Windows.Forms.Button
    Friend WithEvents Btncalc2 As System.Windows.Forms.Button
    Friend WithEvents BtnClose As System.Windows.Forms.Button

End Class
