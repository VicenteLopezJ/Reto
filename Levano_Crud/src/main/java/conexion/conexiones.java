package conexion;

import java.sql.Connection;
import java.sql.DriverManager;
import javax.swing.JOptionPane;

/**
 *
 * @author Usuario
 */
public class conexiones {
     Connection conectar = null; 
     String usuario = "admin";
     String password = "llampier2";
     String bd = "base_datos1";
     String ip = "bdformandcalen.cta8k88a0vve.us-east-1.rds.amazonaws.com";
     String puerto = "3306";

    private String cadena = "jdbc:mysql://"+ip+":"+puerto+"/"+bd;

    // Método para conectar a la base de datos
    public Connection getConexion() {
        try {
            if (conectar == null || conectar.isClosed()) {
                Class.forName("com.mysql.cj.jdbc.Driver");
                conectar = DriverManager.getConnection(cadena, usuario, password);
                JOptionPane.showMessageDialog(null, "Se conectó a la base de datos");
            }
        } catch (Exception e) {
            JOptionPane.showMessageDialog(null, "No se conectó a la base de datos, error: " + e.toString());
        }
        return conectar;
    }

}
