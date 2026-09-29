package com.hiresphere.dao;

import com.hiresphere.DatabaseConnection;
import com.hiresphere.model.UserMessage;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Data Access Object for handling MySQL operations on the `messages` table
 */
public class MessageDao {

    /**
     * Initializes the `messages` database table if it doesn't exist already.
     */
    public void initTable() {
        String sql = "CREATE TABLE IF NOT EXISTS messages (" +
                "id INT AUTO_INCREMENT PRIMARY KEY, " +
                "user_id VARCHAR(100) NOT NULL, " +
                "full_name VARCHAR(150) NOT NULL, " +
                "email_address VARCHAR(150) NOT NULL, " +
                "phone_no VARCHAR(50), " +
                "subject VARCHAR(200) NOT NULL, " +
                "message_content TEXT NOT NULL, " +
                "status VARCHAR(50) DEFAULT 'Pending', " +
                "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP" +
                ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";

        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement()) {
            stmt.executeUpdate(sql);
            System.out.println("[MessageDao] MySQL table 'messages' initialized successfully.");
        } catch (SQLException e) {
            System.err.println("[MessageDao] Error initializing 'messages' table: " + e.getMessage());
        }
    }

    /**
     * Inserts a new user message into MySQL `messages` table.
     */
    public boolean saveMessage(UserMessage message) {
        String sql = "INSERT INTO messages (user_id, full_name, email_address, phone_no, subject, message_content, status) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            stmt.setString(1, message.getUserId());
            stmt.setString(2, message.getFullName());
            stmt.setString(3, message.getEmailAddress());
            stmt.setString(4, message.getPhoneNo() != null ? message.getPhoneNo() : "");
            stmt.setString(5, message.getSubject());
            stmt.setString(6, message.getMessageContent());
            stmt.setString(7, message.getStatus() != null ? message.getStatus() : "Pending");

            int rows = stmt.executeUpdate();
            if (rows > 0) {
                try (ResultSet rs = stmt.getGeneratedKeys()) {
                    if (rs.next()) {
                        message.setId(rs.getInt(1));
                    }
                }
                return true;
            }
        } catch (SQLException e) {
            System.err.println("[MessageDao] Error inserting message: " + e.getMessage());
        }
        return false;
    }

    /**
     * Retrieves all messages sent by a specific user from MySQL `messages` table.
     */
    public List<UserMessage> getMessagesByUserId(String userId) {
        List<UserMessage> list = new ArrayList<>();
        String sql = "SELECT id, user_id, full_name, email_address, phone_no, subject, message_content, status, created_at " +
                "FROM messages WHERE user_id = ? ORDER BY id DESC";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, userId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    UserMessage msg = new UserMessage();
                    msg.setId(rs.getInt("id"));
                    msg.setUserId(rs.getString("user_id"));
                    msg.setFullName(rs.getString("full_name"));
                    msg.setEmailAddress(rs.getString("email_address"));
                    msg.setPhoneNo(rs.getString("phone_no"));
                    msg.setSubject(rs.getString("subject"));
                    msg.setMessageContent(rs.getString("message_content"));
                    msg.setStatus(rs.getString("status"));
                    msg.setCreatedAt(rs.getString("created_at"));
                    list.add(msg);
                }
            }
        } catch (SQLException e) {
            System.err.println("[MessageDao] Error retrieving messages for user " + userId + ": " + e.getMessage());
        }
        return list;
    }

    /**
     * Deletes a message by ID for a user.
     */
    public boolean deleteMessage(int id, String userId) {
        String sql = "DELETE FROM messages WHERE id = ? AND user_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, id);
            stmt.setString(2, userId);
            int rows = stmt.executeUpdate();
            return rows > 0;
        } catch (SQLException e) {
            System.err.println("[MessageDao] Error deleting message ID " + id + ": " + e.getMessage());
        }
        return false;
    }
}
