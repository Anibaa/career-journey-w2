Imports System.Drawing
Imports System.Windows.Forms

Public Class frmMenu

    Private Sub frmMenu_Load(sender As Object, e As EventArgs) Handles MyBase.Load
        ' Icône représentative pour le bouton Fermer (croix rouge du système)
        BtnClose.Image = SystemIcons.Error.ToBitmap()
    End Sub

    ' Ferme l'application
    Private Sub BtnClose_Click(sender As Object, e As EventArgs) Handles BtnClose.Click
        Application.Exit()
    End Sub

    ' Affiche la calculatrice simple
    Private Sub Btncalc1_Click(sender As Object, e As EventArgs) Handles Btncalc1.Click
        Using f As New Frmcalc1()
            f.ShowDialog(Me)
        End Using
    End Sub

    ' Affiche la calculatrice standard
    Private Sub Btncalc2_Click(sender As Object, e As EventArgs) Handles Btncalc2.Click
        Using f As New Frmcalc2()
            f.ShowDialog(Me)
        End Using
    End Sub

End Class
