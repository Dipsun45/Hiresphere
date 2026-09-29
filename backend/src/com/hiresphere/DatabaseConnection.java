package com.hiresphere;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

/**
 * HireSphere - MySQL Database Connection Manager
 * Connects to MySQL on localhost:3306 for database 'hiresphere'
 * Uses SET GLOBAL max_allowed_packet to support large base64 file storage
 */
public class DatabaseConnection {
    private static final String URL =
        "jdbc:mysql://127.0.0.1:3306/hiresphere" +
        "?useSSL=false" +
        "&allowPublicKeyRetrieval=true" +
        "&serverTimezone=UTC" +
        "&maxAllowedPacket=67108864";

    private static final String USER = "root";
    private static final String PASSWORD = ""; // Default XAMPP MySQL password is empty

    static {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            System.out.println("[DatabaseConnection] MySQL JDBC Driver loaded successfully.");
        } catch (ClassNotFoundException e) {
            System.err.println("[DatabaseConnection] Error: MySQL JDBC Driver not found in classpath!");
            e.printStackTrace();
        }
    }

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }

    public static boolean testConnection() {
        try (Connection conn = getConnection()) {
            // Also try to increase global packet size
            try (Statement stmt = conn.createStatement()) {
                stmt.execute("SET GLOBAL max_allowed_packet = 67108864");
            } catch (Exception ignored) {}
            return conn != null && !conn.isClosed();
        } catch (SQLException e) {
            System.err.println("[DatabaseConnection] Connection test failed: " + e.getMessage());
            return false;
        }
    }
}
