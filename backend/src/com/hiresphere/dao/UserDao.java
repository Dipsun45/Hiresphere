package com.hiresphere.dao;

import com.hiresphere.DatabaseConnection;
import com.hiresphere.model.User;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

/**
 * HireSphere - Data Access Object for userlogin table (MySQL)
 */
public class UserDao {

    /**
     * Finds a user by user_id
     */
    public User findByUserId(String userId) {
        String sql = "SELECT id, user_id, password FROM userlogin WHERE LOWER(user_id) = LOWER(?)";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, userId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return new User(
                        rs.getInt("id"),
                        rs.getString("user_id"),
                        rs.getString("password")
                    );
                }
            }
        } catch (SQLException e) {
            System.err.println("[UserDao] Error finding user: " + e.getMessage());
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Saves user into database if not present, or authenticates if already present.
     */
    public User saveOrAuthenticate(String userId, String password) throws SQLException {
        User existing = findByUserId(userId);
        if (existing != null) {
            // User exists: verify password
            if (existing.getPassword().equals(password)) {
                System.out.println("[UserDao] User authenticated successfully: " + userId);
                return existing;
            } else {
                // Incorrect password
                System.out.println("[UserDao] Authentication failed for user: " + userId + " - Incorrect password.");
                return null;
            }
        }

        // New user: INSERT into hiresphere.userlogin
        String insertSql = "INSERT INTO userlogin (user_id, password) VALUES (?, ?)";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(insertSql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setString(1, userId);
            stmt.setString(2, password);
            int affected = stmt.executeUpdate();
            if (affected > 0) {
                int generatedId = 0;
                try (ResultSet keys = stmt.getGeneratedKeys()) {
                    if (keys.next()) {
                        generatedId = keys.getInt(1);
                    }
                }
                System.out.println("[UserDao] New user saved to database: ID=" + generatedId + ", user_id=" + userId);
                return new User(generatedId, userId, password);
            }
        }

        throw new SQLException("Failed to save user into userlogin table.");
    }
}
