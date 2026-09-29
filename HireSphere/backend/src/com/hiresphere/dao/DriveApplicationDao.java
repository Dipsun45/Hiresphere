package com.hiresphere.dao;

import com.hiresphere.DatabaseConnection;
import com.hiresphere.model.DriveApplication;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Data Access Object for handling MySQL operations on the `drive_applications` table
 */
public class DriveApplicationDao {

    /**
     * Initializes the `drive_applications` MySQL table if it doesn't exist already.
     */
    public void initTable() {
        String sql = "CREATE TABLE IF NOT EXISTS drive_applications (" +
                "id INT AUTO_INCREMENT PRIMARY KEY, " +
                "user_id VARCHAR(100) NOT NULL, " +
                "company_name VARCHAR(150) NOT NULL, " +
                "job_title VARCHAR(150) NOT NULL, " +
                "full_name VARCHAR(150) NOT NULL, " +
                "email VARCHAR(150) NOT NULL, " +
                "phone VARCHAR(50) NOT NULL, " +
                "qualification VARCHAR(100) NOT NULL, " +
                "experience VARCHAR(50) NOT NULL, " +
                "skills TEXT NOT NULL, " +
                "resume_url LONGTEXT, " +
                "cover_letter TEXT, " +
                "application_status VARCHAR(50) DEFAULT 'Submitted', " +
                "applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP" +
                ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";

        String alterSql = "ALTER TABLE drive_applications MODIFY resume_url LONGTEXT;";

        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement()) {
            stmt.executeUpdate(sql);
            try {
                stmt.executeUpdate(alterSql);
            } catch (SQLException ignored) {
                // Ignore if it fails
            }
            System.out.println("[DriveApplicationDao] MySQL table 'drive_applications' initialized successfully.");
        } catch (SQLException e) {
            System.err.println("[DriveApplicationDao] Error initializing 'drive_applications' table: " + e.getMessage());
        }
    }

    /**
     * Saves a new drive application into MySQL `drive_applications` table.
     */
    public boolean saveApplication(DriveApplication app) {
        String sql = "INSERT INTO drive_applications " +
                "(user_id, company_name, job_title, full_name, email, phone, qualification, experience, skills, resume_url, cover_letter, application_status) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            stmt.setString(1, app.getUserId());
            stmt.setString(2, app.getCompanyName());
            stmt.setString(3, app.getJobTitle());
            stmt.setString(4, app.getFullName());
            stmt.setString(5, app.getEmail());
            stmt.setString(6, app.getPhone());
            stmt.setString(7, app.getQualification());
            stmt.setString(8, app.getExperience());
            stmt.setString(9, app.getSkills());
            stmt.setString(10, app.getResumeUrl() != null ? app.getResumeUrl() : "");
            stmt.setString(11, app.getCoverLetter() != null ? app.getCoverLetter() : "");
            stmt.setString(12, app.getApplicationStatus() != null ? app.getApplicationStatus() : "Submitted");

            int rows = stmt.executeUpdate();
            if (rows > 0) {
                try (ResultSet rs = stmt.getGeneratedKeys()) {
                    if (rs.next()) {
                        app.setId(rs.getInt(1));
                    }
                }
                return true;
            }
        } catch (SQLException e) {
            System.err.println("[DriveApplicationDao] Error saving drive application: " + e.getMessage());
            e.printStackTrace();
        }
        return false;
    }

    /**
     * Retrieves all drive applications submitted by a specific user.
     */
    public List<DriveApplication> getApplicationsByUserId(String userId) {
        List<DriveApplication> list = new ArrayList<>();
        String sql = "SELECT * FROM drive_applications WHERE user_id = ? ORDER BY applied_at DESC";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, userId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    DriveApplication app = new DriveApplication();
                    app.setId(rs.getInt("id"));
                    app.setUserId(rs.getString("user_id"));
                    app.setCompanyName(rs.getString("company_name"));
                    app.setJobTitle(rs.getString("job_title"));
                    app.setFullName(rs.getString("full_name"));
                    app.setEmail(rs.getString("email"));
                    app.setPhone(rs.getString("phone"));
                    app.setQualification(rs.getString("qualification"));
                    app.setExperience(rs.getString("experience"));
                    app.setSkills(rs.getString("skills"));
                    app.setResumeUrl(rs.getString("resume_url"));
                    app.setCoverLetter(rs.getString("cover_letter"));
                    app.setApplicationStatus(rs.getString("application_status"));
                    app.setAppliedAt(rs.getString("applied_at"));
                    list.add(app);
                }
            }
        } catch (SQLException e) {
            System.err.println("[DriveApplicationDao] Error fetching applications for user " + userId + ": " + e.getMessage());
        }
        return list;
    }

    /**
     * Deletes / Withdraws a drive application for a specific user.
     */
    public boolean deleteApplication(int id, String userId) {
        String sql = "DELETE FROM drive_applications WHERE id = ? AND user_id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            stmt.setString(2, userId);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("[DriveApplicationDao] Error deleting application id " + id + ": " + e.getMessage());
            return false;
        }
    }
}
