Imports System.Drawing
Imports System.Windows.Forms

Public Class Frmcalc1

    ' Décharge la feuille
    Private Sub btnclose_Click(sender As Object, e As EventArgs) Handles btnclose.Click
        Me.Close()
    End Sub

    ' Effectue l'opération sélectionnée
    Private Sub btncalculer_Click(sender As Object, e As EventArgs) Handles btncalculer.Click
        Dim a, b As Double

        If Not Double.TryParse(txtC1.Text, a) Then
            MessageBox.Show("Nombre 1 invalide.", "Erreur", MessageBoxButtons.OK, MessageBoxIcon.Warning)
            txtC1.Focus()
            Return
        End If
        If Not Double.TryParse(txtC2.Text, b) Then
            MessageBox.Show("Nombre 2 invalide.", "Erreur", MessageBoxButtons.OK, MessageBoxIcon.Warning)
            txtC2.Focus()
            Return
        End If

        If optPlus.Checked Then
            txtRes.Text = (a + b).ToString()
        ElseIf optMoins.Checked Then
            txtRes.Text = (a - b).ToString()
        ElseIf optMult.Checked Then
            txtRes.Text = (a * b).ToString()
        ElseIf optDiv.Checked Then
            If b = 0 Then
                MessageBox.Show("Division par zéro impossible.", "Erreur", MessageBoxButtons.OK, MessageBoxIcon.Error)
                txtRes.Text = "0"
            Else
                txtRes.Text = (a / b).ToString()
            End If
        Else
            MessageBox.Show("Veuillez choisir une opération.", "Erreur", MessageBoxButtons.OK, MessageBoxIcon.Information)
        End If
    End Sub

    ' Filtre la saisie : chiffres, une seule virgule et la touche Retour arrière (vbBack)
    Private Sub txtC_KeyPress(sender As Object, e As KeyPressEventArgs) Handles txtC1.KeyPress, txtC2.KeyPress
        Dim txt As TextBox = DirectCast(sender, TextBox)

        If Char.IsDigit(e.KeyChar) OrElse e.KeyChar = ControlChars.Back Then   ' ControlChars.Back = vbBack
            e.Handled = False
        ElseIf e.KeyChar = ","c AndAlso Not txt.Text.Contains(","c) Then
            e.Handled = False
        Else
            e.Handled = True   ' caractère refusé
        End If
    End Sub

    ' Sélectionne tout le contenu à l'entrée dans la zone de texte (pratique pour remplacer le "0")
    Private Sub txtC_Enter(sender As Object, e As EventArgs) Handles txtC1.Enter, txtC2.Enter
        DirectCast(sender, TextBox).SelectAll()
    End Sub

End Class
