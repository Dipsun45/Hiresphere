package com.hiresphere.dao;

import com.hiresphere.DatabaseConnection;
import com.hiresphere.model.Project;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Data Access Object for MySQL `projects` table
 */
public class ProjectDao {

    /**
     * Creates the `projects` table if it doesn't exist
     */
    public void initTable() {
        String sql = "CREATE TABLE IF NOT EXISTS projects (" +
                "id INT AUTO_INCREMENT PRIMARY KEY, " +
                "user_id VARCHAR(150) NOT NULL, " +
                "project_name VARCHAR(255) NOT NULL, " +
                "project_description TEXT, " +
                "tech_stack VARCHAR(500), " +
                "category VARCHAR(100), " +
                "live_url VARCHAR(500), " +
                "github_url VARCHAR(500), " +
                "start_date VARCHAR(50), " +
                "end_date VARCHAR(50), " +
                "project_photo LONGTEXT, " +
                "project_zip LONGTEXT, " +
                "project_zip_name VARCHAR(255), " +
                "cert_name VARCHAR(255), " +
                "cert_issuer VARCHAR(255), " +
                "cert_date VARCHAR(50), " +
                "cert_url VARCHAR(500), " +
                "cert_photo LONGTEXT, " +
                "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP" +
                ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";

        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement()) {
            stmt.executeUpdate(sql);
            System.out.println("[ProjectDao] MySQL table 'projects' initialized successfully.");
        } catch (SQLException e) {
            System.err.println("[ProjectDao] Error initializing 'projects' table: " + e.getMessage());
        }
    }

    /**
     * Saves a new project record into MySQL `projects` table
     */
    public boolean saveProject(Project p) {
        String sql = "INSERT INTO projects " +
                "(user_id, project_name, project_description, tech_stack, category, live_url, github_url, " +
                "start_date, end_date, project_photo, project_zip, project_zip_name, " +
                "cert_name, cert_issuer, cert_date, cert_url, cert_photo) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, p.getUserId());
            ps.setString(2, p.getProjectName());
            ps.setString(3, p.getProjectDescription());
            ps.setString(4, p.getTechStack());
            ps.setString(5, p.getCategory());
            ps.setString(6, p.getLiveUrl());
            ps.setString(7, p.getGithubUrl());
            ps.setString(8, p.getStartDate());
            ps.setString(9, p.getEndDate());
            ps.setString(10, p.getProjectPhoto());
            ps.setString(11, p.getProjectZip());
            ps.setString(12, p.getProjectZipName());
            ps.setString(13, p.getCertName());
            ps.setString(14, p.getCertIssuer());
            ps.setString(15, p.getCertDate());
            ps.setString(16, p.getCertUrl());
            ps.setString(17, p.getCertPhoto());
            int rows = ps.executeUpdate();
            return rows > 0;
        } catch (SQLException e) {
            System.err.println("[ProjectDao] Error saving project: " + e.getMessage());
            return false;
        }
    }

    /**
     * Retrieves all projects for a specific user (session-isolated)
     */
    public List<Project> getProjectsByUser(String userId) {
        List<Project> list = new ArrayList<>();
        String sql = "SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Project p = new Project();
                    p.setId(rs.getInt("id"));
                    p.setUserId(rs.getString("user_id"));
                    p.setProjectName(rs.getString("project_name"));
                    p.setProjectDescription(rs.getString("project_description"));
                    p.setTechStack(rs.getString("tech_stack"));
                    p.setCategory(rs.getString("category"));
                    p.setLiveUrl(rs.getString("live_url"));
                    p.setGithubUrl(rs.getString("github_url"));
                    p.setStartDate(rs.getString("start_date"));
                    p.setEndDate(rs.getString("end_date"));
                    p.setProjectPhoto(rs.getString("project_photo"));
                    p.setProjectZip(rs.getString("project_zip"));
                    p.setProjectZipName(rs.getString("project_zip_name"));
                    p.setCertName(rs.getString("cert_name"));
                    p.setCertIssuer(rs.getString("cert_issuer"));
                    p.setCertDate(rs.getString("cert_date"));
                    p.setCertUrl(rs.getString("cert_url"));
                    p.setCertPhoto(rs.getString("cert_photo"));
                    p.setCreatedAt(rs.getString("created_at"));
                    list.add(p);
                }
            }
        } catch (SQLException e) {
            System.err.println("[ProjectDao] Error fetching projects: " + e.getMessage());
        }
        return list;
    }

    /**
     * Deletes a project by ID and user (prevents cross-user deletion)
     */
    public boolean deleteProject(int id, String userId) {
        String sql = "DELETE FROM projects WHERE id = ? AND user_id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            ps.setString(2, userId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("[ProjectDao] Error deleting project: " + e.getMessage());
            return false;
        }
    }
}
