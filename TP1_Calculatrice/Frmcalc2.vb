Imports System.Drawing
Imports System.Windows.Forms

Public Class Frmcalc2

    Private accumulateur As Double = 0           ' premier opérande / résultat intermédiaire
    Private operateurEnAttente As String = ""    ' opération choisie, en attente du 2ème opérande
    Private nouvelleSaisie As Boolean = True     ' True : le prochain chiffre remplace l'affichage
    Private enErreur As Boolean = False          ' un message d'erreur est affiché

    ' Valeur actuellement affichée
    Private ReadOnly Property ValeurAffichee As Double
        Get
            Dim v As Double
            Double.TryParse(txtAffichage.Text, v)
            Return v
        End Get
    End Property

    Private Sub Afficher(valeur As Double)
        If Double.IsNaN(valeur) OrElse Double.IsInfinity(valeur) Then
            AfficherErreur("Résultat non défini")
        Else
            txtAffichage.Text = valeur.ToString()
        End If
    End Sub

    Private Sub AfficherErreur(message As String)
        txtAffichage.Text = message
        accumulateur = 0
        operateurEnAttente = ""
        nouvelleSaisie = True
        enErreur = True
    End Sub

    Private Sub ReinitialiserSiErreur()
        If enErreur Then
            enErreur = False
            txtAffichage.Text = "0"
            nouvelleSaisie = True
        End If
    End Sub

    Private Function Calculer(a As Double, b As Double, op As String) As Double
        Select Case op
            Case "+" : Return a + b
            Case "-" : Return a - b
            Case "*" : Return a * b
            Case "/"
                If b = 0 Then Throw New DivideByZeroException()
                Return a / b
            Case "^" : Return Math.Pow(a, b)
            Case Else : Return b
        End Select
    End Function

    ' ---------- Chiffres 0..9 ----------
    Private Sub Chiffre_Click(sender As Object, e As EventArgs) Handles _
            btn0.Click, btn1.Click, btn2.Click, btn3.Click, btn4.Click,
            btn5.Click, btn6.Click, btn7.Click, btn8.Click, btn9.Click
        SaisirChiffre(DirectCast(sender, Button).Text)
    End Sub

    Private Sub SaisirChiffre(chiffre As String)
        ReinitialiserSiErreur()
        If nouvelleSaisie OrElse txtAffichage.Text = "0" Then
            txtAffichage.Text = chiffre
        ElseIf txtAffichage.Text = "-0" Then
            txtAffichage.Text = "-" & chiffre
        Else
            txtAffichage.Text &= chiffre
        End If
        nouvelleSaisie = False
    End Sub

    ' ---------- Virgule ----------
    Private Sub btnVirgule_Click(sender As Object, e As EventArgs) Handles btnVirgule.Click
        ReinitialiserSiErreur()
        If nouvelleSaisie Then
            txtAffichage.Text = "0,"
            nouvelleSaisie = False
        ElseIf Not txtAffichage.Text.Contains(","c) Then
            txtAffichage.Text &= ","
        End If
    End Sub

    ' ---------- +/- ----------
    Private Sub btnSigne_Click(sender As Object, e As EventArgs) Handles btnSigne.Click
        If enErreur Then Return
        If txtAffichage.Text.StartsWith("-") Then
            txtAffichage.Text = txtAffichage.Text.Substring(1)
        ElseIf txtAffichage.Text <> "0" Then
            txtAffichage.Text = "-" & txtAffichage.Text
        End If
    End Sub

    ' ---------- Retour arrière / CE / C ----------
    Private Sub btnRetour_Click(sender As Object, e As EventArgs) Handles btnRetour.Click
        If enErreur Then
            ReinitialiserSiErreur()
            Return
        End If
        If nouvelleSaisie Then Return   ' on n'efface pas un résultat
        Dim t As String = txtAffichage.Text.Substring(0, txtAffichage.Text.Length - 1)
        If t = "" OrElse t = "-" Then
            txtAffichage.Text = "0"
            nouvelleSaisie = True
        Else
            txtAffichage.Text = t
        End If
    End Sub

    ' CE : efface uniquement la saisie en cours
    Private Sub btnCE_Click(sender As Object, e As EventArgs) Handles btnCE.Click
        enErreur = False
        txtAffichage.Text = "0"
        nouvelleSaisie = True
    End Sub

    ' C : remise à zéro complète
    Private Sub btnC_Click(sender As Object, e As EventArgs) Handles btnC.Click
        enErreur = False
        accumulateur = 0
        operateurEnAttente = ""
        txtAffichage.Text = "0"
        nouvelleSaisie = True
    End Sub

    ' ---------- Opérations binaires : + - * / ^ ----------
    Private Sub Operateur_Click(sender As Object, e As EventArgs) Handles _
            btnPlus.Click, btnMoins.Click, btnMult.Click, btnDiv.Click, btnPuissance.Click
        AppliquerOperateur(DirectCast(sender, Button).Text)
    End Sub

    Private Sub AppliquerOperateur(op As String)
        If enErreur Then Return
        Try
            ' Enchaînement (ex : 2 + 3 * ...) : on calcule d'abord l'opération en attente
            If Not nouvelleSaisie AndAlso operateurEnAttente <> "" Then
                accumulateur = Calculer(accumulateur, ValeurAffichee, operateurEnAttente)
                Afficher(accumulateur)
                If enErreur Then Return
            ElseIf operateurEnAttente = "" Then
                accumulateur = ValeurAffichee
            End If
            operateurEnAttente = op
            nouvelleSaisie = True
        Catch ex As DivideByZeroException
            AfficherErreur("Division par zéro impossible")
        End Try
    End Sub

    ' ---------- = ----------
    Private Sub btnEgal_Click(sender As Object, e As EventArgs) Handles btnEgal.Click
        Egal()
    End Sub

    Private Sub Egal()
        If enErreur OrElse operateurEnAttente = "" Then Return
        Try
            Dim resultat As Double = Calculer(accumulateur, ValeurAffichee, operateurEnAttente)
            operateurEnAttente = ""
            accumulateur = 0
            Afficher(resultat)
            nouvelleSaisie = True
        Catch ex As DivideByZeroException
            AfficherErreur("Division par zéro impossible")
        End Try
    End Sub

    ' ---------- Opérations unaires : Rac et 1/x ----------
    Private Sub btnRac_Click(sender As Object, e As EventArgs) Handles btnRac.Click
        If enErreur Then Return
        Dim x As Double = ValeurAffichee
        If x < 0 Then
            AfficherErreur("Entrée non valide")
        Else
            Afficher(Math.Sqrt(x))
            nouvelleSaisie = True
        End If
    End Sub

    Private Sub btnInverse_Click(sender As Object, e As EventArgs) Handles btnInverse.Click
        If enErreur Then Return
        Dim x As Double = ValeurAffichee
        If x = 0 Then
            AfficherErreur("Division par zéro impossible")
        Else
            Afficher(1 / x)
            nouvelleSaisie = True
        End If
    End Sub

    ' ---------- Saisie au clavier ----------
    Private Sub Frmcalc2_KeyPress(sender As Object, e As KeyPressEventArgs) Handles Me.KeyPress
        Dim c As Char = e.KeyChar
        If Char.IsDigit(c) Then
            SaisirChiffre(c.ToString())
        ElseIf c = ","c OrElse c = "."c Then
            btnVirgule.PerformClick()
        ElseIf "+-*/^".Contains(c) Then
            AppliquerOperateur(c.ToString())
        ElseIf c = "="c Then
            Egal()
        ElseIf c = ControlChars.Back Then
            btnRetour.PerformClick()
        ElseIf c = ChrW(Keys.Escape) Then
            btnC.PerformClick()
        Else
            Return
        End If
        e.Handled = True
    End Sub

End Class
