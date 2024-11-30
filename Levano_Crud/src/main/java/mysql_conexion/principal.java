
package mysql_conexion;

import conexion.conexiones;


public class principal {

    public static void main(String[] args) {
        conexiones padre = new conexiones();
        padre.getConexion();
    }
}
