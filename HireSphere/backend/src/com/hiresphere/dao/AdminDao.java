package com.hiresphere.dao;

import com.hiresphere.DatabaseConnection;

import java.sql.*;

/**
 * Data Access Object for handling MySQL operations on the `adminlogin` table
 */
public class AdminDao {

    /**
     * Initializes the `adminlogin` MySQL table if it doesn't exist already.
     */
    public void initTable() {
        String sql = "CREATE TABLE IF NOT EXISTS adminlogin (" +
                "id INT AUTO_INCREMENT PRIMARY KEY, " +
                "email VARCHAR(100) NOT NULL UNIQUE, " +
                "password VARCHAR(100) NOT NULL, " +
                "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " +
                "updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP" +
                ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";

        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement()) {
            stmt.executeUpdate(sql);
            
            // Insert default admin if not exists
            String checkAdmin = "SELECT COUNT(*) FROM adminlogin";
            try (ResultSet rs = stmt.executeQuery(checkAdmin)) {
                if (rs.next() && rs.getInt(1) == 0) {
                    String insertAdmin = "INSERT INTO adminlogin (email, password) VALUES ('admin@gmail.com', 'Admin@123')";
                    stmt.executeUpdate(insertAdmin);
                    System.out.println("[AdminDao] Default admin created: admin@gmail.com / Admin@123");
                }
            }
            
            System.out.println("[AdminDao] MySQL table 'adminlogin' initialized successfully.");
        } catch (SQLException e) {
            System.err.println("[AdminDao] Error initializing 'adminlogin' table: " + e.getMessage());
        }
    }

    /**
     * Authenticates an admin using email and password.
     */
    public boolean authenticate(String email, String password) {
        String sql = "SELECT * FROM adminlogin WHERE email = ? AND password = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, email);
            ps.setString(2, password);

            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    System.out.println("[AdminDao] Admin authenticated successfully: " + email);
                    return true;
                } else {
                    System.out.println("[AdminDao] Authentication failed for admin: " + email);
                    return false;
                }
            }
        } catch (SQLException e) {
            System.err.println("[AdminDao] Authentication error: " + e.getMessage());
            return false;
        }
    }

    /**
     * Fetches all records from all main tables and returns them as a JSON Object.
     */
    public com.google.gson.JsonObject getAllDatabaseData() {
        com.google.gson.JsonObject result = new com.google.gson.JsonObject();
        
        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement()) {
            
            // 1. Fetch Users
            com.google.gson.JsonArray users = new com.google.gson.JsonArray();
            try (ResultSet rs = stmt.executeQuery("SELECT id, user_id, password FROM userlogin")) {
                while (rs.next()) {
                    com.google.gson.JsonObject obj = new com.google.gson.JsonObject();
                    obj.addProperty("id", rs.getInt("id"));
                    obj.addProperty("userId", rs.getString("user_id")); // Send as userId to frontend
                    obj.addProperty("password", rs.getString("password"));
                    obj.addProperty("created_at", "N/A");
                    users.add(obj);
                }
            } catch (Exception e) {
                System.err.println("[AdminDao] Users fetch err: " + e.getMessage());
            }
            result.add("users", users);

            // 2. Fetch Profiles
            com.google.gson.JsonArray profiles = new com.google.gson.JsonArray();
            try (ResultSet rs = stmt.executeQuery("SELECT * FROM profile")) {
                while (rs.next()) {
                    com.google.gson.JsonObject obj = new com.google.gson.JsonObject();
                    obj.addProperty("id", rs.getInt("id"));
                    obj.addProperty("user_id", rs.getString("user_id"));
                    obj.addProperty("full_name", rs.getString("full_name"));
                    obj.addProperty("email", rs.getString("email_address"));
                    obj.addProperty("phone", rs.getString("phone_no"));
                    obj.addProperty("gender", rs.getString("gender"));
                    obj.addProperty("address", rs.getString("address"));
                    obj.addProperty("dob", rs.getString("dob"));
                    obj.addProperty("tenth_percentage", rs.getString("tenth_percentage"));
                    obj.addProperty("tenth_year", rs.getString("tenth_year"));
                    obj.addProperty("twelfth_percentage", rs.getString("twelfth_percentage"));
                    obj.addProperty("twelfth_year", rs.getString("twelfth_year"));
                    obj.addProperty("graduation_degree", rs.getString("graduation_degree"));
                    obj.addProperty("graduation_major", rs.getString("graduation_major"));
                    obj.addProperty("graduation_cgpa_percentage", rs.getString("graduation_cgpa_percentage"));
                    obj.addProperty("graduation_year", rs.getString("graduation_year"));
                    obj.addProperty("skills", rs.getString("skills"));
                    obj.addProperty("favorite_technologies", rs.getString("favorite_technologies"));
                    obj.addProperty("linkedin_profile_url", rs.getString("linkedin_profile_url"));
                    obj.addProperty("github_profile_url", rs.getString("github_profile_url"));
                    obj.addProperty("language", rs.getString("language"));
                    profiles.add(obj);
                }
            } catch (Exception e) {
                System.err.println("[AdminDao] Profiles fetch err: " + e.getMessage());
            }
            result.add("profiles", profiles);

            // 3. Fetch Projects
            com.google.gson.JsonArray projects = new com.google.gson.JsonArray();
            try (ResultSet rs = stmt.executeQuery("SELECT * FROM projects")) {
                while (rs.next()) {
                    com.google.gson.JsonObject obj = new com.google.gson.JsonObject();
                    obj.addProperty("id", rs.getInt("id"));
                    obj.addProperty("user_id", rs.getString("user_id"));
                    obj.addProperty("project_name", rs.getString("project_name"));
                    obj.addProperty("category", rs.getString("category"));
                    obj.addProperty("tech_stack", rs.getString("tech_stack"));
                    obj.addProperty("project_description", rs.getString("project_description"));
                    obj.addProperty("live_url", rs.getString("live_url"));
                    obj.addProperty("github_url", rs.getString("github_url"));
                    obj.addProperty("start_date", rs.getString("start_date"));
                    obj.addProperty("end_date", rs.getString("end_date"));
                    obj.addProperty("cert_name", rs.getString("cert_name"));
                    obj.addProperty("cert_issuer", rs.getString("cert_issuer"));
                    obj.addProperty("cert_date", rs.getString("cert_date"));
                    obj.addProperty("cert_url", rs.getString("cert_url"));
                    obj.addProperty("project_zip_name", rs.getString("project_zip_name"));
                    projects.add(obj);
                }
            } catch (Exception e) {
                System.err.println("[AdminDao] Projects fetch err: " + e.getMessage());
            }
            result.add("projects", projects);

            // 4. Fetch Applications (Drives)
            com.google.gson.JsonArray applications = new com.google.gson.JsonArray();
            try (ResultSet rs = stmt.executeQuery("SELECT * FROM drive_applications")) {
                while (rs.next()) {
                    com.google.gson.JsonObject obj = new com.google.gson.JsonObject();
                    obj.addProperty("id", rs.getInt("id"));
                    obj.addProperty("user_id", rs.getString("user_id"));
                    obj.addProperty("company_name", rs.getString("company_name"));
                    obj.addProperty("job_title", rs.getString("job_title"));
                    obj.addProperty("full_name", rs.getString("full_name"));
                    obj.addProperty("email", rs.getString("email"));
                    obj.addProperty("phone", rs.getString("phone"));
                    obj.addProperty("qualification", rs.getString("qualification"));
                    obj.addProperty("experience", rs.getString("experience"));
                    obj.addProperty("skills", rs.getString("skills"));
                    obj.addProperty("resume_url", rs.getString("resume_url"));
                    obj.addProperty("cover_letter", rs.getString("cover_letter"));
                    obj.addProperty("application_status", rs.getString("application_status"));
                    obj.addProperty("applied_at", rs.getString("applied_at"));
                    applications.add(obj);
                }
            } catch (Exception e) {
                System.err.println("[AdminDao] Applications fetch err: " + e.getMessage());
            }
            result.add("applications", applications);

            // 5. Fetch Messages
            com.google.gson.JsonArray messages = new com.google.gson.JsonArray();
            try (ResultSet rs = stmt.executeQuery("SELECT id, user_id, full_name, email_address, phone_no, subject, message_content, status, created_at FROM messages")) {
                while (rs.next()) {
                    com.google.gson.JsonObject obj = new com.google.gson.JsonObject();
                    obj.addProperty("id", rs.getInt("id"));
                    obj.addProperty("user_id", rs.getString("user_id"));
                    obj.addProperty("full_name", rs.getString("full_name"));
                    obj.addProperty("email_address", rs.getString("email_address"));
                    obj.addProperty("phone_no", rs.getString("phone_no"));
                    obj.addProperty("subject", rs.getString("subject"));
                    obj.addProperty("message_content", rs.getString("message_content"));
                    obj.addProperty("status", rs.getString("status"));
                    obj.addProperty("created_at", rs.getString("created_at"));
                    messages.add(obj);
                }
            } catch (Exception e) {
                System.err.println("[AdminDao] Messages fetch err: " + e.getMessage());
            }
            result.add("messages", messages);

        } catch (SQLException e) {
            System.err.println("[AdminDao] Error fetching all data: " + e.getMessage());
        }
        return result;
    }

    public boolean addUserLogin(Integer id, String userId, String password) {
        try (Connection conn = DatabaseConnection.getConnection()) {
            // 1. Check if user_id (email) already exists in table
            String checkEmailSql = "SELECT id FROM userlogin WHERE LOWER(user_id) = LOWER(?)";
            try (PreparedStatement checkPs = conn.prepareStatement(checkEmailSql)) {
                checkPs.setString(1, userId);
                try (ResultSet rs = checkPs.executeQuery()) {
                    if (rs.next()) {
                        int existingId = rs.getInt("id");
                        // User with this email already exists: Update password & ID if specified
                        if (id != null && id > 0 && id != existingId) {
                            String updateSql = "UPDATE userlogin SET id = ?, password = ? WHERE user_id = ?";
                            try (PreparedStatement updatePs = conn.prepareStatement(updateSql)) {
                                updatePs.setInt(1, id);
                                updatePs.setString(2, password);
                                updatePs.setString(3, userId);
                                return updatePs.executeUpdate() > 0;
                            } catch (SQLException ignored) {
                                // Fallback: update password by existingId
                                String fallbackSql = "UPDATE userlogin SET password = ? WHERE id = ?";
                                try (PreparedStatement fbPs = conn.prepareStatement(fallbackSql)) {
                                    fbPs.setString(1, password);
                                    fbPs.setInt(2, existingId);
                                    return fbPs.executeUpdate() > 0;
                                }
                            }
                        } else {
                            String updateSql = "UPDATE userlogin SET password = ? WHERE id = ?";
                            try (PreparedStatement updatePs = conn.prepareStatement(updateSql)) {
                                updatePs.setString(1, password);
                                updatePs.setInt(2, existingId);
                                return updatePs.executeUpdate() > 0;
                            }
                        }
                    }
                }
            }

            // 2. Email does not exist. Check if ID exists.
            if (id != null && id > 0) {
                String checkIdSql = "SELECT id FROM userlogin WHERE id = ?";
                try (PreparedStatement checkPs = conn.prepareStatement(checkIdSql)) {
                    checkPs.setInt(1, id);
                    try (ResultSet rs = checkPs.executeQuery()) {
                        if (rs.next()) {
                            // ID exists with another email: Update that row to new email & password
                            String updateSql = "UPDATE userlogin SET user_id = ?, password = ? WHERE id = ?";
                            try (PreparedStatement updatePs = conn.prepareStatement(updateSql)) {
                                updatePs.setString(1, userId);
                                updatePs.setString(2, password);
                                updatePs.setInt(3, id);
                                return updatePs.executeUpdate() > 0;
                            }
                        }
                    }
                }

                // ID does not exist: Insert new row with custom ID
                String insertSql = "INSERT INTO userlogin (id, user_id, password) VALUES (?, ?, ?)";
                try (PreparedStatement ps = conn.prepareStatement(insertSql)) {
                    ps.setInt(1, id);
                    ps.setString(2, userId);
                    ps.setString(3, password);
                    return ps.executeUpdate() > 0;
                }
            } else {
                // Insert new row with auto-increment ID
                String insertSql = "INSERT INTO userlogin (user_id, password) VALUES (?, ?)";
                try (PreparedStatement ps = conn.prepareStatement(insertSql)) {
                    ps.setString(1, userId);
                    ps.setString(2, password);
                    return ps.executeUpdate() > 0;
                }
            }
        } catch (SQLException e) {
            System.err.println("[AdminDao] Error in addUserLogin upsert: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    public boolean updateUserLogin(int id, String userId, String password) {
        String sql = "UPDATE userlogin SET user_id = ?, password = ? WHERE id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, userId);
            ps.setString(2, password);
            ps.setInt(3, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("[AdminDao] Error updating user login: " + e.getMessage());
            return false;
        }
    }

    public boolean deleteUserLogin(int id) {
        String sql = "DELETE FROM userlogin WHERE id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("[AdminDao] Error deleting user login: " + e.getMessage());
            return false;
        }
    }

    public boolean deleteAllUserLogins() {
        String sql = "DELETE FROM userlogin";
        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement()) {
            return stmt.executeUpdate(sql) >= 0;
        } catch (SQLException e) {
            System.err.println("[AdminDao] Error deleting all user logins: " + e.getMessage());
            return false;
        }
    }

    public boolean updateMessage(int id, String status) {
        String sql = "UPDATE messages SET status = ? WHERE id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, status);
            ps.setInt(2, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("[AdminDao] Error updating message: " + e.getMessage());
            return false;
        }
    }

    public boolean deleteMessage(int id) {
        String sql = "DELETE FROM messages WHERE id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("[AdminDao] Error deleting message: " + e.getMessage());
            return false;
        }
    }

    public boolean deleteAllMessages() {
        String sql = "DELETE FROM messages";
        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement()) {
            return stmt.executeUpdate(sql) >= 0;
        } catch (SQLException e) {
            System.err.println("[AdminDao] Error deleting all messages: " + e.getMessage());
            return false;
        }
    }

    public boolean updateProfile(int id, String fullName, String phone, String gender, String dob, String tenthPct, String tenthYear, String twelfthPct, String twelfthYear, String gradDegree, String gradMajor, String gradCgpa, String gradYear, String skills, String favTech, String linkedin, String github, String language) {
        String sql = "UPDATE profile SET full_name = ?, phone_no = ?, gender = ?, dob = ?, tenth_percentage = ?, tenth_year = ?, twelfth_percentage = ?, twelfth_year = ?, graduation_degree = ?, graduation_major = ?, graduation_cgpa_percentage = ?, graduation_year = ?, skills = ?, favorite_technologies = ?, linkedin_profile_url = ?, github_profile_url = ?, language = ? WHERE id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, fullName);
            ps.setString(2, phone);
            ps.setString(3, gender);
            ps.setString(4, dob);
            ps.setString(5, tenthPct);
            ps.setString(6, tenthYear);
            ps.setString(7, twelfthPct);
            ps.setString(8, twelfthYear);
            ps.setString(9, gradDegree);
            ps.setString(10, gradMajor);
            ps.setString(11, gradCgpa);
            ps.setString(12, gradYear);
            ps.setString(13, skills);
            ps.setString(14, favTech);
            ps.setString(15, linkedin);
            ps.setString(16, github);
            ps.setString(17, language);
            ps.setInt(18, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("[AdminDao] Error updating profile: " + e.getMessage());
            return false;
        }
    }

    public boolean deleteProfile(int id) {
        String sql = "DELETE FROM profile WHERE id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("[AdminDao] Error deleting profile: " + e.getMessage());
            return false;
        }
    }

    public boolean deleteAllProfiles() {
        String sql = "DELETE FROM profile";
        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement()) {
            return stmt.executeUpdate(sql) >= 0;
        } catch (SQLException e) {
            System.err.println("[AdminDao] Error deleting all profiles: " + e.getMessage());
            return false;
        }
    }

    public boolean updateProject(int id, String projectName, String description, String techStack, String category, String liveUrl, String githubUrl, String startDate, String endDate, String certName, String certIssuer, String certDate, String certUrl, String zipName) {
        String sql = "UPDATE projects SET project_name = ?, project_description = ?, tech_stack = ?, category = ?, live_url = ?, github_url = ?, start_date = ?, end_date = ?, cert_name = ?, cert_issuer = ?, cert_date = ?, cert_url = ?, project_zip_name = ? WHERE id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, projectName);
            ps.setString(2, description);
            ps.setString(3, techStack);
            ps.setString(4, category);
            ps.setString(5, liveUrl);
            ps.setString(6, githubUrl);
            ps.setString(7, startDate);
            ps.setString(8, endDate);
            ps.setString(9, certName);
            ps.setString(10, certIssuer);
            ps.setString(11, certDate);
            ps.setString(12, certUrl);
            ps.setString(13, zipName);
            ps.setInt(14, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("[AdminDao] Error updating project: " + e.getMessage());
            return false;
        }
    }

    public boolean deleteProject(int id) {
        String sql = "DELETE FROM projects WHERE id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("[AdminDao] Error deleting project: " + e.getMessage());
            return false;
        }
    }

    public boolean deleteAllProjects() {
        String sql = "DELETE FROM projects";
        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement()) {
            return stmt.executeUpdate(sql) >= 0;
        } catch (SQLException e) {
            System.err.println("[AdminDao] Error deleting all projects: " + e.getMessage());
            return false;
        }
    }

    // --- APPLICATION (DRIVES) CRUD ---

    public boolean updateApplication(int id, String companyName, String jobTitle, String fullName, String email, String phone, String qualification, String experience, String skills, String coverLetter, String applicationStatus, String resumeUrl) {
        String sql = "UPDATE drive_applications SET company_name = ?, job_title = ?, full_name = ?, email = ?, phone = ?, qualification = ?, experience = ?, skills = ?, cover_letter = ?, application_status = ?, resume_url = ? WHERE id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, companyName);
            ps.setString(2, jobTitle);
            ps.setString(3, fullName);
            ps.setString(4, email);
            ps.setString(5, phone);
            ps.setString(6, qualification);
            ps.setString(7, experience);
            ps.setString(8, skills);
            ps.setString(9, coverLetter);
            ps.setString(10, applicationStatus);
            ps.setString(11, resumeUrl);
            ps.setInt(12, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("[AdminDao] Error updating application: " + e.getMessage());
            return false;
        }
    }

    public boolean deleteApplication(int id) {
        String sql = "DELETE FROM drive_applications WHERE id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("[AdminDao] Error deleting application: " + e.getMessage());
            return false;
        }
    }

    public boolean deleteAllApplications() {
        String sql = "DELETE FROM drive_applications";
        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement()) {
            return stmt.executeUpdate(sql) >= 0;
        } catch (SQLException e) {
            System.err.println("[AdminDao] Error deleting all applications: " + e.getMessage());
            return false;
        }
    }
}
