package com.hiresphere.dao;

import com.hiresphere.DatabaseConnection;
import com.hiresphere.model.CandidateProfile;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

/**
 * HireSphere - Data Access Object for candidate `profile` table (MySQL)
 * Handles table creation, SELECT, INSERT, UPDATE, and DELETE queries for user profiles.
 * Supports large base64 data (photos, PDF resumes) via LONGTEXT columns.
 */
public class ProfileDao {

    /**
     * Creates `profile` table in MySQL if it doesn't exist yet.
     */
    public void initTable() {
        String sql = "CREATE TABLE IF NOT EXISTS profile (" +
                "id INT AUTO_INCREMENT PRIMARY KEY, " +
                "user_id VARCHAR(100) NOT NULL UNIQUE, " +
                "profile_photo LONGTEXT, " +
                "full_name VARCHAR(255), " +
                "email_address VARCHAR(255), " +
                "phone_no VARCHAR(50), " +
                "gender VARCHAR(50), " +
                "address TEXT, " +
                "dob VARCHAR(50), " +
                "tenth_percentage VARCHAR(50), " +
                "tenth_year VARCHAR(50), " +
                "twelfth_percentage VARCHAR(50), " +
                "twelfth_year VARCHAR(50), " +
                "graduation_degree VARCHAR(255), " +
                "graduation_major VARCHAR(255), " +
                "graduation_cgpa_percentage VARCHAR(50), " +
                "graduation_year VARCHAR(50), " +
                "skills TEXT, " +
                "favorite_technologies TEXT, " +
                "linkedin_profile_url VARCHAR(255), " +
                "github_profile_url VARCHAR(255), " +
                "language VARCHAR(255), " +
                "resume_pdf_path LONGTEXT, " +
                "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " +
                "updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP" +
                ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";

        // Also ensure max_allowed_packet is large enough
        String packetSql = "SET GLOBAL max_allowed_packet = 67108864";

        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement()) {
            try { stmt.execute(packetSql); } catch (Exception ignored) {}
            stmt.execute(sql);
            System.out.println("[ProfileDao] MySQL 'profile' table verified/initialized successfully.");
        } catch (SQLException e) {
            System.err.println("[ProfileDao] Failed to initialize 'profile' table: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Finds profile by user_id (Cookie login session)
     */
    public CandidateProfile findByUserId(String userId) {
        if (userId == null || userId.trim().isEmpty()) return null;

        String sql = "SELECT * FROM profile WHERE LOWER(user_id) = LOWER(?)";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, userId.trim());
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToProfile(rs);
                }
            }
        } catch (SQLException e) {
            System.err.println("[ProfileDao] Error finding profile for user '" + userId + "': " + e.getMessage());
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Saves or Updates profile record for user_id in MySQL database.
     */
    public CandidateProfile saveOrUpdate(CandidateProfile p) throws SQLException {
        CandidateProfile existing = findByUserId(p.getUserId());
        if (existing != null) {
            // UPDATE record
            String updateSql = "UPDATE profile SET " +
                    "profile_photo = ?, " +
                    "full_name = ?, " +
                    "email_address = ?, " +
                    "phone_no = ?, " +
                    "gender = ?, " +
                    "address = ?, " +
                    "tenth_percentage = ?, " +
                    "tenth_year = ?, " +
                    "twelfth_percentage = ?, " +
                    "twelfth_year = ?, " +
                    "graduation_degree = ?, " +
                    "graduation_major = ?, " +
                    "graduation_cgpa_percentage = ?, " +
                    "graduation_year = ?, " +
                    "skills = ?, " +
                    "favorite_technologies = ?, " +
                    "linkedin_profile_url = ?, " +
                    "github_profile_url = ?, " +
                    "language = ?, " +
                    "resume_pdf_path = ?, " +
                    "dob = ? " +
                    "WHERE LOWER(user_id) = LOWER(?)";

            try (Connection conn = DatabaseConnection.getConnection();
                 PreparedStatement stmt = conn.prepareStatement(updateSql)) {
                setStatementParameters(stmt, p);
                stmt.setString(21, safe(p.getDob()));
                stmt.setString(22, p.getUserId().trim());
                stmt.executeUpdate();
                System.out.println("[ProfileDao] Updated profile record for user: " + p.getUserId());
            }
        } else {
            // INSERT record
            String insertSql = "INSERT INTO profile (" +
                    "profile_photo, full_name, email_address, phone_no, gender, address, " +
                    "tenth_percentage, tenth_year, twelfth_percentage, twelfth_year, " +
                    "graduation_degree, graduation_major, graduation_cgpa_percentage, graduation_year, " +
                    "skills, favorite_technologies, linkedin_profile_url, github_profile_url, " +
                    "language, resume_pdf_path, dob, user_id" +
                    ") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

            try (Connection conn = DatabaseConnection.getConnection();
                 PreparedStatement stmt = conn.prepareStatement(insertSql, Statement.RETURN_GENERATED_KEYS)) {
                setStatementParameters(stmt, p);
                stmt.setString(21, safe(p.getDob()));
                stmt.setString(22, p.getUserId().trim());
                stmt.executeUpdate();
                try (ResultSet keys = stmt.getGeneratedKeys()) {
                    if (keys.next()) {
                        p.setId(keys.getInt(1));
                    }
                }
                System.out.println("[ProfileDao] Created new profile record for user: " + p.getUserId());
            }
        }

        return findByUserId(p.getUserId());
    }

    /**
     * Deletes candidate profile by user_id
     */
    public boolean deleteByUserId(String userId) {
        if (userId == null || userId.trim().isEmpty()) return false;

        String sql = "DELETE FROM profile WHERE LOWER(user_id) = LOWER(?)";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, userId.trim());
            int affected = stmt.executeUpdate();
            System.out.println("[ProfileDao] Deleted profile record for user: " + userId + " (Rows affected: " + affected + ")");
            return affected > 0;
        } catch (SQLException e) {
            System.err.println("[ProfileDao] Error deleting profile for user '" + userId + "': " + e.getMessage());
            e.printStackTrace();
        }
        return false;
    }

    private void setStatementParameters(PreparedStatement stmt, CandidateProfile p) throws SQLException {
        stmt.setString(1, safe(p.getProfilePhoto()));
        stmt.setString(2, safe(p.getFullName()));
        stmt.setString(3, safe(p.getEmailAddress()));
        stmt.setString(4, safe(p.getPhoneNo()));
        stmt.setString(5, safe(p.getGender()));
        stmt.setString(6, safe(p.getAddress()));
        stmt.setString(7, safe(p.getTenthPercentage()));
        stmt.setString(8, safe(p.getTenthYear()));
        stmt.setString(9, safe(p.getTwelfthPercentage()));
        stmt.setString(10, safe(p.getTwelfthYear()));
        stmt.setString(11, safe(p.getGraduationDegree()));
        stmt.setString(12, safe(p.getGraduationMajor()));
        stmt.setString(13, safe(p.getGraduationCgpaPercentage()));
        stmt.setString(14, safe(p.getGraduationYear()));
        stmt.setString(15, safe(p.getSkills()));
        stmt.setString(16, safe(p.getFavoriteTechnologies()));
        stmt.setString(17, safe(p.getLinkedinProfileUrl()));
        stmt.setString(18, safe(p.getGithubProfileUrl()));
        stmt.setString(19, safe(p.getLanguage()));
        stmt.setString(20, safe(p.getResumePdfPath()));
    }

    private String safe(String val) {
        return val == null ? "" : val;
    }

    private CandidateProfile mapResultSetToProfile(ResultSet rs) throws SQLException {
        CandidateProfile p = new CandidateProfile();
        p.setId(rs.getInt("id"));
        p.setUserId(rs.getString("user_id"));
        p.setProfilePhoto(rs.getString("profile_photo"));
        p.setFullName(rs.getString("full_name"));
        p.setEmailAddress(rs.getString("email_address"));
        p.setPhoneNo(rs.getString("phone_no"));
        p.setGender(rs.getString("gender"));
        p.setAddress(rs.getString("address"));
        p.setDob(rs.getString("dob"));
        p.setTenthPercentage(rs.getString("tenth_percentage"));
        p.setTenthYear(rs.getString("tenth_year"));
        p.setTwelfthPercentage(rs.getString("twelfth_percentage"));
        p.setTwelfthYear(rs.getString("twelfth_year"));
        p.setGraduationDegree(rs.getString("graduation_degree"));
        p.setGraduationMajor(rs.getString("graduation_major"));
        p.setGraduationCgpaPercentage(rs.getString("graduation_cgpa_percentage"));
        p.setGraduationYear(rs.getString("graduation_year"));
        p.setSkills(rs.getString("skills"));
        p.setFavoriteTechnologies(rs.getString("favorite_technologies"));
        p.setLinkedinProfileUrl(rs.getString("linkedin_profile_url"));
        p.setGithubProfileUrl(rs.getString("github_profile_url"));
        p.setLanguage(rs.getString("language"));
        p.setResumePdfPath(rs.getString("resume_pdf_path"));
        try { p.setCreatedAt(rs.getString("created_at")); } catch (Exception ignored) {}
        try { p.setUpdatedAt(rs.getString("updated_at")); } catch (Exception ignored) {}
        return p;
    }
}
