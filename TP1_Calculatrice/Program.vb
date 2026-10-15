Imports System.Globalization
Imports System.Windows.Forms

Module Program

    <STAThread>
    Sub Main()
        ' La virgule "," est utilisée comme séparateur décimal (culture française)
        Dim culture As New CultureInfo("fr-FR")
        CultureInfo.DefaultThreadCurrentCulture = culture
        CultureInfo.DefaultThreadCurrentUICulture = culture
        System.Threading.Thread.CurrentThread.CurrentCulture = culture
        System.Threading.Thread.CurrentThread.CurrentUICulture = culture

        Application.EnableVisualStyles()
        Application.SetCompatibleTextRenderingDefault(False)
        Application.Run(New frmMenu())
    End Sub

End Module
