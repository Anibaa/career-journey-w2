using System;
using System.Globalization;
using System.Threading;
using System.Windows.Forms;

namespace TraitementDeTexte
{
    internal static class Program
    {
        [STAThread]
        static void Main()
        {
            // Culture française : tri alphabétique correct des mots accentués (é, è, à...)
            CultureInfo culture = new CultureInfo("fr-FR");
            CultureInfo.DefaultThreadCurrentCulture = culture;
            CultureInfo.DefaultThreadCurrentUICulture = culture;
            Thread.CurrentThread.CurrentCulture = culture;
            Thread.CurrentThread.CurrentUICulture = culture;

            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new frmAuth());
        }
    }
}
